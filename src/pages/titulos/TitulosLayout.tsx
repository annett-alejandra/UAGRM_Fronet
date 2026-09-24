import { Routes, Route } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { DashboardNotificacionesTitulosPage } from './DashboardNotificacionesTitulosPage';
import { BusquedaInformixPage } from './BusquedaInformixPage';
import { VisorExpedienteDigitalPage } from './VisorExpedienteDigitalPage';
import { EmisionPlantillasTitulosPage } from './EmisionPlantillasTitulosPage';
import { CargaLibrosMatricesTitulosPage } from './CargaLibrosMatricesTitulosPage';

export function TitulosLayout() {
  return (
    <SidebarNavWidget pageTitle="Departamento de Títulos y Grados - UAGRM">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<DashboardNotificacionesTitulosPage />} />
            <Route path="" element={<DashboardNotificacionesTitulosPage />} />
            <Route path="dashboard" element={<DashboardNotificacionesTitulosPage />} />
            <Route path="dashboard-notificaciones" element={<DashboardNotificacionesTitulosPage />} />
            <Route path="dashboard%20notificaciones" element={<DashboardNotificacionesTitulosPage />} />
            
            <Route path="busqueda-informix" element={<BusquedaInformixPage />} />
            <Route path="busqueda" element={<BusquedaInformixPage />} />
            
            <Route path="visor-expediente" element={<VisorExpedienteDigitalPage />} />
            <Route path="visor-expediente/:id" element={<VisorExpedienteDigitalPage />} />
            <Route path="expediente" element={<VisorExpedienteDigitalPage />} />
            <Route path="expediente/:id" element={<VisorExpedienteDigitalPage />} />
            
            <Route path="emision-plantillas" element={<EmisionPlantillasTitulosPage />} />
            <Route path="emision" element={<EmisionPlantillasTitulosPage />} />
            
            <Route path="carga-libros" element={<CargaLibrosMatricesTitulosPage />} />
            <Route path="*" element={<DashboardNotificacionesTitulosPage />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
