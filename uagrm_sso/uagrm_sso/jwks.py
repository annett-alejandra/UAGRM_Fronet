"""
JWKS client con cache en memoria — cliente del IdP admincentral UAGRM.

Usa jwt.PyJWKClient (PyJWT >= 2.4) para resolver la clave pública correcta
a partir del `kid` del JWT. Soporta rotación de claves zero-downtime:

  1. Cuando admincentral rota su clave RSA, JWKS devuelve DOS entradas (vieja + nueva).
  2. PyJWKClient elige la clave correcta por `kid` automáticamente.
  3. Si el `kid` no está en cache, re-fetchea el JWKS una vez (auto-refresh).

Cache: in-memory por worker, lifespan=300 s (5 minutos).
El endpoint JWKS de admincentral es público (AllowAny), no requiere API-Key.
"""

import logging

import jwt
from django.conf import settings

logger = logging.getLogger(__name__)

_client: jwt.PyJWKClient | None = None


def _get_client() -> jwt.PyJWKClient:
    global _client
    if _client is None:
        base_url = getattr(settings, "URL_API_SSO", "http://admincentral-backend:8003").rstrip("/")
        jwks_url = f"{base_url}/api/sso/public-key"
        _client = jwt.PyJWKClient(
            jwks_url,
            cache_keys=True,
            max_cached_keys=4,
            lifespan=300,
        )
    return _client


def get_signing_key(token: str) -> jwt.algorithms.RSAAlgorithm:
    """
    Devuelve la clave pública RSA que corresponde al `kid` del token.

    Si el `kid` no está en cache local, el cliente re-fetchea el JWKS
    desde admincentral automáticamente (máximo una vez por token).

    Raises:
        jwt.exceptions.PyJWKClientConnectionError — si admincentral no responde
        jwt.exceptions.PyJWKClientError           — si el kid no existe en el JWKS
    """
    return _get_client().get_signing_key_from_jwt(token)
