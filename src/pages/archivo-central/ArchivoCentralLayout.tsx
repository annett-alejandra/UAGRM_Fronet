import { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { BusquedaExpediente } from '../../features/busqueda-expediente/BusquedaExpediente';
import { SubidaDocumentos } from '../../features/subida-documentos/SubidaDocumentos';
import { ReconstruccionOcrSplitView } from '../../features/reconstruccion-ocr/ReconstruccionOcrSplitView';
import { PlantillaAutenticidad } from '../../features/plantilla-autenticidad/PlantillaAutenticidad';

const TABS = [
  { id: 'subida', label: 'Subir Documento', path: '/archivo/subida' },
  { id: 'busqueda', label: 'Busqueda y Expedientes', path: '/archivo/busqueda' },
  { id: 'reconstruccion', label: 'Validacion OCR (Reconstruccion)', path: '/archivo/reconstruccion' },
  { id: 'plantillas', label: 'Plantillas de Autenticidad', path: '/archivo/plantillas' },
];

export function ArchivoCentralLayout() {
  const location = useLocation();

  return (
    <SidebarNavWidget pageTitle="Archivo Central">
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* Header con Pestanas */}
        <header className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-wrap gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = location.pathname.includes(tab.path);
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                } rounded-t-lg`}
              >
                {tab.label}
              </Link>
            );
          })}
        </header>

        {/* Area de Contenido (Rutas) */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
          <Routes>
            <Route path="/" element={<Navigate to="busqueda" replace />} />
            <Route path="busqueda" element={<BusquedaExpediente />} />
            <Route path="subida" element={<SubidaDocumentos />} />
            <Route path="reconstruccion" element={<ReconstruccionOcrSplitView />} />
            <Route path="plantillas" element={<PlantillaAutenticidad />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
