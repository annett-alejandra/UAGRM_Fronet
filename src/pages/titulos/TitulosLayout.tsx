import { Routes, Route } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { DashboardNotificacionesTitulosPage } from './DashboardNotificacionesTitulosPage';
import { BusquedaInformixPage } from './BusquedaInformixPage';
import { VisorExpedienteDigitalPage } from './VisorExpedienteDigitalPage';
import { CargaLibrosMatricesTitulosPage } from './CargaLibrosMatricesTitulosPage';
import { EmisionCertificadoPage } from '../emision-certificado';

// Vistas Especializadas de Títulos y Grados
import DashboardTitulos from './views/DashboardTitulos';
import ConvalidacionEspejo from './views/ConvalidacionEspejo';
import BovedaHistorica from './views/BovedaHistorica';
import LotesInstitucionales from './views/LotesInstitucionales';
import BandejaEntrada from './views/BandejaEntrada';

export function TitulosLayout() {
  return (
    <SidebarNavWidget pageTitle="Departamento de Títulos y Grados - UAGRM">
      <div className="flex flex-col h-full bg-[#F9F9F6]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route index element={<DashboardNotificacionesTitulosPage />} />
            <Route path="" element={<DashboardNotificacionesTitulosPage />} />
            <Route path="dashboard" element={<DashboardNotificacionesTitulosPage />} />
            <Route path="dashboard-notificaciones" element={<DashboardNotificacionesTitulosPage />} />
            
            {/* Vistas Especializadas */}
            <Route path="convalidacion" element={<div className="p-6"><ConvalidacionEspejo /></div>} />
            <Route path="boveda" element={<div className="p-6"><BovedaHistorica /></div>} />
            <Route path="lotes" element={<div className="p-6"><LotesInstitucionales /></div>} />
            <Route path="lotes-institucionales" element={<div className="p-6"><LotesInstitucionales /></div>} />
            <Route path="bandeja-entrada" element={<div className="p-6"><BandejaEntrada /></div>} />
            <Route path="dashboard-general" element={<div className="p-6"><DashboardTitulos /></div>} />
            
            {/* Vistas Existentes */}
            <Route path="busqueda-informix" element={<BusquedaInformixPage />} />
            <Route path="busqueda" element={<BusquedaInformixPage />} />
            <Route path="visor-expediente" element={<VisorExpedienteDigitalPage />} />
            <Route path="visor-expediente/:id" element={<VisorExpedienteDigitalPage />} />
            <Route path="emision-plantillas" element={<EmisionCertificadoPage />} />
            <Route path="emision" element={<EmisionCertificadoPage />} />
            <Route path="carga-libros" element={<CargaLibrosMatricesTitulosPage />} />
            <Route path="*" element={<DashboardNotificacionesTitulosPage />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
