"""
URL configuration raíz del proyecto.

Cada módulo registra su propio namespace bajo /api/<módulo>/.
"""
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

urlpatterns = [
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path("admin/", admin.site.urls),

    # ── Módulos de la API ────────────────────────
    path("api/storage/", include("apps.minio_storage.urls", namespace="minio_storage")),
    path("api/org-units/", include("apps.organizational_units.urls", namespace="organizational_units")),
    path("api/documents/", include("apps.documents.urls", namespace="documents")),
    path("api/ocr/", include("apps.ocr_pipeline.urls", namespace="ocr_pipeline")),
    path("api/search/", include("apps.search_engine.urls", namespace="search_engine")),
    path("api/tramites/", include("apps.titulos_tramites.urls", namespace="titulos_tramites")),
]
