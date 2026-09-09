import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { EmptyState } from '../../../shared/ui/EmptyState/EmptyState';
import { formatRelativeTime } from '../../../shared/lib/format';
import type { SearchHit } from '../api/useSearchDocuments';
import './SearchResults.css';

interface SearchResultsProps {
  readonly hits: readonly SearchHit[];
  readonly total: number;
  readonly took: number;
  readonly isSearching: boolean;
  readonly query: string;
  readonly onClickHit?: (hit: SearchHit) => void;
}

function createHighlightedFragment(html: string): { __html: string } {
  /* The backend returns OpenSearch <em> tags for highlights; we convert them to <mark> */
  const sanitized = html
    .replace(/<em>/g, '<mark>')
    .replace(/<\/em>/g, '</mark>');
  return { __html: sanitized };
}

export function SearchResults({
  hits,
  total,
  took,
  isSearching,
  query,
  onClickHit,
}: SearchResultsProps) {
  if (isSearching) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <Spinner size="lg" label="Buscando documentos" />
      </div>
    );
  }

  if (query && hits.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description={`No se encontraron documentos para "${query}". Intenta con otros términos de búsqueda.`}
      />
    );
  }

  if (hits.length === 0) return null;

  return (
    <div className="search-results">
      <div className="search-results__header">
        <span className="search-results__count">
          {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
        </span>
        <span className="search-results__time">
          {took}ms
        </span>
      </div>

      {hits.map((hit) => (
        <div
          key={hit.documentId}
          className="search-result-item"
          onClick={onClickHit ? () => onClickHit(hit) : undefined}
          role={onClickHit ? 'button' : undefined}
          tabIndex={onClickHit ? 0 : undefined}
          onKeyDown={onClickHit ? (e) => { if (e.key === 'Enter') onClickHit(hit); } : undefined}
        >
          <div className="search-result-item__name">{hit.nombre}</div>
          {hit.fragmentos.map((fragment, i) => (
            <p
              key={i}
              className="search-result-item__fragment"
              dangerouslySetInnerHTML={createHighlightedFragment(fragment)}
            />
          ))}
          <div className="search-result-item__meta">
            <span>{formatRelativeTime(hit.createdAt)}</span>
            <span className="search-result-item__score">
              Relevancia: {hit.score.toFixed(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
