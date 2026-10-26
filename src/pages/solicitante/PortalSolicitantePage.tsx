import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2, FileEdit, Layers, Search, ArrowLeft, Handshake
} from 'lucide-react';
import { Button, Badge } from '@/shared/ui';

// Vistas del Portal del Solicitante
import { VistaConvenioInstitucional } from './views/VistaConvenioInstitucional';
import { VistaAdmision } from './views/VistaAdmision/VistaAdmision';
import { VistaCargaLote } from './views/VistaCargaLote/VistaCargaLote';
import { VistaSeguimiento } from './views/VistaSeguimiento/VistaSeguimiento';

const VALID_TABS = ['convenio', 'admision', 'lotes', 'seguimiento'] as const;
type TabType = typeof VALID_TABS[number];

export function PortalSolicitantePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tabActiva: TabType = VALID_TABS.includes(tabParam as TabType) ? (tabParam as TabType) : 'admision';

  const handleSelectTab = (tab: TabType) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-slate-900 font-sans flex flex-col">
      {/* Header Institucional UAGRM */}
      <header className="bg-[#191A7D] text-white border-b-4 border-amber-400 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-10 h-10 rounded-xl bg-white text-[#191A7D] flex items-center justify-center font-extrabold shadow-sm border border-amber-300">
              <Building2 className="w-5 h-5 text-[#191A7D]" />
            </div>
            <div>
              <div className="text-[11px] tracking-wider text-amber-400 font-bold uppercase">
                Universidad Autónoma Gabriel René Moreno
              </div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
                Portal del Solicitante & Certificaciones Oficiales
                <Badge variant="warning">Portal Público</Badge>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Módulos Internos
            </Button>
          </div>
        </div>
      </header>

      {/* Barra de Pestañas del Portal del Solicitante */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 py-2 overflow-x-auto">
          <Button
            variant={tabActiva === 'convenio' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleSelectTab('convenio')}
            className="gap-2 shrink-0 rounded-lg text-xs font-semibold"
          >
            <Handshake className="w-4 h-4" />
            <span>Convenios & Nóminas (Dev 2)</span>
          </Button>

          <Button
            variant={tabActiva === 'admision' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleSelectTab('admision')}
            className="gap-2 shrink-0 rounded-lg text-xs font-semibold"
          >
            <FileEdit className="w-4 h-4" />
            <span>Admisión & Solicitud</span>
          </Button>

          <Button
            variant={tabActiva === 'lotes' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleSelectTab('lotes')}
            className="gap-2 shrink-0 rounded-lg text-xs font-semibold"
          >
            <Layers className="w-4 h-4" />
            <span>Carga Masiva por Lote</span>
          </Button>

          <Button
            variant={tabActiva === 'seguimiento' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleSelectTab('seguimiento')}
            className="gap-2 shrink-0 rounded-lg text-xs font-semibold"
          >
            <Search className="w-4 h-4" />
            <span>Seguimiento de Trámite</span>
          </Button>
        </div>
      </div>

      {/* Contenido Principal Renderizado según Pestaña */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {tabActiva === 'convenio' && <VistaConvenioInstitucional />}
        {tabActiva === 'admision' && <VistaAdmision />}
        {tabActiva === 'lotes' && <VistaCargaLote />}
        {tabActiva === 'seguimiento' && <VistaSeguimiento />}
      </main>

      {/* Footer Institucional */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Universidad Autónoma Gabriel René Moreno (UAGRM) — Sistema Oficial de Títulos Supletorios y Certificaciones de Autenticidad.</p>
        </div>
      </footer>
    </div>
  );
}
