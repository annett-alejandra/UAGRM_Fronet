import sys

connectors_content = """
import logging

logger = logging.getLogger(__name__)

class InformixCajaConnector:
    @staticmethod
    def validar_recibo(nro_recibo: str) -> dict:
        \"\"\"
        MOCK: Simula la conexion a la base de datos Informix de Caja.
        En produccion, aqui se usaria ibm_db o jaydebeapi para conectar.
        \"\"\"
        logger.info(f"Consultando Informix para el recibo: {nro_recibo}")
        
        # Simulacion de logica de negocio
        if nro_recibo.startswith("INV"):
            return {"valido": False, "motivo": "Recibo inexistente o no pagado."}
        if nro_recibo.startswith("USD"):
            return {"valido": False, "motivo": "Recibo ya utilizado en otro tramite."}
            
        return {
            "valido": True,
            "monto": 30.00,
            "concepto": "Memoriales Varios",
            "motivo": None
        }

class AnzioLegacyConnector:
    @staticmethod
    def buscar_por_ci(ci: str) -> list:
        \"\"\"
        MOCK: Simula la conexion a la base de datos legacy ANZIO (Post-2023).
        \"\"\"
        logger.info(f"Consultando ANZIO para el C.I.: {ci}")
        
        if ci == "1234567":
            return [{
                "origen": "ANZIO",
                "estado_tramite": "EMITIDO",
                "numero_titulo": "2023-A-001",
                "fecha_emision": "2023-05-10",
                "nombre_graduado": "Juan Perez Post-2023"
            }]
        return []
"""

orchestrator_content = """
import logging
from .connectors import AnzioLegacyConnector
from apps.ocr_core.models import ExpedienteEstudiante

logger = logging.getLogger(__name__)

def buscar_historial_academico_unificado(ci: str) -> list:
    \"\"\"
    Buscador Hibrido: Consulta ANZIO y PostgreSQL simultaneamente
    y unifica los resultados para el Frontend.
    \"\"\"
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
"""

with open(r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\titulos_tramites\connectors.py", "w", encoding="utf-8") as f:
    f.write(connectors_content)

with open(r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\titulos_tramites\orchestrator.py", "w", encoding="utf-8") as f:
    f.write(orchestrator_content)

print("Conectores y Orquestador creados correctamente.")
