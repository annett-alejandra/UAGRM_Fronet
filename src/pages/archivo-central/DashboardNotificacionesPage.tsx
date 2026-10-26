import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Inbox,
  Hourglass,
  Send,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  ListOrdered,
  ChevronRight,
  Bell,
  Globe,
  Building2,
  FileCheck,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

interface SolicitudCentral {
  id: string;
  codigoTramite: string;
  solicitanteNombre: string;
  ci: string;
  origen: 'REGISTRO_WEB' | 'ENTIDAD_PUBLICA' | 'PRESENCIAL';
  tipoTramite: string;
  fechaRegistro: string;
  estado: 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO';
}

export function DashboardNotificacionesPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO'>('TODOS');
  const [filtroOrigen, setFiltroOrigen] = useState<'TODOS' | 'REGISTRO_WEB' | 'ENTIDAD_PUBLICA'>('TODOS');
  const [query, setQuery] = useState('');
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const [solicitudes] = useState<SolicitudCentral[]>([
    { id: '1', codigoTramite: 'ARC-2026-001', solicitanteNombre: 'GUALBERTO MEDINA VARGAS', ci: '8072900-SCZ', origen: 'REGISTRO_WEB', tipoTramite: 'BÃºsqueda Folio Tomo 1995', fechaRegistro: '24/09/2026 08:30 AM', estado: 'PENDIENTE' },
    { id: '2', codigoTramite: 'ARC-2026-002', solicitanteNombre: 'DRA. ', ci: '', origen: 'ENTIDAD_PUBLICA', tipoTramite: 'Informe Autenticidad TÃ­tulo MÃ©dico', fechaRegistro: '24/09/2026 09:15 AM', estado: 'PENDIENTE' },
    { id: '3', codigoTramite: 'ARC-2026-003', solicitanteNombre: 'ING. MARISOL ROCA TERRAZAS', ci: '4589214-SCZ', origen: 'REGISTRO_WEB', tipoTramite: 'DigitalizaciÃ³n OCR Expediente 2001', fechaRegistro: '23/09/2026 14:10 PM', estado: 'EN_REVISION' },
    { id: '4', codigoTramite: 'ARC-2026-004', solicitanteNombre: 'MINISTERIO DE SALUD - LOTE #4', ci: 'VARARIOS (15 PER)', origen: 'ENTIDAD_PUBLICA', tipoTramite: 'VerificaciÃ³n por Lote de Convenio', fechaRegistro: '23/09/2026 11:20 AM', estado: 'EN_REVISION' },
    { id: '5', codigoTramite: 'ARC-2026-005', solicitanteNombre: 'CARLOS ALBERTO AGUILAR', ci: '1928301-SCZ', origen: 'REGISTRO_WEB', tipoTramite: 'Certificado de Autenticidad Folio', fechaRegistro: '22/09/2026 16:45 PM', estado: 'COMPLETADO' },
  ]);

  const solicitudesFiltradas = solicitudes.filter(s => {
    const matchEstado = filtroEstado === 'TODOS' || s.estado === filtroEstado;
    const matchOrigen = filtroOrigen === 'TODOS' || s.origen === filtroOrigen;
    const matchQuery = s.solicitanteNombre.toLowerCase().includes(query.toLowerCase()) || s.codigoTramite.toLowerCase().includes(query.toLowerCase()) || s.ci.toLowerCase().includes(query.toLowerCase());
    return matchEstado && matchOrigen && matchQuery;
  });

  const totalPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE').length;
  const totalRevision = solicitudes.filter(s => s.estado === 'EN_REVISION').length;
  const totalCompletados = solicitudes.filter(s => s.estado === 'COMPLETADO').length;

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
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Archivo Central â€¢ MÃ³dulo 01
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Dashboard de Notificaciones & Control de Solicitudes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Haga clic en las tarjetas superiores para filtrar dinÃ¡micamente el estado de atenciÃ³n.
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={() => setShowNotificationDrawer(!showNotificationDrawer)} className="relative p-3 h-auto" title="Notificaciones">
          <Bell className="w-5 h-5 text-[#191A7D]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D31338] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            3
          </span>
        </Button>
      </div>

      {/* DRAWER DE NOTIFICACIONES ACTIVAS */}
      {showNotificationDrawer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-sm"
        >
          <div className="flex justify-between items-center border-b border-amber-200/60 pb-2">
            <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              Notificaciones Pendientes de Archivo Central
            </h4>
            <Button variant="ghost" size="sm" onClick={() => setShowNotificationDrawer(false)} className="text-xs text-amber-800 font-bold h-auto p-1">Cerrar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-[#191A7D]">Lote Entidades PÃºblicas:</span>
              <p className="text-slate-600 mt-1">15 carpetas adjuntas para revisiÃ³n de convenio del Min. Salud.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-indigo-700">DigitalizaciÃ³n HistÃ³rica:</span>
              <p className="text-slate-600 mt-1">Tomo III - AÃ±o 2002 listo para indexar folios pendientes.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
              <span className="font-bold text-emerald-700">Solicitud Web Recibida:</span>
              <p className="text-slate-600 mt-1">Certificado de Autenticidad abonado por QR Gaby (Bs. 30).</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TARJETAS KPI DINÃMICAS E INTERACTIVAS (CLICK PARA FILTRAR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroEstado('TODOS')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroEstado === 'TODOS' ? 'bg-blue-50/90 border-[#191A7D] ring-2 ring-[#191A7D]/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-[#191A7D] absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#191A7D]">Total Solicitudes</span>
            <div className="p-2 bg-blue-100 text-[#191A7D] rounded-xl group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#191A7D]">{solicitudes.length}</span>
            <span className="text-xs text-slate-500 font-medium">Registros totales</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroEstado('PENDIENTE')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroEstado === 'PENDIENTE' ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">Pendientes</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-110 transition-transform">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-amber-600">{totalPendientes}</span>
            <span className="text-xs text-amber-700 font-medium">Por procesar</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroEstado('EN_REVISION')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroEstado === 'EN_REVISION' ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-indigo-600 absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">En RevisiÃ³n</span>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl group-hover:scale-110 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-indigo-700">{totalRevision}</span>
            <span className="text-xs text-indigo-700 font-medium">Con cotejo OCR</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroEstado('COMPLETADO')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroEstado === 'COMPLETADO' ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-emerald-600 absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">Completados</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">{totalCompletados}</span>
            <span className="text-xs text-emerald-700 font-medium">Derivados a TÃ­tulos</span>
          </div>
        </motion.div>

      </div>

      {/* TABLA Y BUSCADOR DINÃMICO */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <ListOrdered className="w-5 h-5 text-[#191A7D]" />
              Bandeja de Entrada de Solicitudes Recibidas ({solicitudesFiltradas.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Filtrado activo: <span className="font-bold text-[#191A7D]">{filtroEstado}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar solicitante o C.I..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
              <Button variant={filtroOrigen === "TODOS" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setFiltroOrigen("TODOS")}>Todas</Button>
              <Button variant={filtroOrigen === "REGISTRO_WEB" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setFiltroOrigen("REGISTRO_WEB")}>Web</Button>
              <Button variant={filtroOrigen === "ENTIDAD_PUBLICA" ? "primary" : "ghost"} size="sm" className="h-7 text-xs" onClick={() => setFiltroOrigen("ENTIDAD_PUBLICA")}>Entidades</Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">CÃ³digo TrÃ¡mite</th>
                <th className="py-3.5 px-4">Solicitante / Titular</th>
                <th className="py-3.5 px-4">C.I. / CUI</th>
                <th className="py-3.5 px-4">Origen</th>
                <th className="py-3.5 px-4">Tipo TrÃ¡mite</th>
                <th className="py-3.5 px-4">Fecha Registro</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">AcciÃ³n</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {solicitudesFiltradas.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#191A7D]">{s.codigoTramite}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 uppercase">{s.solicitanteNombre}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.ci}</td>
                  <td className="py-3.5 px-4">
                    {s.origen === 'REGISTRO_WEB' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Globe className="w-3 h-3" /> Web
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Building2 className="w-3 h-3" /> Entidad PÃºblica
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{s.tipoTramite}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{s.fechaRegistro}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.estado === 'PENDIENTE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : s.estado === 'EN_REVISION'
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="primary" size="sm" className="gap-1 h-7 text-xs" onClick={() => navigate("/archivo/triaje")}>
                      <span>Procesar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}


