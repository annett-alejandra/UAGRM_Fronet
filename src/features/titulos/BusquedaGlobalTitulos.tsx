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
    <div className="max-w-7xl mx-auto space-y-6 pb-16 font-sans bg-[#F8FAFC]">
      
      {/* 1. Cabecera Superior Homogénea sobre Fondo Claro #F8FAFC */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#003366]/10 rounded-full text-[11px] font-mono text-[#003366] font-bold">
            <span className="material-symbols-outlined text-[#003366]" style={{ fontSize: '14px' }}>school</span>
            <span>DEPARTAMENTO DE TÍTULOS Y GRADOS - UAGRM</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#003366]">
            Búsqueda Global de Expedientes
          </h1>
          <p className="text-slate-500 text-xs max-w-xl">
            Consulta centralizada de títulos académicos, diplomas de bachiller y legajos documentales.
          </p>
        </div>

        <button 
          onClick={() => navigate('/titulos/carga-libros')}
          className="px-4 py-2.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>collections_bookmark</span>
          Cargar Libros Matrices
        </button>
      </div>

      {/* 2. Tarjeta de Filtros de Búsqueda */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003366]/10 text-[#003366] flex items-center justify-center font-bold text-lg">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>tune</span>
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">Filtros de Búsqueda Avanzada</h2>
              <p className="text-[11px] text-slate-500">Ingrese C.I., Número de Título o Nombre del Estudiante</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">CATÁLOGO UAGRM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Carnet de Identidad (C.I.)
            </label>
            <input
              type="text"
              placeholder="Ej. 1234567"
              value={ci}
              onChange={e => setCi(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 shadow-xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-medium text-slate-800 h-[42px] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Número de Título
            </label>
            <input
              type="text"
              placeholder="Ej. TS-2026-0042"
              value={nroTitulo}
              onChange={e => setNroTitulo(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 shadow-xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-mono font-medium text-slate-800 h-[42px] outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Nombre Completo del Estudiante
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Carlos Pérez"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-slate-50/50 shadow-xs focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 text-xs py-2.5 px-3 font-medium text-slate-800 h-[42px] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
            Limpiar Filtros
          </button>
          
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
            {buscando ? 'Buscando...' : 'Buscar Registros'}
          </button>
        </div>
      </form>

      {/* 3. Tabla de Expedientes Coincidentes (Limpia sin fondos negros ni bordes toscos) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70 flex justify-between items-center">
          <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003366]" style={{ fontSize: '18px' }}>folder_shared</span>
            Expedientes Coincidentes ({resultados.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Registros Institucionales</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-slate-50/50 text-[#003366] font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="px-5 py-3.5">Estudiante / C.I.</th>
                <th className="px-5 py-3.5">Número de Título</th>
                <th className="px-5 py-3.5">Tipo Título</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5">Fecha Registro</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
              {resultados.length > 0 ? resultados.map(item => (
                <tr key={item.id} className="hover:bg-[#F1F5F9] transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800">
                    <div>{item.nombre_estudiante}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">C.I. {item.ci}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-[#C51D24]">
                    {item.numero_titulo}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600">{item.tipo_titulo}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1B7A43]/10 text-[#1B7A43] border border-[#1B7A43]/20 whitespace-nowrap select-none">
                      <span className="material-symbols-outlined text-[#1B7A43]" style={{ fontSize: '14px' }}>check_circle</span>
                      {item.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500">{new Date(item.fecha_creacion).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => navigate(`/titulos/expediente/${item.id}`)}
                        className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Ver Expediente Digital"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                        Expediente
                      </button>
                      <button
                        onClick={() => navigate(`/titulos/emision?nombre=${encodeURIComponent(item.nombre_estudiante)}&ci=${encodeURIComponent(item.ci)}&expedienteId=${item.id}`)}
                        className="px-3 py-1.5 border border-[#E2E8F0] hover:border-slate-300 text-[#003366] hover:bg-slate-100 bg-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Emitir Plantilla A4"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
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
    </div>
  );
}
