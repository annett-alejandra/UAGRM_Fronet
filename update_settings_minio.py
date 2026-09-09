import sys

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'MINIO_BUCKET_NAME = os.environ.get("MINIO_BUCKET_NAME", "titulo-supletorio")',
    'MINIO_BUCKET_EXPEDIENTES = os.environ.get("MINIO_BUCKET_EXPEDIENTES", "uagrm-expedientes")\nMINIO_BUCKET_LIBROS = os.environ.get("MINIO_BUCKET_LIBROS", "uagrm-libros-matrices")'
)

with open(settings_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("settings.py MinIO buckets updated")
