import { useState, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';
import type { PresignedUploadResponse } from '../../../entities/documento';

interface UploadState {
  readonly isUploading: boolean;
  readonly progress: number;
  readonly error: string | null;
  readonly isComplete: boolean;
}

interface UsePresignedUploadReturn {
  readonly state: UploadState;
  readonly upload: (file: File, unidadId: string, repositorioId: string) => Promise<void>;
  readonly reset: () => void;
}

const INITIAL_STATE: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
  isComplete: false,
};

export function usePresignedUpload(): UsePresignedUploadReturn {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);

  const upload = useCallback(async (file: File, unidadId: string, repositorioId: string) => {
    setState({ isUploading: true, progress: 0, error: null, isComplete: false });

    try {
      /* Step 1: Request presigned URL from backend */
      const { data } = await restClient.post<PresignedUploadResponse>(
        '/storage/presign/upload/',
        {
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          unidad_id: unidadId,
          repositorio_id: repositorioId,
        },
      );

      /* Step 2: Upload directly to MinIO via presigned URL */
      await restClient.uploadToPresignedUrl(
        data.presignedUrl,
        file,
        (percent) => {
          setState((prev) => ({ ...prev, progress: percent }));
        },
      );

      setState({ isUploading: false, progress: 100, error: null, isComplete: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al subir archivo';
      setState({ isUploading: false, progress: 0, error: message, isComplete: false });
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { state, upload, reset };
}
