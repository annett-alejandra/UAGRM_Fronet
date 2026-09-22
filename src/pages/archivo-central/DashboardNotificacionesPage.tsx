import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SolicitudDerivada {
  id: string;
  codigoTramite: string;
  solicitanteNombre: string;
  ci: string;
  unidadOrigen: string;
  unidadDestino: string;
  tipoTramite: string;
  fechaDerivacion: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'DERIVADO_SECRETARIA' | 'COMPLETADO';
}

export function DashboardNotificacionesPage() {
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'PENDIENTE' | 'DERIVADO'>('TODOS');

  // Datos de prueba en blanco
  const [solicitudes] = useState<SolicitudDerivada[]>([
    { id: '1', codigoTramite: 'TR-88421', solicitanteNombre: 'JENNY FLORES PEÑA', ci: '3250858-SCZ', unidadOrigen: 'Unidad de Títulos y Grados', unidadDestino: 'Archivo Central', tipoTramite: 'Certificación de Autenticidad', fechaDerivacion: '14/09/2026 08:30 AM', estado: 'PENDIENTE' },
    { id: '2', codigoTramite: 'TR-88422', solicitanteNombre: 'GUALBERTO MEDINA VARGAS', ci: '8072900-SCZ', unidadOrigen: 'Unidad de Títulos y Grados', unidadDestino: 'Archivo Central', tipoTramite: 'Título Supletorio Médico Cirujano', fechaDerivacion: '14/09/2026 09:15 AM', estado: 'PENDIENTE' },
    { id: '3', codigoTramite: 'TR-88420', solicitanteNombre: 'MARIA S. ARISPE LLANOS', ci: '4589214-SCZ', unidadOrigen: 'Archivo Central', unidadDestino: 'Despacho Secretaría General', tipoTramite: 'Dictamen de Autenticidad Histórica 2001', fechaDerivacion: '13/09/2026 16:45 PM', estado: 'DERIVADO_SECRETARIA' },
    { id: '4', codigoTramite: 'TR-88419', solicitanteNombre: 'LILIANA I. NAVARRO PAZ', ci: '3892102-SCZ', unidadOrigen: 'Archivo Central', unidadDestino: 'Asesoría Legal UAGRM', tipoTramite: 'Revisión Testimonio Notarial Supletorio', fechaDerivacion: '13/09/2026 14:20 PM', estado: 'DERIVADO_SECRETARIA' },
    { id: '5', codigoTramite: 'TR-88415', solicitanteNombre: 'HERIBERTO ORELLANA VILLANUEVA', ci: '2981044-CB', unidadOrigen: 'Unidad de Títulos y Grados', unidadDestino: 'Archivo Central', tipoTramite: 'Copia Legalizada Foja OCR', fechaDerivacion: '12/09/2026 11:00 AM', estado: 'COMPLETADO' }
  ]);

  const solicitudesFiltradas = solicitudes.filter(s => {
    if (filtroEstado === 'PENDIENTE') return s.estado === 'PENDIENTE';
    if (filtroEstado === 'DERIVADO') return s.estado === 'DERIVADO_SECRETARIA';
    return true;
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto bg-white min-h-screen">
      {/* BANNER BLANCO LIMPIO (OPCIÓN 7) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center font-bold border border-blue-200 shrink-0">
            <span className="material-symbols-outlined text-2xl">dashboard</span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-bold uppercase tracking-wider mb-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Opción 7 · Dashboard Executivo & Notificaciones
            </div>
            <h2 className="text-xl font-extrabold text-[#003366] tracking-tight">
              Bandeja de Entrada, Notificaciones & Derivaciones
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control centralizado de solicitudes derivadas por la Unidad de Títulos y transferencias enviadas a otras unidades.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/archivo/triaje')}
            className="px-4 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-sm">move_to_inbox</span>
            Ir a Triaje Documental
          </button>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS EJECUTIVAS EN FONDO BLANCO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Solicitudes Entrantes</span>
            <span className="material-symbols-outlined text-blue-600">inbox</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#003366]">12</span>
            <span className="text-[10px] text-slate-500 font-medium">Derivadas de Títulos</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pendientes de Revisión</span>
            <span className="material-symbols-outlined text-amber-600">hourglass_empty</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-amber-600">5</span>
            <span className="text-[10px] text-amber-700 font-medium">Requieren firma / foja</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Derivados a Secretaría</span>
            <span className="material-symbols-outlined text-purple-600">send</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-purple-700">8</span>
            <span className="text-[10px] text-slate-500 font-medium">En revisión de firma</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Completados Hoy</span>
            <span className="material-symbols-outlined text-emerald-600">task_alt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-emerald-600">18</span>
            <span className="text-[10px] text-emerald-700 font-medium">Informes certificados</span>
          </div>
        </div>
      </div>

      {/* BANDEJA DE SOLICITUDES Y DERIVACIONES (TABLA EN FONDO BLANCO) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h3 className="text-sm font-extrabold text-[#003366] flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">list_alt</span>
              Bandeja de Entrada de Solicitudes y Derivaciones Entre Unidades
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtre las solicitudes recibidas o enviadas hacia Secretaría General o Asesoría Legal.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFiltroEstado('TODOS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filtroEstado === 'TODOS' ? 'bg-white text-[#003366] shadow-sm font-extrabold' : 'text-slate-600'
              }`}
            >
              Todas (5)
            </button>
            <button
              onClick={() => setFiltroEstado('PENDIENTE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filtroEstado === 'PENDIENTE' ? 'bg-white text-amber-700 shadow-sm font-extrabold' : 'text-slate-600'
              }`}
            >
              Pendientes (2)
            </button>
            <button
              onClick={() => setFiltroEstado('DERIVADO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filtroEstado === 'DERIVADO' ? 'bg-white text-purple-700 shadow-sm font-extrabold' : 'text-slate-600'
              }`}
            >
              Derivadas (2)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Código Trámite</th>
                <th className="p-3.5">Solicitante / Titular</th>
                <th className="p-3.5">C.I.</th>
                <th className="p-3.5">Unidad Origen ➔ Destino</th>
                <th className="p-3.5">Tipo de Trámite</th>
                <th className="p-3.5">Fecha Derivación</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {solicitudesFiltradas.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#003366]">{s.codigoTramite}</td>
                  <td className="p-3.5 font-bold text-slate-800 uppercase">{s.solicitanteNombre}</td>
                  <td className="p-3.5 font-mono text-slate-600">{s.ci}</td>
                  <td className="p-3.5 font-medium text-slate-700">
                    <span className="text-slate-500">{s.unidadOrigen}</span>
                    <span className="mx-1.5 text-blue-600 font-bold">➔</span>
                    <strong className="text-[#003366]">{s.unidadDestino}</strong>
                  </td>
                  <td className="p-3.5 text-slate-700 font-medium">{s.tipoTramite}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{s.fechaDerivacion}</td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      s.estado === 'PENDIENTE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : s.estado === 'DERIVADO_SECRETARIA'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {s.estado === 'PENDIENTE' ? 'Pendiente' : s.estado === 'DERIVADO_SECRETARIA' ? 'Derivado a Secretaría' : 'Completado'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => navigate('/archivo/triaje')}
                      className="px-3 py-1.5 bg-[#003366] text-white hover:bg-[#002244] font-bold rounded-lg text-xs transition-all shadow-xs"
                    >
                      Atender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
