"""
serializers.py – Validadores de la información del documento.
"""
from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    # No podemos leer el nombre directamente, solo el ID
    department_name = serializers.CharField(read_only=True, default="")

    class Meta:
        model = Document
        fields = [
            "id",
            "department_id",
            "department_name",
            "title",
            "description",
            "object_key",
            "content_type",
            "file_size_bytes",
            "status",
            "extracted_text",
            "uploaded_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "extracted_text",
            "created_at",
            "updated_at",
        ]


class DocumentCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para la creación de documentos."""

    class Meta:
        model = Document
        fields = [
            "department_id",
            "title",
            "description",
            "object_key",
            "content_type",
            "file_size_bytes",
        ]
