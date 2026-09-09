"""
views.py – Endpoint de recepción del Webhook emitido por MinIO.

Recibe el aviso s3:ObjectCreated:* y dispara la tarea de OCR en Celery.
"""
import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.documents.models import Document, DocumentStatus

from .tasks import process_document_ocr

logger = logging.getLogger(__name__)


class MinioWebhookView(APIView):
    """
    Adaptador de entrada: recibe webhooks de MinIO.
    Permiso AllowAny porque MinIO no envía tokens de autenticación Django.
    Se recomienda proteger con IP whitelist o shared secret en producción.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        records = request.data.get("Records", [])

        for record in records:
            event_name = record.get("eventName", "")
            if not event_name.startswith("s3:ObjectCreated"):
                continue

            s3_info = record.get("s3", {})
            object_key = s3_info.get("object", {}).get("key", "")
            bucket_name = s3_info.get("bucket", {}).get("name", "")

            if not object_key:
                logger.warning("Webhook sin object key, ignorando.")
                continue

            logger.info("Webhook recibido: bucket=%s, key=%s", bucket_name, object_key)

            # Buscar el documento asociado
            try:
                document = Document.objects.get(object_key=object_key)
            except Document.DoesNotExist:
                logger.warning("No se encontró documento para object_key=%s", object_key)
                continue

            # Actualizar estado y disparar tarea asíncrona
            document.status = DocumentStatus.UPLOADED
            document.save(update_fields=["status", "updated_at"])

            process_document_ocr.delay(str(document.id), bucket_name)
            logger.info("Tarea OCR encolada para documento %s.", document.id)

        return Response({"status": "ok"}, status=status.HTTP_200_OK)
