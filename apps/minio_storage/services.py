"""
services.py – Generación de URLs prefirmadas (presigned URLs).

Operaciones PUT (subida directa desde el navegador) y GET (descarga/visualización).
"""
from django.conf import settings

from .client import get_s3_client


def generate_presigned_upload_url(
    object_key: str,
    content_type: str = "application/octet-stream",
    expiration: int = 3600,
) -> str:
    """
    Genera una URL prefirmada para que el cliente suba un archivo
    directamente a MinIO (PUT).
    """
    s3 = get_s3_client()
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": settings.MINIO_BUCKET_NAME,
            "Key": object_key,
            "ContentType": content_type,
        },
        ExpiresIn=expiration,
    )


def generate_presigned_download_url(
    object_key: str,
    expiration: int = 3600,
) -> str:
    """
    Genera una URL prefirmada para descargar / visualizar un archivo
    almacenado en MinIO (GET).
    """
    s3 = get_s3_client()
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket": settings.MINIO_BUCKET_NAME,
            "Key": object_key,
        },
        ExpiresIn=expiration,
    )
