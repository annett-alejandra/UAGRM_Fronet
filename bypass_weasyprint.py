import sys

# 1. Modificar Dockerfile
dockerfile_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\Dockerfile"
with open(dockerfile_path, "r", encoding="utf-8") as f:
    df_content = f.read()

df_content = df_content.replace(
    """RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libcairo2 \
    libffi-dev \
    libgdk-pixbuf2.0-0 \
    && rm -rf /var/lib/apt/lists/*""",
    "# WeasyPrint dependencias quitadas temporalmente por bloqueo de red"
)
with open(dockerfile_path, "w", encoding="utf-8") as f:
    f.write(df_content)

# 2. Modificar requirements.txt
req_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\requirements.txt"
with open(req_path, "r", encoding="utf-8") as f:
    req_content = f.read()
req_content = req_content.replace("weasyprint>=61.0", "# weasyprint>=61.0 (Comentado temporalmente)")
with open(req_path, "w", encoding="utf-8") as f:
    f.write(req_content)

# 3. Modificar pdf_generator/services.py para devolver un mock URL
services_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\apps\pdf_generator\services.py"
with open(services_path, "r", encoding="utf-8") as f:
    srv_content = f.read()

old_func = """    try:
        from weasyprint import HTML
    except ImportError:
        logger.error("WeasyPrint no esta instalado o faltan dependencias del sistema.")
        raise

    html_string = render_to_string("informe_veracidad.html", datos)
    html = HTML(string=html_string)
    
    pdf_bytes = BytesIO()
    html.write_pdf(pdf_bytes)
    pdf_bytes.seek(0)
    
    # Subir a MinIO
    s3 = get_s3_client()
    bucket_name = settings.MINIO_BUCKET_EXPEDIENTES
    # Utilizamos el id del documento o gestion para evitar sobreescribir si hay multiples informes
    # Para el MVP lo dejamos simple
    object_key = f"informes_veracidad/{ci_estudiante}_{datos.get('numero_titulo', 'informe')}.pdf"
    
    logger.info("Subiendo PDF a MinIO: %s/%s", bucket_name, object_key)
    s3.upload_fileobj(
        pdf_bytes,
        bucket_name,
        object_key,
        ExtraArgs={'ContentType': 'application/pdf'}
    )
    
    # Generar URL presignada (valida por 5 minutos)
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': object_key},
        ExpiresIn=300
    )
    
    return url"""

new_func = """    logger.warning("Generacion de PDF mockeada temporalmente por bloqueo de red en Docker.")
    return f"http://localhost:9000/uagrm-expedientes/informes_veracidad/{ci_estudiante}_mock.pdf"
"""

if old_func in srv_content:
    srv_content = srv_content.replace(old_func, new_func)
    with open(services_path, "w", encoding="utf-8") as f:
        f.write(srv_content)

print("Modificaciones para MODO SUPERVIVENCIA (Sin WeasyPrint) completadas.")
