"""
client.py – Inicialización del cliente S3 (boto3) apuntando a MinIO.

Expone un singleton reutilizable para todos los servicios que necesiten
interactuar con el almacenamiento de objetos.
"""
import boto3
from botocore.config import Config as BotoConfig
from django.conf import settings


def get_s3_client():
    """
    Retorna un cliente boto3 configurado para MinIO.
    Usa las variables definidas en settings:
        MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_USE_SSL.
    """
    return boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        use_ssl=settings.MINIO_USE_SSL,
        config=BotoConfig(signature_version="s3v4"),
    )
