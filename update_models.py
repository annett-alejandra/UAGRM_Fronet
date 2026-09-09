import sys

models_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_core\models.py"
with open(models_path, 'r', encoding='utf-8') as f:
    content = f.read()

expediente_model = """
class ExpedienteEstudiante(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ci_estudiante = models.CharField(max_length=20, unique=True, db_index=True)
    nombre_completo = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ci_estudiante} - {self.nombre_completo}"
"""

if "ExpedienteEstudiante" not in content:
    # Insert right before DocumentoEstado
    content = content.replace(
        "class DocumentoEstado(models.TextChoices):",
        expediente_model + "\nclass DocumentoEstado(models.TextChoices):"
    )
    
    # Add FK to DocumentoEscaneado
    fk_field = "    expediente = models.ForeignKey(ExpedienteEstudiante, on_delete=models.SET_NULL, null=True, related_name='documentos')"
    
    content = content.replace(
        "    id_usuario_auditor = models.ForeignKey(",
        fk_field + "\n    id_usuario_auditor = models.ForeignKey("
    )
    
    with open(models_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("models.py actualizado con ExpedienteEstudiante")
else:
    print("ExpedienteEstudiante ya existe")
