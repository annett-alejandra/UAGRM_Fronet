from celery import shared_task
import logging
import os
import tempfile
from apps.motor_ocr.services import procesar_imagen_ocr
from django.conf import settings
from apps.minio_storage.services import get_s3_client

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def tarea_extraer_texto(self, minio_object_key):
    """
    Descarga la imagen de MinIO, la procesa con PaddleOCR y devuelve el JSON.
    """
    logger.info(f"Iniciando extraccion OCR para: {minio_object_key}")
    
    s3 = get_s3_client()
    bucket_name = settings.MINIO_BUCKET_EXPEDIENTES
    
    # Descargar a un archivo temporal
    fd, temp_path = tempfile.mkstemp(suffix=".jpg")
    try:
        with os.fdopen(fd, 'wb') as f:
            s3.download_fileobj(bucket_name, minio_object_key, f)
            
        logger.info(f"Imagen descargada temporalmente en: {temp_path}")
        
        # Procesar OCR
        resultado_json = procesar_imagen_ocr(temp_path)
        
        logger.info("Extraccion OCR completada exitosamente.")
        return resultado_json
        
    except Exception as exc:
        logger.error(f"Error en tarea_extraer_texto: {exc}")
        self.retry(exc=exc, countdown=10)
    finally:
        # Limpiar archivo temporal
        if os.path.exists(temp_path):
            os.remove(temp_path)
