"""
listeners.py - Handlers que escuchan eventos de dominio.

Aqui se conectan otros modulos al signal ocr_completed para
reaccionar al resultado del OCR sin acoplamiento directo.
"""
import logging

from django.dispatch import receiver

from .signals import ocr_completed

logger = logging.getLogger(__name__)


@receiver(ocr_completed)
def on_ocr_completed_update_tramite(sender, document_id: str, extracted_text: str, **kwargs):
    """
    Escuchado por titulos_tramites:
    Actualiza el estado del tramite asociado a "VERIFICADO_OCR".
    """
    try:
        from apps.titulos_tramites.services import marcar_tramite_verificado_ocr
        marcar_tramite_verificado_ocr(document_id)
        logger.info("Tramite actualizado a VERIFICADO_OCR para documento %s.", document_id)
    except Exception:
        logger.exception("Error actualizando tramite para documento %s.", document_id)


@receiver(ocr_completed)
def on_ocr_completed_index_search(sender, document_id: str, extracted_text: str, **kwargs):
    """
    Escuchado por search_engine:
    Indexa el texto extraido en OpenSearch.
    """
    try:
        from apps.search_engine.services import index_document_text
        index_document_text(document_id, extracted_text)
        logger.info("Documento %s indexado en OpenSearch.", document_id)
    except Exception:
        logger.exception("Error indexando documento %s en OpenSearch.", document_id)


@receiver(ocr_completed)
def on_ocr_completed_registrar_gemelo_digital(sender, document_id: str, extracted_text: str, **kwargs):
    """
    NUEVO - Escuchado por ocr_core (Gemelo Digital):
    Crea el DocumentoEscaneado con los guesses del OCR para
    el flujo de Control de Calidad de la UAGRM.
    """
    try:
        from apps.documents.models import Document
        from apps.ocr_core.services import registrar_documento_escaneado

        document = Document.objects.get(pk=document_id)

        registrar_documento_escaneado(
            object_key=document.object_key,
            ocr_text=extracted_text,
            usuario_digitalizador_id=document.uploaded_by_id,
        )
        logger.info(
            "Gemelo Digital creado en ocr_core para documento %s (estado: PENDIENTE_CONTROL_CALIDAD).",
            document_id,
        )
    except Exception:
        logger.exception("Error creando Gemelo Digital para documento %s.", document_id)
