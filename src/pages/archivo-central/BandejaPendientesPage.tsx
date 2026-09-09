import { useNavigate } from 'react-router-dom';
import { Card } from '../../shared/ui/Card/Card';
import { Button } from '../../shared/ui/Button/Button';

// Datos de prueba temporales para la bandeja
const mockPendientes = [
  { id: '1', estudiante: 'Juan Pérez', tramite: 'Provisión Nacional', fecha: '2023-10-01', estado: 'Pendiente OCR' },
  { id: '2', estudiante: 'María Gómez', tramite: 'Bachiller', fecha: '2023-10-02', estado: 'Pendiente OCR' },
];

export function BandejaPendientesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Bandeja de Pendientes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Expedientes pendientes de validación OCR</p>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {mockPendientes.map((item) => (
          <Card key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.estudiante}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Trámite: {item.tramite} | Fecha: {item.fecha}</p>
            </div>
            <div>
              <Button onClick={() => navigate(`/archivo/expediente/${item.id}`)} variant="primary">
                Validar Expediente
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
