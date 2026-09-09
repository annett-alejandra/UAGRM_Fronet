"""
AppConfig para uagrm_sso — módulo cliente SSO del IdP admincentral UAGRM.

En ready() arranca SSOEventConsumer como daemon thread cuando el proceso
es un servidor web (uvicorn/gunicorn) o el hijo del autoreloader de Django.
No se inicia durante management commands (migrate, shell, collectstatic)
ni en procesos Celery (worker, beat).

Prerequisito: SSO_AMQP_URL debe estar configurada en el entorno; si está
vacía, el consumer dormirá sin consumir ningún mensaje.
"""

import os
import sys

from django.apps import AppConfig


class UagrmSSOConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "uagrm_sso"
    verbose_name = "UAGRM SSO Client"

    def ready(self):
        if self._should_start_consumer():
            self._start_consumer()

    @staticmethod
    def _should_start_consumer() -> bool:
        """
        True solo cuando el proceso es un servidor web:
          - Producción (gunicorn/uvicorn): argv[0] no es manage.py ni celery.
          - Desarrollo (manage.py runserver): solo el proceso hijo (RUN_MAIN=true).
          - Management commands (migrate, shell, etc.): False.
          - Celery worker/beat: False.
        """
        argv0 = os.path.basename(sys.argv[0])

        if argv0 == "celery" or any("celery" in str(a) for a in sys.argv[:2]):
            return False

        if argv0 in ("manage.py", "django-admin"):
            cmd = sys.argv[1] if len(sys.argv) > 1 else ""
            return cmd == "runserver" and os.environ.get("RUN_MAIN") == "true"

        return True

    @staticmethod
    def _start_consumer():
        import logging
        from django.conf import settings

        if not getattr(settings, "SSO_AMQP_URL", ""):
            return
        try:
            from .consumer import SSOEventConsumer
            SSOEventConsumer().start()
            logging.getLogger(__name__).info(
                "UagrmSSOConfig: SSOEventConsumer iniciado."
            )
        except Exception as exc:
            logging.getLogger(__name__).warning(
                "UagrmSSOConfig: no se pudo iniciar el consumer AMQP: %s", exc
            )
