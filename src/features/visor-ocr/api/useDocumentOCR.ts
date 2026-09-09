import { useState, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';

export interface OcrData {
  readonly document_id: string;
  readonly document_class: string;
  readonly ocr_guesses: Record<string, string>;
  readonly confianza?: number; // Opcional, por si se envía
}

interface UseDocumentOCRReturn {
  readonly isLoading: boolean;
  readonly isSaving: boolean;
  readonly data: OcrData | null;
  readonly error: string | null;
  readonly fetchOcr: (documentoId: string) => Promise<void>;
  readonly confirmOcr: (documentoId: string, documentClass: string, validatedPayload: Record<string, string>) => Promise<boolean>;
  readonly rejectOcr: (documentoId: string, reason: string) => Promise<boolean>;
}

export function useDocumentOCR(): UseDocumentOCRReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<OcrData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOcr = useCallback(async (documentoId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: ocrData } = await restClient.get<OcrData>(
        `/documents/${documentoId}/ocr/`,
      );
      setData(ocrData);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener datos OCR';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  const confirmOcr = useCallback(async (documentoId: string, documentClass: string, validatedPayload: Record<string, string>) => {
    setIsSaving(true);
    setError(null);
    try {
      await restClient.post(`/v1/review-desk/documents/${documentoId}/confirm/`, {
        document_class: documentClass,
        validated_payload: validatedPayload
      });
      setIsSaving(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar la convalidación';
      setError(message);
      setIsSaving(false);
      return false;
    }
  }, []);

  const rejectOcr = useCallback(async (documentoId: string, reason: string) => {
    setIsSaving(true);
    setError(null);
    try {
      await restClient.post(`/v1/review-desk/documents/${documentoId}/reject/`, {
        reason
      });
      setIsSaving(false);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al rechazar el documento';
      setError(message);
      setIsSaving(false);
      return false;
    }
  }, []);

  return { isLoading, isSaving, data, error, fetchOcr, confirmOcr, rejectOcr };
}
