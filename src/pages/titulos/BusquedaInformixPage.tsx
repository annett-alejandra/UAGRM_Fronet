import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Database,
  Filter,
  User,
  CreditCard,
  FileText,
  BookOpen,
  CheckCircle2,
  Eye,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface RegistroInformix {
  id: string;
  nroTitulo: string;
  nroDiploma: string;
  nombreCompleto: string;
  cui: string;
  carrera: string;
  facultad: string;
  gestion: string;
  libro: string;
  foja: string;
  estado: 'Verificado' | 'En ValidaciÃ³n';
}

const REGISTROS_MOCK: RegistroInformix[] = [
  { id: '1', nroTitulo: 'TIT-96071', nroDiploma: 'DIP-96071', nombreCompleto: 'GUALBERTO MEDINA VARGAS', cui: '8072900-SCZ', carrera: 'Medicina Humana', facultad: 'Ciencias de la Salud Humana', gestion: '1995', libro: 'Libro Tomo I', foja: 'Foja 142', estado: 'Verificado' },
  { id: '2', nroTitulo: 'TIT-88421', nroDiploma: 'DIP-88421', nombreCompleto: '', cui: '', carrera: 'Licenciatura en Derecho', facultad: 'Ciencias JurÃ­dicas y PolÃ­ticas', gestion: '1998', libro: 'Libro Tomo II', foja: 'Foja 88', estado: 'Verificado' },
  { id: '3', nroTitulo: 'TIT-77312', nroDiploma: 'DIP-77312', nombreCompleto: 'MARIA S. ARISPE LLANOS', cui: '4589214-SCZ', carrera: 'IngenierÃ­a en Sistemas', facultad: 'PolitÃ©cnica / TecnologÃ­a', gestion: '2001', libro: 'Libro Tomo III', foja: 'Foja 204', estado: 'Verificado' },
  { id: '4', nroTitulo: 'TIT-66219', nroDiploma: 'DIP-66219', nombreCompleto: 'CARLOS ALBERTO ROCA SOLIZ', cui: '3982104-SCZ', carrera: 'AuditorÃ­a Financiera', facultad: 'Ciencias EconÃ³micas y Financieras', gestion: '2005', libro: 'Libro Tomo IV', foja: 'Foja 51', estado: 'En ValidaciÃ³n' },
  { id: '5', nroTitulo: 'TIT-55104', nroDiploma: 'DIP-55104', nombreCompleto: 'PATRICIA AGUILAR VARGAS', cui: '5192039-SCZ', carrera: 'OdontologÃ­a', facultad: 'Ciencias de la Salud Humana', gestion: '2010', libro: 'Libro Tomo V', foja: 'Foja 119', estado: 'Verificado' },
];

export function BusquedaInformixPage() {
  const navigate = useNavigate();
  const [criterioSearch, setCriterioSearch] = useState<'NUM_TITULO' | 'CUI' | 'NOMBRE'>('NUM_TITULO');
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [modalRegistro, setModalRegistro] = useState<RegistroInformix | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const registrosFiltrados = REGISTROS_MOCK.filter(r => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    if (criterioSearch === 'NUM_TITULO') {
      return r.nroTitulo.toLowerCase().includes(q) || r.nroDiploma.toLowerCase().includes(q);
    }
    if (criterioSearch === 'CUI') {
      return r.cui.toLowerCase().includes(q);
    }
    return r.nombreCompleto.toLowerCase().includes(q);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-7xl mx-auto font-sans"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#191A7D] to-[#2B6CB0] text-[#E5A823] rounded-2xl shadow-md">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#191A7D] border border-blue-200">
                TÃ­tulos y Grados â€¢ OpciÃ³n 2
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              BÃºsqueda de Registros mediante Informix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Consulte expedientes de tÃ­tulos por NÃºmero de TÃ­tulo, CUI / C.I. o Nombre Completo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-[#191A7D] text-xs font-bold rounded-xl border border-blue-200">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Informix DB Server Online</span>
        </div>
      </div>

      {/* PANEL DE BÃšSQUEDA MEDIANTE INFORMIX */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#191A7D]" />
              Seleccione Criterio de BÃºsqueda:
            </label>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
              <Button type="button" variant={criterioSearch === "NUM_TITULO" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setCriterioSearch("NUM_TITULO")}><FileText className="w-3.5 h-3.5 inline mr-1.5" />
                NÃºmero de TÃ­tulo</Button>

              <Button type="button" variant={criterioSearch === "CUI" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setCriterioSearch("CUI")}><CreditCard className="w-3.5 h-3.5 inline mr-1.5" />
                CUI / C.I.</Button>

              <Button type="button" variant={criterioSearch === "NOMBRE" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setCriterioSearch("NOMBRE")}><User className="w-3.5 h-3.5 inline mr-1.5" />
                Nombre Completo</Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  criterioSearch === 'NUM_TITULO'
                    ? 'Ingrese NÃºmero de TÃ­tulo o Diploma (Ej. TIT-96071, 88421)'
                    : criterioSearch === 'CUI'
                    ? 'Ingrese CUI / C.I. (Ej. 8072900-SCZ, )'
                    : 'Ingrese Nombre Completo del Titular (Ej. Gualberto Medina)'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
              />
            </div>

            <Button type="submit" variant="primary" className="gap-2 shrink-0">
              <Search className="w-4 h-4" />
              <span>Consultar Informix</span>
            </Button>
          </div>
        </form>
      </div>

      {/* RESULTADOS DE LA BÃšSQUEDA INFORMIX */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[#191A7D]" />
              Resultados de la Base de Datos Informix ({registrosFiltrados.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Registros consolidados en el servidor Informix UAGRM.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nro. TÃ­tulo / Diploma</th>
                <th className="py-3.5 px-4">Titular / Graduado</th>
                <th className="py-3.5 px-4">CUI / C.I.</th>
                <th className="py-3.5 px-4">Carrera / Programa</th>
                <th className="py-3.5 px-4">GestiÃ³n</th>
                <th className="py-3.5 px-4">Libro / Foja</th>
                <th className="py-3.5 px-4 text-center">Estado Informix</th>
                <th className="py-3.5 px-4 text-right">AcciÃ³n</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {registrosFiltrados.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#191A7D]">{r.nroTitulo}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 uppercase">{r.nombreCompleto}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">{r.cui}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{r.carrera}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{r.gestion}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <span className="text-[#191A7D] font-bold">{r.libro}</span> / {r.foja}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      r.estado === 'Verificado'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {r.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="primary" size="sm" onClick={() => setModalRegistro(r)} className="gap-1.5 h-7 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Registro</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE DE REGISTRO INFORMIX */}
      {modalRegistro && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Ficha de Registro Informix #{modalRegistro.nroTitulo}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setModalRegistro(null)} className="h-7 w-7 p-0"><X className="w-5 h-5" /></Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1.5 font-mono">
                <p><span className="font-bold text-slate-700 font-sans">Titular:</span> {modalRegistro.nombreCompleto}</p>
                <p><span className="font-bold text-slate-700 font-sans">CUI / C.I.:</span> {modalRegistro.cui}</p>
                <p><span className="font-bold text-slate-700 font-sans">Carrera:</span> {modalRegistro.carrera}</p>
                <p><span className="font-bold text-slate-700 font-sans">Facultad:</span> {modalRegistro.facultad}</p>
                <p><span className="font-bold text-slate-700 font-sans">GestiÃ³n EmisiÃ³n:</span> {modalRegistro.gestion}</p>
                <p><span className="font-bold text-slate-700 font-sans">CatalogaciÃ³n:</span> {modalRegistro.libro} - {modalRegistro.foja}</p>
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="primary" className="flex-1 gap-1.5" onClick={() => { setModalRegistro(null); navigate("/titulos/visor-expediente"); }}>
                  <span>Ver Expediente Digital</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}


