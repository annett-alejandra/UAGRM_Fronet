import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Eye,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Download,
  Printer,
  Edit3,
  Check
} from 'lucide-react';

export function VisorExpedienteDigitalPage() {
  const navigate = useNavigate();
  const [paginaSeleccionada, setPaginaSeleccionada] = useState<'ANVERSO' | 'REVERSO' | 'CI' | 'CARTA'>('ANVERSO');
  const [zoom, setZoom] = useState(100);
  const [aprobado, setAprobado] = useState(false);

  // Form State editable para validación OCR en tiempo real
  const [nroTitulo, setNroTitulo] = useState('TIT-96071');
  const [titular, setTitular] = useState('GUALBERTO MEDINA VARGAS');
  const [cui, setCui] = useState('8072900-SCZ');
  const [carrera, setCarrera] = useState('MEDICINA HUMANA');
  const [gestion, setGestion] = useState('1995');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-7xl mx-auto font-sans"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#003366] to-[#002244] text-[#E5A823] rounded-2xl shadow-md">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                Títulos y Grados • Opción 3
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Reconstrucción & Visor Digital de Expediente
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Visor interactivo con reconocimiento OCR asistido para cotejar documentos escaneados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {aprobado ? (
            <div className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Expediente Aprobado para Emisión</span>
            </div>
          ) : (
            <button
              onClick={() => setAprobado(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Aprobar Expediente</span>
            </button>
          )}
        </div>
      </div>

      {/* VISOR DIVIDIDO 2 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMNA IZQUIERDA: DOCUMENTO ESCANEADO */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
              <button
                onClick={() => setPaginaSeleccionada('ANVERSO')}
                className={`px-3 py-1 rounded-lg transition-all text-xs cursor-pointer ${paginaSeleccionada === 'ANVERSO' ? 'bg-white text-[#003366] font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Anverso Título
              </button>
              <button
                onClick={() => setPaginaSeleccionada('REVERSO')}
                className={`px-3 py-1 rounded-lg transition-all text-xs cursor-pointer ${paginaSeleccionada === 'REVERSO' ? 'bg-white text-[#003366] font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Reverso Sello
              </button>
              <button
                onClick={() => setPaginaSeleccionada('CI')}
                className={`px-3 py-1 rounded-lg transition-all text-xs cursor-pointer ${paginaSeleccionada === 'CI' ? 'bg-white text-[#003366] font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Carnet C.I.
              </button>
              <button
                onClick={() => setPaginaSeleccionada('CARTA')}
                className={`px-3 py-1 rounded-lg transition-all text-xs cursor-pointer ${paginaSeleccionada === 'CARTA' ? 'bg-white text-[#003366] font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Carta Rector
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setZoom(p => Math.max(75, p - 15))} className="p-1.5 bg-white rounded-lg text-slate-700 cursor-pointer">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-2">{zoom}%</span>
              <button onClick={() => setZoom(p => Math.min(150, p + 15))} className="p-1.5 bg-white rounded-lg text-slate-700 cursor-pointer">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VISTA DEL DOCUMENTO ESCANEADO */}
          <div className="bg-slate-900 rounded-2xl p-4 overflow-auto min-h-[420px] flex items-center justify-center relative">
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="bg-[#FAF8F5] text-slate-900 p-8 rounded-lg shadow-2xl border-4 border-[#003366] max-w-md w-full font-serif space-y-4 transition-transform duration-200"
            >
              <div className="text-center border-b-2 border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#880000]">
                  UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                </h4>
                <p className="text-[10px] font-sans font-bold text-slate-600 uppercase mt-1">
                  {paginaSeleccionada === 'ANVERSO' ? 'DIPLOMA ACADÉMICO / TÍTULO DE GRADO' :
                   paginaSeleccionada === 'REVERSO' ? 'REVERSO REGISTRO Y REGISTRO RECTORAL' :
                   paginaSeleccionada === 'CI' ? 'CEDULA DE IDENTIDAD DIGITALIZADA' :
                   'CARTA DIRIGIDA AL RECTOR UAGRM'}
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <p><span className="text-slate-500 font-sans">Código Expediente:</span> <strong className="text-[#003366]">{nroTitulo}</strong></p>
                <p><span className="text-slate-500 font-sans">Titular:</span> <strong>{titular}</strong></p>
                <p><span className="text-slate-500 font-sans">CUI / C.I.:</span> <strong>{cui}</strong></p>
                <p><span className="text-slate-500 font-sans">Carrera:</span> <strong>{carrera}</strong></p>
                <p><span className="text-slate-500 font-sans">Gestión:</span> <strong>{gestion}</strong></p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-sans">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Preservación Archivo Histórico
                </span>
                <span className="text-slate-500 font-mono">Página 1 / 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: COTEJO Y VALIDACIÓN OCR */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#003366]" />
              Cotejo de Datos & Reconocimiento OCR
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Precisión OCR: 98.4%
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Número de Título / Código
              </label>
              <input
                type="text"
                value={nroTitulo}
                onChange={(e) => setNroTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-[#003366] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Nombre Completo del Titular
              </label>
              <input
                type="text"
                value={titular}
                onChange={(e) => setTitular(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                CUI / Cédula de Identidad
              </label>
              <input
                type="text"
                value={cui}
                onChange={(e) => setCui(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Carrera / Programa
              </label>
              <input
                type="text"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Gestión Académica
              </label>
              <input
                type="text"
                value={gestion}
                onChange={(e) => setGestion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <button
              onClick={() => navigate('/titulos/emision-plantillas')}
              className="w-full py-3 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Generar Plantilla de Certificación</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
