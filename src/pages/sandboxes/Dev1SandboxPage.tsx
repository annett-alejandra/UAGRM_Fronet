import { useState } from 'react';
import { FileEdit, Layers, Search, Award, Landmark, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VistaAdmision } from '@/pages/solicitante/views/VistaAdmision/VistaAdmision';
import { VistaCargaLote } from '@/pages/solicitante/views/VistaCargaLote/VistaCargaLote';
import { VistaSeguimiento } from '@/pages/solicitante/views/VistaSeguimiento/VistaSeguimiento';
import { VistaEmisionPlantillas } from '@/features/emision-plantillas/VistaEmisionPlantillas';

export function Dev1SandboxPage() {
  const [vistaActiva, setVistaActiva] = useState<'1.1' | '1.2' | '1.3' | '1.4'>('1.4');
  const navigate = useNavigate();

  const pestanas = [
    {
      id: '1.4' as const,
      titulo: '1.4 Emisión de Plantillas (NUEVO)',
      icono: Award,
      badge: 'Último Commit Aireyu',
      descripcion: 'Normalización A4 de Certificados, Supletorios e Informes Oficiales con Margen 4cm',
    },
    {
      id: '1.1' as const,
      titulo: '1.1 Admisión & Solicitud',
      icono: FileEdit,
      badge: 'Dev 1',
      descripcion: 'Trámite personal con carta o institucional con convenio',
    },
    {
      id: '1.2' as const,
      titulo: '1.2 Auditoría Masiva por Lote',
      icono: Layers,
      badge: 'Dev 1',
      descripcion: 'Pre-auditoría masiva con semáforo y aislamiento',
    },
    {
      id: '1.3' as const,
      titulo: '1.3 Portal de Seguimiento RUT',
      icono: Search,
      badge: 'Dev 1',
      descripcion: 'Stepper de 5 fases, corte por año y control CPT',
    },
  ];

  const anchoMaximo = vistaActiva === '1.4' ? '1600px' : '1300px';

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* Barra superior de advertencia de entorno aislado */}
      <div className="bg-amber-500 text-slate-950 px-6 py-2 text-xs font-bold flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Sandbox Aislado
          </span>
          <span>
            Visualizando cambios de la rama <strong>origin/Aireyu</strong> (DEV 1) sin mezclar con los módulos principales.
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-slate-950 hover:bg-slate-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Volver al Sistema Principal
        </button>
      </div>

      {/* Header Institucional de DEV 1 */}
      <header className="bg-[#191A7D] text-white px-8 py-4 border-b-4 border-[#f2a900] shadow-md">
        <div style={{ maxWidth: anchoMaximo, margin: '0 auto' }} className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-white rounded-lg p-2 flex items-center justify-center shadow">
              <Landmark size={28} className="text-[#191A7D]" />
            </div>
            <div>
              <div className="text-xs tracking-wider text-[#f2a900] font-bold">
                UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Entorno Aislado DEV 1 — Rama Aireyu
              </h1>
              <span className="text-xs text-slate-300">
                Módulo Oficial DEV 1 &bull; Normalización A4, Split-Screen de Folios, Admisión y Seguimiento
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2 rounded-lg border border-white/20">
            <ShieldCheck size={20} className="text-[#f2a900]" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">
                Módulo Aislado: DEV 1
              </div>
              <div className="text-[11px] text-slate-200">
                Branch: <strong className="text-[#f2a900]">origin/Aireyu</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Selector de Pestañas */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div style={{ maxWidth: anchoMaximo, margin: '0 auto' }} className="px-8 flex gap-2 overflow-x-auto">
          {pestanas.map((p) => {
            const activa = vistaActiva === p.id;
            const Icono = p.icono;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setVistaActiva(p.id)}
                className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  activa
                    ? 'border-[#191A7D] text-[#191A7D] bg-slate-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icono size={18} className={activa ? 'text-[#191A7D]' : 'text-slate-400'} />
                <span>{p.titulo}</span>
                {p.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    activa ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main style={{ maxWidth: anchoMaximo, margin: '0 auto' }} className="p-6 flex-1 w-full">
        {vistaActiva === '1.4' && <VistaEmisionPlantillas />}
        {vistaActiva === '1.1' && <VistaAdmision />}
        {vistaActiva === '1.2' && <VistaCargaLote />}
        {vistaActiva === '1.3' && <VistaSeguimiento />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-12">
        <p className="font-semibold text-slate-700 mb-1">
          Universidad Autónoma Gabriel René Moreno &bull; Entorno de Inspección Aislado DEV 1
        </p>
        <p className="text-[11px] text-slate-400">
          Archivos integrados bajo arquitectura institucional FSD
        </p>
      </footer>
    </div>
  );
}
export default Dev1SandboxPage;
