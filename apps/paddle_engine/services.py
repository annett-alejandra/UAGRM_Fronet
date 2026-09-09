import logging
import os
import subprocess

logger = logging.getLogger(__name__)
PADDLE_REPO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "repo")

def iniciar_motor_paddle_externo():
    if not os.path.exists(PADDLE_REPO_PATH):
        logger.error(f"El repositorio de PaddleOCR no se encontró en {PADDLE_REPO_PATH}")
        return False
    logger.info("El repositorio de PaddleOCR fue detectado correctamente.")
    return True
