import { useState } from 'react';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { Button } from '../../shared/ui/Button/Button';
import { Card, CardBody } from '../../shared/ui/Card/Card';

export function DataGridUniversal() {
  const [criterio, setCriterio] = useState<'CI' | 'TITULO'>('CI');
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [haBuscado, setHaBuscado] = useState(false);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valorBusqueda.trim()) return;
    setHaBuscado(true);
    setResultados([
      { id: '1', codigo: 'TS-2023-001', solicitante: 'Juan Perez', tipo: 'Supletorio', estado: 'Aprobado' }
    ]);
  };

  const handleReset = () => {
    setValorBusqueda('');
    setResultados([]);
    setHaBuscado(false);
  };

  const placeholderText = criterio === 'CI' ? 'Ingrese el CI...' : 'Ingrese el Titulo...';

  return (
    <SidebarNavWidget pageTitle="Busqueda Universal">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card>
          <CardBody>
            <form onSubmit={handleBuscar} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <select
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
                value={criterio}
                onChange={(e) => setCriterio(e.target.value as 'CI' | 'TITULO')}
              >
                <option value="CI">Carnet de Identidad (CI)</option>
                <option value="TITULO">Numero de Titulo</option>
              </select>
              <input
                type="text"
                placeholder={placeholderText}
                value={valorBusqueda}
                onChange={(e) => setValorBusqueda(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
              />
              <Button type="submit" variant="primary">Buscar</Button>
              {haBuscado && (
                <Button type="button" variant="secondary" onClick={handleReset}>Volver a buscar</Button>
              )}
            </form>
          </CardBody>
        </Card>

        {haBuscado && (
          <div style={{ marginTop: '1.5rem' }}>
            <Card>
              <CardBody>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Codigo</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Solicitante</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tipo</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length > 0 ? resultados.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.75rem' }}>{r.codigo}</td>
                        <td style={{ padding: '0.75rem' }}>{r.solicitante}</td>
                        <td style={{ padding: '0.75rem' }}>{r.tipo}</td>
                        <td style={{ padding: '0.75rem' }}>{r.estado}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/titulos/tramites/' + r.id}>Ver Detalle</Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>No se encontraron resultados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </SidebarNavWidget>
  );
}
