import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { CertificadoAutenticidadPage } from './CertificadoAutenticidadPage';
import { BandejaPendientesPage } from './BandejaPendientesPage';
import { ReconstruccionExpedientePage } from './ReconstruccionExpedientePage';
import { SubidaDocumentos } from '../../features/subida-documentos/SubidaDocumentos';

export function ArchivoCentralLayout() {
  return (
    <SidebarNavWidget pageTitle="Archivo Central & Digitalización - UAGRM">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="autenticidad" replace />} />
            <Route path="autenticidad" element={<CertificadoAutenticidadPage />} />
            <Route path="triaje" element={<BandejaPendientesPage />} />
            <Route path="subida" element={<SubidaDocumentos />} />
            <Route path="reconstruccion" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="*" element={<Navigate to="autenticidad" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
