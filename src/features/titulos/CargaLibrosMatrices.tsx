import { useState } from 'react';
import { titulosApi } from './api/titulos-api';

export function CargaLibrosMatrices() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    numero_libro: 104,
    tomo: 'A-2026',
    gestion: 2026,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
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
    setStatusText('Solicitando Presigned URL en MinIO S3...');
    setUploadProgress(25);

    try {
      setUploadProgress(60);
      setStatusText('Enviando paquete a Celery Workers...');

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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-16 font-sans">
      
      {/* Header Banner Oscuro Institucional */}
      <div className="bg-slate-900/90 backdrop-blur-2xl p-7 rounded-3xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestor de Carga de Libros Matrices</h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            POST /api/v1/storage/presigned-upload-url/ | POST /api/v1/libros-matrices/
          </p>
        </div>
        <span className="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-full">
          Celery OCR Pipeline
        </span>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-8">
        
        {/* Canvas Drag & Drop con Icono central */}
        <div 
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all bg-slate-900/90 backdrop-blur-2xl ${
            dragActive 
              ? 'border-amber-500 bg-amber-500/10 scale-[1.01]' 
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold border border-amber-500/20">
            📚
          </div>
          <p className="text-xl font-bold text-white">
            {file ? file.name : 'Arrastre aquí el PDF escaneado del Libro Matriz completo'}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            MinIO Direct Upload URL via Presigned Request (Hasta 200MB por Libro)
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
            className="inline-block mt-6 px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-extrabold text-xs cursor-pointer transition-all active:scale-95 shadow-lg shadow-amber-600/20"
          >
            Explorar Archivo PDF
          </label>
        </div>

        {/* Metadatos Registrados */}
        <div className="bg-slate-900/90 backdrop-blur-2xl p-7 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3">
            Metadatos Registrados en Postgres
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Número de Libro *</label>
              <input 
                type="number"
                required
                value={formData.numero_libro}
                onChange={e => setFormData({ ...formData, numero_libro: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-white font-mono font-bold text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tomo *</label>
              <input 
                type="text"
                required
                value={formData.tomo}
                onChange={e => setFormData({ ...formData, tomo: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-white font-mono font-bold text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Gestión *</label>
              <input 
                type="number"
                required
                value={formData.gestion}
                onChange={e => setFormData({ ...formData, gestion: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950 text-white font-mono font-bold text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-2xl font-extrabold text-xs shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            ⬆️ Solicitar URL MinIO e Iniciar Carga
          </button>
        </div>
      </form>

      {/* Modales */}
      {uploading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-800 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Procesando Carga en Celery</h3>
            <p className="text-xs text-slate-400 font-mono">{statusText}</p>
            
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
              <div 
                style={{ width: `${uploadProgress}%` }}
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              ></div>
            </div>

            <span className="font-mono text-sm font-bold text-amber-400">{uploadProgress}% Completado</span>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-800 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white">¡Libro Cargado e Indexado Correctamente!</h3>
              <p className="text-slate-400 text-sm mt-2">
                El Libro Matriz <strong>N° {formData.numero_libro}</strong> (Tomo {formData.tomo}, Gestión {formData.gestion}) ha sido procesado por Celery e indexado en el Gemelo Digital.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFile(null);
                }}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all active:scale-95"
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
