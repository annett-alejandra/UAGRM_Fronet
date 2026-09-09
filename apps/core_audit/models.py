import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SesionSeguridad(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sesiones_seguridad')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    
    direccion_ip = models.GenericIPAddressField(null=True, blank=True)
    direccion_mac = models.CharField(max_length=17, null=True, blank=True, help_text="Formato: XX:XX:XX:XX:XX:XX")
    user_agent = models.TextField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Sesión de Seguridad'
        verbose_name_plural = 'Sesiones de Seguridad'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"Sesión de {self.usuario.username} ({self.direccion_ip})"


class HistorialBackup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fecha_ejecucion = models.DateTimeField(auto_now_add=True)
    exitoso = models.BooleanField(default=True)
    tamano_bytes = models.BigIntegerField(null=True, blank=True)
    ruta_archivo = models.CharField(max_length=512)
    
    ejecutado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    direccion_ip = models.GenericIPAddressField(null=True, blank=True)
    direccion_mac = models.CharField(max_length=17, null=True, blank=True)
    notas = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = 'Historial de Backup'
        verbose_name_plural = 'Historiales de Backups'
        ordering = ['-fecha_ejecucion']

    def __str__(self):
        estado = "Exitoso" if self.exitoso else "Fallido"
        return f"Backup {self.fecha_ejecucion.strftime('%Y-%m-%d %H:%M')} - {estado}"
