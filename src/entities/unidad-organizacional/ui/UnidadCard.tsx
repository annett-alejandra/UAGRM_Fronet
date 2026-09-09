import { type CuotaEntity } from '../model/types';
import { formatFileSize } from '../../../shared/lib/format';
import './UnidadCard.css';

interface UnidadCardProps {
  readonly cuota: CuotaEntity;
  readonly onClick?: (cuota: CuotaEntity) => void;
}

function getCuotaFillClass(porcentaje: number): string {
  if (porcentaje >= 90) return 'unidad-card__cuota-fill--danger';
  if (porcentaje >= 70) return 'unidad-card__cuota-fill--warning';
  return '';
}

export function UnidadCard({ cuota, onClick }: UnidadCardProps) {
  const fillClass = getCuotaFillClass(cuota.porcentajeUso);

  return (
    <div
      className="unidad-card"
      onClick={onClick ? () => onClick(cuota) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(cuota); } : undefined}
    >
      <div className="unidad-card__logo" aria-hidden="true">
        {cuota.unidadNombre.slice(0, 2).toUpperCase()}
      </div>
      <div className="unidad-card__info">
        <div className="unidad-card__name">{cuota.unidadNombre}</div>
        <div className="unidad-card__sigla">{cuota.archivosCount} archivo{cuota.archivosCount !== 1 ? 's' : ''}</div>
      </div>
      <div className="unidad-card__cuota">
        <div className="unidad-card__cuota-text">
          <span>{formatFileSize(cuota.usadoGb * 1024 * 1024 * 1024)}</span>
          <span>{formatFileSize(cuota.cuotaMaxGb * 1024 * 1024 * 1024)}</span>
        </div>
        <div className="unidad-card__cuota-bar" role="progressbar" aria-valuenow={cuota.porcentajeUso} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`unidad-card__cuota-fill ${fillClass}`}
            style={{ width: `${Math.min(100, cuota.porcentajeUso)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
