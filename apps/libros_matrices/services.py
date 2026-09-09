"""
services.py - Logica de negocio para libros_matrices.
"""
import logging
from django.db import transaction
from apps.libros_matrices.models import PaginaLibroEscaneada, FilaRegistroHistorico, EstadoPagina

logger = logging.getLogger(__name__)

def registrar_ocr_tabular(pagina_id: str, ocr_filas_guesses: list) -> PaginaLibroEscaneada:
    """
    Fase 1: El OCR tabular guarda las sugerencias en formato JSON.
    """
    pagina = PaginaLibroEscaneada.objects.get(pk=pagina_id)
    pagina.ocr_filas_guesses = ocr_filas_guesses
    pagina.estado = EstadoPagina.PENDIENTE_CONTROL_CALIDAD
    pagina.save(update_fields=['ocr_filas_guesses', 'estado'])
    logger.info("OCR Tabular registrado para pagina %s", pagina_id)
    return pagina

@transaction.atomic
def validar_y_consolidar_pagina(pagina_id: str, filas_corregidas: list, usuario_auditor_id=None) -> PaginaLibroEscaneada:
    """
    Fase 3: Operador humano confirma las filas. Se insertan en FilaRegistroHistorico.
    """
    pagina = PaginaLibroEscaneada.objects.select_for_update().get(pk=pagina_id)

    if pagina.estado != EstadoPagina.PENDIENTE_CONTROL_CALIDAD:
        raise ValueError(f"La pagina {pagina_id} no esta en estado PENDIENTE_CONTROL_CALIDAD")

    # Eliminar posibles filas previas (en caso de re-consolidacion)
    FilaRegistroHistorico.objects.filter(pagina=pagina).delete()

    nuevas_filas = []
    for fila in filas_corregidas:
        nuevas_filas.append(FilaRegistroHistorico(
            pagina=pagina,
            numero_fila=fila.get("numero_fila"),
            nombre_estudiante=fila.get("nombre_estudiante", ""),
            numero_titulo=fila.get("numero_titulo", ""),
            firma_detectada=fila.get("firma_detectada", False)
        ))
    
    FilaRegistroHistorico.objects.bulk_create(nuevas_filas)

    # Actualizar estado
    pagina.estado = EstadoPagina.APROBADO_VOBO
    pagina.id_usuario_auditor_id = usuario_auditor_id
    pagina.save(update_fields=["estado", "id_usuario_auditor"])

    logger.info("Pagina %s consolidada con %s filas", pagina_id, len(nuevas_filas))
    return pagina
