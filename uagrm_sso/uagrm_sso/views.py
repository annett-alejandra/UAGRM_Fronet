"""
Vistas SSO para sistemas Django externos integrados al IdP UAGRM.

SSOCallbackView   POST /api/sso/callback        — canje de ticket por JWT
SSORefreshView    POST /api/sso/refresh-session — renovación de sesión
SSOLogoutView     POST /api/sso/logout          — limpieza de cookies
SSOEventsView     GET  /api/sso/events          — notificaciones SSE en tiempo real
"""

import json
import logging

import jwt as _jwt
import requests
from django.conf import settings
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from . import client as _client
from .jwks import get_signing_key
from .notify import _CHANNEL_PREFIX, _redis_url
from .state import get_local_pv, seed_from_jwt

logger = logging.getLogger(__name__)

_ACCESS_TTL      = 15 * 60        # 15 min
_REFRESH_TTL     = 7 * 24 * 3600  # 7 días
_KEEPALIVE_TIMEOUT = 25           # segundos — SSE keepalive para evitar cierre por proxies


def _decode_jwt_claims(token: str) -> dict:
    """
    Decodifica un JWT verificando la firma via JWKS del IdP.
    Fallback a JWT_LLAVE_PUBLICA si el JWKS no está disponible.
    """
    try:
        key = get_signing_key(token).key
    except Exception as exc:
        logger.warning("uagrm_sso: JWKS no disponible (%s), usando JWT_LLAVE_PUBLICA", exc)
        key = getattr(settings, "JWT_LLAVE_PUBLICA", "").replace("\\n", "\n")
    return _jwt.decode(token, key, algorithms=["RS256"], options={"verify_aud": False})


def _set_sso_cookies(response, access_token: str, refresh_token: str) -> None:
    use_https = getattr(settings, "USE_HTTPS", False)
    opts = {"httponly": True, "samesite": "Lax", "path": "/", "secure": use_https}
    response.set_cookie("sso_access_token",  access_token,  max_age=_ACCESS_TTL,  **opts)
    response.set_cookie("sso_refresh_token", refresh_token, max_age=_REFRESH_TTL, **opts)


@method_decorator(csrf_exempt, name="dispatch")
class SSOCallbackView(View):
    """
    POST /api/sso/callback
    Body: {"ticket": "<uuid>"}

    Canjea el ticket con el IdP y establece cookies de sesión HttpOnly.
    Siembra pv/dv/perms en Redis local para validación per-request.
    """

    def post(self, request):
        try:
            body = json.loads(request.body)
        except (ValueError, TypeError):
            return JsonResponse({"error": "Cuerpo JSON inválido."}, status=400)

        ticket = body.get("ticket", "").strip()
        if not ticket:
            return JsonResponse({"error": "ticket es requerido."}, status=400)

        if not _client._system_key():
            logger.error("SSOCallbackView: SSO_SYSTEM_KEY no configurada")
            return JsonResponse({"error": "Configuración SSO incompleta."}, status=503)

        try:
            data = _client.exchange_ticket(ticket)
        except requests.exceptions.ConnectionError:
            return JsonResponse({"error": "No se pudo conectar con el servidor de identidad."}, status=502)
        except requests.exceptions.Timeout:
            return JsonResponse({"error": "El servidor de identidad tardó demasiado."}, status=504)
        except requests.HTTPError as exc:
            status = exc.response.status_code
            if status == 404:
                return JsonResponse({"error": "Ticket inválido, expirado o ya utilizado."}, status=401)
            if status == 403:
                return JsonResponse({"error": "Acceso denegado por el servidor de identidad."}, status=403)
            logger.warning("SSOCallbackView: IdP devolvió %s", status)
            return JsonResponse({"error": "Error al canjear el ticket SSO."}, status=502)

        access_token  = data.get("access_token", "")
        refresh_token = data.get("refresh_token", "")
        permissions   = data.get("permissions", [])

        if not access_token:
            return JsonResponse({"error": "El IdP no devolvió access_token."}, status=502)

        try:
            claims = _decode_jwt_claims(access_token)
            seed_from_jwt(claims, permissions=permissions)
        except Exception as exc:
            logger.warning("SSOCallbackView: no se pudo sembrar estado SSO: %s", exc)

        response = JsonResponse({"ok": True})
        _set_sso_cookies(response, access_token, refresh_token)
        return response

    def http_method_not_allowed(self, request, *args, **kwargs):
        return JsonResponse({"error": "Método no permitido."}, status=405)


@method_decorator(csrf_exempt, name="dispatch")
class SSORefreshView(View):
    """
    POST /api/sso/refresh-session

    Renueva los tokens SSO leyendo el refresh_token desde cookie HttpOnly.
    Actualiza las cookies y el estado Redis.

    200 {"ok": true}
    401 {"error": "...", "code": "REFRESH_EXPIRED"}  → fuerza logout
    403 {"error": "...", "code": "DEVICE_REVOKED"}
    """

    def post(self, request):
        refresh_token = request.COOKIES.get("sso_refresh_token", "").strip()
        if not refresh_token:
            return JsonResponse({"error": "No hay sesión activa.", "code": "NO_SESSION"}, status=401)

        if not _client._system_key():
            logger.error("SSORefreshView: SSO_SYSTEM_KEY no configurada")
            return JsonResponse({"error": "Configuración SSO incompleta."}, status=503)

        try:
            data = _client.refresh_token(refresh_token)
        except requests.exceptions.ConnectionError:
            return JsonResponse({"error": "No se pudo conectar con el servidor de identidad."}, status=502)
        except requests.exceptions.Timeout:
            return JsonResponse({"error": "El servidor de identidad tardó demasiado."}, status=504)
        except requests.HTTPError as exc:
            status = exc.response.status_code
            try:
                body = exc.response.json()
            except Exception:
                body = {}
            if status == 401:
                return JsonResponse(
                    {"error": body.get("error", "Sesión expirada."), "code": body.get("code", "REFRESH_EXPIRED")},
                    status=401,
                )
            if status == 403:
                return JsonResponse(
                    {"error": body.get("error", "Dispositivo no autorizado."), "code": body.get("code", "DEVICE_REVOKED")},
                    status=403,
                )
            logger.warning("SSORefreshView: IdP devolvió %s", status)
            return JsonResponse({"error": "Error al renovar la sesión."}, status=502)

        new_access  = data.get("access_token", "")
        new_refresh = data.get("refresh_token", "")
        permissions = data.get("permissions", [])

        if not new_access:
            return JsonResponse({"error": "El IdP no devolvió access_token."}, status=502)

        try:
            claims = _decode_jwt_claims(new_access)
            seed_from_jwt(claims, permissions=permissions)
        except Exception as exc:
            logger.warning("SSORefreshView: no se pudo actualizar estado SSO: %s", exc)

        response = JsonResponse({"ok": True})
        _set_sso_cookies(response, new_access, new_refresh)
        return response

    def http_method_not_allowed(self, request, *args, **kwargs):
        return JsonResponse({"error": "Método no permitido."}, status=405)


@method_decorator(csrf_exempt, name="dispatch")
class SSOLogoutView(View):
    """POST /api/sso/logout — elimina cookies de sesión SSO."""

    def post(self, request):
        response = JsonResponse({"ok": True})
        for cookie in ("sso_access_token", "sso_refresh_token"):
            response.delete_cookie(cookie, path="/", samesite="Lax")
        return response

    def http_method_not_allowed(self, request, *args, **kwargs):
        return JsonResponse({"error": "Método no permitido."}, status=405)


class SSOEventsView(View):
    """
    GET /api/sso/events — SSE para notificaciones de permisos en tiempo real.

    El browser mantiene la conexión abierta. Cuando el AMQP consumer recibe un
    permission_change, hace PUBLISH en Redis pub/sub y este view reenvía el
    evento al browser.

    Nota: cada conexión ocupa un thread WSGI. Para muchos usuarios concurrentes,
    migrar a ASGI/Django Channels.
    """

    def get(self, request):
        access_token = request.COOKIES.get("sso_access_token", "")
        if not access_token:
            return HttpResponse(status=401)

        try:
            payload = _jwt.decode(
                access_token,
                options={"verify_signature": False},
                algorithms=["RS256", "HS256"],
            )
            rol_id = str(payload.get("rol_id", "")).strip()
            pv_jwt = payload.get("pv")
        except Exception:
            return HttpResponse(status=401)

        if not rol_id:
            return HttpResponse(status=401)

        response = StreamingHttpResponse(
            self._event_stream(rol_id, pv_jwt),
            content_type="text/event-stream",
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"
        return response

    @staticmethod
    def _event_stream(rol_id: str, pv_jwt):
        import redis as _redis

        r = _redis.from_url(_redis_url())
        pubsub = r.pubsub(ignore_subscribe_messages=True)
        pubsub.subscribe(f"{_CHANNEL_PREFIX}:{rol_id}")

        try:
            yield ": keep-alive\n\n"
            # Chequeo inmediato de pv — cubre eventos perdidos durante el reload
            try:
                pv_local = get_local_pv(rol_id)
                if pv_local is not None and pv_jwt is not None and int(pv_local) > int(pv_jwt):
                    data = json.dumps({"rolId": rol_id})
                    yield f"event: permission_change\ndata: {data}\n\n"
            except Exception:
                pass
            while True:
                msg = pubsub.get_message(timeout=_KEEPALIVE_TIMEOUT)
                if msg is None:
                    yield ": ping\n\n"
                    continue
                if msg["type"] == "message":
                    data = json.dumps({"rolId": rol_id})
                    yield f"event: permission_change\ndata: {data}\n\n"
        except GeneratorExit:
            pass
        finally:
            try:
                pubsub.unsubscribe()
                pubsub.close()
                r.close()
            except Exception:
                pass
