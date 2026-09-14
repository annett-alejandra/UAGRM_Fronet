import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface DocumentoLegajo {
  id: string;
  nombre: string;
  tipo: string;
  icono: string;
  paginas: number;
  esFojaUnica?: boolean;
}

export interface ExpedienteResultado {
  id: string;
  ci: string;
  nombre_estudiante: string;
  numero_titulo: string;
  tipo_titulo: string;
  estado: string;
  fecha_creacion: string;
  esCarpetaCompleta: boolean;
  documentos: DocumentoLegajo[];
}

const MOCK_RESULTADOS: ExpedienteResultado[] = [
  {
    id: 'EXP-88421',
    ci: '8072900-SCZ',
    nombre_estudiante: 'GUALBERTO MEDINA VARGAS',
    numero_titulo: 'TS-96071',
    tipo_titulo: 'Título en Provisión Nacional (Médico Cirujano)',
    estado: 'Verificado',
    fecha_creacion: '2026-01-19',
    esCarpetaCompleta: true,
    documentos: [
      { id: 'd1', nombre: 'CI_GUALBERTO_MEDINA_VARGAS.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge', paginas: 2 },
      { id: 'd2', nombre: 'HISTORICO_NOTAS_MEDICINA_UAGRM.pdf', tipo: 'Histórico Académico & Certificado de Notas', icono: 'history_edu', paginas: 4 },
      { id: 'd3', nombre: 'TITULO_PROVISION_MEDICINA_96071.pdf', tipo: 'Título Profesional en Provisión Nacional', icono: 'workspace_premium', paginas: 1 },
      { id: 'd4', nombre: 'FORMULARIO_SOLICITUD_VALORES.pdf', tipo: 'Formulario de Trámite & Recibo Caja', icono: 'receipt_long', paginas: 1 }
    ]
  },
  {
    id: 'EXP-88422',
    ci: '4716343-SCZ',
    nombre_estudiante: 'LYNNE DENISSE PEREZ REVILLA',
    ci: '4716343-SCZ',
    numero_titulo: 'TS-019741',
    tipo_titulo: 'Diploma de Bachiller en Humanidades',
    estado: 'Digitalizado',
    fecha_creacion: '2026-04-20',
    esCarpetaCompleta: true,
    documentos: [
      { id: 'd1', nombre: 'CI_LYNNE_DENISSE_PEREZ.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge', paginas: 2 },
      { id: 'd2', nombre: 'HISTORICO_ESTUDIOS_COLEGIO.pdf', tipo: 'Histórico de Estudio de Colegio', icono: 'school', paginas: 3 },
      { id: 'd3', nombre: 'DIPLOMA_BACHILLER_019741.pdf', tipo: 'Diploma de Bachiller Escaneado', icono: 'workspace_premium', paginas: 1 }
    ]
  },
  {
    id: 'EXP-88423',
    ci: '4510293-CB',
    nombre_estudiante: 'MARIA SUAREZ ROJAS',
    numero_titulo: 'TS-045129',
    tipo_titulo: 'Licenciada en Derecho (Foja Única)',
    estado: 'En Custodia Física',
    fecha_creacion: '2026-02-10',
    esCarpetaCompleta: false, // Fallback: Solo foja única reconstruida por OCR
    documentos: [
      { id: 'd1', nombre: 'LIBRO_MATRIZ_1995_FOJA_88.pdf', tipo: 'Foja Única Reconstruida', icono: 'menu_book', paginas: 1, esFojaUnica: true }
    ]
  }
];

export function BusquedaGlobalTitulos() {
  const navigate = useNavigate();
  const [ci, setCi] = useState('');
  const [nroTitulo, setNroTitulo] = useState('');
  const [nombre, setNombre] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<ExpedienteResultado[]>(MOCK_RESULTADOS);

  // Estado para el Drawer / Modal de Carpeta Digital del Alumno
  const [selectedExpedienteModal, setSelectedExpedienteModal] = useState<ExpedienteResultado | null>(null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentoLegajo | null>(null);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBuscando(true);
    setTimeout(() => {
      const filtered = MOCK_RESULTADOS.filter(item => {
        const matchCi = !ci || item.ci.toLowerCase().includes(ci.toLowerCase());
        const matchTitulo = !nroTitulo || item.numero_titulo.toLowerCase().includes(nroTitulo.toLowerCase());
        const matchNombre = !nombre || item.nombre_estudiante.toLowerCase().includes(nombre.toLowerCase());
        return matchCi && matchTitulo && matchNombre;
      });
      setResultados(filtered);
      setBuscando(false);
    }, 400);
  };

  const handleReset = () => {
    setCi('');
    setNroTitulo('');
    setNombre('');
    setResultados(MOCK_RESULTADOS);
  };

  const handleOpenFolderDrawer = (item: ExpedienteResultado) => {
    setSelectedExpedienteModal(item);
    setSelectedDocPreview(item.documentos[0] || null);
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16">
      
      {/* 1. Formulario de Búsqueda Multiparamétrica */}
      <form onSubmit={handleBuscar} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#003366] text-white rounded-xl">
              <span className="material-symbols-outlined text-lg">search</span>
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">Filtros de Búsqueda Avanzada de Títulos</h2>
              <p className="text-[11px] text-slate-500">Ingrese C.I., Número de Título o Nombre del Estudiante</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">CATÁLOGO GENERAL UAGRM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Carnet de Identidad (C.I.)
            </label>
            <input
              type="text"
              placeholder="Ej. 8072900-SCZ"
              value={ci}
              onChange={e => setCi(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 shadow-2xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-medium text-slate-800 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Número de Título
            </label>
            <input
              type="text"
              placeholder="Ej. 96071 o TS-96071"
              value={nroTitulo}
              onChange={e => setNroTitulo(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 shadow-2xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-mono font-medium text-slate-800 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Nombre Completo del Estudiante
            </label>
            <input
              type="text"
              placeholder="Ej. GUALBERTO MEDINA VARGAS"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 shadow-2xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-medium text-slate-800 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Limpiar Filtros
          </button>
          
          <button
            type="submit"
            className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">search</span>
            {buscando ? 'Buscando...' : 'Buscar Registros'}
          </button>
        </div>
      </form>

      {/* 2. Tabla de Expedientes Coincidentes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24] text-lg">folder_shared</span>
            Expedientes Encontrados ({resultados.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            * Al pulsar &quot;Expediente&quot; se abre la Carpeta Digital de Legajo del Alumno
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[#003366] font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="px-5 py-3.5">Estudiante / C.I.</th>
                <th className="px-5 py-3.5">Número de Título</th>
                <th className="px-5 py-3.5">Tipo Título / Grado</th>
                <th className="px-5 py-3.5">Estado Legajo</th>
                <th className="px-5 py-3.5">Fecha Registro</th>
                <th className="px-5 py-3.5 text-right">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              {resultados.length > 0 ? resultados.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg shrink-0 ${
                        item.esCarpetaCompleta ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="material-symbols-outlined text-lg">
                          {item.esCarpetaCompleta ? 'folder' : 'menu_book'}
                        </span>
                      </span>
                      <div>
                        <div>{item.nombre_estudiante}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal">C.I. {item.ci}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-[#C51D24]">
                    {item.numero_titulo}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{item.tipo_titulo}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      item.esCarpetaCompleta 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {item.esCarpetaCompleta ? '📁 Carpeta Completa' : '📄 Foja Única Reconstruida'}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">{item.fecha_creacion}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {/* BOTÓN EXPEDIENTE: Abre la Carpeta Digital estilo File Explorer */}
                      <button
                        type="button"
                        onClick={() => handleOpenFolderDrawer(item)}
                        className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Abrir Carpeta Digital de Legajo"
                      >
                        <span className="material-symbols-outlined text-base">folder_open</span>
                        Expediente
                      </button>

                      {/* BOTÓN EMITIR: Navega a la vista de emisión de Certificado */}
                      <button
                        type="button"
                        onClick={() => navigate(`/titulos/emision?nombre=${encodeURIComponent(item.nombre_estudiante)}&ci=${encodeURIComponent(item.ci)}&expedienteId=${item.id}`)}
                        className="px-3.5 py-1.5 border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-100 bg-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Emitir Certificado de Autenticidad"
                      >
                        <span className="material-symbols-outlined text-base">print</span>
                        Emitir
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    No se encontraron expedientes con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL / DRAWER LATERAL: CARPETA DIGITAL DEL ALUMNO (ESTILO FILE EXPLORER) */}
      {selectedExpedienteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header del Drawer / File Explorer */}
            <div className="bg-[#003366] text-white p-4 flex justify-between items-center border-b border-blue-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl">
                  <span className="material-symbols-outlined text-2xl">folder_shared</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-wide">
                      Carpeta Digital de Legajo: {selectedExpedienteModal.nombre_estudiante}
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-900 text-blue-200 font-mono text-[10px] font-bold rounded border border-blue-700">
                      C.I. {selectedExpedienteModal.ci}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    Trámite: {selectedExpedienteModal.tipo_titulo} • Nº {selectedExpedienteModal.numero_titulo}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExpedienteModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Banner de Estado o Fallback */}
            {!selectedExpedienteModal.esCarpetaCompleta && (
              <div className="bg-amber-50 border-b border-amber-200 p-3 px-6 text-xs text-amber-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-lg">warning</span>
                <span>
                  <strong>Caso Excepcional (Foja Única Reconstruida):</strong> Este estudiante no cuenta con legajo completo digitalizado. Únicamente se tiene la foja del libro matriz histórico reconstruida por OCR.
                </span>
              </div>
            )}

            {/* Cuerpo Estilo File Explorer: Lista de Archivos (Izquierda) + Visor PDF (Derecha) */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Panel Izquierdo: Archivos de la Carpeta */}
              <div className="w-80 border-r border-slate-200 bg-slate-50 p-4 space-y-3 overflow-y-auto shrink-0">
                <p className="text-[11px] font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">folder</span>
                  Archivos Integrantes ({selectedExpedienteModal.documentos.length}):
                </p>

                <div className="space-y-2">
                  {selectedExpedienteModal.documentos.map((doc) => {
                    const isSelectedDoc = selectedDocPreview?.id === doc.id;

                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocPreview(doc)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelectedDoc
                            ? 'bg-blue-100/80 border-[#003366] shadow-2xs ring-1 ring-[#003366]/30'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`material-symbols-outlined text-xl shrink-0 ${
                            doc.esFojaUnica ? 'text-amber-700' : 'text-[#003366]'
                          }`}>
                            {doc.icono}
                          </span>
                          <div className="min-w-0">
                            <p className="font-extrabold text-xs text-slate-900 truncate">
                              {doc.tipo}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                              📄 {doc.nombre}
                            </p>
                          </div>
                        </div>

                        {doc.esFojaUnica && (
                          <span className="text-[9px] font-extrabold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                            Foja Única
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Panel Derecho: Previsualizador PDF Seleccionado */}
              <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center overflow-auto relative text-slate-900">
                {selectedDocPreview ? (
                  <div className="bg-white max-w-xl w-full min-h-[440px] p-6 shadow-2xl rounded-xl border border-slate-700 font-sans space-y-4 flex flex-col justify-between relative">
                    
                    {/* Marca de agua */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <span className="text-6xl font-extrabold uppercase rotate-45 text-[#003366]">
                        UAGRM AUDITADO
                      </span>
                    </div>

                    <div className="border-b border-slate-200 pb-3 flex justify-between items-center text-xs">
                      <span className="font-extrabold text-[#003366] uppercase">
                        {selectedDocPreview.tipo}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        Pág. 1 de {selectedDocPreview.paginas}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Nombre de Archivo:</p>
                          <p className="font-bold text-slate-900 font-mono">{selectedDocPreview.nombre}</p>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-extrabold rounded ${
                          selectedDocPreview.esFojaUnica ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {selectedDocPreview.esFojaUnica ? 'Foja Única Reconstruida' : 'Documento Verificado'}
                        </span>
                      </div>

                      <div className="p-4 border border-dashed border-slate-300 rounded-xl text-slate-700 text-justify text-xs space-y-2">
                        <p className="font-medium">
                          Visualizando documento escaneado a 300 DPI adjunto al expediente de <strong className="text-[#003366]">{selectedExpedienteModal.nombre_estudiante}</strong> con C.I. <strong className="font-mono">{selectedExpedienteModal.ci}</strong>.
                        </p>
                        {selectedDocPreview.esFojaUnica && (
                          <p className="text-[11px] text-amber-800 font-medium italic bg-amber-50 p-2 rounded">
                            * Nota: Este registro corresponde a una foja física antigua de libro matriz restaurada mediante indexación OCR Celery.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>UAGRM Legajo Digital</span>
                      <span>ID: {selectedExpedienteModal.id}</span>
                    </div>

                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs space-y-2">
                    <span className="material-symbols-outlined text-4xl">description</span>
                    <p>Seleccione un documento de la lista para visualizarlo.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer del Drawer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xs text-slate-600">
                Total Documentos en Carpeta: <strong className="text-[#003366] font-bold">{selectedExpedienteModal.documentos.length}</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedExpedienteModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cerrar Carpeta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exp = selectedExpedienteModal;
                    setSelectedExpedienteModal(null);
                    navigate(`/titulos/emision?nombre=${encodeURIComponent(exp.nombre_estudiante)}&ci=${encodeURIComponent(exp.ci)}&expedienteId=${exp.id}`);
                  }}
                  className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  Emitir Certificación
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
