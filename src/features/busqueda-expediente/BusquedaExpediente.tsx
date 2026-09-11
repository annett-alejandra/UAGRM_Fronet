import { useState } from 'react';

interface ExpedienteItem {
  id: string;
  ci: string;
  ru: string;
  nombre: string;
  carrera: string;
  libro: string;
  tomo: string;
  folio: string;
  gestion: string;
  tipoDocumento: string;
  estado: string;
}

const MOCK_DATA: ExpedienteItem[] = [
  { id: 'EXP-101', ci: '1234567 SC', ru: '219084732', nombre: 'JUAN PÉREZ GARCÍA', carrera: 'INGENIERÍA INFORMÁTICA', libro: 'L-45', tomo: 'T-02', folio: 'F-128', gestion: '1999', tipoDocumento: 'Título Supletorio', estado: 'VALIDADO' },
  { id: 'EXP-102', ci: '7654321 CB', ru: '218045911', nombre: 'MARÍA LÓPEZ MERCADO', carrera: 'DERECHO', libro: 'L-32', tomo: 'T-01', folio: 'F-054', gestion: '2005', tipoDocumento: 'Certificado de Notas', estado: 'EN REVISIÓN' },
  { id: 'EXP-103', ci: '4567890 LP', ru: '220194822', nombre: 'CARLOS GUTIÉRREZ PAZ', carrera: 'MEDICINA', libro: 'L-12', tomo: 'T-04', folio: 'F-210', gestion: '1994', tipoDocumento: 'Acta de Grado', estado: 'RECONSTRUIDO' },
];

export function BusquedaExpediente() {
  const [filtros, setFiltros] = useState({
    ci: '',
    ru: '',
    nombre: '',
    libro: '',
    tomo: '',
    folio: '',
    gestion: ''
  });

  const [resultados, setResultados] = useState<ExpedienteItem[]>(MOCK_DATA);
  const [buscando, setBuscando] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBuscando(true);
    setTimeout(() => {
      const filtered = MOCK_DATA.filter(item => {
        const matchCi = !filtros.ci || item.ci.toLowerCase().includes(filtros.ci.toLowerCase());
        const matchRu = !filtros.ru || item.ru.toLowerCase().includes(filtros.ru.toLowerCase());
        const matchNombre = !filtros.nombre || item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
        const matchLibro = !filtros.libro || item.libro.toLowerCase().includes(filtros.libro.toLowerCase());
        const matchTomo = !filtros.tomo || item.tomo.toLowerCase().includes(filtros.tomo.toLowerCase());
        const matchFolio = !filtros.folio || item.folio.toLowerCase().includes(filtros.folio.toLowerCase());
        const matchGestion = !filtros.gestion || item.gestion.includes(filtros.gestion);
        return matchCi && matchRu && matchNombre && matchLibro && matchTomo && matchFolio && matchGestion;
      });
      setResultados(filtered);
      setBuscando(false);
    }, 400);
  };

  const handleReset = () => {
    setFiltros({ ci: '', ru: '', nombre: '', libro: '', tomo: '', folio: '', gestion: '' });
    setResultados(MOCK_DATA);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-[#003366]">Búsqueda Universal de Expedientes y Libros</h2>
          <p className="text-slate-500 text-xs mt-1">
            Consulte expedientes académicos utilizando datos del estudiante o datos de Libro, Tomo y Folio.
          </p>
        </div>
        <span className="px-3 py-1 bg-[#003366]/10 text-[#003366] font-bold text-xs rounded-full">
          Consulta Catalográfica
        </span>
      </div>

      {/* Formulario de Búsqueda por Campos */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Carnet de Identidad (CI)</label>
            <input 
              type="text"
              placeholder="Buscar por CI..."
              value={filtros.ci}
              onChange={e => setFiltros({ ...filtros, ci: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Registro Universitario (RU)</label>
            <input 
              type="text"
              placeholder="Buscar por RU..."
              value={filtros.ru}
              onChange={e => setFiltros({ ...filtros, ru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nombre Completo</label>
            <input 
              type="text"
              placeholder="Buscar por Apellido o Nombre..."
              value={filtros.nombre}
              onChange={e => setFiltros({ ...filtros, nombre: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium"
            />
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nro. Libro</label>
            <input 
              type="text"
              placeholder="Ej. L-45"
              value={filtros.libro}
              onChange={e => setFiltros({ ...filtros, libro: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nro. Tomo</label>
            <input 
              type="text"
              placeholder="Ej. T-02"
              value={filtros.tomo}
              onChange={e => setFiltros({ ...filtros, tomo: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Nro. Folio</label>
            <input 
              type="text"
              placeholder="Ej. F-128"
              value={filtros.folio}
              onChange={e => setFiltros({ ...filtros, folio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Gestión</label>
            <input 
              type="text"
              placeholder="Ej. 1999"
              value={filtros.gestion}
              onChange={e => setFiltros({ ...filtros, gestion: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-slate-800 focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 outline-none text-xs font-medium font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            Limpiar Filtros
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {buscando ? 'Buscando...' : 'Buscar Expedientes'}
          </button>
        </div>
      </form>

      {/* Resultados de la Búsqueda */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-slate-50/70">
          <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider">Resultados Encontrados ({resultados.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-700 font-bold border-b border-[#E2E8F0] uppercase text-[10px] tracking-wider select-none">
                <th className="p-4">CI / RU</th>
                <th className="p-4">Estudiante</th>
                <th className="p-4">Carrera</th>
                <th className="p-4">Libro / Tomo / Folio</th>
                <th className="p-4">Gestión</th>
                <th className="p-4">Tipo Doc.</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {resultados.length > 0 ? resultados.map(item => (
                <tr key={item.id} className="hover:bg-[#F1F5F9] transition-colors">
                  <td className="p-4 font-mono">
                    <div className="font-bold">{item.ci}</div>
                    <div className="text-[10px] text-slate-400">RU: {item.ru}</div>
                  </td>
                  <td className="p-4 font-bold">{item.nombre}</td>
                  <td className="p-4 text-slate-600">{item.carrera}</td>
                  <td className="p-4 font-mono text-xs">
                    <span className="px-2 py-0.5 bg-[#003366]/10 text-[#003366] rounded font-bold">
                      {item.libro} | {item.tomo} | {item.folio}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{item.gestion}</td>
                  <td className="p-4 font-medium">{item.tipoDocumento}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1B7A43]/10 text-[#1B7A43] border border-[#1B7A43]/20 whitespace-nowrap select-none">
                      ● {item.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs">
                      Ver Expediente
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
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
