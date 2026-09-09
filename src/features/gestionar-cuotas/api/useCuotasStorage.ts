import { useState, useEffect, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';
import type { CuotaEntity } from '../../../entities/unidad-organizacional';

interface UseCuotasStorageReturn {
  readonly isLoading: boolean;
  readonly cuotas: readonly CuotaEntity[];
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
}

export function useCuotasStorage(): UseCuotasStorageReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [cuotas, setCuotas] = useState<readonly CuotaEntity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCuotas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await restClient.get<readonly CuotaEntity[]>('/org-units/quotas/');
      setCuotas(data);
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar cuotas';
      setError(message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCuotas();
  }, [fetchCuotas]);

  return { isLoading, cuotas, error, refresh: fetchCuotas };
}
