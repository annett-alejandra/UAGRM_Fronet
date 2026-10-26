import './secretaria.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarNavWidget } from '@/widgets/SidebarNavWidget/SidebarNavWidget';
import { SecretariaProvider } from './context/SecretariaContext';
import { VistaAdmisionPrevia } from './views/VistaAdmisionPrevia';
import { VistaApostillamiento } from './views/VistaApostillamiento';
import { VistaDespachoSeguro } from './views/VistaDespachoSeguro';
import { VistaCatalogoConvenios } from './views/VistaCatalogoConvenios';
import { SecretariaModule } from './SecretariaModule';
import { ReconstruccionOcrSplitView } from '@/features/reconstruccion-ocr/ReconstruccionOcrSplitView';
import { EmisionCertificadoPage } from '../emision-certificado';
import SecretariaGeneral from './views/SecretariaGeneral';
import { VistaConvenioInstitucional } from '@/pages/solicitante/views/VistaConvenioInstitucional';

export function SecretariaLayout() {
  return (
    <SidebarNavWidget pageTitle="Secretaría General - UAGRM">
      <SecretariaProvider>
        <div className="flex flex-col h-full bg-[#F9F9F6] text-slate-900">
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="admision" replace />} />
              <Route path="admision" element={<div className="p-6"><VistaAdmisionPrevia /></div>} />
              <Route path="apostillamiento" element={<div className="p-6"><VistaApostillamiento /></div>} />
              <Route path="despacho-seguro" element={<div className="p-6"><VistaDespachoSeguro /></div>} />
              <Route path="convenios" element={<div className="p-6"><VistaCatalogoConvenios /></div>} />
              <Route path="modulo-completo" element={<SecretariaModule />} />
              <Route path="convenios-radicacion" element={<div className="p-6"><VistaConvenioInstitucional /></div>} />
              <Route path="reconstruccion-ocr" element={<ReconstruccionOcrSplitView />} />
              <Route path="autenticidad" element={<EmisionCertificadoPage />} />
              <Route path="general" element={<div className="p-6"><SecretariaGeneral /></div>} />
              <Route path="*" element={<Navigate to="admision" replace />} />
            </Routes>
          </main>
        </div>
      </SecretariaProvider>
    </SidebarNavWidget>
  );
}

