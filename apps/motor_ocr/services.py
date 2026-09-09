import logging
import re

logger = logging.getLogger(__name__)

# Intentar inicializar PaddleOCR de forma global para que el modelo se cargue 
# en memoria RAM una sola vez cuando arranca Celery
try:
    from paddleocr import PaddleOCR
    logger.info("Inicializando motor PaddleOCR en memoria...")
    # use_angle_cls=True detecta si la imagen esta rotada
    ocr_engine = PaddleOCR(use_angle_cls=True, lang='es', show_log=False)
except ImportError:
    ocr_engine = None
    logger.warning("PaddleOCR no esta instalado. El motor no se cargo.")

def procesar_imagen_ocr(ruta_imagen_local):
    """
    Recibe una imagen local (descargada previamente de MinIO) 
    y retorna el texto bruto y variables estructuradas.
    """
    if not ocr_engine:
        logger.error("Se intento procesar OCR pero el motor no esta disponible.")
        return {"texto_bruto": "ERROR_MOTOR_NO_DISPONIBLE", "datos_estructurados": {}}
        
    logger.info(f"Ejecutando inferencia OCR sobre: {ruta_imagen_local}")
    
    # Inferencia
    resultados = ocr_engine.ocr(ruta_imagen_local, cls=True)
    
    texto_completo = ""
    #resultados[0] contiene las lineas detectadas
    if resultados and resultados[0]:
        for linea in resultados[0]:
            # linea = [[[x1,y1],[x2,y2],[x3,y3],[x4,y4]], ('Texto', score)]
            texto_detectado = linea[1][0]
            texto_completo += texto_detectado + " "
            
    # Extraccion estructurada (Ejemplo: Carnet de Identidad)
    datos_extraidos = {}
    busqueda_ci = re.search(r'C\.?I\.?\s*[:\-]?\s*(\d+)', texto_completo, re.IGNORECASE)
    if busqueda_ci:
        datos_extraidos['ci_estudiante'] = busqueda_ci.group(1)
        
    return {
        "texto_bruto": texto_completo.strip(),
        "datos_estructurados": datos_extraidos
    }
