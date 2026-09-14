import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RequisitoTriaje {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  verificado: boolean;
  obligatorio: boolean;
  documentoUrl?: string;
}

export interface SolicitudPendiente {
  id: string;
  codigoTramite: string;
  solicitanteNombre: string;
  solicitanteCi: string;
  telefono: string;
  tramiteTipo: 'Título Supletorio' | 'Certificación de Autenticidad' | 'Reconstrucción de Legajo';
  fechaIngreso: string;
  nroReciboPago: string;
  montoPago: string;
  estadoTriaje: 'Completo' | 'Pendiente' | 'Observado';
  requisitos: RequisitoTriaje[];
}

const INITIAL_PENDIENTES: SolicitudPendiente[] = [
  {
    id: 'SOL-2026-001',
    codigoTramite: 'TR-88421',
    solicitanteNombre: 'JENNY FLORES PEÑA',
    solicitanteCi: '3250858-SCZ',
    telefono: '77348912',
    tramiteTipo: 'Certificación de Autenticidad',
    fechaIngreso: '14/09/2026 08:30 AM',
    nroReciboPago: 'REC-994812',
    montoPago: 'Bs. 150.00',
    estadoTriaje: 'Completo',
    requisitos: [
      {
        id: 'req-1',
        nombre: '3 Copias de Cédula de Identidad',
        descripcion: 'Verificación física de 3 fotocopias legibles del C.I.',
        icono: 'badge',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal firmada justificando la emisión',
        icono: 'mail',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 150 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Imagen digitalizada a 300 DPI ambos lados',
        icono: 'workspace_premium',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente del titular o apoderado',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true
      }
    ]
  },
  {
    id: 'SOL-2026-002',
    codigoTramite: 'TR-88422',
    solicitanteNombre: 'GUALBERTO MEDINA VARGAS',
    solicitanteCi: '8072900-SCZ',
    telefono: '76012345',
    tramiteTipo: 'Título Supletorio',
    fechaIngreso: '14/09/2026 09:15 AM',
    nroReciboPago: 'REC-994815',
    montoPago: 'Bs. 250.00',
    estadoTriaje: 'Pendiente',
    requisitos: [
      {
        id: 'req-1',
        nombre: '3 Copias de Cédula de Identidad',
        descripcion: 'Verificación física de 3 fotocopias legibles del C.I.',
        icono: 'badge',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal firmada justificando la emisión',
        icono: 'mail',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 250 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Falta escaneo del reverso con sellos institucionales',
        icono: 'workspace_premium',
        verificado: false,
        obligatorio: true
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente del titular o apoderado',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true
      }
    ]
  },
  {
    id: 'SOL-2026-003',
    codigoTramite: 'TR-88423',
    solicitanteNombre: 'MARIA SUAREZ ROJAS',
    solicitanteCi: '4510293-CB',
    telefono: '71098765',
    tramiteTipo: 'Reconstrucción de Legajo',
    fechaIngreso: '14/09/2026 10:00 AM',
    nroReciboPago: 'REC-994820',
    montoPago: 'Bs. 180.00',
    estadoTriaje: 'Observado',
    requisitos: [
      {
        id: 'req-1',
        nombre: '3 Copias de Cédula de Identidad',
        descripcion: 'Faltan 2 copias de C.I. (Solo entregó 1 copia)',
        icono: 'badge',
        verificado: false,
        obligatorio: true
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal sin firma de apoderado',
        icono: 'mail',
        verificado: false,
        obligatorio: true
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 180 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Imagen digitalizada legibles ambos lados',
        icono: 'workspace_premium',
        verificado: true,
        obligatorio: true
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true
      }
    ]
  }
];

export function BandejaPendientesPage() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState<SolicitudPendiente[]>(INITIAL_PENDIENTES);
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Completo' | 'Pendiente' | 'Observado'>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudPendiente | null>(INITIAL_PENDIENTES[0]);

  const handleToggleRequisito = (solicitudId: string, reqId: string) => {
    setSolicitudes(prev => prev.map(sol => {
      if (sol.id !== solicitudId) return sol;
      
      const nuevosReqs = sol.requisitos.map(r => r.id === reqId ? { ...r, verificado: !r.verificado } : r);
      const todosCumplidos = nuevosReqs.every(r => r.verificado);
      const algunoFalta = nuevosReqs.some(r => !r.verificado);

      let nuevoEstado: 'Completo' | 'Pendiente' | 'Observado' = 'Pendiente';
      if (todosCumplidos) nuevoEstado = 'Completo';
      else if (algunoFalta) nuevoEstado = 'Pendiente';

      const actualizada = { ...sol, requisitos: nuevosReqs, estadoTriaje: nuevoEstado };
      if (selectedSolicitud?.id === solicitudId) {
        setSelectedSolicitud(actualizada);
      }
      return actualizada;
    }));
  };

  const filteredSolicitudes = solicitudes.filter(sol => {
    const matchEstado = filtroEstado === 'Todos' || sol.estadoTriaje === filtroEstado;
    const matchSearch = !busqueda || 
      sol.solicitanteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.solicitanteCi.toLowerCase().includes(busqueda.toLowerCase()) ||
      sol.codigoTramite.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchSearch;
  });

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-28">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C51D24] mb-1">
            <span className="material-symbols-outlined text-sm">checklist</span>
            Módulo de Archivo Central • Triaje de Recepción
          </div>
          <h1 className="text-2xl font-extrabold text-[#003366] tracking-tight font-heading">
            Bandeja de Pendientes & Triaje de Requisitos Documentales
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Verificación obligatoria de requisitos físicos y digitales (3 Copias C.I., Carta al Rector, Pago de Valores y Escáner de Título).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-blue-50 text-[#003366] text-xs font-extrabold rounded-full border border-blue-200">
            Pendientes en Cola: {solicitudes.filter(s => s.estadoTriaje !== 'Completo').length}
          </span>
        </div>
      </div>

      {/* Contenedor Principal: Lista de Solicitudes + Panel de Triaje */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMNA IZQUIERDA: LISTA DE SOLICITUDES (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filtros y Buscador */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por Nombre, C.I. o Trámite..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">search</span>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {(['Todos', 'Pendiente', 'Completo', 'Observado'] as const).map((est) => (
                <button
                  key={est}
                  type="button"
                  onClick={() => setFiltroEstado(est)}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    filtroEstado === est
                      ? 'bg-[#003366] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas de Solicitudes */}
          <div className="space-y-3">
            {filteredSolicitudes.map((sol) => {
              const isSelected = selectedSolicitud?.id === sol.id;
              const reqsCumplidos = sol.requisitos.filter(r => r.verificado).length;
              const totalReqs = sol.requisitos.length;

              return (
                <div
                  key={sol.id}
                  onClick={() => setSelectedSolicitud(sol)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#003366] ring-2 ring-[#003366]/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {sol.codigoTramite} • {sol.fechaIngreso}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
                        {sol.solicitanteNombre}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        C.I. <strong className="font-mono text-slate-900">{sol.solicitanteCi}</strong>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                      sol.estadoTriaje === 'Completo' ? 'bg-emerald-100 text-emerald-800' :
                      sol.estadoTriaje === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {sol.estadoTriaje}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Requisitos: <strong className="text-[#003366] font-bold">{reqsCumplidos}/{totalReqs}</strong>
                    </span>

                    <span className="font-mono font-bold text-slate-700 text-[11px]">
                      Recibo: {sol.nroReciboPago}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE TRIAJE Y REQUISITOS (7 COLS) */}
        <div className="lg:col-span-7">
          {selectedSolicitud ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
              
              {/* Encabezado del Solicitante Seleccionado */}
              <div className="border-b border-slate-200 pb-4 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-[#003366] font-mono font-bold text-xs rounded-lg">
                      {selectedSolicitud.codigoTramite}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Ingreso: {selectedSolicitud.fechaIngreso}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#003366] mt-2 font-heading">
                    {selectedSolicitud.solicitanteNombre}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Trámite: <strong className="text-slate-900">{selectedSolicitud.tramiteTipo}</strong> | C.I. <strong className="font-mono">{selectedSolicitud.solicitanteCi}</strong> | Tel: {selectedSolicitud.telefono}
                  </p>
                </div>

                <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Pago de Valores</p>
                  <p className="font-mono font-extrabold text-sm text-[#003366]">{selectedSolicitud.nroReciboPago}</p>
                  <p className="text-xs font-bold text-emerald-700">{selectedSolicitud.montoPago} (Caja UAGRM)</p>
                </div>
              </div>

              {/* LISTA DE CHECKLIST DE REQUISITOS OBLIGATORIOS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#C51D24] text-base">fact_check</span>
                    Lista de Verificación de Requisitos Obligatorios
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    * Marque cada casilla tras auditar el documento físico/digital
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedSolicitud.requisitos.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => handleToggleRequisito(selectedSolicitud.id, req.id)}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 cursor-pointer select-none ${
                        req.verificado
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          req.verificado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {req.icono}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-slate-900">
                              {req.nombre}
                            </h4>
                            {req.obligatorio && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                                Obligatorio
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {req.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center shrink-0">
                        <input
                          type="checkbox"
                          checked={req.verificado}
                          onChange={() => {}} // Manejado por onClick del contenedor
                          className="w-5 h-5 text-[#003366] rounded-md focus:ring-[#003366] cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Acción de Triaje */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className={`w-3 h-3 rounded-full ${
                    selectedSolicitud.estadoTriaje === 'Completo' ? 'bg-emerald-500' :
                    selectedSolicitud.estadoTriaje === 'Pendiente' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></span>
                  <span>Estado de Triaje: <strong className="text-[#003366] font-bold">{selectedSolicitud.estadoTriaje}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert(`Solicitud ${selectedSolicitud.codigoTramite} observada y notificada.`)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Observar Trámite
                  </button>

                  <button
                    type="button"
                    disabled={selectedSolicitud.estadoTriaje !== 'Completo'}
                    onClick={() => navigate('/archivo/autenticidad')}
                    className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer ${
                      selectedSolicitud.estadoTriaje === 'Completo'
                        ? 'bg-[#003366] hover:bg-[#002244] text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">description</span>
                    Generar Informe (Tipo 1)
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200 space-y-2">
              <span className="material-symbols-outlined text-4xl">touch_app</span>
              <p className="text-sm font-bold">Seleccione una solicitud de la lista para verificar sus requisitos.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
