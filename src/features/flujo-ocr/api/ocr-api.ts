import { restClient } from '../../../shared/api/rest-client';

export interface PresignRequest {
  readonly organizational_unit_id: string;
  readonly filename: string;
  readonly content_type: string;
}

export interface PresignResponse {
  readonly upload_url: string;
  readonly object_key: string;
  readonly expires_in: number;
}

export interface DocumentCreateRequest {
  readonly department_id: string;
  readonly title: string;
  readonly description?: string;
  readonly object_key: string;
  readonly content_type: string;
  readonly file_size_bytes: number;
}

export interface DocumentResponse {
  readonly id: string;
  readonly object_key: string;
  readonly status: 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR';
  readonly extracted_text?: string;
}

export const ocrApi = {
  // PASO 0: Pedir Permiso (URL Prefirmada)
  async pedirUrlPrefirmada(data: PresignRequest): Promise<PresignResponse> {
    const res = await restClient.post<PresignResponse>('/storage/presign/upload/', data);
    return res.data;
  },

  // PASO 1: Registrar Metadata
  async registrarDocumento(data: DocumentCreateRequest): Promise<DocumentResponse> {
    const res = await restClient.post<DocumentResponse>('/documents/documents/', data);
    return res.data;
  },

  // PASO 2: Subir Archivo Real
  async subirPdfAMinio(uploadUrl: string, file: File, onProgress?: (percent: number) => void): Promise<void> {
    await restClient.uploadToPresignedUrl(uploadUrl, file, onProgress);
  },

  // PASO 3: Polling OCR
  async consultarEstadoDocumento(documentId: string): Promise<DocumentResponse> {
    const res = await restClient.get<DocumentResponse>(`/documents/documents/${documentId}/`);
    return res.data;
  }
};

