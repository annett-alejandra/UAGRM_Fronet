"""
views.py – Endpoints para unidades organizacionales.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Department, Institution, StorageQuota
from .serializers import DepartmentSerializer, InstitutionSerializer, StorageQuotaSerializer


class InstitutionViewSet(viewsets.ModelViewSet):
    """CRUD de instituciones."""
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticated]


class DepartmentViewSet(viewsets.ModelViewSet):
    """CRUD de departamentos con filtro por institución."""
    queryset = Department.objects.select_related("institution", "parent").all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        institution_id = self.request.query_params.get("institution")
        if institution_id:
            qs = qs.filter(institution_id=institution_id)
        return qs


class StorageQuotaViewSet(viewsets.ReadOnlyModelViewSet):
    """Consulta de cuotas de almacenamiento (solo lectura)."""
    queryset = StorageQuota.objects.select_related("department").all()
    serializer_class = StorageQuotaSerializer
    permission_classes = [IsAuthenticated]
