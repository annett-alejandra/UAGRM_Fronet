import { useState } from 'react';

export function CargaLibrosMatrices() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    numero_libro: 115,
    tomo: 'A-1',
    gestion: 2026,
  });

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setStatusText('Solicitando Presigned URL a MinIO...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setUploadProgress(40);
      setStatusText('Subiendo archivo PDF de Libro Matriz a MinIO (Storage)...');

      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(75);
      setStatusText('Enviando paquete a Celery Workers OCR Pipeline...');

      setTimeout(async () => {
        setUploadProgress(100);
        setStatusText('Libro indexado exitosamente');
        setUploading(false);
        setShowSuccessModal(true);
      }, 1000);

    } catch {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 font-sans text-slate-900 pb-20">
      
      {/* Header Banner Modo Claro Institucional */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C51D24] mb-1">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Departamento de Títulos y Grados • UAGRM
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight font-heading">
            Gestor de Carga de Libros Matrices
          </h1>
          <p className="text-[#64748B] text-xs mt-1">
            Procesamiento de Libros Matrices escaneados para indexación OCR y Gemelo Digital.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Celery OCR Pipeline
        </span>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* Canvas Drag & Drop Modo Claro */}
        <div 
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white shadow-sm ${
            dragActive 
              ? 'border-[#003366] bg-blue-50/50 scale-[1.01]' 
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="w-16 h-16 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl font-bold border border-blue-100">
            <span className="material-symbols-outlined text-3xl">upload_file</span>
          </div>
          <p className="text-lg font-extrabold text-[#1E293B]">
            {file ? file.name : 'Arrastre aquí el PDF escaneado del Libro Matriz completo'}
          </p>
          <p className="text-xs text-[#64748B] mt-1 font-mono">
            Soporta archivos de hasta 200MB por Libro escaneado en HD (300 DPI)
          </p>
          
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={e => e.target.files && setFile(e.target.files[0])} 
            className="hidden" 
            id="libro-upload"
          />
          <label 
            htmlFor="libro-upload"
            className="inline-block mt-5 px-6 py-3 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-extrabold text-xs cursor-pointer transition-all shadow-md"
          >
            Explorar Archivo PDF
          </label>
        </div>

        {/* Metadatos Registrados - Entradas Estándar Claras (Fondo Blanco, Borde Gris) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24] text-base">edit_note</span>
            Metadatos del Libro Matriz
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Número de Libro *</label>
              <input 
                type="number"
                required
                value={formData.numero_libro}
                onChange={e => setFormData({ ...formData, numero_libro: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0F172A] font-mono font-bold text-sm text-center focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Tomo *</label>
              <input 
                type="text"
                required
                value={formData.tomo}
                onChange={e => setFormData({ ...formData, tomo: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0F172A] font-mono font-bold text-sm text-center focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Gestión *</label>
              <input 
                type="number"
                required
                value={formData.gestion}
                onChange={e => setFormData({ ...formData, gestion: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0F172A] font-mono font-bold text-sm text-center focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file}
            className="px-8 py-3.5 bg-[#003366] hover:bg-[#002244] disabled:opacity-50 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            Iniciar Carga e Indexación Celery
          </button>
        </div>
      </form>

      {/* Modales Claros */}
      {uploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 text-center space-y-4">
            <h3 className="text-lg font-extrabold text-[#003366]">Procesando Carga en Pipeline Celery OCR</h3>
            <p className="text-xs text-slate-600 font-mono">{statusText}</p>
            
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div 
                style={{ width: `${uploadProgress}%` }}
                className="h-full bg-[#003366] transition-all duration-300 rounded-full"
              ></div>
            </div>

            <span className="font-mono text-xs font-bold text-[#003366]">{uploadProgress}% Completado</span>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 text-center space-y-6">
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            
            <div>
              <h3 className="text-lg font-extrabold text-[#003366]">¡Libro Cargado e Indexado Correctamente!</h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                El Libro Matriz <strong>Nº {formData.numero_libro}</strong> (Tomo {formData.tomo}, Gestión {formData.gestion}) ha sido procesado por Celery e indexado en el Gemelo Digital.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setFile(null);
                }}
                className="px-6 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Subir Otro Libro Matriz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
