"""
models.py – Metadatos de documentos y estados operativos.
"""
import uuid

from django.db import models
from apps.audit_logs.mixins import AuditableModelMixin



class DocumentStatus(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    UPLOADING = "UPLOADING", "Subiendo"
    UPLOADED = "UPLOADED", "Subido"
    PROCESSING = "PROCESSING", "En procesamiento OCR"
    DONE = "DONE", "Completado"
    ERROR = "ERROR", "Error"


class Document(AuditableModelMixin, models.Model):
    """
    Registro de metadatos de un documento almacenado en MinIO.
    No almacena el archivo en sí, solo su referencia (object_key).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department_id = models.UUIDField(
        "ID del Departamento",
        help_text="Referencia lógica al departamento propietario (Módulo organizational_units).",
        db_index=True,
    )
    title = models.CharField("Título del documento", max_length=512)
    description = models.TextField("Descripción", blank=True, default="")
    object_key = models.CharField(
        "Clave del objeto en MinIO",
        max_length=1024,
        unique=True,
    )
    content_type = models.CharField("MIME type", max_length=128, default="application/pdf")
    file_size_bytes = models.BigIntegerField("Tamaño (bytes)", null=True, blank=True)
    status = models.CharField(
        "Estado",
        max_length=20,
        choices=DocumentStatus.choices,
        default=DocumentStatus.PENDING,
        db_index=True,
    )
    extracted_text = models.TextField(
        "Texto extraído (OCR)",
        blank=True,
        default="",
        help_text="Texto plano extraído por el pipeline de OCR.",
    )
    uploaded_by = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_documents",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Documento"
        verbose_name_plural = "Documentos"
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.status}] {self.title}"
