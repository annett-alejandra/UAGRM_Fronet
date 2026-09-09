"""
urls.py – Enrutamiento del módulo organizational_units.
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "organizational_units"

router = DefaultRouter()
router.register(r"institutions", views.InstitutionViewSet, basename="institution")
router.register(r"departments", views.DepartmentViewSet, basename="department")
router.register(r"quotas", views.StorageQuotaViewSet, basename="quota")

urlpatterns = [
    path("", include(router.urls)),
]
