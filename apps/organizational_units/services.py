"""
services.py – Construcción de rutas jerárquicas dinámicas para MinIO.
"""
from __future__ import annotations

from .models import Department, LogicalRepository


def generate_tenant_prefix(department: Department, filename: str) -> str:
    """
    Construye la ruta completa (object key) donde se almacenará el archivo
    dentro de MinIO, partiendo de la jerarquía del departamento.

    Ejemplo de resultado:
        "unellez/vicerrectorado-academico/archivo-central/2026/08/acta_01.pdf"
    """
    parts: list[str] = []

    # Recorrer la jerarquía hacia arriba
    current: Department | None = department
    while current is not None:
        parts.append(current.code)
        current = current.parent

    # Agregar la institución al inicio
    parts.append(department.institution.code)
    parts.reverse()

    # Agregar el nombre del archivo al final
    parts.append(filename)

    return "/".join(parts)


def get_repository_for_department(department: Department) -> LogicalRepository:
    """
    Retorna el repositorio lógico asignado al departamento.
    Lanza DoesNotExist si no tiene uno configurado.
    """
    return department.repository  # OneToOneField reverse access
