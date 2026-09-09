"""
serializers.py – DTOs para solicitudes de subida y descarga.
"""
from rest_framework import serializers


class PresignedUploadRequestSerializer(serializers.Serializer):
    """Datos necesarios para solicitar una URL de subida."""
    filename = serializers.CharField(max_length=512, help_text="Nombre del archivo a subir.")
    content_type = serializers.CharField(
        max_length=128,
        default="application/octet-stream",
        help_text="MIME type del archivo.",
    )
    organizational_unit_id = serializers.UUIDField(
        help_text="UUID de la unidad organizacional que sube el documento.",
    )


class PresignedUploadResponseSerializer(serializers.Serializer):
    """Respuesta con la URL prefirmada para PUT."""
    upload_url = serializers.URLField()
    object_key = serializers.CharField()
    expires_in = serializers.IntegerField()


class PresignedDownloadRequestSerializer(serializers.Serializer):
    """Datos necesarios para solicitar una URL de descarga."""
    object_key = serializers.CharField(max_length=1024)


class PresignedDownloadResponseSerializer(serializers.Serializer):
    """Respuesta con la URL prefirmada para GET."""
    download_url = serializers.URLField()
    expires_in = serializers.IntegerField()
