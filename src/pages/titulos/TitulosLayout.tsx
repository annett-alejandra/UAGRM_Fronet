import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { BusquedaGlobalTitulos } from '../../features/titulos/BusquedaGlobalTitulos';
import { VisorExpedienteDigital } from '../../features/titulos/VisorExpedienteDigital';
import { EmisionPlantillas } from '../../features/titulos/EmisionPlantillas';
import { CargaLibrosMatrices } from '../../features/titulos/CargaLibrosMatrices';

const TABS = [
  { id: 'busqueda', label: '1. Búsqueda Global (Dashboard)', path: '/titulos/busqueda' },
  { id: 'expediente', label: '2. Visor Expediente (Split View)', path: '/titulos/expediente/TIT-9901' },
  { id: 'emision', label: '3. Emisión & Plantillas (5 Tipos)', path: '/titulos/emision' },
  { id: 'carga', label: '4. Carga Libros Matrices', path: '/titulos/carga-libros' },
];

export function TitulosLayout() {
  const location = useLocation();

  return (
    <SidebarNavWidget pageTitle="Departamento de Títulos y Grados">
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* Header con Pestanas de Navegacion React Router */}
        <header className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-wrap gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = location.pathname.includes(tab.id);
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

        {/* Area de Contenido Principal (Rutas React Router) */}
        <main className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-slate-900">
          <Routes>
            <Route path="/" element={<Navigate to="busqueda" replace />} />
            <Route path="busqueda" element={<BusquedaGlobalTitulos />} />
            <Route path="expediente/:id" element={<VisorExpedienteDigital />} />
            <Route path="emision" element={<EmisionPlantillas />} />
            <Route path="carga-libros" element={<CargaLibrosMatrices />} />
            <Route path="*" element={<Navigate to="busqueda" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
