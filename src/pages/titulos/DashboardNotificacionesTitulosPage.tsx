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
  Filter,
  Eye,
  X
} from 'lucide-react';

interface SolicitudTitulos {
  id: string;
  codigoTramite: string;
  solicitanteNombre: string;
  ci: string;
  origen: 'ARCHIVO_CENTRAL' | 'WEB_UAGRM';
  tipoTramite: string;
  fechaDerivacion: string;
  estado: 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO';
}

export function DashboardNotificacionesTitulosPage() {
  const navigate = useNavigate();
  const [filtroOrigen, setFiltroOrigen] = useState<'TODOS' | 'ARCHIVO_CENTRAL' | 'WEB_UAGRM'>('TODOS');
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO'>('TODOS');
  const [query, setQuery] = useState('');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [modalSolicitud, setModalSolicitud] = useState<SolicitudTitulos | null>(null);

  const [solicitudes] = useState<SolicitudTitulos[]>([
    { id: '1', codigoTramite: 'TR-99012', solicitanteNombre: 'GUALBERTO MEDINA VARGAS', ci: '8072900-SCZ', origen: 'ARCHIVO_CENTRAL', tipoTramite: 'Título Supletorio Médico Cirujano', fechaDerivacion: '24/09/2026 08:30 AM', estado: 'PENDIENTE' },
    { id: '2', codigoTramite: 'TR-99013', solicitanteNombre: 'JENNY FLORES PEÑA', ci: '3250858-SCZ', origen: 'WEB_UAGRM', tipoTramite: 'Certificación de Autenticidad de Grado', fechaDerivacion: '24/09/2026 09:10 AM', estado: 'PENDIENTE' },
    { id: '3', codigoTramite: 'TR-99010', solicitanteNombre: 'MARIA S. ARISPE LLANOS', ci: '4589214-SCZ', origen: 'ARCHIVO_CENTRAL', tipoTramite: 'Dictamen de Autenticidad Histórica 2001', fechaDerivacion: '23/09/2026 16:45 PM', estado: 'EN_REVISION' },
    { id: '4', codigoTramite: 'TR-99009', solicitanteNombre: 'CARLOS ALBERTO ROCA SOLIZ', ci: '3982104-SCZ', origen: 'WEB_UAGRM', tipoTramite: 'Segunda Copia de Diploma de Licenciatura', fechaDerivacion: '23/09/2026 14:20 PM', estado: 'EN_REVISION' },
    { id: '5', codigoTramite: 'TR-99008', solicitanteNombre: 'PATRICIA AGUILAR VARGAS', ci: '5192039-SCZ', origen: 'ARCHIVO_CENTRAL', tipoTramite: 'Título Supletorio en Lic. en Derecho', fechaDerivacion: '22/09/2026 11:15 AM', estado: 'COMPLETADO' },
  ]);

  const solicitudesFiltradas = solicitudes.filter(s => {
    const matchOrigen = filtroOrigen === 'TODOS' || s.origen === filtroOrigen;
    const matchEstado = filtroEstado === 'TODOS' || s.estado === filtroEstado;
    const matchQuery = s.solicitanteNombre.toLowerCase().includes(query.toLowerCase()) ||
                       s.codigoTramite.toLowerCase().includes(query.toLowerCase()) ||
                       s.ci.toLowerCase().includes(query.toLowerCase());
    return matchOrigen && matchEstado && matchQuery;
  });

  const totalArchivo = solicitudes.filter(s => s.origen === 'ARCHIVO_CENTRAL').length;
  const totalWeb = solicitudes.filter(s => s.origen === 'WEB_UAGRM').length;
  const totalPendientes = solicitudes.filter(s => s.estado === 'PENDIENTE').length;

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
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                Títulos y Grados • Opción 1
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Dashboard de Notificaciones & Derivaciones
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Haga clic en las tarjetas para filtrar por origen o revisar notificaciones activas.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNotificationPanel(!showNotificationPanel)}
          className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer border border-slate-200"
          title="Ver Alertas de Títulos"
        >
          <Bell className="w-5 h-5 text-[#003366]" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C51D24] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            3
          </span>
        </button>
      </div>

      {/* DRAWER DE ALERTAS & AVISOS */}
      {showNotificationPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50/90 border border-blue-200 rounded-2xl p-5 space-y-3 shadow-sm"
        >
          <div className="flex justify-between items-center border-b border-blue-200/60 pb-2">
            <h4 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-700" />
              Notificaciones del Departamento de Títulos y Grados
            </h4>
            <button onClick={() => setShowNotificationPanel(false)} className="text-xs text-[#003366] font-bold hover:underline cursor-pointer">
              Cerrar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
              <span className="font-bold text-[#003366]">Derivación de Archivo Central:</span>
              <p className="text-slate-600 mt-1">Nuevos 3 expedientes con informe de autenticidad aprobado.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
              <span className="font-bold text-emerald-700">Solicitud Web Institucional:</span>
              <p className="text-slate-600 mt-1">2 solicitudes individuales pagadas por QR Gaby listas para plantilla.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-2xs">
              <span className="font-bold text-amber-700">Aviso de Firma Digital:</span>
              <p className="text-slate-600 mt-1">Secretaría General aprobó el dictamen #TR-99008 para emisión.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TARJETAS KPI DINÁMICAS (AL HACER CLIC FILTRAN LA TABLA ABAJO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => { setFiltroOrigen('TODOS'); setFiltroEstado('TODOS'); }}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroOrigen === 'TODOS' && filtroEstado === 'TODOS' ? 'bg-blue-50/90 border-[#003366] ring-2 ring-[#003366]/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-[#003366] absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#003366]">Solicitudes Recibidas</span>
            <div className="p-2 bg-blue-100 text-[#003366] rounded-xl group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-[#003366]">{solicitudes.length}</span>
            <span className="text-xs text-slate-500 font-medium">Bandeja general</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroOrigen('ARCHIVO_CENTRAL')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroOrigen === 'ARCHIVO_CENTRAL' ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-indigo-600 absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">De Archivo Central</span>
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-indigo-700">{totalArchivo}</span>
            <span className="text-xs text-indigo-700 font-medium">Con expediente OCR</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3 }}
          onClick={() => setFiltroOrigen('WEB_UAGRM')}
          className={`p-5 rounded-2xl border shadow-xs transition-all cursor-pointer relative overflow-hidden group ${
            filtroOrigen === 'WEB_UAGRM' ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20' : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="w-1.5 h-full bg-emerald-600 absolute left-0 top-0 rounded-l-2xl" />
          <div className="flex justify-between items-center text-slate-500 pl-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">De Página Web</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pl-1 mt-3">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">{totalWeb}</span>
            <span className="text-xs text-emerald-700 font-medium">Trámites en línea</span>
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
            <span className="text-xs text-amber-700 font-medium">Alertas activas</span>
          </div>
        </motion.div>

      </div>

      {/* TABLA DINÁMICA DE TRÁMITES Y SOLICITUDES */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <ListOrdered className="w-5 h-5 text-[#003366]" />
              Bandeja de Entradas de Títulos ({solicitudesFiltradas.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Origen: <span className="font-bold text-[#003366]">{filtroOrigen}</span> • Estado: <span className="font-bold text-indigo-700">{filtroEstado}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por solicitante, CUI..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
              <button
                onClick={() => setFiltroOrigen('TODOS')}
                className={`px-3 py-1 rounded-lg text-xs cursor-pointer ${filtroOrigen === 'TODOS' ? 'bg-white text-[#003366] font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Todas ({solicitudes.length})
              </button>
              <button
                onClick={() => setFiltroOrigen('ARCHIVO_CENTRAL')}
                className={`px-3 py-1 rounded-lg text-xs cursor-pointer ${filtroOrigen === 'ARCHIVO_CENTRAL' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Archivo ({totalArchivo})
              </button>
              <button
                onClick={() => setFiltroOrigen('WEB_UAGRM')}
                className={`px-3 py-1 rounded-lg text-xs cursor-pointer ${filtroOrigen === 'WEB_UAGRM' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Web ({totalWeb})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Código Trámite</th>
                <th className="py-3.5 px-4">Solicitante / Titular</th>
                <th className="py-3.5 px-4">C.I. / CUI</th>
                <th className="py-3.5 px-4">Origen Derivación</th>
                <th className="py-3.5 px-4">Tipo Trámite</th>
                <th className="py-3.5 px-4">Fecha Derivación</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {solicitudesFiltradas.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#003366]">{s.codigoTramite}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 uppercase">{s.solicitanteNombre}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">{s.ci}</td>
                  <td className="py-3.5 px-4">
                    {s.origen === 'ARCHIVO_CENTRAL' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Building2 className="w-3 h-3" /> Archivo Central
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Globe className="w-3 h-3" /> Página Web
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{s.tipoTramite}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{s.fechaDerivacion}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      s.estado === 'PENDIENTE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : s.estado === 'EN_REVISION'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setModalSolicitud(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-lg text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Atender</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETALLE DE SOLICITUD */}
      {modalSolicitud && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Atención de Solicitud #{modalSolicitud.codigoTramite}
              </h3>
              <button onClick={() => setModalSolicitud(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p><span className="font-bold text-slate-700">Solicitante:</span> {modalSolicitud.solicitanteNombre}</p>
                <p><span className="font-bold text-slate-700">CUI / C.I.:</span> {modalSolicitud.ci}</p>
                <p><span className="font-bold text-slate-700">Trámite:</span> {modalSolicitud.tipoTramite}</p>
                <p><span className="font-bold text-slate-700">Origen:</span> {modalSolicitud.origen}</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setModalSolicitud(null);
                    navigate('/titulos/visor-expediente');
                  }}
                  className="flex-1 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Abrir en Visor Digital</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setModalSolicitud(null);
                    navigate('/titulos/emision-plantillas');
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ir a Emisión de Plantilla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
