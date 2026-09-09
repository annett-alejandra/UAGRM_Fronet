"""
models.py – Jerarquía institucional y repositorios lógicos.
"""
import uuid

from django.db import models


class Institution(models.Model):
    """
    Representa la institución raíz (ej. la Universidad).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Nombre de la institución", max_length=256)
    code = models.CharField("Código único", max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Institución"
        verbose_name_plural = "Instituciones"

    def __str__(self):
        return self.name


class Department(models.Model):
    """
    Unidad u oficina dentro de la institución.
    Ejemplos: DTIC, Archivo Central, Vicerrectorado, Sección Títulos.
    Soporta jerarquía (parent) para sub-departamentos.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name="departments",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
        help_text="Departamento padre (si aplica).",
    )
    name = models.CharField("Nombre del departamento", max_length=256)
    code = models.CharField("Código único del depto.", max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"

    def __str__(self):
        return f"{self.institution.code}/{self.name}"


class LogicalRepository(models.Model):
    """
    Carpeta/prefijo de almacenamiento asignado dentro de MinIO
    a un departamento específico.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.OneToOneField(
        Department,
        on_delete=models.CASCADE,
        related_name="repository",
    )
    bucket_name = models.CharField(
        "Bucket MinIO",
        max_length=128,
        help_text="Nombre del bucket en MinIO.",
    )
    prefix = models.CharField(
        "Prefijo / ruta virtual",
        max_length=512,
        help_text="Prefijo (carpeta virtual) dentro del bucket.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Repositorio Lógico"
        verbose_name_plural = "Repositorios Lógicos"

    def __str__(self):
        return f"s3://{self.bucket_name}/{self.prefix}"


class StorageQuota(models.Model):
    """
    Límite de espacio en disco (GB) disponible para un departamento.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    department = models.OneToOneField(
        Department,
        on_delete=models.CASCADE,
        related_name="quota",
    )
    max_size_gb = models.DecimalField(
        "Cuota máxima (GB)",
        max_digits=10,
        decimal_places=2,
        default=10.00,
    )
    used_size_gb = models.DecimalField(
        "Espacio usado (GB)",
        max_digits=10,
        decimal_places=2,
        default=0.00,
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Cuota de Almacenamiento"
        verbose_name_plural = "Cuotas de Almacenamiento"

    def __str__(self):
        return f"{self.department} → {self.used_size_gb}/{self.max_size_gb} GB"

    @property
    def remaining_gb(self):
        return self.max_size_gb - self.used_size_gb

    @property
    def is_exceeded(self):
        return self.used_size_gb >= self.max_size_gb
