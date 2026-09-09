
import logging

logger = logging.getLogger(__name__)

class InformixCajaConnector:
    @staticmethod
    def validar_recibo(nro_recibo: str) -> dict:
        """
        MOCK: Simula la conexion a la base de datos Informix de Caja.
        En produccion, aqui se usaria ibm_db o jaydebeapi para conectar.
        """
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
        """
        MOCK: Simula la conexion a la base de datos legacy ANZIO (Post-2023).
        """
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
