import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Eye,
  CheckCircle2,
  Bookmark,
  FileText,
  Calendar,
  Building2
} from 'lucide-react';

interface Tomo {
  id: string;
  codigoTomo: string;
  nombreTomo: string;
  gestion: string;
  facultad: string;
  carrera: string;
  totalFolios: number;
  estadoDigitalizacion: 'COMPLETO' | 'EN_PROCESO' | 'EN_REVISION';
  ultimoFolioDigit: number;
}

interface Folio {
  numeroFolio: number;
  nombreTitular: string;
  cui: string;
  nroTitulo: string;
  fechaEmision: string;
  tipoDocumento: string;
}

const TOMOS_MOCK: Tomo[] = [
  { id: '1', codigoTomo: 'TOMO-1995-A', nombreTomo: 'Tomo I - Títulos Supletorios Médicos 1995', gestion: '1995', facultad: 'Ciencias de la Salud Humana', carrera: 'Medicina Humana', totalFolios: 250, estadoDigitalizacion: 'COMPLETO', ultimoFolioDigit: 250 },
  { id: '2', codigoTomo: 'TOMO-1998-B', nombreTomo: 'Tomo II - Licenciaturas en Derecho 1998', gestion: '1998', facultad: 'Ciencias Jurídicas y Políticas', carrera: 'Derecho', totalFolios: 320, estadoDigitalizacion: 'COMPLETO', ultimoFolioDigit: 320 },
  { id: '3', codigoTomo: 'TOMO-2002-[#3]', nombreTomo: 'Tomo III - Ingenierías Informática y Sistemas 2002', gestion: '2002', facultad: 'Politécnica / Tecnología', carrera: 'Ingeniería en Sistemas', totalFolios: 180, estadoDigitalizacion: 'EN_PROCESO', ultimoFolioDigit: 142 },
  { id: '4', codigoTomo: 'TOMO-2005-IV', nombreTomo: 'Tomo IV - Odontología y Bioquímica 2005', gestion: '2005', facultad: 'Ciencias de la Salud Humana', carrera: 'Odontología', totalFolios: 210, estadoDigitalizacion: 'COMPLETO', ultimoFolioDigit: 210 },
  { id: '5', codigoTomo: 'TOMO-2010-V', nombreTomo: 'Tomo V - Auditoría y Contabilidad 2010', gestion: '2010', facultad: 'Ciencias Económicas y Financieras', carrera: 'Auditoría Financiera', totalFolios: 400, estadoDigitalizacion: 'EN_REVISION', ultimoFolioDigit: 380 },
];

const FOLIOS_MOCK: Folio[] = [
  { numeroFolio: 1, nombreTitular: 'DR. GUALBERTO MEDINA VARGAS', cui: '8072900-SCZ', nroTitulo: 'TIT-9501', fechaEmision: '14/05/1995', tipoDocumento: 'Título de Médico Cirujano' },
  { numeroFolio: 2, nombreTitular: 'DRA. CLARA RIVERA PAZ', cui: '3421098-SCZ', nroTitulo: 'TIT-9502', fechaEmision: '18/05/1995', tipoDocumento: 'Título de Médica Cirujana' },
  { numeroFolio: 3, nombreTitular: 'LIC. FERNANDO AGUILAR ROCA', cui: '4920182-SCZ', nroTitulo: 'TIT-9503', fechaEmision: '22/05/1995', tipoDocumento: 'Diploma Académico Medicina' },
  { numeroFolio: 4, nombreTitular: 'DRA. PATRICIA VARGAS TERRAZAS', cui: '5192039-SCZ', nroTitulo: 'TIT-9504', fechaEmision: '30/05/1995', tipoDocumento: 'Título de Médica Cirujana' },
];

export function VerLibrosPorTomoPage() {
  const [tomoSeleccionado, setTomoSeleccionado] = useState<Tomo>(TOMOS_MOCK[0]);
  const [folioActualIndex, setFolioActualIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [filtroGestion, setFiltroGestion] = useState('TODAS');
  const [query, setQuery] = useState('');

  const tomosFiltrados = TOMOS_MOCK.filter(t => {
    const matchQuery = t.nombreTomo.toLowerCase().includes(query.toLowerCase()) || t.codigoTomo.toLowerCase().includes(query.toLowerCase());
    const matchGestion = filtroGestion === 'TODAS' || t.gestion === filtroGestion;
    return matchQuery && matchGestion;
  });

  const folioActual = FOLIOS_MOCK[folioActualIndex % FOLIOS_MOCK.length];

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
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                Opción 7 • Archivo Central
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Visor Histórico de Libros y Tomos Digitalizados
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consulte y explore folios digitalizados catalogados por Tomo, Gestión, Facultad y Carrera.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Servidor de Repositorio Digital Online</span>
        </div>
      </div>

      {/* GRID DE DOS COLUMNAS: SELECCIÓN DE TOMO + LECTOR DE FOLIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMNA IZQUIERDA: BUSCADOR Y LISTA DE TOMOS */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#003366]" />
              Catálogo de Tomos Digitales
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {tomosFiltrados.length} Tomos encontrados
            </span>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar tomo por código o título..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 shrink-0">Gestión:</span>
              {['TODAS', '1995', '1998', '2002', '2005', '2010'].map((g) => (
                <button
                  key={g}
                  onClick={() => setFiltroGestion(g)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                    filtroGestion === g ? 'bg-[#003366] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {tomosFiltrados.map((t) => {
              const selected = tomoSeleccionado.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setTomoSeleccionado(t);
                    setFolioActualIndex(0);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    selected
                      ? 'bg-blue-50/80 border-[#003366] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {selected && <div className="w-1.5 h-full bg-[#003366] absolute left-0 top-0" />}

                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-bold text-[#003366] bg-blue-100/80 px-2 py-0.5 rounded-md">
                      {t.codigoTomo}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      t.estadoDigitalizacion === 'COMPLETO'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {t.estadoDigitalizacion}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                    {t.nombreTomo}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div><span className="font-semibold text-slate-700">Facultad:</span> {t.facultad}</div>
                    <div><span className="font-semibold text-slate-700">Folios:</span> {t.ultimoFolioDigit} / {t.totalFolios}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: VISOR DIGITAL INTERACTIVO DE FOLIO */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {tomoSeleccionado.codigoTomo}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Folio Nro. {folioActual.numeroFolio} de {tomoSeleccionado.totalFolios}
                </h3>
              </div>

              {/* CONTROLES DE ZOOM Y NAVEGACIÓN */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                  className="p-1.5 bg-white hover:bg-slate-50 rounded-lg shadow-2xs text-slate-700 cursor-pointer"
                  title="Alejar Zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                  className="p-1.5 bg-white hover:bg-slate-50 rounded-lg shadow-2xs text-slate-700 cursor-pointer"
                  title="Acercar Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* VISTA SIMULADA DEL DOCUMENTO DIGITALIZADO CON EFECTO HISTÓRICO */}
            <div className="mt-4 bg-slate-900 rounded-2xl p-4 overflow-auto min-h-[400px] flex items-center justify-center relative">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="bg-[#FFFDF7] text-slate-900 p-8 rounded-lg shadow-2xl border-4 border-[#C5A059] max-w-lg w-full font-serif space-y-4 transition-transform duration-200 relative"
              >
                {/* MARCA DE AGUA VINTAGE */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-6xl font-black text-slate-900">
                  UAGRM 1995
                </div>

                <div className="text-center border-b-2 border-slate-800 pb-3 space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#880000]">
                    UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                  </h4>
                  <p className="text-[10px] font-sans font-bold text-slate-600 uppercase">
                    REGISTRO DE MATRÍCULA Y LIBRO DE FOLIOS DIGITALIZADOS
                  </p>
                </div>

                <div className="space-y-2 text-xs leading-relaxed font-mono">
                  <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                    <span className="text-slate-500">Folio Registro Nro:</span>
                    <span className="font-bold text-[#003366]">{folioActual.numeroFolio}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                    <span className="text-slate-500">Titular del Grado:</span>
                    <span className="font-bold text-slate-900">{folioActual.nombreTitular}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                    <span className="text-slate-500">CUI / C.I.:</span>
                    <span className="font-bold text-slate-800">{folioActual.cui}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                    <span className="text-slate-500">Nro. de Título:</span>
                    <span className="font-bold text-emerald-700">{folioActual.nroTitulo}</span>
                  </div>

                  <div className="flex justify-between border-b border-dashed border-slate-300 pb-1">
                    <span className="text-slate-500">Fecha Emisión Original:</span>
                    <span className="font-bold text-slate-800">{folioActual.fechaEmision}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipo de Documento:</span>
                    <span className="font-bold text-slate-900">{folioActual.tipoDocumento}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-sans">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    OCR Verificado & Indexado
                  </span>
                  <span className="text-slate-400 font-mono">
                    Firma Rectoral Digit. #88912
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BARRA INFERIOR DE NAVEGACIÓN ENTRE FOLIOS */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setFolioActualIndex(prev => Math.max(0, prev - 1))}
              disabled={folioActualIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Folio Anterior</span>
            </button>

            <span className="text-xs font-mono font-bold text-slate-600">
              Folio {folioActualIndex + 1} de {FOLIOS_MOCK.length}
            </span>

            <button
              onClick={() => setFolioActualIndex(prev => (prev + 1) % FOLIOS_MOCK.length)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Siguiente Folio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
