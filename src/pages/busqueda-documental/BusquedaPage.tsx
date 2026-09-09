import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { useSearchDocuments, SearchResults } from '../../features/buscar-documentos';
import './BusquedaPage.css';

export function BusquedaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const { state, search } = useSearchDocuments();

  useEffect(() => {
    if (initialQuery) {
      void search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) {
      setSearchParams({ q });
      void search(q);
    }
  };

  return (
    <SidebarNavWidget pageTitle="Búsqueda Documental">
      <div className="busqueda-page">
        <div className="busqueda-page__hero">
          <h2 className="busqueda-page__hero-title">Búsqueda Full-Text</h2>
          <p className="busqueda-page__hero-subtitle">
            Busca en el contenido de todos los documentos procesados por el motor OCR
          </p>
        </div>

        <div className="busqueda-page__search-wrapper">
          <SearchBar
            placeholder="Buscar en documentos…"
            value={query}
            onSearch={handleSearch}
            size="lg"
            autoFocus
            showShortcut={false}
          />
        </div>

        <SearchResults
          hits={state.result?.hits ?? []}
          total={state.result?.total ?? 0}
          took={state.result?.took ?? 0}
          isSearching={state.isSearching}
          query={query}
        />
      </div>
    </SidebarNavWidget>
  );
}
