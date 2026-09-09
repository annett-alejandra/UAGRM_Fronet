import sys

schema_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\schema.py"
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

if "import apps.libros_matrices.schema" not in content:
    content = content.replace("import apps.ocr_core.schema", "import apps.ocr_core.schema\nimport apps.libros_matrices.schema")
    content = content.replace("class Query(apps.ocr_core.schema.Query", "class Query(apps.libros_matrices.schema.Query, apps.ocr_core.schema.Query")
    content = content.replace("class Mutation(apps.ocr_core.schema.Mutation", "class Mutation(apps.libros_matrices.schema.Mutation, apps.ocr_core.schema.Mutation")
    
    with open(schema_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("config/schema.py actualizado con libros_matrices")
