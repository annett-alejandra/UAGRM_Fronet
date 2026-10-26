import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Sparkles,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';

interface LibroMatriz {
  id: string;
  codigoMatriz: string;
  tomoNombre: string;
  carrera: string;
  gestion: string;
  totalPaginas: number;
  fechaCarga: string;
  estado: 'PROCESADO' | 'EN_INDEXACION';
}

export function CargaLibrosMatricesTitulosPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [libros, setLibros] = useState<LibroMatriz[]>([
    { id: '1', codigoMatriz: 'MAT-2026-01', tomoNombre: 'Libro Matriz Med-95 Tomo I', carrera: 'Medicina Humana', gestion: '1995', totalPaginas: 250, fechaCarga: '24/09/2026', estado: 'PROCESADO' },
    { id: '2', codigoMatriz: 'MAT-2026-02', tomoNombre: 'Libro Matriz Der-98 Tomo II', carrera: 'Licenciatura en Derecho', gestion: '1998', fechaCarga: '23/09/2026', totalPaginas: 320, estado: 'PROCESADO' },
    { id: '3', codigoMatriz: 'MAT-2026-03', tomoNombre: 'Libro Matriz Sis-02 Tomo III', carrera: 'Ingeniería en Sistemas', gestion: '2002', fechaCarga: '22/09/2026', totalPaginas: 180, estado: 'EN_INDEXACION' },
  ]);

  const handleSimularCarga = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const nuevo: LibroMatriz = {
            id: String(Date.now()),
            codigoMatriz: `MAT-2026-0${libros.length + 1}`,
            tomoNombre: `Libro Matriz Tomo ${libros.length + 1} - Escaneado`,
            carrera: 'Ciencias de la Salud / Tecnología',
            gestion: '2010',
            totalPaginas: 210,
            fechaCarga: '24/09/2026 (Nuevo)',
            estado: 'PROCESADO'
          };
          setLibros(p => [nuevo, ...p]);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-7xl mx-auto font-sans"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#191A7D] to-[#2B6CB0] text-[#E5A823] rounded-2xl shadow-md">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#191A7D] border border-blue-200">
                Títulos y Grados • Opción 5
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Reconstrucción & Carga de Libros Matrices
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cargue archivos escaneados o carpetas de libros matrices históricas para su digitalización.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Motor de Reorganización de Tomos Activo</span>
        </div>
      </div>

      {/* ZONA INTERACTIVA DE CARGA / DROPZONE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#191A7D]" />
            Cargar Nuevo Libro Matriz Escaneado (PDF / Excel ZIP)
          </h3>
        </div>

        <div className="border-2 border-dashed border-slate-300 hover:border-[#191A7D] rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer space-y-3">
          <div className="w-14 h-14 bg-blue-100/80 text-[#191A7D] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Arrastre y suelte la carpeta escaneada o archivo del Libro Matriz
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Formatos soportados: PDF escaneado multi-página, Excel (.xlsx) o archivo comprimido (.zip)
            </p>
          </div>

          {isUploading ? (
            <div className="max-w-xs mx-auto space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
                <span>Procesando Libro Matriz...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="bg-[#191A7D] h-[#191A7D] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <button
              onClick={handleSimularCarga}
              className="px-5 py-2.5 bg-[#191A7D] hover:bg-[#2B6CB0] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Simular Carga de Libro Matriz</span>
            </button>
          )}
        </div>
      </div>

      {/* TABLA DE LIBROS MATRICES CARGADOS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#191A7D]" />
              Libros Matrices Registrados en el Sistema ({libros.length})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Lista de tomos y libros matrices digitalizados y vinculados al catálogo general.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Código Matriz</th>
                <th className="py-3.5 px-4">Nombre del Tomo / Libro</th>
                <th className="py-3.5 px-4">Carrera Vinculada</th>
                <th className="py-3.5 px-4">Gestión</th>
                <th className="py-3.5 px-4">Total Páginas</th>
                <th className="py-3.5 px-4">Fecha Carga</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {libros.map((l) => (
                <tr key={l.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#191A7D]">{l.codigoMatriz}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{l.tomoNombre}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{l.carrera}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{l.gestion}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">{l.totalPaginas} folios</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{l.fechaCarga}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      l.estado === 'PROCESADO'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {l.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setLibros(p => p.filter(item => item.id !== l.id))}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
