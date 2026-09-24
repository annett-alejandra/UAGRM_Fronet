import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { CertificadoAutenticidadPage } from './CertificadoAutenticidadPage';
import { BandejaPendientesPage } from './BandejaPendientesPage';
import { ReconstruccionExpedientePage } from './ReconstruccionExpedientePage';
import { BusquedaExpedientesArchivoPage } from './BusquedaExpedientesArchivoPage';
import { CargaExcelLibrosHistoricos } from './CargaExcelLibrosHistoricos';
import { DashboardNotificacionesPage } from './DashboardNotificacionesPage';
import { SubidaDocumentos } from '../../features/subida-documentos/SubidaDocumentos';

export function ArchivoCentralLayout() {
  return (
    <SidebarNavWidget pageTitle="Archivo Central & Digitalización - UAGRM">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard-notificaciones" replace />} />
            <Route path="dashboard-notificaciones" element={<DashboardNotificacionesPage />} />
            <Route path="triaje" element={<BandejaPendientesPage />} />
            <Route path="autenticidad" element={<CertificadoAutenticidadPage />} />
            <Route path="subida" element={<SubidaDocumentos />} />
            <Route path="busqueda-expedientes" element={<BusquedaExpedientesArchivoPage />} />
            <Route path="subida-excel" element={<CargaExcelLibrosHistoricos />} />
            <Route path="reconstruccion" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="*" element={<Navigate to="dashboard-notificaciones" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}