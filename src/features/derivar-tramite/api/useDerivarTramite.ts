import { useState, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';
import type { TramiteEntity } from '../../../entities/tramite';

interface UseDerivarTramiteReturn {
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly derivarTramite: (tramiteId: string, destinoUnidadId: string, observaciones?: string) => Promise<TramiteEntity | null>;
}

export function useDerivarTramite(): UseDerivarTramiteReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const derivarTramite = useCallback(async (
    tramiteId: string,
    destinoUnidadId: string,
    observaciones?: string,
  ): Promise<TramiteEntity | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await restClient.post<TramiteEntity>(
        `/tramites/tramites/${tramiteId}/derivar/`,
        {
          destino_unidad_id: destinoUnidadId,
          observaciones: observaciones ?? null,
        },
      );
      setIsSubmitting(false);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al derivar trámite';
      setError(message);
      setIsSubmitting(false);
      return null;
    }
  }, []);

  return { isSubmitting, error, derivarTramite };
}
