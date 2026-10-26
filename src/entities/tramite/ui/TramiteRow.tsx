import { Badge } from '../../../shared/ui/Badge/Badge';
import { formatRelativeTime } from '../../../shared/lib/format';
import { type TramiteEntity, TramiteEstado, TipoTitulo } from '../model/types';
import './TramiteRow.css';

interface TramiteRowProps {
  readonly tramite: TramiteEntity;
  readonly onClick?: (tramite: TramiteEntity) => void;
}

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';

export function getEstadoBadge(estado: TramiteEstado): { label: string; variant: BadgeVariant } {
  switch (estado) {
    case TramiteEstado.RECEPCION_VENTANILLA:
      return { label: 'Recepción', variant: 'info' };
    case TramiteEstado.REVISION_ARCHIVO:
      return { label: 'Rev. Archivo', variant: 'warning' };
    case TramiteEstado.VERIFICADO_OCR:
      return { label: 'Verificado OCR', variant: 'primary' };
    case TramiteEstado.APROBACION_TITULOS:
      return { label: 'Aprobación Títulos', variant: 'primary' };
    case TramiteEstado.CERTIFICACION_EMITIDA:
      return { label: 'Cert. Emitida', variant: 'success' };
    case TramiteEstado.ENTREGADO:
      return { label: 'Entregado', variant: 'accent' };
    case TramiteEstado.RECHAZADO:
      return { label: 'Rechazado', variant: 'error' };
  }
}

export function getTipoLabel(tipo: TipoTitulo): string {
  switch (tipo) {
    case TipoTitulo.BIENHECHURIA:
      return 'Bienhechuría';
    case TipoTitulo.PROPIEDAD:
      return 'Propiedad';
    case TipoTitulo.EJIDO:
      return 'Ejido';
    case TipoTitulo.POSESION:
      return 'Posesión';
    case TipoTitulo.SUPLETORIO:
      return 'Supletorio';
  }
}

export function TramiteRow({ tramite, onClick }: TramiteRowProps) {
  const badge = getEstadoBadge(tramite.estado);

  return (
    <div
      className="tramite-row"
      onClick={onClick ? () => onClick(tramite) : undefined}
      role={onClick ? 'button' : 'row'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(tramite); } : undefined}
    >
      <span className="tramite-row__codigo">{tramite.codigo}</span>
      <div className="tramite-row__solicitante">
        <span className="tramite-row__nombre">{tramite.solicitanteNombre}</span>
        <span className="tramite-row__carrera">{tramite.carrera}</span>
      </div>
      <span className="tramite-row__tipo">{getTipoLabel(tramite.tipoTitulo)}</span>
      <span className="tramite-row__unidad" title={tramite.unidadActual}>
        {tramite.unidadActual}
      </span>
      <Badge variant={badge.variant} showDot size="sm">{badge.label}</Badge>
      <span className="tramite-row__fecha">{formatRelativeTime(tramite.createdAt)}</span>
    </div>
  );
}
