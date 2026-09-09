"""
urls.py – Enrutamiento del módulo titulos_tramites.
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "titulos_tramites"

router = DefaultRouter()
router.register(r"titulos", views.TituloViewSet, basename="titulo")
router.register(r"tramites", views.TramiteViewSet, basename="tramite")
router.register(r"certificaciones", views.CertificacionViewSet, basename="certificacion")

urlpatterns = [
    path("", include(router.urls)),
]
