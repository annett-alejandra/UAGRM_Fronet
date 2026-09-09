import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class EstadoPagina(models.TextChoices):
    ESCANEO_COMPLETADO = 'ESCANEO_COMPLETADO', 'Escaneo Completado'
    PENDIENTE_CONTROL_CALIDAD = 'PENDIENTE_CONTROL_CALIDAD', 'Pendiente de Control de Calidad (OCR)'
    DEVUELTO = 'DEVUELTO', 'Devuelto por Deficiencia'
    APROBADO_VOBO = 'APROBADO_VOBO', 'Aprobado Vo.Bo.'

class LibroMatriz(models.Model):
    """
    Representa el tomo fisico (Ej: "Libro Entregas 1996-1998").
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tomo_nombre = models.CharField(max_length=255, unique=True)
    gestion_inicio = models.CharField(max_length=4)
    gestion_fin = models.CharField(max_length=4)
    estado_digitalizacion = models.CharField(max_length=50, default='EN_PROCESO')
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Libros Matrices"
        ordering = ["-fecha_registro"]

    def __str__(self):
        return f"{self.tomo_nombre} ({self.gestion_inicio}-{self.gestion_fin})"

class PaginaLibroEscaneada(models.Model):
    """
    Fase 1 (Extraccion): El OCR procesa el escaneo y aloja los metadatos en un estado temporal.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    libro = models.ForeignKey(LibroMatriz, on_delete=models.CASCADE, related_name='paginas')
    numero_pagina = models.IntegerField()
    object_key_minio = models.CharField(max_length=512, help_text="Ruta en uagrm-libros-matrices")
    
    estado = models.CharField(
        max_length=50,
        choices=EstadoPagina.choices,
        default=EstadoPagina.ESCANEO_COMPLETADO
    )
    
    # Human-in-the-Loop: OCR vierte aqui las filas temporales sin afectar el historico
    ocr_filas_guesses = models.JSONField(
        null=True, blank=True,
        help_text="Matriz temporal extraida por el OCR tabular."
    )
    
    id_usuario_digitalizador = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='paginas_digitalizadas'
    )
    id_usuario_auditor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='paginas_auditadas'
    )
    motivo_devolucion = models.TextField(null=True, blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('libro', 'numero_pagina')
        ordering = ["libro", "numero_pagina"]

    def __str__(self):
        return f"Pagina {self.numero_pagina} - {self.libro.tomo_nombre}"

class FilaRegistroHistorico(models.Model):
    """
    Fase 3 (Consolidacion): Registros inmutables que el humano guardo.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pagina = models.ForeignKey(PaginaLibroEscaneada, on_delete=models.CASCADE, related_name='filas_historicas')
    numero_fila = models.IntegerField()
    
    nombre_estudiante = models.CharField(max_length=255)
    numero_titulo = models.CharField(max_length=100)
    firma_detectada = models.BooleanField(default=False)
    
    fecha_consolidacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["pagina", "numero_fila"]

    def __str__(self):
        return f"Fila {self.numero_fila} - Pagina {self.pagina.numero_pagina}"
