"""
services.py – Reglas de negocio que modifican estado.

Contiene la lógica de dominio pura para trámites, títulos y certificaciones.
Estos servicios son invocados desde las views y desde los listeners de eventos.
"""
import logging
from datetime import datetime

from django.db import transaction
from django.utils import timezone

from .models import Certificacion, EstadoCertificacion, EstadoTramite, Titulo, Tramite

logger = logging.getLogger(__name__)


@transaction.atomic
def iniciar_tramite_supletorio(
    titulo: Titulo,
    unidad_recepcion_id: str,
    *,
    observaciones: str = "",
    asignado_a=None,
) -> Tramite:
    """
    Registra el ingreso de un nuevo trámite de título supletorio.
    Crea un Tramite en estado RECEPCION_VENTANILLA.
    """
    tramite = Tramite.objects.create(
        titulo=titulo,
        estado=EstadoTramite.RECEPCION_VENTANILLA,
        unidad_actual_id=unidad_recepcion_id,
        observaciones=observaciones,
        asignado_a=asignado_a,
    )
    logger.info("Trámite iniciado: %s (Título: %s)", tramite.id, titulo.numero_expediente)
    return tramite


@transaction.atomic
def derivar_tramite(
    tramite: Tramite,
    nuevo_estado: str,
    nueva_unidad_id: str,
    *,
    observaciones: str = "",
) -> Tramite:
    """
    Cambia el estado del trámite y lo mueve a la siguiente unidad organizacional.
    Ej: de Ventanilla a Archivo Central.
    """
    tramite.estado = nuevo_estado
    tramite.unidad_actual_id = nueva_unidad_id
    if observaciones:
        tramite.observaciones = observaciones
    tramite.save(update_fields=["estado", "unidad_actual_id", "observaciones", "updated_at"])

    logger.info(
        "Trámite %s derivado a estado '%s' en unidad '%s'.",
        tramite.id, nuevo_estado, nueva_unidad_id,
    )
    return tramite


@transaction.atomic
def marcar_tramite_verificado_ocr(document_id: str) -> None:
    """
    Llamado por el listener de ocr_completed.
    Busca los trámites cuyo título esté vinculado al documento y
    actualiza su estado a VERIFICADO_OCR.
    """
    tramites = Tramite.objects.filter(
        titulo__document_id=document_id,
    ).exclude(
        estado__in=[EstadoTramite.ENTREGADO, EstadoTramite.RECHAZADO],
    )

    updated = tramites.update(estado=EstadoTramite.VERIFICADO_OCR)
    logger.info("Se actualizaron %d trámite(s) a VERIFICADO_OCR para document_id=%s.", updated, document_id)


@transaction.atomic
def aprobar_certificacion(
    certificacion: Certificacion,
    emitida_por,
) -> Certificacion:
    """
    Validaciones y emisión de una certificación.
    """
    if certificacion.estado != EstadoCertificacion.PENDIENTE:
        raise ValueError(
            f"La certificación {certificacion.codigo_certificacion} "
            f"no está en estado PENDIENTE (actual: {certificacion.estado})."
        )

    certificacion.estado = EstadoCertificacion.APROBADA
    certificacion.emitida_por = emitida_por
    certificacion.fecha_emision = timezone.now()
    certificacion.save(update_fields=["estado", "emitida_por", "fecha_emision", "updated_at"])

    logger.info("Certificación %s aprobada por %s.", certificacion.codigo_certificacion, emitida_por)
    return certificacion
