import { useState } from 'react';
import { titulosApi } from './api/titulos-api';

export function CargaLibrosMatrices() {
  const [formData, setFormData] = useState({
    numero_libro: 42,
    tomo: 'II',
    gestion: 1998,
  });

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
    setUploadProgress(15);
    setStatusText('Solicitando Presigned URL a MinIO (POST /api/v1/storage/presigned-upload-url/)...');

    try {
      // Step 1: Request presigned upload URL
      const presigned = await titulosApi.getPresignedUploadUrl({
        filename: file.name,
        content_type: file.type || 'application/pdf'
      });

      setUploadProgress(50);
      setStatusText('Registrando Libro Matriz en Backend (POST /api/v1/libros-matrices/)...');

      // Step 2: Register libro matriz
      const reg = await titulosApi.registrarLibroMatriz({
        numero_libro: formData.numero_libro,
        tomo: formData.tomo,
        gestion: formData.gestion,
        storage_key: presigned.object_key
      });

      setUploadProgress(85);
      setStatusText('Monitoreando Celery OCR Job (GET /api/v1/libros-matrices/{id}/estado/)...');

      // Step 3: Check Celery status
      setTimeout(async () => {
        const estado = await titulosApi.getEstadoLibro(reg.libro_id);
        setUploadProgress(100);
        setStatusText(estado.mensaje);
        setUploading(false);
        setShowSuccessModal(true);
      }, 1000);

    } catch {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestor de Carga de Libros Matrices (Upload Masivo & Celery)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Endpoints: <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-600">POST /api/v1/storage/presigned-upload-url/</code> | <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-emerald-600">POST /api/v1/libros-matrices/</code>
          </p>
        </div>
        <span className="px-3.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-full border border-amber-200 dark:border-amber-800">
          Celery OCR Pipeline
        </span>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-8">
        {/* Zona Drag & Drop */}
        <div 
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all bg-white dark:bg-slate-800 ${
            dragActive 
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 scale-[1.01]' 
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
          }`}
        >
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
            📚
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Arrastre aquí el PDF escaneado del Libro Matriz completo'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            MinIO Direct Upload URL via Presigned Request
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
            className="inline-block mt-5 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm cursor-pointer transition-colors shadow-md"
          >
            Explorar PDF de Libro
          </label>
        </div>

        {/* Metadatos */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
            Metadatos Registrados en Postgres
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Número de Libro *</label>
              <input 
                type="number"
                required
                value={formData.numero_libro}
                onChange={e => setFormData({ ...formData, numero_libro: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Tomo *</label>
              <input 
                type="text"
                required
                value={formData.tomo}
                onChange={e => setFormData({ ...formData, tomo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Gestión *</label>
              <input 
                type="number"
                required
                value={formData.gestion}
                onChange={e => setFormData({ ...formData, gestion: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file}
            className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2"
          >
            ⬆️ Solicitar URL MinIO e Iniciar Carga
          </button>
        </div>
      </form>

      {/* Modal 1: Progress */}
      {uploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Procesando Carga en Celery</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{statusText}</p>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-4 rounded-full overflow-hidden">
              <div 
                style={{ width: `${uploadProgress}%` }}
                className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              ></div>
            </div>

            <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">{uploadProgress}% Completado</span>
          </div>
        </div>
      )}

      {/* Modal 2: Success Confirmation */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">¡Libro Cargado e Indexado Correctamente!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                El Libro Matriz <strong>N° {formData.numero_libro}</strong> (Tomo {formData.tomo}, Gestión {formData.gestion}) ha sido procesado por Celery e indexado en el Gemelo Digital.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFile(null);
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
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
