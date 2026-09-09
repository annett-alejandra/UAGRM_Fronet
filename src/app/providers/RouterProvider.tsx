import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
// IMPORTACIONES SSO COMENTADAS
// import { useAuthStore, ROLES, type RolInstitucional } from '../../shared/lib/auth';
// import { LoginPage, SSOCallbackPage } from '../../pages/login';

import { ArchivoCentralLayout } from '../../pages/archivo-central/ArchivoCentralLayout';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { TitulosLayout } from '../../pages/titulos/TitulosLayout';
import { SecretariaLayout } from '../../pages/secretaria/SecretariaLayout';
import { CargadorOcrWizard } from '../../features/flujo-ocr/ui/CargadorOcrWizard';
import { PantallaVerificacionOcr } from '../../features/flujo-ocr/ui/PantallaVerificacionOcr';

function ProtectedRoute({ children }: { readonly children: ReactNode }) {
  // SSO TOTALMENTE DESACTIVADO A PETICIÓN DEL USUARIO PARA MAQUETACIÓN DIRECTA
  return <>{children}</>;
}

function RoleBasedRedirect() {
  // Al no haber SSO, redirigimos a Títulos por defecto para revisión
  return <Navigate to="/titulos" replace />;
}

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS SSO COMENTADAS 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sso/callback" element={<SSOCallbackPage />} />
        */}

        {/* Redirect Root */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

                {/* Flujo OCR */}
        <Route path="/archivo/subir-ocr" element={<ProtectedRoute><SidebarNavWidget pageTitle="Subir Expediente"><CargadorOcrWizard /></SidebarNavWidget></ProtectedRoute>} />
        <Route path="/archivo/verificar-ocr/:docId" element={<ProtectedRoute><PantallaVerificacionOcr /></ProtectedRoute>} />

        {/* Vista 1: Archivo Central */}
        <Route
          path="/archivo/*"
          element={
            <ProtectedRoute>
              <ArchivoCentralLayout />
            </ProtectedRoute>
          }
        />

        {/* Vista 2: Títulos */}
        <Route
          path="/titulos/*"
          element={
            <ProtectedRoute>
              <TitulosLayout />
            </ProtectedRoute>
          }
        />

        {/* Vista 3: Secretaría General */}
        <Route
          path="/secretaria/*"
          element={
            <ProtectedRoute>
              <SecretariaLayout />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


