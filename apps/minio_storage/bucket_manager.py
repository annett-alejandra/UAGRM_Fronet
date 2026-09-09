"""
bucket_manager.py – Administración de Buckets, ILM y WORM.

Funciones de utilidad para crear, configurar y gestionar buckets
de MinIO de forma programática.
"""
import json
import logging

from django.conf import settings

from .client import get_s3_client

logger = logging.getLogger(__name__)


def ensure_bucket_exists(bucket_name: str | None = None) -> None:
    """Crea el bucket si no existe."""
    bucket_name = bucket_name or settings.MINIO_BUCKET_NAME
    s3 = get_s3_client()
    try:
        s3.head_bucket(Bucket=bucket_name)
        logger.info("Bucket '%s' ya existe.", bucket_name)
    except s3.exceptions.ClientError:
        s3.create_bucket(Bucket=bucket_name)
        logger.info("Bucket '%s' creado.", bucket_name)


def set_lifecycle_policy(
    bucket_name: str | None = None,
    *,
    prefix: str = "",
    expiration_days: int = 365 * 10,
) -> None:
    """
    Configura una política de ciclo de vida (ILM) sobre un prefijo.
    Por defecto, los objetos expiran a los 10 años.
    """
    bucket_name = bucket_name or settings.MINIO_BUCKET_NAME
    s3 = get_s3_client()
    policy = {
        "Rules": [
            {
                "ID": f"ilm-{prefix or 'all'}",
                "Status": "Enabled",
                "Filter": {"Prefix": prefix},
                "Expiration": {"Days": expiration_days},
            }
        ]
    }
    s3.put_bucket_lifecycle_configuration(
        Bucket=bucket_name,
        LifecycleConfiguration=policy,
    )
    logger.info("ILM aplicada en '%s/%s' → %d días.", bucket_name, prefix, expiration_days)


def enable_object_lock(bucket_name: str | None = None) -> None:
    """
    Habilita WORM (Object Lock) en el bucket.
    NOTA: El bucket debe haber sido creado con ObjectLockEnabledForBucket=True.
    """
    bucket_name = bucket_name or settings.MINIO_BUCKET_NAME
    s3 = get_s3_client()
    s3.put_object_lock_configuration(
        Bucket=bucket_name,
        ObjectLockConfiguration={
            "ObjectLockEnabled": "Enabled",
            "Rule": {
                "DefaultRetention": {
                    "Mode": "COMPLIANCE",
                    "Days": 365 * 5,  # 5 años de retención por defecto
                }
            },
        },
    )
    logger.info("Object Lock (WORM) habilitado en '%s'.", bucket_name)
