"""
services.py – Interacción con OpenSearch.

Funciones para indexar documentos, buscar texto completo
y resaltar coincidencias (highlighting).
"""
import logging

from django.conf import settings
from opensearchpy import OpenSearch

from .documents import INDEX_MAPPING, INDEX_NAME

logger = logging.getLogger(__name__)


def get_opensearch_client() -> OpenSearch:
    """Retorna un cliente OpenSearch configurado."""
    return OpenSearch(
        hosts=[{"host": settings.OPENSEARCH_HOST, "port": settings.OPENSEARCH_PORT}],
        use_ssl=False,
        verify_certs=False,
    )


def ensure_index_exists() -> None:
    """Crea el índice si no existe."""
    client = get_opensearch_client()
    if not client.indices.exists(index=INDEX_NAME):
        client.indices.create(index=INDEX_NAME, body=INDEX_MAPPING)
        logger.info("Índice '%s' creado en OpenSearch.", INDEX_NAME)


def index_document_text(document_id: str, extracted_text: str) -> None:
    """
    Indexa el texto extraído de un documento en OpenSearch.

    Esta función es invocada por el listener de ocr_completed.
    """
    from apps.documents.models import Document

    client = get_opensearch_client()

    try:
        document = Document.objects.select_related("department__institution").get(pk=document_id)
    except Document.DoesNotExist:
        logger.error("Documento %s no encontrado para indexar.", document_id)
        return

    body = {
        "document_id": str(document.id),
        "title": document.title,
        "extracted_text": extracted_text,
        "department_code": document.department.code,
        "institution_code": document.department.institution.code,
        "status": document.status,
        "created_at": document.created_at.isoformat(),
        "updated_at": document.updated_at.isoformat(),
    }

    client.index(index=INDEX_NAME, id=str(document.id), body=body)
    logger.info("Documento '%s' indexado exitosamente.", document.title)


def full_text_search(
    query: str,
    *,
    department_code: str | None = None,
    page: int = 1,
    page_size: int = 25,
) -> dict:
    """
    Realiza una búsqueda de texto completo con highlighting.

    Args:
        query: Texto a buscar.
        department_code: Filtro opcional por departamento.
        page: Página actual (1-indexed).
        page_size: Resultados por página.

    Returns:
        dict con hits, total y fragmentos resaltados.
    """
    client = get_opensearch_client()

    must_clauses = [
        {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "extracted_text"],
                "type": "best_fields",
                "fuzziness": "AUTO",
            }
        }
    ]

    filter_clauses = []
    if department_code:
        filter_clauses.append({"term": {"department_code": department_code}})

    body = {
        "query": {
            "bool": {
                "must": must_clauses,
                "filter": filter_clauses,
            }
        },
        "highlight": {
            "fields": {
                "extracted_text": {
                    "fragment_size": 200,
                    "number_of_fragments": 3,
                    "pre_tags": ["<mark>"],
                    "post_tags": ["</mark>"],
                },
                "title": {
                    "pre_tags": ["<mark>"],
                    "post_tags": ["</mark>"],
                },
            }
        },
        "from": (page - 1) * page_size,
        "size": page_size,
    }

    response = client.search(index=INDEX_NAME, body=body)

    hits = []
    for hit in response["hits"]["hits"]:
        hits.append({
            "document_id": hit["_source"]["document_id"],
            "title": hit["_source"]["title"],
            "score": hit["_score"],
            "highlights": hit.get("highlight", {}),
        })

    return {
        "total": response["hits"]["total"]["value"],
        "page": page,
        "page_size": page_size,
        "results": hits,
    }
