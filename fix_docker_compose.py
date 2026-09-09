import sys

compose_path = r"C:\Users\MSI\OneDrive\Titulo_Supletorio\docker-compose.yml"
with open(compose_path, "r", encoding="utf-8") as f:
    content = f.read()

# Split before 'volumes:'
parts = content.split("volumes:\n  postgres_data:")

services_part = parts[0]
volumes_part = "volumes:\n  postgres_data:" + parts[1]

# Extraer el bloque backend y celery_worker del final
backend_block_start = "  # ==============================================================================\n  # API Backend (Django / GraphQL)"
if backend_block_start in volumes_part:
    v_parts = volumes_part.split(backend_block_start)
    clean_volumes = v_parts[0]
    extracted_services = backend_block_start + v_parts[1]
    
    # Reensamblar: services_part + extracted_services + clean_volumes
    new_content = services_part + extracted_services + "\n" + clean_volumes
    
    with open(compose_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("docker-compose.yml corregido.")
else:
    print("No se encontro el bloque backend en volumes.")
