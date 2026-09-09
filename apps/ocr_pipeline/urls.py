"""
urls.py – Enrutamiento del módulo ocr_pipeline.
"""
from django.urls import path

from . import views

app_name = "ocr_pipeline"

urlpatterns = [
    path("webhook/minio/", views.MinioWebhookView.as_view(), name="minio-webhook"),
]
