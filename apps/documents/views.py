"""
views.py – Operaciones CRUD para los metadatos de los documentos.
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Document
from .serializers import DocumentCreateSerializer, DocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    """CRUD de metadatos de documentos."""
    queryset = Document.objects.select_related("uploaded_by").all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return DocumentCreateSerializer
        return DocumentSerializer

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        department_id = self.request.query_params.get("department")
        status_filter = self.request.query_params.get("status")
        if department_id:
            qs = qs.filter(department_id=department_id)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs
