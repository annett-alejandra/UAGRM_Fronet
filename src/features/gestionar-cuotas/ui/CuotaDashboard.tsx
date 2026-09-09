import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { ProgressBar } from '../../../shared/ui/ProgressBar/ProgressBar';
import { formatFileSize } from '../../../shared/lib/format';
import { useCuotasStorage } from '../api/useCuotasStorage';
import './CuotaDashboard.css';

export function CuotaDashboard() {
  const { isLoading, cuotas, error } = useCuotasStorage();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Spinner size="lg" label="Cargando cuotas" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'var(--color-error-500)', textAlign: 'center', padding: '2rem' }}>
        {error}
      </div>
    );
  }

  const totalUsado = cuotas.reduce((sum, c) => sum + c.usadoGb, 0);
  const totalMax = cuotas.reduce((sum, c) => sum + c.cuotaMaxGb, 0);
  const totalArchivos = cuotas.reduce((sum, c) => sum + c.archivosCount, 0);
  const porcentajeGlobal = totalMax > 0 ? (totalUsado / totalMax) * 100 : 0;

  function getCuotaColor(porcentaje: number): 'primary' | 'success' | 'warning' | 'error' {
    if (porcentaje >= 90) return 'error';
    if (porcentaje >= 70) return 'warning';
    return 'primary';
  }

  return (
    <div className="cuota-dashboard">
      {/* Summary Stats */}
      <div className="cuota-dashboard__summary">
        <div className="cuota-dashboard__stat">
          <div className="cuota-dashboard__stat-label">Almacenamiento Total</div>
          <div className="cuota-dashboard__stat-value">
            {formatFileSize(totalMax * 1024 * 1024 * 1024)}
          </div>
        </div>
        <div className="cuota-dashboard__stat">
          <div className="cuota-dashboard__stat-label">Espacio Usado</div>
          <div className="cuota-dashboard__stat-value">
            {formatFileSize(totalUsado * 1024 * 1024 * 1024)}
          </div>
          <div className="cuota-dashboard__stat-change cuota-dashboard__stat-change--up">
            {porcentajeGlobal.toFixed(1)}% utilizado
          </div>
        </div>
        <div className="cuota-dashboard__stat">
          <div className="cuota-dashboard__stat-label">Unidades</div>
          <div className="cuota-dashboard__stat-value">{cuotas.length}</div>
        </div>
        <div className="cuota-dashboard__stat">
          <div className="cuota-dashboard__stat-label">Total Archivos</div>
          <div className="cuota-dashboard__stat-value">
            {totalArchivos.toLocaleString('es')}
          </div>
        </div>
      </div>

      {/* Per-Unit Quotas */}
      <div className="cuota-dashboard__list">
        <h3 className="cuota-dashboard__list-title">Uso por Unidad Organizacional</h3>
        {cuotas.map((cuota) => (
          <ProgressBar
            key={cuota.id}
            value={cuota.porcentajeUso}
            label={cuota.unidadNombre}
            color={getCuotaColor(cuota.porcentajeUso)}
          />
        ))}
      </div>
    </div>
  );
}
