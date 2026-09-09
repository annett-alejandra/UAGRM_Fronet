FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Instalar dependencias de sistema minimas para Linux
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0     && apt-get clean     && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 2. Instalar PaddlePaddle forzando el binario de Linux CPU puro
RUN python -m pip install paddlepaddle==2.6.1 -f https://www.paddlepaddle.org.cn/whl/linux/cpu/mkl/avx/stable.html --no-cache-dir

# 3. Instalar PaddleOCR
RUN pip install "paddleocr>=2.0.1" --no-cache-dir

COPY . /app/

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
