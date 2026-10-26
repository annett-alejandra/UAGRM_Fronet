import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { BookOpen, Search, FileCheck, Clock, AlertTriangle, CheckCircle2, Plus, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OCRViewer } from '../../features/visor-ocr/ui/OCRViewer';

export function ReconstruccionExpedientePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [activeId, setActiveId] = useState<string | null>(id || null);

  const documentUrl = `${import.meta.env.VITE_MINIO_PUBLIC_URL || 'http://localhost:10001'}/uagrm-expedientes/sample-document.pdf`;
  const currentDocId = activeId || id || 'EXP-2026';
  const documentName = `Expediente-${currentDocId}.pdf`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setActiveId(searchId.trim());
      navigate(`/archivo/reconstruccion/${searchId.trim()}`);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setActiveId(presetId);
    navigate(`/archivo/reconstruccion/${presetId}`);
  };

  // State cuando no se proporciona ID
  if (!activeId && !id) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6 p-4 font-sans animate-in fade-in duration-300">
        
        {/* Header Institucional */}
        <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#191A7D] tracking-tight font-heading flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#191A7D] inline-block mr-1" /> ReconstrucciÃ³n y ValidaciÃ³n de Legajos HistÃ³ricos
              </h1>
              <p className="text-[#64748B] text-xs mt-1">
                Ingrese el nÃºmero de expediente, C.I. o R.U. para cargar la vista previa del documento y su matriz de archivo
              </p>
            </div>

            <span className="badge-status-publicado font-mono text-xs">
              ðŸ›ï¸ Archivo Central UAGRM
            </span>
          </div>

          {/* Buscador de Legajos */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64748B] pointer-events-none" />
              <input
                type="text"
                placeholder="Ingrese C.I., R.U. o CÃ³digo de Legajo (Ej. EXP-2026, )"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#191A2D] focus:outline-none focus:border-[#191A7D] focus:bg-white transition-all"
              />
            </div>
            
            <Button type="submit" variant="primary" className="py-2.5 px-6 text-xs font-bold shrink-0">Cargar Legajo</Button>
          </form>

          {/* Accesos RÃ¡pidos Presets */}
          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
              Expedientes Disponibles para RevisiÃ³n:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'EXP-2026', title: 'Legajo  (Bachiller 1998)' },
                { id: 'TIT-9901', title: 'Diploma AcadÃ©mico Carlos Gutierrez' },
                { id: 'LEG-1048', title: 'TÃ­tulo Supletorio Derecho 2004' },
              ].map(item => (
                <Button key={item.id} variant="outline" size="sm" onClick={() => handleSelectPreset(item.id)} className="h-auto py-1.5 px-3">
                  <span className="font-mono font-bold text-[#191A7D] group-hover:text-white">{item.id}</span>
                  <span className="text-[11px] opacity-75">â€” {item.title}</span>
                </Button>
              ))}
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F9F9F6]">
      <header className="px-6 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setActiveId(null)} className="h-auto py-1.5 px-3">
            â† Volver a BÃºsqueda
          </Button>
          <h1 className="text-sm font-extrabold text-[#191A7D]">
            ValidaciÃ³n de Legajo HistÃ³rico: <span className="font-mono text-[#D31338]">{currentDocId}</span>
          </h1>
        </div>

        <span className="text-xs text-[#1B7A43] font-mono font-bold bg-[#1B7A43]/10 px-3 py-1 rounded-full">
          âœ“ Cotejo Visual Activo
        </span>
      </header>

      <div className="flex-1 overflow-hidden p-4">
        <OCRViewer
          documentoId={currentDocId}
          documentUrl={documentUrl}
          documentName={documentName}
        />
      </div>
    </div>
  );
}

