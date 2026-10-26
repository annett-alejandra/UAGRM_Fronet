import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { SSOCallbackPage } from '../pages/login/SSOCallbackPage';
import { ArchivoCentralLayout } from '../pages/archivo-central/ArchivoCentralLayout';
import { TitulosLayout } from '../pages/titulos/TitulosLayout';
import { SecretariaLayout } from '../pages/secretaria/SecretariaLayout';
import { SidebarNavWidget } from '../widgets/SidebarNavWidget/SidebarNavWidget';
import { CargadorOcrWizard, PantallaVerificacionOcr } from '../features/ocr';
import { PortalSolicitantePage } from '../pages/solicitante/PortalSolicitantePage';
import { EmisionCertificadoPage } from '../pages/emision-certificado';
import { VerificacionPage } from '../pages/verificacion';
import { Dev1SandboxPage, Dev2SandboxPage, Dev3SandboxPage } from '../pages/sandboxes';
import { HeroLuxuryUAGRM } from '../widgets/HeroLuxuryUAGRM';
import { ColorPaletteShowcase } from '../shared/ui';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portada Inmersiva UAGRM & Showcase de Colores */}
        <Route path="/hero" element={<HeroLuxuryUAGRM onExplore={() => window.location.href = '/login'} />} />
        <Route path="/portada" element={<HeroLuxuryUAGRM onExplore={() => window.location.href = '/login'} />} />
        <Route path="/colores" element={<div className="min-h-screen bg-[#F9F9F6] p-4 sm:p-8 flex items-center justify-center"><ColorPaletteShowcase /></div>} />
        <Route path="/paleta" element={<div className="min-h-screen bg-[#F9F9F6] p-4 sm:p-8 flex items-center justify-center"><ColorPaletteShowcase /></div>} />

        {/* Login Portal & SSO Callback */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/sso/callback" element={<SSOCallbackPage />} />
        <Route path="/login/sso/callback" element={<SSOCallbackPage />} />

        {/* Portal del Solicitante & Convenios Institucionales */}
        <Route path="/solicitante/*" element={<PortalSolicitantePage />} />
        <Route path="/solicitante" element={<PortalSolicitantePage />} />
        <Route path="/convenios" element={<Navigate to="/solicitante?tab=convenio" replace />} />
        <Route path="/portal-convenios" element={<Navigate to="/solicitante?tab=convenio" replace />} />

        {/* Portal Público de Verificación QR */}
        <Route path="/verificar/:token?" element={<VerificacionPage />} />
        <Route path="/verificar" element={<VerificacionPage />} />

        {/* Emisión de Certificados */}
        <Route path="/emision-certificado" element={<SidebarNavWidget pageTitle="Emisión de Certificados"><EmisionCertificadoPage /></SidebarNavWidget>} />

        {/* Flujo OCR */}
        <Route path="/archivo/subir-ocr" element={<SidebarNavWidget pageTitle="Subir Expediente"><CargadorOcrWizard /></SidebarNavWidget>} />
        <Route path="/archivo/verificar-ocr/:docId" element={<SidebarNavWidget pageTitle="Verificación OCR"><PantallaVerificacionOcr /></SidebarNavWidget>} />

        {/* Módulo 1: Archivo Central */}
        <Route path="/archivo/*" element={<ArchivoCentralLayout />} />

        {/* Módulo 2: Títulos y Grados */}
        <Route path="/titulos/*" element={<TitulosLayout />} />

        {/* Módulo 3: Secretaría General */}
        <Route path="/secretaria/*" element={<SecretariaLayout />} />

        {/* Entorno Aislado: DEV 1 (Rama Aireyu) */}
        <Route path="/dev1/*" element={<Dev1SandboxPage />} />
        <Route path="/dev1" element={<Dev1SandboxPage />} />

        {/* Entorno Aislado: DEV 2 (Rama Fabian Cuellar) */}
        <Route path="/dev2/*" element={<Dev2SandboxPage />} />
        <Route path="/dev2" element={<Dev2SandboxPage />} />

        {/* Entorno Aislado: DEV 3 (Rama Juan Pablo) */}
        <Route path="/dev3/*" element={<Dev3SandboxPage />} />
        <Route path="/dev3" element={<Dev3SandboxPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
