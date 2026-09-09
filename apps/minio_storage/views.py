"""
views.py – Endpoints para firmar cargas directas y descargas.
"""
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    PresignedDownloadRequestSerializer,
    PresignedDownloadResponseSerializer,
    PresignedUploadRequestSerializer,
    PresignedUploadResponseSerializer,
)
from .services import generate_presigned_download_url, generate_presigned_upload_url


class PresignedUploadView(APIView):
    """Genera una URL prefirmada para que el cliente suba un archivo a MinIO."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PresignedUploadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        # TODO: Construir object_key usando organizational_units.services.generate_tenant_prefix()
        object_key = f"{data['organizational_unit_id']}/{data['filename']}"

        upload_url = generate_presigned_upload_url(
            object_key=object_key,
            content_type=data["content_type"],
        )

        response_data = PresignedUploadResponseSerializer(
            {
                "upload_url": upload_url,
                "object_key": object_key,
                "expires_in": 3600,
            }
        ).data

        return Response(response_data, status=status.HTTP_200_OK)


class PresignedDownloadView(APIView):
    """Genera una URL prefirmada para descargar un archivo de MinIO."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PresignedDownloadRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        download_url = generate_presigned_download_url(
            object_key=serializer.validated_data["object_key"],
        )

        response_data = PresignedDownloadResponseSerializer(
            {
                "download_url": download_url,
                "expires_in": 3600,
            }
        ).data

        return Response(response_data, status=status.HTTP_200_OK)
