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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-16 font-sans">
      
      {/* Banner Superior Institucional Azul #2A3964 */}
      <div className="bg-[#2A3964] text-white p-8 rounded-2xl shadow-md border-l-8 border-[#880000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-slate-200">
            <span>DEPARTAMENTO DE TÍTULOS Y GRADOS - UAGRM</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-heading text-white">
            Búsqueda Global de Expedientes
          </h1>
          <p className="text-slate-200 text-xs max-w-xl">
            Consulta centralizada de títulos académicos, diplomas de bachiller y legajos documentales.
          </p>
        </div>

        <button 
          onClick={() => navigate('/titulos/carga-libros')}
          className="btn-secundario-curvo py-3 px-5 whitespace-nowrap shadow-md"
        >
          <span>📚</span> Cargar Libros Matrices
        </button>
      </div>

      {/* Tarjeta de Filtros de Búsqueda (Estilo Light Card de componentes y estilos) */}
      <form onSubmit={handleSearch} className="card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A3964] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              🔍
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#2A3964] uppercase tracking-wider">Filtros de Búsqueda Avanzada</h2>
              <p className="text-xs text-slate-500">Ingrese C.I., Número de Título o Nombre del Estudiante</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">CATÁLOGO UAGRM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Carnet de Identidad (C.I.)
            </label>
            <input
              type="text"
              placeholder="Ej. 1234567"
              value={ci}
              onChange={e => setCi(e.target.value)}
              className="select-estilo"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Número de Título
            </label>
            <input
              type="text"
              placeholder="Ej. TS-2026-0042"
              value={nroTitulo}
              onChange={e => setNroTitulo(e.target.value)}
              className="select-estilo font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nombre Completo del Estudiante
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Carlos Pérez"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="select-estilo"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
          >
            Limpiar Filtros
          </button>
          
          <button
            type="submit"
            className="boton-crear"
          >
            {buscando ? 'Buscando...' : '🔍 Buscar Registros'}
          </button>
        </div>
      </form>

      {/* Tabla de Resultados (Estilo tabla-cms de componentes y estilos) */}
      <div className="div-tabla">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-extrabold text-[#2A3964] text-xs uppercase tracking-wider">
            Expedientes Coincidentes ({resultados.length})
          </h3>
          <span className="text-xs text-slate-500 font-mono">Registros Institucionales</span>
        </div>

        <table className="tabla-cms">
          <thead>
            <tr>
              <th>Estudiante / C.I.</th>
              <th>Número de Título</th>
              <th>Tipo Título</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultados.length > 0 ? resultados.map(item => (
              <tr key={item.id}>
                <td className="font-bold text-slate-800">
                  <div>{item.nombre_estudiante}</div>
                  <div className="text-[10px] text-slate-500 font-mono">C.I. {item.ci}</div>
                </td>
                <td className="font-mono font-bold text-[#880000]">
                  {item.numero_titulo}
                </td>
                <td className="font-medium text-slate-600">{item.tipo_titulo}</td>
                <td>
                  <span className="badge-status-publicado">
                    ● {item.estado}
                  </span>
                </td>
                <td className="font-mono text-slate-500">{new Date(item.fecha_creacion).toLocaleDateString()}</td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/titulos/expediente/${item.id}`)}
                      className="boton-editar text-xs py-1.5 px-3"
                    >
                      📂 Expediente
                    </button>
                    <button
                      onClick={() => navigate(`/titulos/emision?nombre=${encodeURIComponent(item.nombre_estudiante)}&ci=${encodeURIComponent(item.ci)}&expedienteId=${item.id}`)}
                      className="btn-secundario-curvo py-1.5 px-3"
                    >
                      🖨️ Emitir
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="tabla-vacia">
                  No se encontraron expedientes con los criterios seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
