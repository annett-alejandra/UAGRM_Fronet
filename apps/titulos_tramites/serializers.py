"""
serializers.py – Serializadores del módulo de títulos y trámites.
"""
from rest_framework import serializers

from .models import Certificacion, Titulo, Tramite


class TituloSerializer(serializers.ModelSerializer):
    tipo_titulo_display = serializers.CharField(source="get_tipo_titulo_display", read_only=True)

    class Meta:
        model = Titulo
        fields = [
            "id",
            "tipo_titulo",
            "tipo_titulo_display",
            "numero_expediente",
            "solicitante_nombre",
            "solicitante_cedula",
            "descripcion",
            "document_id",
            "department_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TramiteSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)
    titulo_expediente = serializers.CharField(read_only=True)
    unidad_actual_nombre = serializers.CharField(read_only=True)

    class Meta:
        model = Tramite
        fields = [
            "id",
            "titulo",
            "titulo_expediente",
            "estado",
            "estado_display",
            "unidad_actual_id",
            "unidad_actual_nombre",
            "observaciones",
            "asignado_a",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "estado", "created_at", "updated_at"]


class TramiteCreateSerializer(serializers.Serializer):
    """Serializer para iniciar un nuevo trámite."""
    titulo_id = serializers.UUIDField()
    unidad_recepcion_id = serializers.UUIDField()
    observaciones = serializers.CharField(required=False, default="")


class TramiteDerivarSerializer(serializers.Serializer):
    """Serializer para derivar un trámite a otra unidad."""
    nuevo_estado = serializers.ChoiceField(choices=[
        ("REVISION_ARCHIVO", "Revisión en Archivo Central"),
        ("APROBACION_TITULOS", "Aprobación en Sección Títulos"),
        ("CERTIFICACION_EMITIDA", "Certificación Emitida"),
        ("ENTREGADO", "Entregado al Solicitante"),
        ("RECHAZADO", "Rechazado"),
    ])
    nueva_unidad_id = serializers.UUIDField()
    observaciones = serializers.CharField(required=False, default="")


class CertificacionSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = Certificacion
        fields = [
            "id",
            "titulo",
            "codigo_certificacion",
            "estado",
            "estado_display",
            "emitida_por",
            "fecha_emision",
            "observaciones",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "estado", "emitida_por", "fecha_emision", "created_at", "updated_at"]
