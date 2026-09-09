import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { titulosApi, type ExpedienteItemResponse } from './api/titulos-api';

export function BusquedaGlobalTitulos() {
  const navigate = useNavigate();
  const [ci, setCi] = useState('');
  const [nroTitulo, setNroTitulo] = useState('');
  const [nombre, setNombre] = useState('');
  const [resultados, setResultados] = useState<ExpedienteItemResponse[]>([]);
  const [buscando, setBuscando] = useState(false);

  const fetchResults = async (filters: { ci?: string; numero_titulo?: string; nombre?: string }) => {
    setBuscando(true);
    try {
      const data = await titulosApi.buscarExpedientes(filters);
      setResultados(data.results);
    } catch {
      /* handled */
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    void fetchResults({});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchResults({ ci, numero_titulo: nroTitulo, nombre });
  };

  const handleReset = () => {
    setCi('');
    setNroTitulo('');
    setNombre('');
    void fetchResults({});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Búsqueda Global de Títulos</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            API Endpoint: <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-600 dark:text-blue-400">GET /api/v1/expedientes/buscar/</code>
          </p>
        </div>
        <span className="px-3.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-full border border-blue-200 dark:border-blue-800">
          REST API v1 Activa
        </span>
      </div>

      {/* Formulario de Busqueda Multiparametrica */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
          Filtros de Búsqueda Multiparamétrica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Carnet de Identidad (C.I.)
            </label>
            <input
              type="text"
              placeholder="Ej. 1234567"
              value={ci}
              onChange={e => setCi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Número de Título
            </label>
            <input
              type="text"
              placeholder="Ej. TS-2026-0042"
              value={nroTitulo}
              onChange={e => setNroTitulo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Carlos Pérez"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2"
          >
            {buscando ? 'Buscando...' : '🔍 Buscar Títulos'}
          </button>
        </div>
      </form>

      {/* Tabla de Resultados (Data Grid) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Resultados Encontrados ({resultados.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase text-xs">
              <tr>
                <th className="p-4">C.I.</th>
                <th className="p-4">Estudiante</th>
                <th className="p-4">Nro. Título</th>
                <th className="p-4">Tipo Título</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Fecha Creación</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-800 dark:text-slate-200">
              {resultados.length > 0 ? resultados.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{item.ci}</td>
                  <td className="p-4 font-bold">{item.nombre_estudiante}</td>
                  <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">{item.numero_titulo}</td>
                  <td className="p-4 text-xs font-semibold">{item.tipo_titulo}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs">{new Date(item.fecha_creacion).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/titulos/expediente/${item.id}`)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-all flex items-center gap-1"
                      >
                        📂 Ver Expediente
                      </button>
                      <button
                        onClick={() => navigate(`/titulos/emision?nombre=${encodeURIComponent(item.nombre_estudiante)}&ci=${encodeURIComponent(item.ci)}&expedienteId=${item.id}`)}
                        className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        🖨️ Emitir
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron expedientes con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
