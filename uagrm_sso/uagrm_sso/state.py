"""
Local SSO state cache — cliente del IdP admincentral UAGRM.

Almacena en Redis local los contadores pv (perms_version) y dv (device_version)
que admincentral emite en cada JWT. Se actualizan:
  - Al hacer login (SSOCallbackView siembra los valores desde el JWT)
  - Al renovar tokens (SSORefreshSessionView actualiza tras refresh exitoso)
  - Al recibir un evento AMQP de revocación (SSOEventConsumer actualiza)

Cuando el valor local difiere del claim en el JWT → validar_estado_sso() rechaza.
Si no hay valor local (Redis frío/reinicio) → se siembra desde el JWT y se permite.
"""

import logging

from django.core.cache import cache

logger = logging.getLogger(__name__)

_PV_PREFIX    = "sso:pv:rol"
_DV_PREFIX    = "sso:dv:user"
_PERMS_PREFIX = "sso:perms:rol"
_TTL = 60 * 60 * 24 * 7  # 7 días — coincide con el refresh_token lifetime


def _pv_key(rol_id: str) -> str:
    return f"{_PV_PREFIX}:{rol_id}"


def _dv_key(user_id: str) -> str:
    return f"{_DV_PREFIX}:{user_id}"


def _perms_key(rol_id: str) -> str:
    return f"{_PERMS_PREFIX}:{rol_id}"


def get_local_pv(rol_id: str) -> int | None:
    """Devuelve el pv almacenado localmente, o None si no existe (cache frío)."""
    val = cache.get(_pv_key(rol_id))
    return int(val) if val is not None else None


def get_local_dv(user_id: str) -> int | None:
    """Devuelve el dv almacenado localmente, o None si no existe (cache frío)."""
    val = cache.get(_dv_key(user_id))
    return int(val) if val is not None else None


def set_local_pv(rol_id: str, pv: int) -> None:
    """Persiste el pv en Redis local."""
    if not rol_id:
        return
    try:
        cache.set(_pv_key(rol_id), pv, _TTL)
        logger.debug("sso.state: pv actualizado rol=%s pv=%s", rol_id, pv)
    except Exception as exc:
        logger.warning("sso.state: set_local_pv falló rol=%s: %s", rol_id, exc)


def set_local_dv(user_id: str, dv: int) -> None:
    """Persiste el dv en Redis local."""
    if not user_id:
        return
    try:
        cache.set(_dv_key(user_id), dv, _TTL)
        logger.debug("sso.state: dv actualizado user=%s dv=%s", user_id, dv)
    except Exception as exc:
        logger.warning("sso.state: set_local_dv falló user=%s: %s", user_id, exc)


def get_local_perms(rol_id: str) -> list | None:
    """Devuelve los permisos almacenados localmente para el rol, o None si no existen."""
    import json
    val = cache.get(_perms_key(rol_id))
    if val is None:
        return None
    try:
        return json.loads(val)
    except (ValueError, TypeError):
        return None


def set_local_perms(rol_id: str, perms: list) -> None:
    """Persiste los permisos del rol en Redis local."""
    import json
    if not rol_id:
        return
    try:
        cache.set(_perms_key(rol_id), json.dumps(perms), _TTL)
        logger.debug("sso.state: perms actualizados rol=%s count=%s", rol_id, len(perms))
    except Exception as exc:
        logger.warning("sso.state: set_local_perms falló rol=%s: %s", rol_id, exc)


def check_perm(rol_id: str, codigo: str) -> bool:
    """
    Verifica si el rol tiene el permiso en Redis local.
    Devuelve False si Redis está frío (sin perms sembrados aún).
    """
    perms = get_local_perms(rol_id)
    if perms is None:
        return False
    return codigo in perms


def seed_from_jwt(token_payload: dict, permissions: list | None = None) -> None:
    """
    Siembra pv, dv y opcionalmente permisos en Redis local.
    Llamado en el callback de login y en el refresh de sesión.
    """
    rol_id  = token_payload.get("rol_id", "")
    user_id = token_payload.get("sub", "")
    pv      = token_payload.get("pv")
    dv      = token_payload.get("dv")

    if rol_id and pv is not None:
        set_local_pv(rol_id, int(pv))
    if user_id and dv is not None:
        set_local_dv(user_id, int(dv))
    if rol_id and permissions is not None:
        set_local_perms(rol_id, permissions)
