import sys
import yaml

compose_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\docker-compose.yml"
with open(compose_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix MinIO init buckets
content = content.replace(
    "/usr/bin/mc mb -l myminio/titulo-supletorio;",
    "/usr/bin/mc mb -l myminio/uagrm-expedientes;\n      /usr/bin/mc mb -l myminio/uagrm-libros-matrices;"
)
content = content.replace(
    "/usr/bin/mc version enable myminio/titulo-supletorio;",
    "/usr/bin/mc version enable myminio/uagrm-expedientes;\n      /usr/bin/mc version enable myminio/uagrm-libros-matrices;"
)

# Add backend and celery to docker-compose
backend_services = """
  # ==============================================================================
  # API Backend (Django / GraphQL)
  # ==============================================================================
  backend:
    build: .
    container_name: titulo_supletorio_backend
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/titulo_supletorio
      - CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//
      - MINIO_ENDPOINT=http://minio:9000
    depends_on:
      postgres:
        condition: service_healthy
      minio:
        condition: service_healthy
    command: >
      sh -c "python manage.py migrate && 
             gunicorn config.wsgi:application --bind 0.0.0.0:8000 --reload"

  # ==============================================================================
  # Celery Worker (OCR y Tareas en Segundo Plano)
  # ==============================================================================
  celery_worker:
    build: .
    container_name: titulo_supletorio_celery
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/titulo_supletorio
      - CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//
      - MINIO_ENDPOINT=http://minio:9000
    depends_on:
      - rabbitmq
      - backend
    command: celery -A config worker --loglevel=info
"""

if "backend:" not in content:
    content += backend_services

with open(compose_path, "w", encoding="utf-8") as f:
    f.write(content)

print("docker-compose.yml configurado con backend y celery.")
