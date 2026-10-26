/**
 * Modelo de Datos Unificado para OCR y Reconocimiento de Documentos Universitarios
 * Sistema de Gestión de Títulos Supletorios y Archivo Central — UAGRM
 */

export type DocumentoOcrStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly page?: number;
}

export interface CampoOcrExtraido {
  valor: string | null;
  confianza: number; // 0.0 a 1.0 (ej. 0.95 = 95%)
  editable: boolean;
  observacion?: string;
  bbox?: BoundingBox;
}

export interface RespuestaOcrDinamico {
  readonly id?: string;
  readonly tipo_documento_detectado: string;
  readonly denominacion_modelo: string;
  readonly confianza_general: number;
  readonly campos_extraidos: Record<string, CampoOcrExtraido>;
  readonly extracted_text?: string;
  readonly status?: DocumentoOcrStatus;
  readonly minio_object_key?: string;
}

export interface PresignUploadRequest {
  readonly organizational_unit_id: string;
  readonly filename: string;
  readonly content_type: string;
}

export interface PresignUploadResponse {
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
  readonly status: DocumentoOcrStatus;
  readonly extracted_text?: string;
  readonly campos_extraidos?: Record<string, CampoOcrExtraido>;
}

export interface ConfirmacionOcrPayload {
  readonly document_id: string;
  readonly document_class: string;
  readonly validated_payload: Record<string, string>;
  readonly ci_titular?: string;
}
