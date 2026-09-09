import { useState, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';
import type { TramiteEntity } from '../../../entities/tramite';

interface IniciarTramiteInput {
  readonly tipoTitulo: string;
  readonly solicitanteNombre: string;
  readonly solicitanteCi: string;
  readonly carrera: string;
  readonly facultad: string;
  readonly observaciones?: string;
  readonly documentoIds: readonly string[];
}

interface UseIniciarTramiteReturn {
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly iniciarTramite: (input: IniciarTramiteInput) => Promise<TramiteEntity | null>;
}

export function useIniciarTramite(): UseIniciarTramiteReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciarTramite = useCallback(async (input: IniciarTramiteInput): Promise<TramiteEntity | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await restClient.post<TramiteEntity>(
        '/tramites/tramites/iniciar/',
        {
          tipo_titulo: input.tipoTitulo,
          solicitante_nombre: input.solicitanteNombre,
          solicitante_ci: input.solicitanteCi,
          carrera: input.carrera,
          facultad: input.facultad,
          observaciones: input.observaciones ?? null,
          documento_ids: input.documentoIds,
        },
      );
      setIsSubmitting(false);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar trámite';
      setError(message);
      setIsSubmitting(false);
      return null;
    }
  }, []);

  return { isSubmitting, error, iniciarTramite };
}
