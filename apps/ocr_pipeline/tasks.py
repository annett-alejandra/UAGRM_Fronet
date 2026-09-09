"""
tasks.py – Tareas asíncronas de Celery para el pipeline de OCR.

Contiene la tarea maestra que:
1. Descarga el PDF desde MinIO.
2. Lo divide en páginas/imágenes.
3. Ejecuta el motor de OCR (Tesseract / PaddleOCR).
4. Emite un evento de dominio al finalizar.
"""
import logging
import tempfile
from pathlib import Path

from celery import shared_task
from django.apps import apps

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_document_ocr(self, document_id: str, bucket_name: str = None) -> dict:
    """
    Tarea maestra de OCR.

    Args:
        document_id: UUID del documento registrado en apps.documents.

    Returns:
        dict con el resultado del procesamiento.
    """
    from apps.documents.models import Document, DocumentStatus
    from apps.minio_storage.client import get_s3_client
    from django.conf import settings

    from .processors import extract_text_from_pdf
    from .signals import ocr_completed

    try:
        if bucket_name == settings.MINIO_BUCKET_LIBROS:
            # FLUJO TABULAR
            from apps.libros_matrices.models import PaginaLibroEscaneada
            from apps.libros_matrices.services import registrar_ocr_tabular
            
            try:
                pagina = PaginaLibroEscaneada.objects.get(pk=document_id)
            except PaginaLibroEscaneada.DoesNotExist:
                return {"error": "PaginaLibroEscaneada no encontrada"}
                
            logger.info("Iniciando OCR Tabular para pagina %s", pagina.numero_pagina)
            # En un entorno real se usaria PaddleOCR/LayoutLM
            # Por ahora simulamos los guesses extraidos
            filas_guesses = [
                {"numero_fila": 1, "nombre_estudiante": "EJEMPLO OCR TABULAR 1", "numero_titulo": "001-TEST", "firma_detectada": True}
            ]
            registrar_ocr_tabular(str(pagina.id), filas_guesses)
            
            # Emitimos signal opcional
            return {"document_id": str(pagina.id), "status": "PENDIENTE_CONTROL_CALIDAD"}

        document = Document.objects.get(pk=document_id)
        document.status = DocumentStatus.PROCESSING
        document.save(update_fields=["status", "updated_at"])

        logger.info("Iniciando OCR para documento '%s' (key: %s)", document.title, document.object_key)

        # 1. Descargar archivo de MinIO a un directorio temporal
        s3 = get_s3_client()
        with tempfile.TemporaryDirectory() as tmpdir:
            local_path = Path(tmpdir) / "input.pdf"
            s3.download_file(
                Bucket=bucket_name or settings.MINIO_BUCKET_EXPEDIENTES,
                Key=document.object_key,
                Filename=str(local_path),
            )

            # 2. Extraer texto con el procesador
            extracted_text = extract_text_from_pdf(local_path)

        # 3. Guardar texto extraído
        document.extracted_text = extracted_text
        document.status = DocumentStatus.DONE
        document.save(update_fields=["extracted_text", "status", "updated_at"])

        # 4. Emitir evento de dominio → los otros módulos escuchan
        ocr_completed.send(
            sender=process_document_ocr,
            document_id=str(document.id),
            extracted_text=extracted_text,
        )

        logger.info("OCR completado para documento '%s'.", document.title)
        return {"document_id": str(document.id), "status": "DONE", "text_length": len(extracted_text)}

    except Document.DoesNotExist:
        logger.error("Documento con id=%s no encontrado.", document_id)
        return {"error": "Document not found"}

    except Exception as exc:
        logger.exception("Error procesando OCR para documento %s", document_id)
        # Marcar como error
        Document.objects.filter(pk=document_id).update(status=DocumentStatus.ERROR)
        raise self.retry(exc=exc)
