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
              <h1 className="text-xl font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#003366] inline-block mr-1" /> Reconstrucción y Validación de Legajos Históricos
              </h1>
              <p className="text-[#64748B] text-xs mt-1">
                Ingrese el número de expediente, C.I. o R.U. para cargar la vista previa del documento y su matriz de archivo
              </p>
            </div>

            <span className="badge-status-publicado font-mono text-xs">
              🏛️ Archivo Central UAGRM
            </span>
          </div>

          {/* Buscador de Legajos */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64748B] pointer-events-none" />
              <input
                type="text"
                placeholder="Ingrese C.I., R.U. o Código de Legajo (Ej. EXP-2026, 3250858-SCZ)"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#003366] focus:bg-white transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="boton-crear py-2.5 px-6 text-xs font-bold shrink-0 shadow-sm"
            >
              Cargar Legajo
            </button>
          </form>

          {/* Accesos Rápidos Presets */}
          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2">
              Expedientes Disponibles para Revisión:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'EXP-2026', title: 'Legajo Jenny Flores Peña (Bachiller 1998)' },
                { id: 'TIT-9901', title: 'Diploma Académico Carlos Gutierrez' },
                { id: 'LEG-1048', title: 'Título Supletorio Derecho 2004' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPreset(item.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#003366] hover:text-white border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#1E293B] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="font-mono font-bold text-[#003366] group-hover:text-white">{item.id}</span>
                  <span className="text-[11px] opacity-75">— {item.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <header className="px-6 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveId(null)}
            className="px-3 py-1.5 border border-[#E2E8F0] hover:bg-slate-100 rounded-xl text-xs font-bold text-[#64748B] transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Volver a Búsqueda
          </button>
          <h1 className="text-sm font-extrabold text-[#003366]">
            Validación de Legajo Histórico: <span className="font-mono text-[#C51D24]">{currentDocId}</span>
          </h1>
        </div>

        <span className="text-xs text-[#1B7A43] font-mono font-bold bg-[#1B7A43]/10 px-3 py-1 rounded-full">
          ✓ Cotejo Visual Activo
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
