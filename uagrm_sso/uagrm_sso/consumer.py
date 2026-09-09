"""
SSO Event Consumer — cliente AMQP del IdP admincentral UAGRM.

Daemon thread que consume mensajes de RabbitMQ para actualizar el Redis
local con los contadores pv/dv en menos de 500 ms.

Exchange: sso.events (topic, durable)
Queue:    sso.events.{SSO_SYSTEM_SLUG}  (durable, auto-creada si no existe)
Routing:  # (todos los eventos SSO)

Eventos procesados:
  permission_change  → actualiza pv local del rol afectado
  device_revoked     → actualiza dv local del usuario afectado
  session_revoked    → marca sesión como revocada en Redis (TTL 24 h)

Si SSO_AMQP_URL no está configurada, el thread duerme y no consume nada.
El consumer se reinicia automáticamente tras cualquier excepción de red.
"""

import json
import logging
import socket
import threading
import time

logger = logging.getLogger(__name__)


class SSOEventConsumer(threading.Thread):
    """Daemon AMQP que mantiene el Redis local sincronizado con admincentral."""

    daemon = True
    name = "sso-event-consumer"

    def run(self):
        while True:
            try:
                self._consume_loop()
            except Exception as exc:
                logger.warning(
                    "SSOEventConsumer: error — reintentando en 5 s: %s", exc
                )
                time.sleep(5)

    def _consume_loop(self):
        from django.conf import settings
        from kombu import Connection, Exchange, Queue

        amqp_url = getattr(settings, "SSO_AMQP_URL", "")
        if not amqp_url:
            logger.debug(
                "SSOEventConsumer: SSO_AMQP_URL no configurada — consumidor inactivo."
            )
            time.sleep(60)
            return

        system_slug = getattr(settings, "SSO_SYSTEM_SLUG", "sistema")
        exchange = Exchange("sso.events", type="topic", durable=True)
        queue = Queue(
            f"sso.events.{system_slug}",
            exchange=exchange,
            routing_key="#",
            durable=True,
        )

        with Connection(amqp_url, heartbeat=30) as conn:
            logger.info(
                "SSOEventConsumer: conectado — exchange=sso.events queue=sso.events.%s",
                system_slug,
            )
            with conn.Consumer(
                queues=[queue], callbacks=[self._handle], prefetch_count=1
            ):
                while True:
                    try:
                        conn.drain_events(timeout=2)
                    except socket.timeout:
                        conn.heartbeat_check()

    @staticmethod
    def _handle(body, message):
        try:
            if not isinstance(body, dict):
                body = json.loads(body)

            event_type = body.get("event_type", "")

            if event_type == "permission_change":
                from django.conf import settings as _s
                rol_id = str(body.get("rol_id", "")).strip()
                new_pv = body.get("new_pv")
                if rol_id and new_pv is not None:
                    from .state import set_local_pv, set_local_perms
                    set_local_pv(rol_id, int(new_pv))

                    # permissions_by_app siempre presente en el payload de admincentral.
                    # Usar get(slug, []) para cubrir el caso en que el rol quedó sin
                    # permisos para este sistema — en ese caso la clave está ausente
                    # del dict pero debemos actualizar Redis a lista vacía.
                    if "permissions_by_app" in body:
                        system_slug = getattr(_s, "SSO_SYSTEM_SLUG", "sistema")
                        perms = body["permissions_by_app"].get(system_slug, [])
                        set_local_perms(rol_id, perms)
                        from .notify import publish_perm_change
                        publish_perm_change(rol_id)
                        logger.info(
                            "SSOConsumer: pv+perms actualizados — rol=%s pv=%s perms=%d",
                            rol_id, new_pv, len(perms),
                        )
                    else:
                        logger.info(
                            "SSOConsumer: pv actualizado — rol=%s pv=%s (sin permissions_by_app en payload)",
                            rol_id, new_pv,
                        )

            elif event_type == "device_revoked":
                user_id = str(body.get("user_id", "")).strip()
                new_dv = body.get("new_dv")
                if user_id and new_dv is not None:
                    from .state import set_local_dv
                    set_local_dv(user_id, int(new_dv))
                    logger.info(
                        "SSOConsumer: dv actualizado — user=%s dv=%s", user_id, new_dv
                    )

            elif event_type == "session_revoked":
                user_id = str(body.get("user_id", "")).strip()
                if user_id:
                    from django.core.cache import cache
                    cache.set(f"sso:session:{user_id}:revoked", 1, 86400)
                    logger.info(
                        "SSOConsumer: sesión revocada — user=%s", user_id
                    )

            else:
                logger.debug(
                    "SSOConsumer: event_type desconocido ignorado: %s", event_type
                )

            message.ack()

        except Exception as exc:
            logger.error(
                "SSOConsumer: error procesando mensaje — %s; body=%s", exc, body
            )
            message.reject(requeue=True)
