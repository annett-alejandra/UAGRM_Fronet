import { SidebarNavWidget } from '../../widgets/SidebarNavWidget';
import { CuotaDashboard } from '../../features/gestionar-cuotas';
import './UnidadesPage.css';

export function UnidadesPage() {
  return (
    <SidebarNavWidget pageTitle="Administración de Unidades">
      <div className="unidades-page">
        <CuotaDashboard />
      </div>
    </SidebarNavWidget>
  );
}
