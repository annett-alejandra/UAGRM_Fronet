import { useState } from 'react';

export function SubidaDocumentos() {
  const [formData, setFormData] = useState({
    // Expediente Academico
    ci: '',
    ru: '',
    nombre: '',
    carrera: 'Ingenieria Informatica',
    facultad: 'Facultad de Ciencias de la Computacion y Telecomunicaciones',
    // Registro de Libro / Archivo
    libro: '',
    tomo: '',
    folio: '',
    gestion: '2024',
    pagina: '',
    tipoDocumento: 'Titulo Supletorio',
    observaciones: ''
  });

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Subir Expediente / Documento de Archivo</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Complete la ficha catalográfica del expediente e ingrese el libro, tomo y folio correspondiente.
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-full">
          Archivo Central UAGRM
        </span>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-200 flex justify-between items-center">
          <div>
            <p className="font-bold">¡Expediente catalogado y subido con éxito!</p>
            <p className="text-sm">El documento ha sido indexado en Postgres y el archivo PDF registrado.</p>
          </div>
          <button onClick={() => { setSuccess(false); setFile(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700">
            Subir Otro Expediente
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dropzone de Archivo */}
        <div 
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-white dark:bg-slate-800 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]' 
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
          }`}
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            📄
          </div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Arrastre y suelte el documento PDF del expediente'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">O haga clic para explorar sus archivos locales (Máx 50MB)</p>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={e => e.target.files && setFile(e.target.files[0])} 
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="inline-block mt-4 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg font-medium text-sm cursor-pointer transition-colors shadow-sm"
          >
            Seleccionar PDF
          </label>
        </div>

        {/* Seccion 1: Datos del Expediente Academico */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Datos del Expediente Académico</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Carnet de Identidad (CI) *</label>
              <input 
                type="text"
                required
                placeholder="Ej. 1234567 SC"
                value={formData.ci}
                onChange={e => handleChange('ci', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Registro Universitario (RU) *</label>
              <input 
                type="text"
                required
                placeholder="Ej. 219084732"
                value={formData.ru}
                onChange={e => handleChange('ru', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nombre Completo del Solicitante *</label>
              <input 
                type="text"
                required
                placeholder="Ej. Juan Pérez García"
                value={formData.nombre}
                onChange={e => handleChange('nombre', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Carrera *</label>
              <input 
                type="text"
                required
                placeholder="Ej. Ingeniería Informática"
                value={formData.carrera}
                onChange={e => handleChange('carrera', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Facultad *</label>
              <input 
                type="text"
                required
                placeholder="Ej. Facultad de Ciencias de la Computación y Telecomunicaciones"
                value={formData.facultad}
                onChange={e => handleChange('facultad', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Seccion 2: Datos de Registro de Libro y Archivo */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Datos de Registro de Libro (Matriz de Archivo)</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Libro *</label>
              <input 
                type="text"
                required
                placeholder="Ej. L-45"
                value={formData.libro}
                onChange={e => handleChange('libro', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Tomo *</label>
              <input 
                type="text"
                required
                placeholder="Ej. T-02"
                value={formData.tomo}
                onChange={e => handleChange('tomo', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Nro. Folio *</label>
              <input 
                type="text"
                required
                placeholder="Ej. F-128"
                value={formData.folio}
                onChange={e => handleChange('folio', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Gestión *</label>
              <input 
                type="text"
                required
                placeholder="Ej. 1999"
                value={formData.gestion}
                onChange={e => handleChange('gestion', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Página *</label>
              <input 
                type="text"
                required
                placeholder="Ej. Pág 44"
                value={formData.pagina}
                onChange={e => handleChange('pagina', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Tipo de Documento / Expediente</label>
              <select
                value={formData.tipoDocumento}
                onChange={e => handleChange('tipoDocumento', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              >
                <option value="Titulo Supletorio">Título Supletorio</option>
                <option value="Certificado de Notas">Certificado de Notas</option>
                <option value="Acta de Grado">Acta de Grado Academicas</option>
                <option value="Diploma Academico">Diploma Académico Original</option>
                <option value="Expediente Completo">Expediente de Titulación Completo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Observaciones / Notas de Archivo</label>
              <input 
                type="text"
                placeholder="Ej. Documento físico con sello de goma restaurado"
                value={formData.observaciones}
                onChange={e => handleChange('observaciones', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                ci: '', ru: '', nombre: '', carrera: 'Ingeniería Informática', facultad: 'Facultad de Ciencias de la Computación y Telecomunicaciones',
                libro: '', tomo: '', folio: '', gestion: '2024', pagina: '', tipoDocumento: 'Título Supletorio', observaciones: ''
              });
            }}
            className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Limpiar Formulario
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {uploading ? 'Guardando Expediente...' : 'Guardar y Registrar Expediente'}
          </button>
        </div>
      </form>
    </div>
  );
}
