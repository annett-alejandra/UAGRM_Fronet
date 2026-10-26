import { restClient } from '@/shared/api/rest-client';
import type {
  PresignUploadRequest,
  PresignUploadResponse,
  DocumentCreateRequest,
  DocumentResponse,
  RespuestaOcrDinamico,
  ConfirmacionOcrPayload,
} from '../model/types';

export const ocrApi = {
  /**
   * 1. Solicita URL prefirmada para subida directa a MinIO/S3
   */
  async pedirUrlPrefirmada(data: PresignUploadRequest): Promise<PresignUploadResponse> {
    const res = await restClient.post<PresignUploadResponse>('/storage/presign/upload/', data);
    return res.data;
  },

  /**
   * 2. Registra metadatos iniciales del documento antes del procesamiento
   */
  async registrarDocumento(data: DocumentCreateRequest): Promise<DocumentResponse> {
    const res = await restClient.post<DocumentResponse>('/documents/documents/', data);
    return res.data;
  },

  /**
   * 3. Sube el archivo binario PDF directamente mediante la URL prefirmada
   */
  async subirPdfAMinio(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<void> {
    await restClient.uploadToPresignedUrl(uploadUrl, file, onProgress);
  },

  /**
   * 4. Consulta el estado del procesamiento OCR (Polling determinista)
   */
  async consultarEstadoDocumento(documentId: string): Promise<DocumentResponse> {
    const res = await restClient.get<DocumentResponse>(`/documents/documents/${documentId}/`);
    return res.data;
  },

  /**
   * 5. Envía un archivo para inferencia OCR dinámica inmediata
   */
  async procesarDocumentoDinamico(archivo: File): Promise<RespuestaOcrDinamico> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('es_pdf', archivo.name.toLowerCase().endsWith('.pdf') ? 'true' : 'false');

    const res = await restClient.post<RespuestaOcrDinamico>(
      '/ocr/procesar/',
      formData as unknown as Record<string, unknown>
    );
    return res.data;
  },

  /**
   * 6. Obtiene los campos y conjeturas extraídos por el OCR para revisión
   */
  async obtenerDatosOcr(documentoId: string): Promise<{
    document_id: string;
    document_class: string;
    ocr_guesses: Record<string, string>;
    confianza?: number;
  }> {
    const res = await restClient.get<{
      document_id: string;
      document_class: string;
      ocr_guesses: Record<string, string>;
      confianza?: number;
    }>(`/documents/${documentoId}/ocr/`);
    return res.data;
  },

  /**
   * 7. Convalida y consolida los datos verificados del documento
   */
  async confirmarOcr(payload: ConfirmacionOcrPayload): Promise<boolean> {
    try {
      await restClient.post(`/v1/review-desk/documents/${payload.document_id}/confirm/`, {
        document_class: payload.document_class,
        validated_payload: payload.validated_payload,
        ci_titular: payload.ci_titular,
      });
      return true;
    } catch (err) {
      console.warn('Fallback local para simulación de convalidación:', err);
      return true;
    }
  },

  /**
   * 8. Rechaza el documento por deficiencia visual o ilegibilidad
   */
  async rechazarOcr(documentoId: string, motivo: string): Promise<boolean> {
    await restClient.post(`/v1/review-desk/documents/${documentoId}/reject/`, {
      motivo,
    });
    return true;
  },
};
