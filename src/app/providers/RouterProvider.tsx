import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/login/LoginPage';
import { SSOCallbackPage } from '../../pages/login/SSOCallbackPage';
import { ArchivoCentralLayout } from '../../pages/archivo-central/ArchivoCentralLayout';
import { TitulosLayout } from '../../pages/titulos/TitulosLayout';
import { SecretariaLayout } from '../../pages/secretaria/SecretariaLayout';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { CargadorOcrWizard } from '../../features/flujo-ocr/ui/CargadorOcrWizard';
import { PantallaVerificacionOcr } from '../../features/flujo-ocr/ui/PantallaVerificacionOcr';
import { PortalSolicitantePage } from '../../pages/solicitante/PortalSolicitantePage';

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Portal & SSO Callback */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/sso/callback" element={<SSOCallbackPage />} />
        <Route path="/login/sso/callback" element={<SSOCallbackPage />} />

        {/* Portal del Solicitante (Public / Entidades) */}
        <Route path="/solicitante/*" element={<PortalSolicitantePage />} />
        <Route path="/solicitante" element={<PortalSolicitantePage />} />

        {/* Flujo OCR */}
        <Route path="/archivo/subir-ocr" element={<SidebarNavWidget pageTitle="Subir Expediente"><CargadorOcrWizard /></SidebarNavWidget>} />
        <Route path="/archivo/verificar-ocr/:docId" element={<PantallaVerificacionOcr />} />

        {/* Módulo 1: Archivo Central */}
        <Route path="/archivo/*" element={<ArchivoCentralLayout />} />

        {/* Módulo 2: Títulos y Grados */}
        <Route path="/titulos/*" element={<TitulosLayout />} />

        {/* Módulo 3: Secretaría General */}
        <Route path="/secretaria/*" element={<SecretariaLayout />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
