import sys

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, 'r', encoding='utf-8') as f:
    settings_content = f.read()

if "apps.libros_matrices" not in settings_content:
    settings_content = settings_content.replace(
        '"apps.ocr_core.apps.OcrCoreConfig",',
        '"apps.ocr_core.apps.OcrCoreConfig",\n    "apps.libros_matrices.apps.LibrosMatricesConfig",'
    )
    with open(settings_path, 'w', encoding='utf-8') as f:
        f.write(settings_content)
    print("settings.py actualizado con apps.libros_matrices")
else:
    print("apps.libros_matrices ya esta en settings.py")
