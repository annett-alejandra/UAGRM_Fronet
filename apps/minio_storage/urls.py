"""
urls.py – Enrutamiento del módulo minio_storage.
"""
from django.urls import path

from . import views

app_name = "minio_storage"

urlpatterns = [
    path("presign/upload/", views.PresignedUploadView.as_view(), name="presigned-upload"),
    path("presign/download/", views.PresignedDownloadView.as_view(), name="presigned-download"),
]
