"""
HTTP client para el IdP admincentral UAGRM.

Encapsula las dos llamadas que cada sistema externo necesita hacer al IdP,
con los headers y body correctos, leyendo settings de Django.

  exchange_ticket(ticket)       → POST /api/sso/exchange-ticket
  refresh_token(refresh_token)  → POST /api/sso/refresh

Settings requeridos (en config/settings/base.py):
  URL_API_SSO      — URL base del IdP,  ej. "http://admincentral-backend:8003"
  SSO_API_KEY      — header API-Key,    = VALID_API_KEYS en admincentral .env
  SSO_SYSTEM_KEY   — clave del sistema, = Aplicacion.api_key_hash plain-text
                     (alias: SSO_TRAMITES_SYSTEM_KEY para compatibilidad)
"""

import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

_TIMEOUT = 10  # segundos


def _base_url() -> str:
    return getattr(settings, "URL_API_SSO", "http://admincentral-backend:8003").rstrip("/")


def _api_key() -> str:
    return getattr(settings, "SSO_API_KEY", "")


def _system_key() -> str:
    # SSO_SYSTEM_KEY es el nombre genérico.
    # SSO_TRAMITES_SYSTEM_KEY es el alias usado por el sistema de trámites.
    return (
        getattr(settings, "SSO_SYSTEM_KEY", "")
        or getattr(settings, "SSO_TRAMITES_SYSTEM_KEY", "")
    )


def exchange_ticket(ticket: str) -> dict:
    """
    Canjea un ticket UUID one-time por JWT de acceso + refresh + permisos.

    Returns:
        dict con: access_token, refresh_token, permissions[], pv, token_type, expires_in

    Raises:
        requests.HTTPError — si admincentral devuelve 4xx/5xx
        requests.ConnectionError — si admincentral no responde
    """
    resp = requests.post(
        f"{_base_url()}/api/sso/exchange-ticket",
        headers={"API-Key": _api_key(), "Content-Type": "application/json"},
        json={"ticket": ticket, "api_key": _system_key()},
        timeout=_TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()


def refresh_token(refresh_token_str: str) -> dict:
    """
    Renueva el JWT de acceso SSO usando el refresh token.

    El IdP verifica dispositivo autorizado y ventana horaria en cada renovación.

    Returns:
        dict con: access_token, refresh_token, permissions[], pv, token_type, expires_in

    Raises:
        requests.HTTPError — si el token expiró o admincentral rechaza (401/403)
        requests.ConnectionError — si admincentral no responde
    """
    resp = requests.post(
        f"{_base_url()}/api/sso/refresh",
        headers={
            "API-Key":       _api_key(),
            "X-SSO-API-Key": _system_key(),
            "Content-Type":  "application/json",
        },
        json={"refresh_token": refresh_token_str},
        timeout=_TIMEOUT,
    )
    resp.raise_for_status()
    return resp.json()
