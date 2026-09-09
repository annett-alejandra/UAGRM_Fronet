"""
SSO notify — publica cambios de permisos via Redis pub/sub.

Desacopla al AMQP consumer del SSE view: el consumer llama a
publish_perm_change(rol_id) y SSOEventsView (que corre en otro thread)
recibe el mensaje y lo reenvía al browser como evento SSE.

Canal Redis: sso:notify:rol:{rol_id}  (pub/sub, no key-value)
"""

import logging

logger = logging.getLogger(__name__)

_CHANNEL_PREFIX = "sso:notify:rol"
_DEDUP_TTL      = 2  # segundos — ventana de deduplicación entre workers


def _redis_url() -> str:
    from django.conf import settings
    # 1. Variable explícita de override
    url = getattr(settings, "SSO_REDIS_URL", None)
    if url:
        return url
    # 2. Variable top-level (algunos proyectos la exponen así)
    url = getattr(settings, "REDIS_CACHE_URL", None)
    if url:
        return url
    # 3. Leer del CACHES["default"]["LOCATION"] — fallback universal
    try:
        return settings.CACHES["default"]["LOCATION"]
    except (AttributeError, KeyError):
        pass
    return "redis://localhost:6379/1"


def publish_perm_change(rol_id: str) -> None:
    """
    Publica un evento permission_change con deduplicación distribuida via Redis NX.
    Si varios workers de gunicorn reciben el mismo evento AMQP en ráfaga,
    solo el primero en hacer SET NX publica — los demás son ignorados.
    TTL de 2 s agrupa cambios consecutivos del mismo rol en un solo PUBLISH.
    """
    if not rol_id:
        return
    try:
        import redis as _redis
        r = _redis.from_url(_redis_url(), socket_timeout=2)
        lock_key = f"sso:notify-sent:{rol_id}"
        if r.set(lock_key, 1, nx=True, ex=_DEDUP_TTL):
            r.publish(f"{_CHANNEL_PREFIX}:{rol_id}", "permission_change")
            logger.debug("sso.notify: publicado permission_change rol=%s", rol_id)
        else:
            logger.debug("sso.notify: deduplicado rol=%s (otro proceso ya publicó)", rol_id)
        r.close()
    except Exception as exc:
        logger.warning("sso.notify: publish_perm_change falló rol=%s: %s", rol_id, exc)
