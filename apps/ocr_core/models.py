import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ExpedienteEstudiante(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ci_estudiante = models.CharField(max_length=20, unique=True, db_index=True)
    nombre_completo = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ci_estudiante} - {self.nombre_completo}"

class DocumentoEstado(models.TextChoices):
    ESCANEO_COMPLETADO = 'ESCANEO_COMPLETADO', 'Escaneo Completado'
    PENDIENTE_CONTROL_CALIDAD = 'PENDIENTE_CONTROL_CALIDAD', 'Pendiente de Control de Calidad'
    DEVUELTO = 'DEVUELTO', 'Devuelto por Deficiencia'
    APROBADO_VOBO = 'APROBADO_VOBO', 'Aprobado Vo.Bo.'

class DocumentoEscaneado(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    object_key = models.CharField(max_length=512, help_text="Ruta en MinIO (S3)")
    estado = models.CharField(
        max_length=50,
        choices=DocumentoEstado.choices,
        default=DocumentoEstado.ESCANEO_COMPLETADO
    )
    ocr_guesses = models.JSONField(
        null=True, blank=True,
        help_text="Extracción temporal de Tesseract"
    )
    fecha_subida = models.DateTimeField(auto_now_add=True)
    id_usuario_digitalizador = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='documentos_digitalizados'
    )
    
    expediente = models.ForeignKey(ExpedienteEstudiante, on_delete=models.SET_NULL, null=True, related_name='documentos')
    id_usuario_auditor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='documentos_auditados'
    )
    motivo_devolucion = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.object_key} - {self.get_estado_display()}"


# ==========================================
# INFORMES Y METADATOS DEFINITIVOS
# ==========================================

class TituloProfesionalMetadata(models.Model):
    documento = models.OneToOneField(
        DocumentoEscaneado, on_delete=models.CASCADE, primary_key=True, related_name='titulo_metadata'
    )
    numero_titulo = models.CharField(max_length=100)
    nombre_graduado = models.CharField(max_length=255)
    libro = models.CharField(max_length=50)
    fojas = models.CharField(max_length=50)

    def __str__(self):
        return f"Título {self.numero_titulo} - {self.nombre_graduado}"


class BoletaPagoMetadata(models.Model):
    documento = models.OneToOneField(
        DocumentoEscaneado, on_delete=models.CASCADE, primary_key=True, related_name='boleta_metadata'
    )
    anio = models.IntegerField()
    mes = models.CharField(max_length=20)
    monto = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Boleta {self.mes}/{self.anio} - {self.monto}"


class InformeArchivoVoBo(models.Model):
    id_informe = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    documento = models.OneToOneField(
        DocumentoEscaneado, on_delete=models.CASCADE, related_name='informe_vobo'
    )
    codigo_informe_generado = models.CharField(max_length=100, unique=True)
    id_jefe_archivo = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='informes_aprobados'
    )
    fecha_aprobacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.codigo_informe_generado
