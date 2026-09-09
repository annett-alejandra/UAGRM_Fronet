import sys

# 1. Update Dockerfile
dockerfile_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\Dockerfile"
with open(dockerfile_path, "r", encoding="utf-8") as f:
    df_content = f.read()

new_df = """FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Instalar dependencias de sistema minimas para Linux
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 2. Instalar PaddlePaddle forzando el binario de Linux CPU puro
RUN python -m pip install paddlepaddle==2.6.1 -f https://www.paddlepaddle.org.cn/whl/linux/cpu/mkl/avx/stable.html --no-cache-dir

# 3. Instalar PaddleOCR
RUN pip install "paddleocr>=2.0.1" --no-cache-dir

COPY . /app/

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
"""

with open(dockerfile_path, "w", encoding="utf-8") as f:
    f.write(new_df)

# 2. Update docker-compose.yml to add volume paddle_models
compose_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\docker-compose.yml"
with open(compose_path, "r", encoding="utf-8") as f:
    dc_content = f.read()

if "paddle_models:" not in dc_content:
    # Add paddle_models: to the volumes section
    dc_content = dc_content.replace("volumes:\n  postgres_data:", "volumes:\n  postgres_data:\n  paddle_models:")
    
    # Mount volume in celery_worker
    celery_volumes_marker = "container_name: titulo_supletorio_celery\n    volumes:\n      - .:/app"
    celery_volumes_new = "container_name: titulo_supletorio_celery\n    volumes:\n      - .:/app\n      - paddle_models:/root/.paddleocr"
    dc_content = dc_content.replace(celery_volumes_marker, celery_volumes_new)

    # Mount volume in backend
    backend_volumes_marker = "container_name: titulo_supletorio_backend\n    ports:\n      - \"8000:8000\"\n    volumes:\n      - .:/app"
    backend_volumes_new = "container_name: titulo_supletorio_backend\n    ports:\n      - \"8000:8000\"\n    volumes:\n      - .:/app\n      - paddle_models:/root/.paddleocr"
    dc_content = dc_content.replace(backend_volumes_marker, backend_volumes_new)

    with open(compose_path, "w", encoding="utf-8") as f:
        f.write(dc_content)

print("Dockerfile y docker-compose.yml actualizados con configuracion de PaddleOCR.")
