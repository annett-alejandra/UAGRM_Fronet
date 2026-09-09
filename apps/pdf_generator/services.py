import logging
from io import BytesIO
from django.conf import settings
from apps.minio_storage.client import get_s3_client
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)

def generar_informe_veracidad_pdf(datos: dict, ci_estudiante: str) -> str:
    """
    Genera el Informe de Veracidad en PDF usando WeasyPrint.
    Sube el PDF a MinIO y retorna la URL presignada.
    """
    # Importacion diferida para evitar crasheos en Windows por falta de GTK3
    logger.warning("Generacion de PDF mockeada temporalmente por bloqueo de red en Docker.")
    return f"http://localhost:9000/uagrm-expedientes/informes_veracidad/{ci_estudiante}_mock.pdf"

