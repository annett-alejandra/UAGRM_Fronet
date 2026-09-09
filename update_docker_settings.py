import sys
import re

settings_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\config\settings.py"
with open(settings_path, "r", encoding="utf-8") as f:
    content = f.read()

# Añadir dj_database_url
if "import dj_database_url" not in content:
    content = content.replace("import os", "import os\nimport dj_database_url")

# Cambiar ALLOWED_HOSTS
if "ALLOWED_HOSTS = []" in content:
    content = content.replace("ALLOWED_HOSTS = []", "ALLOWED_HOSTS = ['*']")

# Cambiar Base de datos a PostgreSQL / dj_database_url
old_db = """DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}"""

new_db = """# PostgreSQL via Docker
DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/titulo_supletorio"),
        conn_max_age=600
    )
}"""

if old_db in content:
    content = content.replace(old_db, new_db)

# Cambiar endpoints locales a nombres de docker (rabbitmq, minio)
# Si estan localhost, los cambiamos a los defaults para Docker
content = content.replace(
    'os.environ.get("CELERY_BROKER_URL", "amqp://guest:guest@localhost:5672//")',
    'os.environ.get("CELERY_BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")'
)

content = content.replace(
    'os.environ.get("MINIO_ENDPOINT", "http://localhost:9000")',
    'os.environ.get("MINIO_ENDPOINT", "http://minio:9000")'
)

content = content.replace(
    'os.environ.get("OPENSEARCH_HOST", "localhost")',
    'os.environ.get("OPENSEARCH_HOST", "opensearch")'
)

with open(settings_path, "w", encoding="utf-8") as f:
    f.write(content)
print("settings.py configurado para PostgreSQL y Docker.")
