export const enum DocumentoEstado {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface DocumentoEntity {
  readonly id: string;
  readonly nombre: string;
  readonly nombreOriginal: string;
  readonly mimeType: string;
  readonly tamanoBytes: number;
  readonly estado: DocumentoEstado;
  readonly minioBucket: string;
  readonly minioObjectKey: string;
  readonly unidadId: string;
  readonly creadoPor: string;
  readonly textoOcr: string | null;
  readonly ocrConfianza: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PresignedUploadResponse {
  readonly presignedUrl: string;
  readonly objectKey: string;
  readonly bucket: string;
  readonly expiresIn: number;
}

export interface PresignedDownloadResponse {
  readonly presignedUrl: string;
  readonly expiresIn: number;
}
