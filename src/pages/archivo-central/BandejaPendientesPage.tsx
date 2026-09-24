import { CheckCircle2, Clock, AlertTriangle, FileText, Search, Filter, Share2, Send, Eye, Download, Building2, Sparkles, ChevronRight, User, Calendar, DollarSign, Phone, Mail, FileCheck, ShieldCheck, Inbox, ListOrdered } from 'lucide-react';
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
  nombreArchivo: string;
  paginas?: number;
}

export interface SolicitudPendiente {
  id: string;
  codigoTramite: string;
  solicitanteNombre: string;
  solicitanteCi: string;
  telefono: string;
  email: string;
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
    email: 'jenny.flores@uagrm.edu.bo',
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
        obligatorio: true,
        nombreArchivo: 'CI_3250858_JENNY_FLORES_3COPIAS.pdf',
        paginas: 3
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal firmada justificando la emisión',
        icono: 'mail',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'CARTA_SOLICITUD_RECTOR_JENNY.pdf',
        paginas: 1
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 150 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'RECIBO_PAGO_CAJA_REC994812.pdf',
        paginas: 1
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Imagen digitalizada a 300 DPI ambos lados',
        icono: 'workspace_premium',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'TITULO_BACHILLER_014863_ANVERSO_REVERSO.pdf',
        paginas: 2
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente del titular o apoderado',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'CI_ORIGINAL_DIGITALIZADO.pdf',
        paginas: 2
      }
    ]
  },
  {
    id: 'SOL-2026-002',
    codigoTramite: 'TR-88422',
    solicitanteNombre: 'GUALBERTO MEDINA VARGAS',
    solicitanteCi: '8072900-SCZ',
    telefono: '76012345',
    email: 'gualberto.medina@gmail.com',
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
        obligatorio: true,
        nombreArchivo: 'CI_8072900_MEDINA.pdf',
        paginas: 3
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal firmada justificando la emisión',
        icono: 'mail',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'CARTA_RECTOR_MEDINA.pdf',
        paginas: 1
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 250 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'COMPROBANTE_CAJA_994815.pdf',
        paginas: 1
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Falta escaneo del reverso con sellos institucionales',
        icono: 'workspace_premium',
        verificado: false,
        obligatorio: true,
        nombreArchivo: 'TITULO_MEDICIÓNA_SOLO_ANVERSO.pdf',
        paginas: 1
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente del titular o apoderado',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'CI_MEDINA_HD.pdf',
        paginas: 2
      }
    ]
  },
  {
    id: 'SOL-2026-003',
    codigoTramite: 'TR-88423',
    solicitanteNombre: 'MARIA SUAREZ ROJAS',
    solicitanteCi: '4510293-CB',
    telefono: '71098765',
    email: 'maria.suarez@gmail.com',
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
        obligatorio: true,
        nombreArchivo: 'CI_SUAREZ_1COPIA.pdf',
        paginas: 1
      },
      {
        id: 'req-2',
        nombre: 'Carta Dirigida al Rector / Vicerrector',
        descripcion: 'Solicitud formal sin firma de apoderado',
        icono: 'mail',
        verificado: false,
        obligatorio: true,
        nombreArchivo: 'CARTA_SIN_FIRMA.pdf',
        paginas: 1
      },
      {
        id: 'req-3',
        nombre: 'Comprobante de Pago de Valores (Caja UAGRM)',
        descripcion: 'Depósito de Bs. 180 en caja central UAGRM',
        icono: 'receipt_long',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'PAGO_REC994820.pdf',
        paginas: 1
      },
      {
        id: 'req-4',
        nombre: 'Escaneado de Título Original (Anverso y Reverso)',
        descripcion: 'Imagen digitalizada legibles ambos lados',
        icono: 'workspace_premium',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'TITULO_DERECHO_ANVERSO_REVERSO.pdf',
        paginas: 2
      },
      {
        id: 'req-5',
        nombre: 'Cédula de Identidad Original Digitalizada',
        descripcion: 'Captura HD de C.I. vigente',
        icono: 'contact_page',
        verificado: true,
        obligatorio: true,
        nombreArchivo: 'CI_DIGITAL_SUAREZ.pdf',
        paginas: 2
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

  // Estados para Modal de Visor PDF y Compartir
  const [previewPdfReq, setPreviewPdfReq] = useState<RequisitoTriaje | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiadoExitosa, setCopiadoExitosa] = useState(false);

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

  const handleCopiarEnlace = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiadoExitosa(true);
    setTimeout(() => setCopiadoExitosa(false), 2000);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 bg-white/95 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C51D24] mb-1">
            <ListOrdered className="w-4 h-4 text-[#C51D24]" />
            Módulo de Archivo Central • Triaje de Recepción
          </div>
          <h1 className="text-2xl font-extrabold text-[#003366] tracking-tight font-heading">
            Bandeja de Pendientes & Triaje de Requisitos Documentales
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Verificación obligatoria de requisitos físicos y digitales con Visor PDF incorporado y Opciones de Compartir Expediente.
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
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 bg-white/95 backdrop-blur-sm space-y-3">
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

                {/* Acciones de Encabezado: Compartir & Pago */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#003366] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-200"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    Compartir
                  </button>

                  <div className="text-right bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Pago de Valores</p>
                    <p className="font-mono font-extrabold text-xs text-[#003366]">{selectedSolicitud.nroReciboPago}</p>
                    <p className="text-[11px] font-bold text-emerald-700">{selectedSolicitud.montoPago}</p>
                  </div>
                </div>
              </div>

              {/* LISTA DE CHECKLIST DE REQUISITOS OBLIGATORIOS CON VISOR PDF */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#C51D24] text-base">fact_check</span>
                    Lista de Verificación con Visor PDF Incorporado
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    * Haga clic en &quot;Ver PDF&quot; para auditar el documento en pantalla
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedSolicitud.requisitos.map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 select-none ${
                        req.verificado
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div 
                          onClick={() => handleToggleRequisito(selectedSolicitud.id, req.id)}
                          className={`p-2 rounded-xl shrink-0 mt-0.5 cursor-pointer ${
                            req.verificado ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {req.icono}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-xs text-slate-900 truncate">
                              {req.nombre}
                            </h4>
                            {req.obligatorio && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-red-100 text-red-700 rounded shrink-0">
                                Obligatorio
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 truncate">
                            {req.descripcion}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-slate-400 text-xs">picture_as_pdf</span>
                            {req.nombreArchivo} ({req.paginas} pág.)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Botón para Abrir Visor PDF */}
                        <button
                          type="button"
                          onClick={() => setPreviewPdfReq(req)}
                          className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Ver PDF
                        </button>

                        {/* Checkbox de Verificación */}
                        <input
                          type="checkbox"
                          checked={req.verificado}
                          onChange={() => handleToggleRequisito(selectedSolicitud.id, req.id)}
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

      {/* MODAL 1: VISOR INTERACTIVO DE DOCUMENTOS PDF HD */}
      {previewPdfReq && selectedSolicitud && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header del Visor */}
            <div className="bg-[#003366] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-amber-400">picture_as_pdf</span>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">
                    Visor HD: {previewPdfReq.nombre}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Solicitante: {selectedSolicitud.solicitanteNombre} ({selectedSolicitud.codigoTramite})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white/10 rounded text-xs font-mono">
                  {previewPdfReq.nombreArchivo} ({previewPdfReq.paginas} Pág.)
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewPdfReq(null)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Simulación del Visor de Documento PDF */}
            <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto relative">
              
              <div className="bg-white max-w-2xl w-full min-h-[500px] p-8 shadow-2xl rounded border border-slate-700 text-slate-900 font-sans space-y-6 flex flex-col justify-between relative">
                
                {/* Sello de Marca de Agua de Verificación */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <span className="text-8xl font-extrabold uppercase rotate-45 text-[#003366]">
                    UAGRM VERIFICADO
                  </span>
                </div>

                <div>
                  <div className="border-b border-slate-300 pb-3 flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#003366] uppercase">
                      UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO — ARCHIVO CENTRAL
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      DOC ID: {selectedSolicitud.codigoTramite}-{previewPdfReq.id}
                    </span>
                  </div>

                  <div className="pt-6 space-y-4 text-xs">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Documento Digitalizado:</p>
                        <p className="font-bold text-slate-900">{previewPdfReq.nombre}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded">
                        Auditoría 300 DPI OK
                      </span>
                    </div>

                    <div className="p-4 border border-dashed border-slate-300 rounded-xl space-y-2 text-slate-700 text-justify">
                      <p className="font-medium">
                        Por la presente se certifica la visualización del archivo escaneado <strong className="text-[#003366]">{previewPdfReq.nombreArchivo}</strong>, correspondiente al trámite Nº <strong className="font-mono">{selectedSolicitud.codigoTramite}</strong> a nombre del titular <strong>{selectedSolicitud.solicitanteNombre}</strong> con C.I. <strong>{selectedSolicitud.solicitanteCi}</strong>.
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        * Este archivo cuenta con firma digital y marca de agua institucional para cotejo de legalidad en Archivo Central.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-blue-50 rounded-lg text-center border border-blue-200">
                        <span className="material-symbols-outlined text-2xl text-[#003366]">verified</span>
                        <p className="text-[10px] font-bold text-[#003366] mt-1">Sello Digital Valido</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg text-center border border-amber-200">
                        <span className="material-symbols-outlined text-2xl text-amber-700">receipt</span>
                        <p className="text-[10px] font-bold text-amber-800 mt-1">Recibo: {selectedSolicitud.nroReciboPago}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>Página 1 de {previewPdfReq.paginas}</span>
                  <span>UAGRM Archivo Central 2026</span>
                </div>

              </div>

            </div>

            {/* Footer de Acciones del Visor */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003366]">
                <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                <span>Previsualización Auditable HD</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewPdfReq(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cerrar Visor
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    handleToggleRequisito(selectedSolicitud.id, previewPdfReq.id);
                    setPreviewPdfReq(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  Marcar como Verificado
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: OPCIONES PARA COMPARTIR EXPEDIENTE Y TRAMITE */}
      {showShareModal && selectedSolicitud && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#003366] font-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C51D24]">share</span>
                Compartir Expediente: {selectedSolicitud.solicitanteNombre}
              </h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Opcion 1: WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `*UAGRM - Archivo Central*\nEstado de Trámite: *${selectedSolicitud.tramiteTipo}*\nCódigo: ${selectedSolicitud.codigoTramite}\nSolicitante: ${selectedSolicitud.solicitanteNombre}\nEstado Triaje: ${selectedSolicitud.estadoTriaje}\n\nVer enlace seguro: https://titulos.uagrm.edu.bo/verificar/${selectedSolicitud.codigoTramite}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 font-bold transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                    <span className="material-symbols-outlined text-xl">chat</span>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Compartir por WhatsApp</p>
                    <p className="text-[10px] text-emerald-700 font-normal">Enviar resumen al {selectedSolicitud.telefono}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>

              {/* Opcion 2: Copiar Enlace Seguro */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <p className="font-extrabold text-[#003366] text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">link</span>
                  Enlace Seguro de Verificación:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://titulos.uagrm.edu.bo/verificar/${selectedSolicitud.codigoTramite}`}
                    className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg font-mono text-[11px] text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopiarEnlace(`https://titulos.uagrm.edu.bo/verificar/${selectedSolicitud.codigoTramite}`)}
                    className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    {copiadoExitosa ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              {/* Opcion 3: Código QR Visualizable */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                <p className="font-bold text-slate-700 text-xs">Código QR para Escaneo Móvil:</p>
                <div className="w-32 h-32 bg-white border-2 border-slate-300 mx-auto rounded-xl p-2 flex items-center justify-center shadow-xs">
                  {/* SVG Ilustración de Código QR Real */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11 0h2v2h-2v-2zm-3-2h2v2h-2v-2zm5 0h2v2h-2v-2zm-2 4h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 2h2v2h-2v-2z" />
                  </svg>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Escanear con teléfono móvil para autenticación en ventanilla
                </p>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
