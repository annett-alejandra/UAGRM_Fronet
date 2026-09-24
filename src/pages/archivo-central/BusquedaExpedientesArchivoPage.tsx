import { Search, Folder, FileText, BookOpen, Building2, ChevronRight, ChevronDown, Calendar, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface DocumentoLegajo {
  nombre: string;
  tipo: string;
  icono: string;
}

interface GraduadoLegajo {
  id: string;
  nroDiploma: string;
  nombreTitular: string;
  ci: string;
  fojas: string;
  estado: 'Digitalizado' | 'Verificado' | 'En Custodia Física';
  esCarpetaCompleta: boolean;
  documentos?: DocumentoLegajo[];
}

interface TomoLegajo {
  id: string;
  numeroTomo: string; // ej: Legajo #01
  rangoInicial: string; // ej: 03399
  rangoFinal: string; // ej: 03010
  estadoTomo: 'Cerrado' | 'Abierto';
  totalGraduados: number;
  graduados: GraduadoLegajo[];
}

interface CarreraArchivo {
  id: string;
  nombreCarrera: string; // ej: LIC. EN CIENCIAS JURÍDICAS
  tomos: TomoLegajo[];
}

interface GestionArchivo {
  gestion: string; // ej: 2001, 2000, 1999
  carreras: CarreraArchivo[];
}

// Estructura de Datos Jerárquica de Archivo Central (Gestión -> Carrera -> Tomo/Legajo)
const JERARQUIA_ARCHIVO_MOCK: GestionArchivo[] = [
  {
    gestion: '2001',
    carreras: [
      {
        id: 'car-2001-1',
        nombreCarrera: 'LIC. EN CIENCIAS JURÍDICAS',
        tomos: [
          {
            id: 'tomo-2001-cj-01',
            numeroTomo: 'Legajo #01',
            rangoInicial: '03399',
            rangoFinal: '03010',
            estadoTomo: 'Cerrado',
            totalGraduados: 4,
            graduados: [
              {
                id: 'grad-1',
                nroDiploma: '03399',
                nombreTitular: 'MARIA S. ARISPE LLANOS',
                ci: '3491204-SCZ',
                fojas: '102/2001',
                estado: 'Digitalizado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_MARIA_ARISPE.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
                  { nombre: 'TITULO_CIENCIAS_JURIDICAS_03399.pdf', tipo: 'Título Profesional en Provisión Nacional', icono: 'workspace_premium' },
                  { nombre: 'HISTORICO_NOTAS_JURIDICAS.pdf', tipo: 'Histórico Académico & Certificado de Notas', icono: 'history_edu' }
                ]
              },
              {
                id: 'grad-2',
                nroDiploma: '03398',
                nombreTitular: 'LILIANA I. NAVARRO PAZ',
                ci: '4512903-SCZ',
                fojas: '101/2001',
                estado: 'Verificado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_LILIANA_NAVARRO.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
                  { nombre: 'TITULO_03398.pdf', tipo: 'Título en Provisión Nacional', icono: 'workspace_premium' }
                ]
              },
              {
                id: 'grad-3',
                nroDiploma: '03393',
                nombreTitular: 'HERIBERTO ORELLANA VILLANUEVA',
                ci: '2901842-SCZ',
                fojas: '096/2001',
                estado: 'Digitalizado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_HERIBERTO_ORELLANA.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
                  { nombre: 'TITULO_03393.pdf', tipo: 'Título Profesional', icono: 'workspace_premium' }
                ]
              },
              {
                id: 'grad-4',
                nroDiploma: '03010',
                nombreTitular: 'ROBERTO CARLOS ZABALA',
                ci: '1904812-SCZ',
                fojas: '001/2001',
                estado: 'En Custodia Física',
                esCarpetaCompleta: false, // Fallback foja única
                documentos: [
                  { nombre: 'LIBRO_2001_FOJA_001.pdf', tipo: 'Foja Única Reconstruida', icono: 'menu_book' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'car-2001-2',
        nombreCarrera: 'MÉDICO CIRUJANO',
        tomos: [
          {
            id: 'tomo-2001-[#C51D24]-01',
            numeroTomo: 'Legajo #01',
            rangoInicial: '96071',
            rangoFinal: '96001',
            estadoTomo: 'Cerrado',
            totalGraduados: 2,
            graduados: [
              {
                id: 'grad-m1',
                nroDiploma: '96071',
                nombreTitular: 'GUALBERTO MEDINA VARGAS',
                ci: '8072900-SCZ',
                fojas: '0027',
                estado: 'Verificado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_GUALBERTO_MEDINA.pdf', tipo: 'Cédula de Identidad', icono: 'badge' },
                  { nombre: 'TITULO_96071.pdf', tipo: 'Título Profesional en Provisión Nacional', icono: 'workspace_premium' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    gestion: '1999',
    carreras: [
      {
        id: 'car-1999-1',
        nombreCarrera: 'BACHILLER EN HUMANIDADES',
        tomos: [
          {
            id: 'tomo-1999-bach-01',
            numeroTomo: 'Legajo #01',
            rangoInicial: '019741',
            rangoFinal: '019700',
            estadoTomo: 'Cerrado',
            totalGraduados: 2,
            graduados: [
              {
                id: 'grad-b1',
                nroDiploma: '019741',
                nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
                ci: '4716343-SCZ',
                fojas: '181/99',
                estado: 'Digitalizado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_LYNNE_PEREZ.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
                  { nombre: 'DIPLOMA_019741.pdf', tipo: 'Diploma de Bachiller Escaneado', icono: 'workspace_premium' }
                ]
              },
              {
                id: 'grad-b2',
                nroDiploma: '014863',
                nombreTitular: 'JENNY FLORES PEÑA',
                ci: '3250858-SCZ',
                fojas: '115/98',
                estado: 'Digitalizado',
                esCarpetaCompleta: true,
                documentos: [
                  { nombre: 'CI_JENNY_FLORES.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
                  { nombre: 'DIPLOMA_014863.pdf', tipo: 'Diploma de Bachiller Escaneado', icono: 'workspace_premium' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export function BusquedaExpedientesArchivoPage() {
  const navigate = useNavigate();

  // Estados de Filtros en Cascada (Gestión -> Carrera -> Tomo/Legajo)
  const [selectedGestion, setSelectedGestion] = useState<string>('2001');
  const [selectedCarreraId, setSelectedCarreraId] = useState<string>('car-2001-1');
  const [selectedTomoId, setSelectedTomoId] = useState<string>('tomo-2001-cj-01');

  // Filtro de texto libre opcional (C.I. o Nombre)
  const [queryTexto, setQueryTexto] = useState('');

  // Modales
  const [selectedGraduadoModal, setSelectedGraduadoModal] = useState<GraduadoLegajo | null>(null);

  // 1. Obtener lista de Carreras para la Gestión seleccionada
  const carrerasDisponibles = useMemo(() => {
    const gestObj = JERARQUIA_ARCHIVO_MOCK.find(g => g.gestion === selectedGestion);
    return gestObj ? gestObj.carreras : [];
  }, [selectedGestion]);

  // 2. Obtener lista de Tomos para la Carrera seleccionada
  const tomosDisponibles = useMemo(() => {
    const carObj = carrerasDisponibles.find(c => c.id === selectedCarreraId);
    return carObj ? carObj.tomos : [];
  }, [carrerasDisponibles, selectedCarreraId]);

  // 3. Obtener Tomo/Legajo Activo Seleccionado
  const tomoActivo = useMemo(() => {
    return tomosDisponibles.find(t => t.id === selectedTomoId) || tomosDisponibles[0] || null;
  }, [tomosDisponibles, selectedTomoId]);

  // 4. Filtrar Graduados dentro del Tomo por texto opcional
  const graduadosFiltrados = useMemo(() => {
    if (!tomoActivo) return [];
    if (!queryTexto) return tomoActivo.graduados;
    return tomoActivo.graduados.filter(g =>
      g.nombreTitular.toLowerCase().includes(queryTexto.toLowerCase()) ||
      g.ci.toLowerCase().includes(queryTexto.toLowerCase()) ||
      g.nroDiploma.toLowerCase().includes(queryTexto.toLowerCase())
    );
  }, [tomoActivo, queryTexto]);

  // Manejador de Cambio de Gestión (Reinicia carrera y tomo)
  const handleGestionChange = (nuevaGestion: string) => {
    setSelectedGestion(nuevaGestion);
    const gestObj = JERARQUIA_ARCHIVO_MOCK.find(g => g.gestion === nuevaGestion);
    if (gestObj && gestObj.carreras.length > 0) {
      const primerCarrera = gestObj.carreras[0];
      setSelectedCarreraId(primerCarrera.id);
      if (primerCarrera.tomos.length > 0) {
        setSelectedTomoId(primerCarrera.tomos[0].id);
      }
    }
  };

  // Manejador de Cambio de Carrera
  const handleCarreraChange = (nuevaCarreraId: string) => {
    setSelectedCarreraId(nuevaCarreraId);
    const carObj = carrerasDisponibles.find(c => c.id === nuevaCarreraId);
    if (carObj && carObj.tomos.length > 0) {
      setSelectedTomoId(carObj.tomos[0].id);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen text-slate-900 font-sans pb-28">
      
      {/* Encabezado Principal Archivo Central */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C51D24] mb-1">
            <BookOpen className="w-4 h-4 text-[#C51D24]" />
            Módulo de Archivo Central • Estructura por Tomos y Legajos
          </div>
          <h1 className="text-2xl font-extrabold text-[#003366] tracking-tight font-heading">
            Búsqueda por Jerarquía de Libros, Tomos y Legajos
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Navegación en cascada por Gestión Anual ➔ Carrera / Programa ➔ Tomo / Legajo Físico.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-blue-50 text-[#003366] text-xs font-extrabold rounded-full border border-blue-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Gestión Activa: {selectedGestion}
          </span>
        </div>
      </div>

      {/* FILTROS EN CASCADA (ÁRBOL DE NAVEGACIÓN: GESTIÓN ➔ CARRERA ➔ TOMO/LEGAJO) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[#003366] font-extrabold text-xs uppercase tracking-wider">
            <span className="material-symbols-outlined text-[#C51D24] text-lg">filter_alt</span>
            Navegación Jerárquica en Cascada
          </div>
          <span className="text-[11px] text-slate-400 font-mono">ESTÁNDAR DOCUMENTAL UAGRM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Selector 1: Gestión / Año */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Selector de Gestión (Año):
            </label>
            <select
              value={selectedGestion}
              onChange={(e) => handleGestionChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-[#003366] focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none cursor-pointer"
            >
              {JERARQUIA_ARCHIVO_MOCK.map((g) => (
                <option key={g.gestion} value={g.gestion}>
                  📁 Gestión {g.gestion}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 2: Carrera / Programa */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Carrera / Programa:
            </label>
            <select
              value={selectedCarreraId}
              onChange={(e) => handleCarreraChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none cursor-pointer"
            >
              {carrerasDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  🎓 {c.nombreCarrera}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 3: Tomo / Legajo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Selector de Tomo / Legajo:
            </label>
            <select
              value={selectedTomoId}
              onChange={(e) => setSelectedTomoId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-extrabold text-[#C51D24] focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none cursor-pointer"
            >
              {tomosDisponibles.map((t) => (
                <option key={t.id} value={t.id}>
                  📙 {t.numeroTomo} (Del: {t.rangoInicial} al: {t.rangoFinal})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Buscador secundario rápido por C.I. o Nombre dentro del Tomo */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Filtrar por C.I. o Nombre dentro del legajo seleccionado..."
              value={queryTexto}
              onChange={(e) => setQueryTexto(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">search</span>
          </div>

          {tomoActivo && (
            <div className="text-xs font-mono bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 shrink-0 text-[#003366]">
              Rango Correlativo: <strong>Del {tomoActivo.rangoInicial} al {tomoActivo.rangoFinal}</strong> ({tomoActivo.estadoTomo})
            </div>
          )}
        </div>
      </div>

      {/* TABLA INDEXADA DEL TOMO SELECCIONADO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24] text-lg">menu_book</span>
            Índice de Graduados — {tomoActivo?.numeroTomo} ({carrerasDisponibles.find(c => c.id === selectedCarreraId)?.nombreCarrera})
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Total Graduados en Legajo: <strong>{graduadosFiltrados.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[#003366] font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="px-5 py-3.5">Nº Título / Correlativo</th>
                <th className="px-5 py-3.5">Nombre del Graduado</th>
                <th className="px-5 py-3.5">Cédula de Identidad</th>
                <th className="px-5 py-3.5">Fojas / Registro</th>
                <th className="px-5 py-3.5">Estado Legajo</th>
                <th className="px-5 py-3.5 text-right">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              {graduadosFiltrados.length > 0 ? graduadosFiltrados.map((grad) => (
                <tr key={grad.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono font-extrabold text-[#C51D24]">
                    Nº {grad.nroDiploma}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900 uppercase">
                    {grad.nombreTitular}
                  </td>
                  <td className="px-5 py-4 font-mono font-medium text-slate-700">
                    {grad.ci}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600">
                    Foja {grad.fojas}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      grad.esCarpetaCompleta 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {grad.esCarpetaCompleta ? '📁 Carpeta Completa' : '📄 Foja Única Reconstruida'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedGraduadoModal(grad)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">folder_open</span>
                        Ver Carpeta
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
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    No se encontraron graduados en el tomo seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Visualizar Legajo / Carpeta Digital */}
      {selectedGraduadoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#003366] font-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C51D24]">folder_open</span>
                Legajo: {selectedGraduadoModal.nombreTitular} (C.I. {selectedGraduadoModal.ci})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedGraduadoModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Nº Título / Diploma:</p>
                <p className="font-mono font-bold text-[#C51D24]">{selectedGraduadoModal.nroDiploma}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Ubicación Física:</p>
                <p className="font-mono text-slate-900">{tomoActivo?.numeroTomo} | Foja {selectedGraduadoModal.fojas}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#003366] uppercase">Archivos Digitalizados del Legajo:</p>
              <div className="space-y-2">
                {selectedGraduadoModal.documentos?.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[#003366]">{doc.icono}</span>
                      <div>
                        <p className="font-bold text-slate-900">{doc.tipo}</p>
                        <p className="text-[10px] text-slate-500 font-mono">📄 {doc.nombre}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verificado</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedGraduadoModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Visor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedGraduadoModal(null);
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
