"""
signals.py – Definición del evento de dominio ocr_completed.

Este Signal es el mecanismo de comunicación desacoplada entre
el módulo ocr_pipeline y los módulos que reaccionan al resultado:
    - titulos_tramites (actualiza estado del trámite)
    - search_engine (indexa el texto extraído)
"""
import django.dispatch

# Evento emitido cuando el OCR de un documento finaliza exitosamente.
# Kwargs esperados:
#   document_id: str (UUID del documento)
#   extracted_text: str (texto extraído)
ocr_completed = django.dispatch.Signal()
