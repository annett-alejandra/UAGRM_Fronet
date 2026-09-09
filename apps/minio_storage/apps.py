from django.apps import AppConfig


class MinioStorageConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.minio_storage"
    verbose_name = "MinIO Storage"
