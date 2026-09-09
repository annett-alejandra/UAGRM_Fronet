"""
SSO per-request state validator — cliente del IdP admincentral UAGRM.

Compara los claims pv/dv/tw_end del JWT contra el estado local en Redis.
Si difieren → la sesión fue revocada en admincentral y se rechaza el request.

Garantías:
  - dv mismatch: dispositivo revocado → revocación en < 500 ms (vía AMQP)
  - pv mismatch: permisos del rol cambiaron → permisos actualizados en Redis
  - tw_end: ventana horaria superada → revocación inmediata
"""

import logging
from datetime import datetime, timezone

from graphql import GraphQLError

from .state import get_local_pv, get_local_dv, set_local_pv, set_local_dv

logger = logging.getLogger(__name__)

SSO_REVOKED_CODE = "SSO_SESSION_REVOKED"
SSO_EXPIRED_CODE = "SSO_SESSION_EXPIRED"


def validar_estado_sso(token_payload: dict) -> None:
    """
    Valida el estado de la sesión SSO contra Redis local.
    Solo actúa sobre tokens con token_type='sso_access'.

    Comportamiento ante cache frío (Redis vacío/reiniciado):
      - Siembra el valor del JWT en Redis local y permite el request.
      - La próxima actualización AMQP corregirá el estado.

    Lanza GraphQLError si la sesión debe rechazarse.
    """
    if token_payload.get("token_type") != "sso_access":
        return

    user_id = token_payload.get("sub", "")
    rol_id  = token_payload.get("rol_id", "")
    pv_jwt  = token_payload.get("pv")
    dv_jwt  = token_payload.get("dv")
    tw_end  = token_payload.get("tw_end", "")

    # 1. Validar tw_end (ventana horaria)
    if tw_end:
        try:
            end_dt = datetime.fromisoformat(tw_end)
            if datetime.now(timezone.utc) > end_dt:
                logger.info("SSO: tw_end expirado user=%s tw_end=%s", user_id, tw_end)
                raise GraphQLError(
                    "Sesión expirada por ventana horaria. Por favor, vuelve a ingresar.",
                    extensions={"code": SSO_EXPIRED_CODE},
                )
        except (ValueError, TypeError):
            pass

    # 2. Validar pv (perms_version) — mismatch no fuerza re-login, solo log
    if pv_jwt is not None and rol_id:
        local_pv = get_local_pv(rol_id)
        if local_pv is None:
            set_local_pv(rol_id, int(pv_jwt))
        elif local_pv != int(pv_jwt):
            logger.info(
                "SSO: pv mismatch user=%s rol=%s pv_jwt=%s pv_local=%s — "
                "permisos actualizados en Redis, sesión continúa",
                user_id, rol_id, pv_jwt, local_pv,
            )

    # 3. Validar dv (device_version) — mismatch fuerza revocación
    if dv_jwt is not None and user_id:
        local_dv = get_local_dv(user_id)
        if local_dv is None:
            set_local_dv(user_id, int(dv_jwt))
        elif local_dv != int(dv_jwt):
            logger.warning(
                "SSO: dv mismatch user=%s dv_jwt=%s dv_local=%s — dispositivo revocado",
                user_id, dv_jwt, local_dv,
            )
            raise GraphQLError(
                "Dispositivo revocado. Contacta al administrador del sistema.",
                extensions={"code": SSO_REVOKED_CODE},
            )
