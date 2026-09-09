import sys

views_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_pipeline\views.py"
with open(views_path, 'r', encoding='utf-8') as f:
    views_content = f.read()

# Reemplazamos la lógica del webhook para pasar el bucket_name a la tarea de celery
if "process_document_ocr.delay(str(document.id), bucket_name)" not in views_content:
    views_content = views_content.replace(
        'process_document_ocr.delay(str(document.id))',
        'process_document_ocr.delay(str(document.id), bucket_name)'
    )
    with open(views_path, 'w', encoding='utf-8') as f:
        f.write(views_content)
    print("views.py actualizado")

tasks_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\ocr_pipeline\tasks.py"
with open(tasks_path, 'r', encoding='utf-8') as f:
    tasks_content = f.read()

if "def process_document_ocr(self, document_id: str, bucket_name: str = None)" not in tasks_content:
    tasks_content = tasks_content.replace(
        'def process_document_ocr(self, document_id: str) -> dict:',
        'def process_document_ocr(self, document_id: str, bucket_name: str = None) -> dict:'
    )
    
    # Reemplazamos MINIO_BUCKET_NAME
    tasks_content = tasks_content.replace(
        'Bucket=settings.MINIO_BUCKET_NAME,',
        'Bucket=bucket_name or settings.MINIO_BUCKET_EXPEDIENTES,'
    )
    
    # Inyectar bifurcacion
    bifurcacion = """
        if bucket_name == settings.MINIO_BUCKET_LIBROS:
            # FLUJO TABULAR
            from apps.libros_matrices.models import PaginaLibroEscaneada
            from apps.libros_matrices.services import registrar_ocr_tabular
            
            try:
                pagina = PaginaLibroEscaneada.objects.get(pk=document_id)
            except PaginaLibroEscaneada.DoesNotExist:
                return {"error": "PaginaLibroEscaneada no encontrada"}
                
            logger.info("Iniciando OCR Tabular para pagina %s", pagina.numero_pagina)
            # En un entorno real se usaria PaddleOCR/LayoutLM
            # Por ahora simulamos los guesses extraidos
            filas_guesses = [
                {"numero_fila": 1, "nombre_estudiante": "EJEMPLO OCR TABULAR 1", "numero_titulo": "001-TEST", "firma_detectada": True}
            ]
            registrar_ocr_tabular(str(pagina.id), filas_guesses)
            
            # Emitimos signal opcional
            return {"document_id": str(pagina.id), "status": "PENDIENTE_CONTROL_CALIDAD"}
"""
    
    if "FLUJO TABULAR" not in tasks_content:
        tasks_content = tasks_content.replace(
            'try:\n        document = Document.objects.get(pk=document_id)',
            f'try:{bifurcacion}\n        document = Document.objects.get(pk=document_id)'
        )
        with open(tasks_path, 'w', encoding='utf-8') as f:
            f.write(tasks_content)
        print("tasks.py actualizado")
