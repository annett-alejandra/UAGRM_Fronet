
import logging
from .connectors import AnzioLegacyConnector
from apps.ocr_core.models import ExpedienteEstudiante

logger = logging.getLogger(__name__)

def buscar_historial_academico_unificado(ci: str) -> list:
    """
    Buscador Hibrido: Consulta ANZIO y PostgreSQL simultaneamente
    y unifica los resultados para el Frontend.
    """
    resultados = []
    
    # 1. Consultar Legacy (ANZIO)
    resultados_anzio = AnzioLegacyConnector.buscar_por_ci(ci)
    resultados.extend(resultados_anzio)
    
    # 2. Consultar Local PostgreSQL (Archivo Central / OCR)
    try:
        expediente = ExpedienteEstudiante.objects.get(ci_estudiante=ci)
        for doc in expediente.documentos.all():
            if hasattr(doc, 'titulo_metadata'):
                resultados.append({
                    "origen": "POSTGRES",
                    "estado_tramite": doc.estado,
                    "numero_titulo": doc.titulo_metadata.numero_titulo,
                    "fecha_emision": doc.fecha_subida.strftime("%Y-%m-%d"),
                    "nombre_graduado": doc.titulo_metadata.nombre_graduado
                })
    except ExpedienteEstudiante.DoesNotExist:
        pass
        
    logger.info(f"Orquestador encontro {len(resultados)} registros unificados para C.I. {ci}")
    return resultados
