import { useState, useCallback } from 'react';
import { restClient } from '../../../shared/api/rest-client';

export interface SearchHit {
  readonly documentId: string;
  readonly nombre: string;
  readonly fragmentos: readonly string[];
  readonly score: number;
  readonly bucket: string;
  readonly objectKey: string;
  readonly createdAt: string;
}

interface SearchResult {
  readonly hits: readonly SearchHit[];
  readonly total: number;
  readonly took: number;
}

interface SearchState {
  readonly isSearching: boolean;
  readonly result: SearchResult | null;
  readonly error: string | null;
}

interface UseSearchDocumentsReturn {
  readonly state: SearchState;
  readonly search: (query: string, page?: number, size?: number) => Promise<void>;
  readonly clear: () => void;
}

export function useSearchDocuments(): UseSearchDocumentsReturn {
  const [state, setState] = useState<SearchState>({
    isSearching: false,
    result: null,
    error: null,
  });

  const search = useCallback(async (query: string, page: number = 1, size: number = 20) => {
    if (!query.trim()) {
      setState({ isSearching: false, result: null, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isSearching: true, error: null }));

    try {
      const params = new URLSearchParams({
        q: query,
        page: String(page),
        size: String(size),
      });

      const { data } = await restClient.get<SearchResult>(`/search/?${params.toString()}`);
      setState({ isSearching: false, result: data, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la búsqueda';
      setState({ isSearching: false, result: null, error: message });
    }
  }, []);

  const clear = useCallback(() => {
    setState({ isSearching: false, result: null, error: null });
  }, []);

  return { state, search, clear };
}
