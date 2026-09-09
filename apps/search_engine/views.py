"""
views.py – API para consultas de texto completo (Full-Text).
"""
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import full_text_search


class SearchQuerySerializer(serializers.Serializer):
    q = serializers.CharField(max_length=512, help_text="Texto a buscar.")
    department = serializers.CharField(max_length=64, required=False, help_text="Código del departamento (filtro).")
    page = serializers.IntegerField(default=1, min_value=1)
    page_size = serializers.IntegerField(default=25, min_value=1, max_value=100)


class FullTextSearchView(APIView):
    """Endpoint de búsqueda de texto completo con highlighting."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = SearchQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        results = full_text_search(
            query=data["q"],
            department_code=data.get("department"),
            page=data["page"],
            page_size=data["page_size"],
        )

        return Response(results, status=status.HTTP_200_OK)
