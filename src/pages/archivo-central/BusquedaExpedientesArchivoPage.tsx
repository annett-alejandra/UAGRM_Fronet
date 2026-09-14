import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DocumentoCarpeta {
  nombre: string;
  tipo: string;
  icono: string;
}

interface ExpedienteBusqueda {
  id: string;
  ci: string;
  nombreTitular: string;
  diplomaDe: string;
  nroDiploma: string;
  libro: string;
  fojas: string;
  gestion: string;
  estadoLegajo: 'Digitalizado' | 'Verificado' | 'En Custodia Física';
  esCarpetaCompleta: boolean; // true: Carpeta completa | false: Fallback / PDF suelto
  documentosIncluidos?: DocumentoCarpeta[];
}

const EXPEDIENTES_MOCK: ExpedienteBusqueda[] = [
  {
    id: 'EXP-101',
    ci: '3250858-SCZ',
    nombreTitular: 'JENNY FLORES PEÑA',
    diplomaDe: 'BACHILLER EN HUMANIDADES',
    nroDiploma: '014863',
    libro: '19/98',
    fojas: '115/98',
    gestion: '1998',
    estadoLegajo: 'Digitalizado',
    esCarpetaCompleta: true,
    documentosIncluidos: [
      { nombre: 'CI_JENNY_FLORES_PEÑA.pdf', tipo: 'Cédula de Identidad Escaneada', icono: 'badge' },
      { nombre: 'HISTORICO_NOTAS_JENNY_FLORES.pdf', tipo: 'Histórico Académico & Notas', icono: 'history_edu' },
      { nombre: 'CERTIFICADO_ESTUDIOS_COLEGIO_JENNY.pdf', tipo: 'Histórico de Estudio de Colegio', icono: 'school' },
      { nombre: 'DIPLOMA_BACHILLER_014863.pdf', tipo: 'Diploma de Bachiller / Título', icono: 'workspace_premium' }
    ]
  },
  {
    id: 'EXP-102',
    ci: '8072900-SCZ',
    nombreTitular: 'GUALBERTO MEDINA VARGAS',
    diplomaDe: 'MÉDICO CIRUJANO',
    nroDiploma: '96071',
    libro: '0017',
    fojas: '0027',
    gestion: '2022',
    estadoLegajo: 'Verificado',
    esCarpetaCompleta: true,
    documentosIncluidos: [
      { nombre: 'CI_GUALBERTO_MEDINA.pdf', tipo: 'Cédula de Identidad Escaneada', icono: 'badge' },
      { nombre: 'HISTORICO_NOTAS_MEDICINA.pdf', tipo: 'Histórico Académico Universitario', icono: 'history_edu' },
      { nombre: 'TITULO_PROVISION_MEDICINA_96071.pdf', tipo: 'Título Profesional en Provisión Nacional', icono: 'workspace_premium' }
    ]
  },
  {
    id: 'EXP-103',
    ci: '4510293-CB',
    nombreTitular: 'MARIA SUAREZ ROJAS',
    diplomaDe: 'LICENCIADA EN DERECHO',
    nroDiploma: '045129',
    libro: '01/1995',
    fojas: '88/1995',
    gestion: '1995',
    estadoLegajo: 'En Custodia Física',
    esCarpetaCompleta: false, // Fallback último recurso (Documento/PDF suelto)
    documentosIncluidos: [
      { nombre: 'LIBRO_MATRIZ_1995_SCAN.pdf', tipo: 'Folio de Libro Matriz Escaneado (PDF Suelto - Sin Carpeta Completa)', icono: 'picture_as_pdf' }
    ]
  }
];

export function BusquedaExpedientesArchivoPage() {
  const navigate = useNavigate();
  const [ciQuery, setCiQuery] = useState('');
  const [nombreQuery, setNombreQuery] = useState('');
  const [diplomaQuery, setDiplomaQuery] = useState('');
  const [matrizQuery, setMatrizQuery] = useState('');

  const [expandedLegajoId, setExpandedLegajoId] = useState<string | null>('EXP-101');
  const [selectedLegajoModal, setSelectedLegajoModal] = useState<ExpedienteBusqueda | null>(null);

  const filteredExpedientes = EXPEDIENTES_MOCK.filter(exp => {
    const matchCi = !ciQuery || exp.ci.toLowerCase().includes(ciQuery.toLowerCase());
    const matchNombre = !nombreQuery || exp.nombreTitular.toLowerCase().includes(nombreQuery.toLowerCase());
    const matchDiploma = !diplomaQuery || exp.nroDiploma.toLowerCase().includes(diplomaQuery.toLowerCase());
    const matchMatriz = !matrizQuery || `${exp.libro}/${exp.fojas}`.toLowerCase().includes(matrizQuery.toLowerCase());
    return matchCi && matchNombre && matchDiploma && matchMatriz;
  });

  const handleLimpiarFiltros = () => {
    setCiQuery('');
    setNombreQuery('');
    setDiplomaQuery('');
    setMatrizQuery('');
  };

  const toggleExpandFolder = (id: string) => {
    setExpandedLegajoId(expandedLegajoId === id ? null : id);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-28">
      {/* Encabezado Principal de Búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C51D24] mb-1">
            <span className="material-symbols-[#C51D24] material-symbols-outlined text-sm">folder_shared</span>
            Módulo de Consulta Archivo Central UAGRM
          </div>
          <h1 className="text-2xl font-extrabold text-[#003366] tracking-tight font-heading">
            5. Búsqueda Multiparamétrica de Expedientes y Carpetas
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Consulta de expedientes personales por C.I. y Nombre (Prioridad Carpetas Digitalizadas).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-blue-50 text-[#003366] text-xs font-extrabold rounded-full border border-blue-200">
            Total Registros: {filteredExpedientes.length}
          </span>
        </div>
      </div>

      {/* Formulario de Criterios de Búsqueda Combinados */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-[#003366] font-extrabold text-sm border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-[#C51D24]">pageview</span>
          CRITERIOS DE BÚSQUEDA COMBINADOS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Carnet de Identidad (C.I.):
            </label>
            <input
              type="text"
              placeholder="Ej: 3250858-SCZ"
              value={ciQuery}
              onChange={(e) => setCiQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre Completo del Titular:
            </label>
            <input
              type="text"
              placeholder="Ej: JENNY FLORES PEÑA"
              value={nombreQuery}
              onChange={(e) => setNombreQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Número de Título / Diploma:
            </label>
            <input
              type="text"
              placeholder="Ej: 014863"
              value={diplomaQuery}
              onChange={(e) => setDiplomaQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Matriz Física (Libro / Fojas):
            </label>
            <input
              type="text"
              placeholder="Ej: 19/98 o 115/98"
              value={matrizQuery}
              onChange={(e) => setMatrizQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleLimpiarFiltros}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Limpiar Filtros
          </button>

          <button
            type="button"
            className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            Buscar Expedientes
          </button>
        </div>
      </div>

      {/* Resultados de la Búsqueda - carpetas legajo prioritarias */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24] text-lg">folder</span>
            Expedientes Encontrados (Carpetas por C.I. y Nombre del Titular)
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            * Se muestran las carpetas completas y PDFs sueltos como último recurso
          </span>
        </div>

        {filteredExpedientes.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-400">folder_off</span>
            <p className="text-sm font-bold">No se encontraron expedientes que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredExpedientes.map((exp) => {
              const isExpanded = expandedLegajoId === exp.id;

              return (
                <div key={exp.id} className="transition-colors">
                  {/* Encabezado Fila de Carpeta / Legajo */}
                  <div className="p-4 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-[240px]">
                      {/* Icono de Carpeta / PDF */}
                      <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                        exp.esCarpetaCompleta ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className="material-symbols-outlined text-2xl">
                          {exp.esCarpetaCompleta ? 'folder' : 'picture_as_pdf'}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            C.I. {exp.ci}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exp.esCarpetaCompleta 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {exp.esCarpetaCompleta ? '📁 Carpeta Completa' : '📄 Archivo PDF Suelto (Último Recurso)'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                          {exp.nombreTitular}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          {exp.diplomaDe} <span className="font-mono font-bold text-[#C51D24]">Nº {exp.nroDiploma}</span>
                        </p>
                      </div>
                    </div>

                    {/* Matriz y Estado */}
                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="font-mono text-slate-600">
                        Libro: <strong className="text-slate-900">{exp.libro}</strong> | Fojas: <strong className="text-slate-900">{exp.fojas}</strong> ({exp.gestion})
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          exp.estadoLegajo === 'Digitalizado' ? 'bg-emerald-500' :
                          exp.estadoLegajo === 'Verificado' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}></span>
                        <span className="font-semibold text-slate-700">{exp.estadoLegajo}</span>
                      </div>
                    </div>

                    {/* Acciones Directas */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandFolder(exp.id)}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003366] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">
                          {isExpanded ? 'folder_open' : 'folder'}
                        </span>
                        {exp.documentosIncluidos?.length || 1} Documentos
                        <span className="material-symbols-outlined text-base">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedLegajoModal(exp)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        Ver Legajo
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate('/archivo/autenticidad')}
                        className="px-3.5 py-1.5 bg-[#C51D24] hover:bg-[#a3151b] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">description</span>
                        Generar Informe (Tipo 1)
                      </button>
                    </div>
                  </div>

                  {/* Despliegue de los Archivos de la Carpeta */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                      <div className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-l-3 border-[#C51D24] pl-2 flex items-center justify-between">
                        <span>Documentos Integrantes del Expediente de {exp.nombreTitular}:</span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedLegajoModal(exp)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Ver Ficha Legajo
                          </button>

                          <button
                            type="button"
                            onClick={() => navigate('/archivo/autenticidad')}
                            className="px-3 py-1 bg-[#C51D24] hover:bg-[#a3151b] text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">description</span>
                            Generar Informe (Tipo 1)
                          </button>
                        </div>
                      </div>

                      {!exp.esCarpetaCompleta && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-lg">warning</span>
                          <span>
                            <strong>Nota:</strong> No se encontró carpeta completa escaneada para este expediente. Se muestra como último recurso el PDF / documento matriz disponible.
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {exp.documentosIncluidos?.map((doc, idx) => (
                          <div 
                            key={idx}
                            className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 bg-blue-100 text-[#003366] rounded-xl shrink-0">
                                <span className="material-symbols-outlined text-xl">
                                  {doc.icono}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-xs text-slate-900 truncate">
                                  {doc.tipo}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                  📄 {doc.nombre}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => navigate('/archivo/autenticidad')}
                              className="px-2.5 py-1 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">visibility</span>
                              Visor
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para Visualizar Legajo Digital */}
      {selectedLegajoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#003366] font-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C51D24]">folder_open</span>
                Ficha Legajo: {selectedLegajoModal.nombreTitular} (C.I. {selectedLegajoModal.ci})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLegajoModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Cédula de Identidad:</p>
                <p className="font-mono font-bold text-slate-900">{selectedLegajoModal.ci}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Nº Diploma:</p>
                <p className="font-mono font-bold text-[#C51D24]">{selectedLegajoModal.nroDiploma}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Grado / Mención:</p>
                <p className="font-bold text-slate-900">{selectedLegajoModal.diplomaDe}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Ubicación Matriz:</p>
                <p className="font-mono text-slate-900">Libro {selectedLegajoModal.libro} | Fojas {selectedLegajoModal.fojas}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-[#003366] space-y-2">
              <p className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
                Estado de Custodia Digital:
              </p>
              <p>
                Este expediente cuenta con testimonio digitalizado en alta resolución a 300 DPI y la firma manuscrita verificada de autoridades universitarias.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLegajoModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Visor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedLegajoModal(null);
                  navigate('/archivo/autenticidad');
                }}
                className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Generar Informe Oficial (Tipo 1)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
