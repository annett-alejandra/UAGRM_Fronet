"""
views.py – Endpoints REST para títulos, trámites y certificaciones.
"""
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Certificacion, Titulo, Tramite
from .selectors import listar_tramites_pendientes, obtener_titulos_por_tipo
from .serializers import (
    CertificacionSerializer,
    TituloSerializer,
    TramiteCreateSerializer,
    TramiteDerivarSerializer,
    TramiteSerializer,
)
from .services import aprobar_certificacion, derivar_tramite, iniciar_tramite_supletorio


class TituloViewSet(viewsets.ModelViewSet):
    """CRUD de títulos con filtro por tipo."""
    queryset = Titulo.objects.all()
    serializer_class = TituloSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        tipo = self.request.query_params.get("tipo")
        if tipo:
            qs = obtener_titulos_por_tipo(tipo)
        return qs


class TramiteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Trámites: lectura + acciones personalizadas para iniciar y derivar.
    """
    queryset = Tramite.objects.select_related("titulo", "asignado_a").all()
    serializer_class = TramiteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        unidad = self.request.query_params.get("unidad")
        estado = self.request.query_params.get("estado")
        if unidad:
            qs = listar_tramites_pendientes(unidad)
        if estado:
            qs = qs.filter(estado=estado)
        return qs

    @action(detail=False, methods=["post"], url_path="iniciar")
    def iniciar(self, request):
        """POST /api/tramites/tramites/iniciar/ → Inicia un nuevo trámite."""
        serializer = TramiteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        titulo = Titulo.objects.get(pk=data["titulo_id"])

        tramite = iniciar_tramite_supletorio(
            titulo=titulo,
            unidad_recepcion_id=str(data["unidad_recepcion_id"]),
            observaciones=data.get("observaciones", ""),
            asignado_a=request.user,
        )

        return Response(
            TramiteSerializer(tramite).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="derivar")
    def derivar(self, request, pk=None):
        """POST /api/tramites/tramites/{id}/derivar/ → Deriva el trámite."""
        tramite = self.get_object()
        serializer = TramiteDerivarSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        tramite = derivar_tramite(
            tramite=tramite,
            nuevo_estado=data["nuevo_estado"],
            nueva_unidad_id=str(data["nueva_unidad_id"]),
            observaciones=data.get("observaciones", ""),
        )

        return Response(TramiteSerializer(tramite).data, status=status.HTTP_200_OK)


class CertificacionViewSet(viewsets.ModelViewSet):
    """CRUD de certificaciones con acción para aprobar."""
    queryset = Certificacion.objects.select_related("titulo", "emitida_por").all()
    serializer_class = CertificacionSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"], url_path="aprobar")
    def aprobar(self, request, pk=None):
        """POST /api/tramites/certificaciones/{id}/aprobar/"""
        certificacion = self.get_object()
        try:
            certificacion = aprobar_certificacion(
                certificacion=certificacion,
                emitida_por=request.user,
            )
            return Response(CertificacionSerializer(certificacion).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
