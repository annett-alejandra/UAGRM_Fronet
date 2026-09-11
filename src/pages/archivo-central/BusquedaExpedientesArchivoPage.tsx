import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExpedienteResultado {
  id: string;
  ci: string;
  nombreTitular: string;
  diplomaDe: string;
  nroDiploma: string;
  libro: string;
  tomo: string;
  fojas: string;
  gestion: string;
  estadoLegajo: 'Digitalizado' | 'En Custodia Física' | 'Verificado';
}

const DEMO_EXPEDIENTES: ExpedienteResultado[] = [
  {
    id: 'EXP-01',
    ci: '3250858-SCZ',
    nombreTitular: 'JENNY FLORES PEÑA',
    diplomaDe: 'BACHILLER EN HUMANIDADES',
    nroDiploma: '014863',
    libro: '19/98',
    tomo: '02',
    fojas: '115/98',
    gestion: '1998',
    estadoLegajo: 'Digitalizado',
  },
  {
    id: 'EXP-02',
    ci: '8072900-SCZ',
    nombreTitular: 'GUALBERTO MEDINA VARGAS',
    diplomaDe: 'MÉDICO CIRUJANO',
    nroDiploma: '96071',
    libro: '0017',
    tomo: '01',
    fojas: '0027',
    gestion: '2022',
    estadoLegajo: 'Verificado',
  },
  {
    id: 'EXP-03',
    ci: '4510293-CB',
    nombreTitular: 'MARIA SUAREZ ROJAS',
    diplomaDe: 'LICENCIADA EN DERECHO',
    nroDiploma: '045129',
    libro: '01/1995',
    tomo: '03',
    fojas: '88/1995',
    gestion: '1995',
    estadoLegajo: 'En Custodia Física',
  },
];

export function BusquedaExpedientesArchivoPage() {
  const navigate = useNavigate();
  const [ci, setCi] = useState('');
  const [nombre, setNombre] = useState('');
  const [nroDiploma, setNroDiploma] = useState('');
  const [datosMatriz, setDatosMatriz] = useState('');

  const [resultados, setResultados] = useState<ExpedienteResultado[]>(DEMO_EXPEDIENTES);
  const [selectedLegajoModal, setSelectedLegajoModal] = useState<ExpedienteResultado | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = DEMO_EXPEDIENTES.filter((exp) => {
      const matchCi = !ci || exp.ci.toLowerCase().includes(ci.toLowerCase());
      const matchNombre = !nombre || exp.nombreTitular.toLowerCase().includes(nombre.toLowerCase());
      const matchDiploma = !nroDiploma || exp.nroDiploma.includes(nroDiploma);
      const matchMatriz = !datosMatriz || exp.libro.includes(datosMatriz) || exp.fojas.includes(datosMatriz);
      return matchCi && matchNombre && matchDiploma && matchMatriz;
    });
    setResultados(filtered);
  };

  const handleClear = () => {
    setCi('');
    setNombre('');
    setNroDiploma('');
    setDatosMatriz('');
    setResultados(DEMO_EXPEDIENTES);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 font-sans bg-[#F8FAFC]">
      
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-[#003366] font-heading tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '28px' }}>search_insights</span>
            5. Búsqueda Multiparamétrica de Expedientes y Archivos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consulta consolidada de documentos históricos, libros matrices y legajos digitalizados en Archivo Central UAGRM.
          </p>
        </div>
        <span className="px-4 py-1.5 bg-blue-50 text-[#003366] font-bold text-xs rounded-full border border-blue-200 font-mono">
          Total Coincidencias: {resultados.length}
        </span>
      </div>

      {/* Formulario de Filtros Multiparamétricos */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="w-3 h-3 rounded-full bg-[#C51D24]"></span>
          <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
            Criterios de Búsqueda Combinados
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Carnet de Identidad (C.I.):
            </label>
            <input
              type="text"
              placeholder="Ej: 3250858-SCZ"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre Completo del Titular:
            </label>
            <input
              type="text"
              placeholder="Ej: JENNY FLORES PEÑA"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Número de Título / Diploma:
            </label>
            <input
              type="text"
              placeholder="Ej: 014863"
              value={nroDiploma}
              onChange={(e) => setNroDiploma(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Matriz Física (Libro / Fojas):
            </label>
            <input
              type="text"
              placeholder="Ej: 19/98 o 115/98"
              value={datosMatriz}
              onChange={(e) => setDatosMatriz(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Buscar Expedientes
          </button>
        </div>
      </form>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
            Resultados de la Búsqueda
          </h3>
        </div>

        {resultados.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-sans">
            <span className="material-symbols-outlined text-slate-400 text-5xl mb-2">folder_off</span>
            <p className="text-sm font-bold">No se encontraron expedientes con los criterios ingresados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-[#003366] text-white font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 rounded-l-xl">C.I. Titular</th>
                  <th className="p-3.5">Nombre Completo</th>
                  <th className="p-3.5">Grado / Diploma</th>
                  <th className="p-3.5">N° Diploma</th>
                  <th className="p-3.5">Matriz Física (Libro/Folio/Gestión)</th>
                  <th className="p-3.5">Estado Legajo</th>
                  <th className="p-3.5 text-right rounded-r-xl">Acciones Directas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultados.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#003366]">
                      {exp.ci}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900 uppercase">
                      {exp.nombreTitular}
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">
                      {exp.diplomaDe}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#C51D24]">
                      {exp.nroDiploma}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      L: {exp.libro} | F: {exp.fojas} ({exp.gestion})
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] inline-flex items-center gap-1 ${
                        exp.estadoLegajo === 'Digitalizado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : exp.estadoLegajo === 'Verificado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {exp.estadoLegajo}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLegajoModal(exp)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Ver Legajo
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/archivo/autenticidad')}
                        className="px-3 py-1.5 bg-[#C51D24] hover:bg-[#a3151b] text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        Generar Informe (Tipo 3)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Legajo Digital: {selectedLegajoModal.nombreTitular}
              </h3>
              <button
                onClick={() => setSelectedLegajoModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
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
                <p className="text-slate-500 font-medium">N° Diploma:</p>
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
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                Estado de Custodia Digital:
              </p>
              <p>
                Este documento cuenta con testimonio digitalizado en alta resolución a 300 DPI y la firma manuscrita verificada de autoridades universitarias.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLegajoModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cerrar Visor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedLegajoModal(null);
                  navigate('/archivo/autenticidad');
                }}
                className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Emitir Informe Oficial (Tipo 3)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
