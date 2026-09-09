import sys

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, 'r', encoding='utf-8') as f:
    settings_content = f.read()

if "apps.pdf_generator" not in settings_content:
    settings_content = settings_content.replace(
        '"apps.libros_matrices.apps.LibrosMatricesConfig",',
        '"apps.libros_matrices.apps.LibrosMatricesConfig",\n    "apps.pdf_generator.apps.PdfGeneratorConfig",'
    )
    
    # Ensure templates directory is configured
    if "'DIRS': [os.path.join(BASE_DIR, 'templates')]" not in settings_content:
        settings_content = settings_content.replace(
            "'DIRS': [],",
            "'DIRS': [os.path.join(BASE_DIR, 'templates')],"
        )

    with open(settings_path, 'w', encoding='utf-8') as f:
        f.write(settings_content)
    print("settings.py actualizado con apps.pdf_generator y templates DIRS")
