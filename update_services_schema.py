import sys

services_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_core\services.py"
with open(services_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Añadir import de ExpedienteEstudiante y generar_informe_veracidad_pdf
if "from apps.ocr_core.models import ExpedienteEstudiante" not in content:
    content = content.replace(
        "from apps.ocr_core.models import (",
        "from apps.ocr_core.models import (\n    ExpedienteEstudiante,"
    )
    content = content.replace(
        "import logging",
        "import logging\nfrom apps.pdf_generator.services import generar_informe_veracidad_pdf"
    )

# Modificar validar_y_consolidar_documento
old_signature = """def validar_y_consolidar_documento(
    documento_id: str,
    datos_validados: dict,
    usuario_auditor_id=None,
) -> DocumentoEscaneado:"""

new_signature = """def validar_y_consolidar_documento(
    documento_id: str,
    datos_validados: dict,
    usuario_auditor_id=None,
) -> tuple: # (DocumentoEscaneado, url_pdf)"""

if old_signature in content:
    content = content.replace(old_signature, new_signature)
    
    # Reemplazar la creacion del titulo profesional metadata
    old_metadata_creation = """    TituloProfesionalMetadata.objects.create(
        documento=doc,
        numero_titulo=datos_validados["numero_titulo"],
        nombre_graduado=datos_validados["nombre_graduado"],
        libro=datos_validados.get("libro", ""),
        fojas=datos_validados.get("fojas", ""),
    )

    # Actualizar estado
    doc.estado = DocumentoEstado.APROBADO_VOBO
    doc.id_usuario_auditor_id = usuario_auditor_id
    doc.save(update_fields=["estado", "id_usuario_auditor"])

    logger.info("Documento %s consolidado y aprobado Vo.Bo.", documento_id)
    return doc"""

    new_metadata_creation = """
    # 1. Buscar o crear el Expediente (File Casadito)
    ci_estudiante = datos_validados.get("ci_estudiante", "DESCONOCIDO")
    nombre_graduado = datos_validados.get("nombre_graduado", "Sin Nombre")
    
    expediente, _ = ExpedienteEstudiante.objects.get_or_create(
        ci_estudiante=ci_estudiante,
        defaults={"nombre_completo": nombre_graduado}
    )
    
    # 2. Guardar Metadatos y enlazar al Expediente
    TituloProfesionalMetadata.objects.create(
        documento=doc,
        numero_titulo=datos_validados.get("numero_titulo", ""),
        nombre_graduado=nombre_graduado,
        libro=datos_validados.get("libro", ""),
        fojas=datos_validados.get("fojas", ""),
    )

    # 3. Actualizar estado y enlazar documento
    doc.estado = DocumentoEstado.APROBADO_VOBO
    doc.id_usuario_auditor_id = usuario_auditor_id
    doc.expediente = expediente
    doc.save(update_fields=["estado", "id_usuario_auditor", "expediente"])

    logger.info("Documento %s consolidado y aprobado Vo.Bo. (CI: %s)", documento_id, ci_estudiante)
    
    # 4. Generar Informe de Veracidad en PDF
    url_pdf = generar_informe_veracidad_pdf(datos_validados, ci_estudiante)
    
    return doc, url_pdf"""
    
    content = content.replace(old_metadata_creation, new_metadata_creation)

    with open(services_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("services.py actualizado")

schema_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_core\schema.py"
with open(schema_path, 'r', encoding='utf-8') as f:
    schema_content = f.read()

if "url_pdf_informe = graphene.String()" not in schema_content:
    schema_content = schema_content.replace(
        "    documento = graphene.Field(DocumentoEscaneadoType)",
        "    documento = graphene.Field(DocumentoEscaneadoType)\n    url_pdf_informe = graphene.String()"
    )
    schema_content = schema_content.replace(
        "doc = validar_y_consolidar_documento(",
        "doc, url_pdf = validar_y_consolidar_documento("
    )
    schema_content = schema_content.replace(
        "return ValidarYConsolidarDocumento(documento=doc)",
        "return ValidarYConsolidarDocumento(documento=doc, url_pdf_informe=url_pdf)"
    )

    with open(schema_path, 'w', encoding='utf-8') as f:
        f.write(schema_content)
    print("schema.py actualizado")
