"""
models.py – Entidades del Dominio: Trámite, Título y Certificación.

Este es el núcleo del monolito modular. Contiene las reglas de negocio
en forma de modelos, los estados de los documentos y los tipos de títulos.
"""
import uuid

from django.db import models
from apps.audit_logs.mixins import AuditableModelMixin



# ──────────────────────────────────────────────
# Choices / Enums
# ──────────────────────────────────────────────

class TipoTitulo(models.TextChoices):
    """Los 5 tipos de título supletorio."""
    BIENHECHURIA = "BIENHECHURIA", "Título de Bienhechuría"
    PROPIEDAD = "PROPIEDAD", "Título de Propiedad"
    EJIDO = "EJIDO", "Título de Ejido"
    POSESION = "POSESION", "Título de Posesión"
    SUPLETORIO = "SUPLETORIO", "Título Supletorio"


class EstadoTramite(models.TextChoices):
    """Estados del flujo de un trámite."""
    RECEPCION_VENTANILLA = "RECEPCION_VENTANILLA", "Recepción en Ventanilla"
    REVISION_ARCHIVO = "REVISION_ARCHIVO", "Revisión en Archivo Central"
    VERIFICADO_OCR = "VERIFICADO_OCR", "Verificado por OCR"
    APROBACION_TITULOS = "APROBACION_TITULOS", "Aprobación en Sección Títulos"
    CERTIFICACION_EMITIDA = "CERTIFICACION_EMITIDA", "Certificación Emitida"
    ENTREGADO = "ENTREGADO", "Entregado al Solicitante"
    RECHAZADO = "RECHAZADO", "Rechazado"


class EstadoCertificacion(models.TextChoices):
    PENDIENTE = "PENDIENTE", "Pendiente"
    APROBADA = "APROBADA", "Aprobada"
    RECHAZADA = "RECHAZADA", "Rechazada"


# ──────────────────────────────────────────────
# Modelos
# ──────────────────────────────────────────────

class Titulo(AuditableModelMixin, models.Model):
    """
    Entidad principal: el título supletorio.
    Maneja los 5 tipos mediante un campo de opciones.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tipo_titulo = models.CharField(
        "Tipo de Título",
        max_length=20,
        choices=TipoTitulo.choices,
        db_index=True,
    )
    numero_expediente = models.CharField(
        "N.° de Expediente",
        max_length=64,
        unique=True,
    )
    solicitante_nombre = models.CharField("Nombre del solicitante", max_length=256)
    solicitante_cedula = models.CharField("Cédula del solicitante", max_length=20)
    descripcion = models.TextField("Descripción del bien o derecho", blank=True, default="")
    document_id = models.UUIDField(
        "ID del Documento",
        null=True,
        blank=True,
        db_index=True,
        help_text="Referencia lógica al documento digitalizado (Módulo documents).",
    )
    department_id = models.UUIDField(
        "ID del Departamento",
        db_index=True,
        help_text="Referencia lógica al departamento que gestiona este título (Módulo organizational_units).",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Título"
        verbose_name_plural = "Títulos"
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.get_tipo_titulo_display()}] {self.numero_expediente}"


class Tramite(AuditableModelMixin, models.Model):
    """
    Controla el flujo del documento a través de las unidades organizacionales.
    Ej: Recepción en Ventanilla → Revisión en Archivo Central → Aprobación.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.ForeignKey(
        Titulo,
        on_delete=models.CASCADE,
        related_name="tramites",
    )
    estado = models.CharField(
        "Estado del trámite",
        max_length=30,
        choices=EstadoTramite.choices,
        default=EstadoTramite.RECEPCION_VENTANILLA,
        db_index=True,
    )
    unidad_actual_id = models.UUIDField(
        "ID de Unidad Actual",
        db_index=True,
        help_text="Referencia lógica a la unidad organizacional (Módulo organizational_units).",
    )
    observaciones = models.TextField("Observaciones", blank=True, default="")
    asignado_a = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tramites_asignados",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Trámite"
        verbose_name_plural = "Trámites"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Trámite {self.titulo.numero_expediente} → {self.get_estado_display()}"


class Certificacion(AuditableModelMixin, models.Model):
    """
    Certificación emitida que respalda un título.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.ForeignKey(
        Titulo,
        on_delete=models.CASCADE,
        related_name="certificaciones",
    )
    codigo_certificacion = models.CharField(
        "Código de certificación",
        max_length=64,
        unique=True,
    )
    estado = models.CharField(
        "Estado",
        max_length=20,
        choices=EstadoCertificacion.choices,
        default=EstadoCertificacion.PENDIENTE,
    )
    emitida_por = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="certificaciones_emitidas",
    )
    fecha_emision = models.DateTimeField("Fecha de emisión", null=True, blank=True)
    observaciones = models.TextField("Observaciones", blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Certificación"
        verbose_name_plural = "Certificaciones"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Cert. {self.codigo_certificacion} → {self.titulo.numero_expediente}"
