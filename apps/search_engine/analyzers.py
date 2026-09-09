"""
analyzers.py – Configuración de analizadores de texto en español.

Define los analizadores personalizados para OpenSearch, incluyendo
stemming, filtrado de stopwords y normalización de acentos.
"""

# Analizador personalizado para español
SPANISH_ANALYZER = {
    "type": "custom",
    "tokenizer": "standard",
    "filter": [
        "lowercase",
        "spanish_stop",
        "spanish_stemmer",
        "asciifolding",  # Normalizar acentos: á → a
    ],
}

# Filtros personalizados
SPANISH_FILTERS = {
    "spanish_stop": {
        "type": "stop",
        "stopwords": "_spanish_",
    },
    "spanish_stemmer": {
        "type": "stemmer",
        "language": "spanish",
    },
}

# Configuración completa de análisis para crear/actualizar el índice
INDEX_ANALYSIS_SETTINGS = {
    "analysis": {
        "analyzer": {
            "spanish_full_text": SPANISH_ANALYZER,
        },
        "filter": SPANISH_FILTERS,
    },
}
