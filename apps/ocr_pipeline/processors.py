"""
processors.py – Lógica de procesamiento de imágenes y PDFs.

Integración con Tesseract OCR y pdf2image para la conversión
de páginas de PDF a imágenes procesables.
"""
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def pdf_to_images(pdf_path: Path) -> list:
    """
    Convierte un archivo PDF en una lista de imágenes PIL (una por página).
    Requiere poppler instalado en el sistema.
    """
    from pdf2image import convert_from_path

    logger.info("Convirtiendo PDF a imágenes: %s", pdf_path)
    images = convert_from_path(str(pdf_path), dpi=300)
    logger.info("Se generaron %d imágenes.", len(images))
    return images


def ocr_image(image) -> str:
    """
    Ejecuta Tesseract OCR sobre una imagen PIL y retorna el texto extraído.
    Configurado para español (spa).
    """
    import pytesseract

    text = pytesseract.image_to_string(image, lang="spa")
    return text.strip()


def extract_text_from_pdf(pdf_path: Path) -> str:
    """
    Pipeline completo: PDF → imágenes → OCR por página → texto concatenado.
    """
    images = pdf_to_images(pdf_path)
    pages_text = []

    for i, image in enumerate(images, start=1):
        logger.info("Procesando página %d/%d...", i, len(images))
        page_text = ocr_image(image)
        pages_text.append(page_text)

    full_text = "\n\n--- Página ---\n\n".join(pages_text)
    logger.info("Extracción completa: %d caracteres totales.", len(full_text))
    return full_text
