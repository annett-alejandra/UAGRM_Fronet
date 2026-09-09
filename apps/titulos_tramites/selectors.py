"""
selectors.py – Consultas de solo lectura.

Funciones para obtener datos filtrados sin modificar estado.
Separadas de services.py para mantener el patrón Query/Command.
"""
from django.db.models import QuerySet

from .models import EstadoTramite, TipoTitulo, Titulo, Tramite


def obtener_titulos_por_tipo(tipo: str) -> QuerySet[Titulo]:
    """
    Filtra rápidamente los títulos por uno de los 5 tipos.

    Args:
        tipo: Valor de TipoTitulo (ej. "BIENHECHURIA", "SUPLETORIO").
    """
    return Titulo.objects.filter(tipo_titulo=tipo)


def listar_tramites_pendientes(unidad_id: str | None = None) -> QuerySet[Tramite]:
    """
    Lista los trámites que aún están en proceso (no entregados ni rechazados).
    Opcionalmente filtra por unidad organizacional para la bandeja de entrada.
    """
    qs = Tramite.objects.exclude(
        estado__in=[EstadoTramite.ENTREGADO, EstadoTramite.RECHAZADO],
    ).select_related("titulo", "asignado_a")

    if unidad_id:
        qs = qs.filter(unidad_actual_id=unidad_id)

    return qs.order_by("-created_at")


def obtener_tramites_por_estado(estado: str) -> QuerySet[Tramite]:
    """Retorna trámites filtrados por un estado específico."""
    return Tramite.objects.filter(estado=estado).select_related("titulo")


def buscar_titulo_por_expediente(numero_expediente: str) -> Titulo | None:
    """Busca un título por número de expediente."""
    try:
        return Titulo.objects.get(
            numero_expediente=numero_expediente,
        )
    except Titulo.DoesNotExist:
        return None


def buscar_titulo_por_cedula(cedula: str) -> QuerySet[Titulo]:
    """Busca títulos por cédula del solicitante."""
    return Titulo.objects.filter(
        solicitante_cedula=cedula,
    )
