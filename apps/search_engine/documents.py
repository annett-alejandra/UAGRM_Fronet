"""
documents.py – Definición de índices para OpenSearch.

Contiene el mapping del índice invertido para documentos.
"""
from .analyzers import INDEX_ANALYSIS_SETTINGS

# Nombre del índice (también configurado en settings.OPENSEARCH_INDEX)
INDEX_NAME = "documentos"

# Mapping del índice
INDEX_MAPPING = {
    "settings": {
        **INDEX_ANALYSIS_SETTINGS,
        "number_of_shards": 1,
        "number_of_replicas": 1,
    },
    "mappings": {
        "properties": {
            "document_id": {
                "type": "keyword",
            },
            "title": {
                "type": "text",
                "analyzer": "spanish_full_text",
                "fields": {
                    "keyword": {"type": "keyword"},
                },
            },
            "extracted_text": {
                "type": "text",
                "analyzer": "spanish_full_text",
            },
            "department_code": {
                "type": "keyword",
            },
            "institution_code": {
                "type": "keyword",
            },
            "document_type": {
                "type": "keyword",
            },
            "status": {
                "type": "keyword",
            },
            "created_at": {
                "type": "date",
            },
            "updated_at": {
                "type": "date",
            },
        },
    },
}
