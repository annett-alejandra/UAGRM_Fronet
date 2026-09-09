import { useState, useCallback } from 'react';
import { type TramiteEntity, TramiteEstado, TramiteRow } from '../../entities/tramite';
import { EmptyState } from '../../shared/ui/EmptyState/EmptyState';
import { Button } from '../../shared/ui/Button/Button';
import './BandejaEntradaWidget.css';

interface BandejaEntradaWidgetProps {
  readonly tramites: readonly TramiteEntity[];
  readonly isLoading: boolean;
  readonly onTramiteClick?: (tramite: TramiteEntity) => void;
  readonly onNuevoTramite?: () => void;
}

const FILTER_OPTIONS: readonly { value: TramiteEstado | 'TODOS'; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: TramiteEstado.INGRESADO, label: 'Ingresados' },
  { value: TramiteEstado.EN_REVISION, label: 'En Revisión' },
  { value: TramiteEstado.OBSERVADO, label: 'Observados' },
  { value: TramiteEstado.APROBADO, label: 'Aprobados' },
  { value: TramiteEstado.RECHAZADO, label: 'Rechazados' },
  { value: TramiteEstado.FINALIZADO, label: 'Finalizados' },
];

export function BandejaEntradaWidget({
  tramites,
  isLoading,
  onTramiteClick,
  onNuevoTramite,
}: BandejaEntradaWidgetProps) {
  const [activeFilter, setActiveFilter] = useState<TramiteEstado | 'TODOS'>('TODOS');

  const filteredTramites = activeFilter === 'TODOS'
    ? tramites
    : tramites.filter((t) => t.estado === activeFilter);

  const handleFilterClick = useCallback((filter: TramiteEstado | 'TODOS') => {
    setActiveFilter(filter);
  }, []);

  if (isLoading) {
    return (
      <div className="bandeja-widget">
        <div className="bandeja-widget__header">
          <h2 className="bandeja-widget__title">Bandeja de Trámites</h2>
        </div>
        <div className="bandeja-widget__list" style={{ minHeight: 200 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-shimmer" style={{ height: 56, borderBottom: '1px solid var(--border-subtle)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bandeja-widget">
      <div className="bandeja-widget__header">
        <h2 className="bandeja-widget__title">Bandeja de Trámites</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {onNuevoTramite && (
            <Button variant="primary" size="sm" onClick={onNuevoTramite}>
              + Nuevo Trámite
            </Button>
          )}
        </div>
      </div>

      <div className="bandeja-widget__filters">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`bandeja-widget__filter-btn ${activeFilter === opt.value ? 'bandeja-widget__filter-btn--active' : ''}`}
            onClick={() => handleFilterClick(opt.value)}
          >
            {opt.label}
            {opt.value !== 'TODOS' && (
              <> ({tramites.filter((t) => t.estado === opt.value).length})</>
            )}
          </button>
        ))}
      </div>

      {filteredTramites.length === 0 ? (
        <EmptyState
          title="Sin trámites"
          description="No hay trámites en esta categoría. Inicia un nuevo trámite supletorio."
          action={
            onNuevoTramite ? (
              <Button variant="primary" size="sm" onClick={onNuevoTramite}>
                Iniciar Trámite
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bandeja-widget__list">
          <div className="bandeja-widget__list-header">
            <span>Código</span>
            <span>Solicitante</span>
            <span>Tipo</span>
            <span>Unidad</span>
            <span>Estado</span>
            <span style={{ textAlign: 'right' }}>Fecha</span>
          </div>
          {filteredTramites.map((tramite) => (
            <TramiteRow
              key={tramite.id}
              tramite={tramite}
              onClick={onTramiteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
