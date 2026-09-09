import { Badge } from '../../../shared/ui/Badge/Badge';
import { formatDate } from '../../../shared/lib/format';
import { type TituloEntity } from '../model/types';
import { TipoTitulo } from '../../tramite/model/types';
import './TituloCard.css';

interface TituloCardProps {
  readonly titulo: TituloEntity;
  readonly onClick?: (titulo: TituloEntity) => void;
}

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';

function getTipoConfig(tipo: TipoTitulo): { label: string; variant: BadgeVariant; accentClass: string } {
  switch (tipo) {
    case TipoTitulo.ACADEMICO:
      return { label: 'Académico', variant: 'primary', accentClass: 'titulo-card__accent-bar--academico' };
    case TipoTitulo.PROVISION_NACIONAL:
      return { label: 'Provisión Nacional', variant: 'accent', accentClass: 'titulo-card__accent-bar--provision' };
    case TipoTitulo.SUPLETORIO:
      return { label: 'Supletorio', variant: 'warning', accentClass: 'titulo-card__accent-bar--supletorio' };
    case TipoTitulo.DUPLICADO:
      return { label: 'Duplicado', variant: 'info', accentClass: 'titulo-card__accent-bar--duplicado' };
    case TipoTitulo.POSTGRADO:
      return { label: 'Postgrado', variant: 'success', accentClass: 'titulo-card__accent-bar--postgrado' };
  }
}

export function TituloCard({ titulo, onClick }: TituloCardProps) {
  const config = getTipoConfig(titulo.tipo);

  return (
    <div
      className="titulo-card"
      onClick={onClick ? () => onClick(titulo) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(titulo); } : undefined}
    >
      <div className={`titulo-card__accent-bar ${config.accentClass}`} />
      <div className="titulo-card__header">
        <span className="titulo-card__numero">{titulo.numero}</span>
        <Badge variant={config.variant} size="sm">{config.label}</Badge>
      </div>
      <div className="titulo-card__nombre">{titulo.nombreCompleto}</div>
      <div className="titulo-card__detail">
        <span className="titulo-card__detail-label">CI:</span>
        <span>{titulo.ci}</span>
      </div>
      <div className="titulo-card__detail">
        <span className="titulo-card__detail-label">Carrera:</span>
        <span>{titulo.carrera}</span>
      </div>
      <div className="titulo-card__detail">
        <span className="titulo-card__detail-label">Facultad:</span>
        <span>{titulo.facultad}</span>
      </div>
      <div className="titulo-card__footer">
        <span>Emitido: {formatDate(titulo.fechaEmision)}</span>
        {titulo.esDigitalizado && <Badge variant="success" size="sm">Digitalizado</Badge>}
      </div>
    </div>
  );
}
