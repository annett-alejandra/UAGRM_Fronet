"""
Celery application for Titulo Supletorio.
"""
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery("titulo_supletorio")
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover tasks.py en cada app registrada
app.autodiscover_tasks()
