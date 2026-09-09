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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Búsqueda Universal de Expedientes y Libros</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Consulte expedientes académicos utilizando datos del estudiante o datos de Libro, Tomo y Folio.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold text-xs rounded-full">
          Consulta Catalográfica
        </span>
      </div>

      {/* Formulario de Busqueda por Campos */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Carnet de Identidad (CI)</label>
            <input 
              type="text"
              placeholder="Buscar por CI..."
              value={filtros.ci}
              onChange={e => setFiltros({ ...filtros, ci: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Registro Universitario (RU)</label>
            <input 
              type="text"
              placeholder="Buscar por RU..."
              value={filtros.ru}
              onChange={e => setFiltros({ ...filtros, ru: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre Completo</label>
            <input 
              type="text"
              placeholder="Buscar por Apellido o Nombre..."
              value={filtros.nombre}
              onChange={e => setFiltros({ ...filtros, nombre: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Libro</label>
            <input 
              type="text"
              placeholder="Ej. L-45"
              value={filtros.libro}
              onChange={e => setFiltros({ ...filtros, libro: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Tomo</label>
            <input 
              type="text"
              placeholder="Ej. T-02"
              value={filtros.tomo}
              onChange={e => setFiltros({ ...filtros, tomo: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Folio</label>
            <input 
              type="text"
              placeholder="Ej. F-128"
              value={filtros.folio}
              onChange={e => setFiltros({ ...filtros, folio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Gestión</label>
            <input 
              type="text"
              placeholder="Ej. 1999"
              value={filtros.gestion}
              onChange={e => setFiltros({ ...filtros, gestion: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
          >
            {buscando ? 'Buscando...' : 'Buscar Expedientes'}
          </button>
        </div>
      </form>

      {/* Resultados de la Busqueda */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-900 dark:text-white">Resultados Encontrados ({resultados.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase text-xs">
              <tr>
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
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-800 dark:text-slate-200">
              {resultados.length > 0 ? resultados.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-mono">
                    <div className="font-bold">{item.ci}</div>
                    <div className="text-xs text-slate-500">RU: {item.ru}</div>
                  </td>
                  <td className="p-4 font-semibold">{item.nombre}</td>
                  <td className="p-4 text-xs text-slate-600 dark:text-slate-400">{item.carrera}</td>
                  <td className="p-4 font-mono text-xs">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded font-bold">
                      {item.libro} | {item.tomo} | {item.folio}
                    </span>
                  </td>
                  <td className="p-4 font-mono">{item.gestion}</td>
                  <td className="p-4 text-xs">{item.tipoDocumento}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-bold transition-colors">
                      Ver Expediente
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 dark:text-slate-400">
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
