"""
services.py - Lógica de negocio para el módulo ocr_core.

Contiene las funciones que conectan el resultado del OCR (ocr_pipeline)
con el flujo de Control de Calidad de la UAGRM:
    Escaneo -> Pendiente Control Calidad -> Aprobado Vo.Bo.
"""
import logging
from apps.pdf_generator.services import generar_informe_veracidad_pdf
import re

from django.db import transaction

from apps.ocr_core.models import (
    ExpedienteEstudiante,
    DocumentoEscaneado,
    DocumentoEstado,
    TituloProfesionalMetadata,
    InformeArchivoVoBo,
)

logger = logging.getLogger(__name__)


def generar_object_key(modulo: str, tipo_documento: str, gestion: str, identificador: str) -> str:
    """
    Genera la ruta dinámica para MinIO siguiendo la convención UAGRM:
    /{modulo}/{tipo_documento}/{gestion_academica}/{identificador_unico}.pdf
    """
    return f"{modulo}/{tipo_documento}/{gestion}/{identificador}.pdf"


def registrar_documento_escaneado(
    object_key: str,
    ocr_text: str,
    usuario_digitalizador_id=None,
) -> DocumentoEscaneado:
    """
    Paso A del flujo: El escáner genera el PDF y el OCR extrae los datos.
    Se crea un DocumentoEscaneado con estado PENDIENTE_CONTROL_CALIDAD.
    Los datos del OCR se guardan como "guesses" (no definitivos).
    """
    ocr_guesses = _parsear_ocr_a_guesses(ocr_text)

    doc = DocumentoEscaneado.objects.create(
        object_key=object_key,
        estado=DocumentoEstado.PENDIENTE_CONTROL_CALIDAD,
        ocr_guesses=ocr_guesses,
        id_usuario_digitalizador_id=usuario_digitalizador_id,
    )
    logger.info("Documento escaneado registrado: %s (estado: PENDIENTE_CONTROL_CALIDAD)", doc.id)
    return doc


def _parsear_ocr_a_guesses(texto_ocr: str) -> dict:
    """
    Intenta extraer campos clave del texto OCR usando expresiones regulares.
    Retorna un dict con los 'guesses' (sugerencias) para revisión humana.
    """
    guesses = {"texto_completo": texto_ocr[:2000]}

    # Intentar extraer número de título
    match_titulo = re.search(r"(?:título|titulo|nro|n°|numero)\s*[:\-]?\s*(\d[\d\-/]*)", texto_ocr, re.IGNORECASE)
    if match_titulo:
        guesses["numero_titulo"] = match_titulo.group(1).strip()

    # Intentar extraer nombre
    match_nombre = re.search(r"(?:señor|señora|graduado|nombre)\s*[:\-]?\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)", texto_ocr)
    if match_nombre:
        guesses["nombre_graduado"] = match_nombre.group(1).strip()

    # Intentar extraer libro y fojas
    match_libro = re.search(r"(?:libro)\s*[:\-]?\s*(\d+)", texto_ocr, re.IGNORECASE)
    if match_libro:
        guesses["libro"] = match_libro.group(1).strip()

    match_fojas = re.search(r"(?:fojas?|foja)\s*[:\-]?\s*(\d+)", texto_ocr, re.IGNORECASE)
    if match_fojas:
        guesses["fojas"] = match_fojas.group(1).strip()

    return guesses


@transaction.atomic
def validar_y_consolidar_documento(
    documento_id: str,
    datos_validados: dict,
    usuario_auditor_id=None,
) -> tuple: # (DocumentoEscaneado, url_pdf)
    """
    Paso B del flujo: El auditor revisa y consolida los datos del OCR.
    Cambia el estado a APROBADO_VOBO y crea los metadatos definitivos.
    
    datos_validados debe contener:
        numero_titulo, nombre_graduado, libro, fojas
    """
    doc = DocumentoEscaneado.objects.select_for_update().get(pk=documento_id)

    if doc.estado != DocumentoEstado.PENDIENTE_CONTROL_CALIDAD:
        raise ValueError(f"El documento {documento_id} no está en estado PENDIENTE_CONTROL_CALIDAD")

    # Crear metadatos definitivos

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
    
    return doc, url_pdf


def devolver_documento(documento_id: str, motivo: str, usuario_auditor_id=None) -> DocumentoEscaneado:
    """
    El auditor devuelve el documento por deficiencia en el escaneo.
    """
    doc = DocumentoEscaneado.objects.get(pk=documento_id)
    doc.estado = DocumentoEstado.DEVUELTO
    doc.motivo_devolucion = motivo
    doc.id_usuario_auditor_id = usuario_auditor_id
    doc.save(update_fields=["estado", "motivo_devolucion", "id_usuario_auditor"])
    logger.info("Documento %s devuelto. Motivo: %s", documento_id, motivo)
    return doc
