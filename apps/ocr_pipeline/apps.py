from django.apps import AppConfig


class OcrPipelineConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.ocr_pipeline"
    verbose_name = "Pipeline OCR"

    def ready(self):
        # Importar listeners para registrar los handlers de señales
        from . import listeners  # noqa: F401
