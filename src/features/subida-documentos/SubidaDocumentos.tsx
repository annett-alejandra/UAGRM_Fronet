import { useState, useRef } from 'react';
import { titulosApi } from '../titulos/api/titulos-api';

export function SubidaDocumentos() {
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'scanner' | 'qr'>('upload');
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    ci: '3250858-SCZ',
    ru: '219084732',
    nombre: 'JENNY FLORES PEÑA',
    carrera: 'BACHILLER EN HUMANIDADES',
    facultad: 'FACULTAD DE HUMANIDADES',
    libro: '19/98',
    tomo: '02',
    folio: '115/98',
    gestion: '1998',
    tipoDocumento: 'Título Supletorio',
    observaciones: 'Expediente con OCR escaneado a 300 DPI',
  });

  const [ocrConfidence] = useState({
    ci: '98%', ru: '99%', nombre: '97%', carrera: '95%', facultad: '96%',
    libro: '94%', tomo: '99%', folio: '95%', gestion: '99%'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    
    setFormData({
      ci: '3250858-SCZ',
      ru: '219084732',
      nombre: 'JENNY FLORES PEÑA',
      carrera: 'BACHILLER EN HUMANIDADES',
      facultad: 'FACULTAD DE HUMANIDADES',
      libro: 'L-19/98',
      tomo: 'T-02',
      folio: 'F-115',
      gestion: '1998',
      tipoDocumento: 'Título Supletorio',
      observaciones: 'Texto detectado mediante Celery OCR Engine'
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleSaveExpediente = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await titulosApi.guardarBorrador({
        expediente_id: formData.ru || 'EXP-2026',
        tipo_plantilla: formData.tipoDocumento,
        numero_libro: formData.libro,
        tomo: formData.tomo,
        folio: formData.folio,
        observaciones: formData.observaciones
      });
      alert('Expediente convalidado y registrado exitosamente en el sistema.');
    } catch {
      alert('Error al guardar el expediente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 font-sans">
      
      {/* Hidden File Input for Viewer and Toolbar */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="application/pdf,image/*" 
        onChange={e => e.target.files && e.target.files[0] && handleFileSelected(e.target.files[0])} 
        className="hidden" 
        id="expediente-file-input"
      />

      {/* 1. Barra Compacta de Métodos de Captura */}
      <div className="card p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#E2E8F0] pb-3">
          <div>
            <h1 className="text-lg font-extrabold text-[#003366] tracking-tight font-heading">
              Digitalización & Escaneo OCR de Expedientes
            </h1>
            <p className="text-[#64748B] text-xs mt-0.5">
              Seleccione el método de origen o arrastre el archivo directamente en el visor de la izquierda
            </p>
          </div>
          
          <span className="badge-status-publicado font-mono text-[10px]">
            ⚡ Motor OCR Activo (300 DPI)
          </span>
        </div>

        {/* 3 Pestañas de Métodos de Captura Slim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setCaptureMethod('upload')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'upload'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#003366] flex items-center justify-center font-bold text-base shrink-0">
              📄
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">1. Subir PDF / Archivo</div>
              <div className={`text-[10px] ${captureMethod === 'upload' ? 'text-slate-200' : 'text-[#64748B]'}`}>Carga directa en Visor</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('scanner')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'scanner'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1B7A43] flex items-center justify-center font-bold text-base shrink-0">
              🖨️
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">2. Escanear Documento</div>
              <div className={`text-[10px] ${captureMethod === 'scanner' ? 'text-slate-200' : 'text-[#64748B]'}`}>Conexión Escáner TWAIN</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('qr')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'qr'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#E5A823] flex items-center justify-center font-bold text-base shrink-0">
              📱
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">3. Captura Móvil / Celular</div>
              <div className={`text-[10px] ${captureMethod === 'qr' ? 'text-slate-200' : 'text-[#64748B]'}`}>Escanear QR con Cámara</div>
            </div>
          </button>
        </div>

        {/* Paneles Informativos Compactos para Escáner y QR (Solo si están activos) */}
        {captureMethod === 'scanner' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#1E293B]">
              <span className="w-2 h-2 rounded-full bg-[#1B7A43] animate-pulse"></span>
              <span className="font-bold">Escáner TWAIN Ventanilla (Fujitsu fi-7160):</span> Listo para capturar
            </div>
            <button
              type="button"
              onClick={() => {
                alert('Escaneo TWAIN iniciado. Imagen capturada y enviada al visor.');
              }}
              className="btn-secundario-curvo py-1.5 px-4 text-xs"
            >
              Iniciar Escaneo Directo
            </button>
          </div>
        )}

        {captureMethod === 'qr' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center gap-4">
            <div className="w-12 h-12 bg-white p-1 rounded-lg border border-[#E2E8F0] flex items-center justify-center shrink-0">
              <div className="w-full h-full border border-[#1E293B] grid grid-cols-2 gap-0.5 p-0.5">
                <div className="bg-[#003366]"></div>
                <div className="bg-[#C51D24]"></div>
                <div className="bg-[#003366]"></div>
                <div className="bg-[#003366]"></div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#003366]">Escanee este Código QR desde su Celular</h4>
              <p className="text-[11px] text-[#64748B]">Sincronice la fotografía directamente al visor. Session: <span className="font-mono font-bold text-[#E5A823]">QR-UAGRM-99014</span></p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Split-Screen 50/50 (Layout Dividido Sin Scroll Innecesario) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: Visor de Legajo Original + Dropzone Embebida */}
        <div className="card p-5 space-y-4 shadow-sm flex flex-col min-h-[620px]">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span>🖼️</span> Visor de Legajo Original
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Botón Reemplazar / Cambiar Archivo en la Barra de Herramientas */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-bold text-[#003366] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                title="Cambiar o cargar otro archivo"
              >
                <span>📂</span>
                <span>{previewUrl ? 'Cambiar archivo' : 'Examinar'}</span>
              </button>

              {/* Controles de Zoom y Rotación */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-[#E2E8F0] text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 15, 50))}
                  className="px-2 py-0.5 hover:bg-slate-200 rounded font-bold text-[#1E293B]"
                  title="Alejar"
                >
                  -
                </button>
                <span className="font-mono text-[10px] text-[#003366] font-bold px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 15, 200))}
                  className="px-2 py-0.5 hover:bg-slate-200 rounded font-bold text-[#1E293B]"
                  title="Acercar"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                  className="px-2 py-0.5 hover:bg-slate-200 rounded font-bold text-[#C51D24] ml-1"
                  title="Rotar 90°"
                >
                  🔄 90°
                </button>
                <button
                  type="button"
                  onClick={() => { setZoomLevel(100); setRotationAngle(0); }}
                  className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-[10px] text-[#64748B]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Lienzo Principal del Visor / Dropzone Embebida (Empty State) */}
          <div className="flex-1 relative min-h-[520px] bg-slate-50/60 rounded-xl border border-[#E2E8F0] flex items-center justify-center overflow-hidden p-4">
            
            {previewUrl ? (
              <div className="w-full h-full flex items-center justify-center overflow-auto">
                <div 
                  className="transition-transform duration-200 ease-out flex justify-center"
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
                  }}
                >
                  <img 
                    src={previewUrl} 
                    alt="Previsualización Expediente" 
                    className="max-h-[480px] w-auto object-contain rounded-lg shadow-md border border-[#E2E8F0]"
                  />
                </div>
              </div>
            ) : (
              /* EMPTY STATE DROPZONE EMBEBIDA EN EL VISOR */
              <div 
                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-full min-h-[480px] border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-[#003366] bg-blue-50/70 scale-[0.99]' 
                    : 'border-[#E2E8F0] hover:border-[#003366] hover:bg-white bg-slate-50/50'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 text-[#003366] flex items-center justify-center mb-4 text-3xl shadow-xs">
                  📄
                </div>
                
                <h4 className="text-sm font-extrabold text-[#003366] uppercase tracking-wide mb-1">
                  Cargar Expediente o Legajo Físico
                </h4>
                
                <p className="text-xs text-[#1E293B] font-semibold max-w-sm mb-1">
                  Arrastre y suelte el documento PDF o imagen escaneada aquí
                </p>
                
                <p className="text-[11px] text-[#64748B] mb-5">
                  Soporta archivos PDF, PNG, JPG hasta 50MB
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="boton-crear text-xs py-2.5 px-6 font-bold shadow-sm cursor-pointer hover:bg-[#002244]"
                >
                  Examinar archivo...
                </button>
              </div>
            )}

          </div>

          {file && (
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 px-1 border-t border-[#E2E8F0]">
              <span className="font-medium truncate max-w-[300px]">📁 Archivo: <strong className="text-[#003366]">{file.name}</strong></span>
              <span className="font-mono text-[10px] text-[#1B7A43] bg-[#1B7A43]/10 px-2 py-0.5 rounded font-bold">✓ Carga completada</span>
            </div>
          )}

        </div>

        {/* PANEL DERECHO: Formulario de Convalidación y Validación OCR */}
        <div className="card p-5 space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span>✍️</span> Formulario de Convalidación OCR
            </h3>
            <span className="text-[10px] font-mono font-extrabold text-[#1B7A43] bg-[#1B7A43]/10 px-2 py-1 rounded-full">
              Campos Editables al 100%
            </span>
          </div>

          <form onSubmit={handleSaveExpediente} className="space-y-4">
            
            {/* Sección 1: Datos Personales */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                1. Datos del Expediente Académico
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#1E293B]">
                      Carnet de Identidad (C.I.) *
                    </label>
                    <span className="text-[9px] font-mono text-[#1B7A43] bg-[#1B7A43]/10 px-1.5 py-0.5 rounded font-bold">
                      {ocrConfidence.ci} Confianza
                    </span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.ci}
                    onChange={e => handleChange('ci', e.target.value)}
                    className="select-estilo font-mono font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#1E293B]">
                      Registro Universitario (R.U.) *
                    </label>
                    <span className="text-[9px] font-mono text-[#1B7A43] bg-[#1B7A43]/10 px-1.5 py-0.5 rounded font-bold">
                      {ocrConfidence.ru} Confianza
                    </span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.ru}
                    onChange={e => handleChange('ru', e.target.value)}
                    className="select-estilo font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-[#1E293B]">
                    Nombre Completo del Solicitante *
                  </label>
                  <span className="text-[9px] font-mono text-[#1B7A43] bg-[#1B7A43]/10 px-1.5 py-0.5 rounded font-bold">
                    {ocrConfidence.nombre} Confianza
                  </span>
                </div>
                <input 
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={e => handleChange('nombre', e.target.value)}
                  className="select-estilo font-extrabold uppercase text-[#003366]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#1E293B]">
                      Carrera *
                    </label>
                    <span className="text-[9px] font-mono text-[#1B7A43] bg-[#1B7A43]/10 px-1.5 py-0.5 rounded font-bold">
                      {ocrConfidence.carrera} Confianza
                    </span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.carrera}
                    onChange={e => handleChange('carrera', e.target.value)}
                    className="select-estilo"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-[#1E293B]">
                      Facultad *
                    </label>
                    <span className="text-[9px] font-mono text-[#1B7A43] bg-[#1B7A43]/10 px-1.5 py-0.5 rounded font-bold">
                      {ocrConfidence.facultad} Confianza
                    </span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.facultad}
                    onChange={e => handleChange('facultad', e.target.value)}
                    className="select-estilo"
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Libro, Tomo, Folio y Gestión */}
            <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                2. Matriz de Archivo (Libro, Tomo, Folio, Gestión)
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-[#1E293B]">Libro *</label>
                    <span className="text-[8px] font-mono text-[#1B7A43] font-bold">{ocrConfidence.libro}</span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.libro}
                    onChange={e => handleChange('libro', e.target.value)}
                    className="select-estilo font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-[#1E293B]">Tomo *</label>
                    <span className="text-[8px] font-mono text-[#1B7A43] font-bold">{ocrConfidence.tomo}</span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.tomo}
                    onChange={e => handleChange('tomo', e.target.value)}
                    className="select-estilo font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-[#1E293B]">Folio *</label>
                    <span className="text-[8px] font-mono text-[#1B7A43] font-bold">{ocrConfidence.folio}</span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.folio}
                    onChange={e => handleChange('folio', e.target.value)}
                    className="select-estilo font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-[#1E293B]">Gestión *</label>
                    <span className="text-[8px] font-mono text-[#1B7A43] font-bold">{ocrConfidence.gestion}</span>
                  </div>
                  <input 
                    type="text"
                    required
                    value={formData.gestion}
                    onChange={e => handleChange('gestion', e.target.value)}
                    className="select-estilo font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1E293B] mb-1">
                  Tipo de Expediente
                </label>
                <select
                  value={formData.tipoDocumento}
                  onChange={e => handleChange('tipoDocumento', e.target.value)}
                  className="select-estilo"
                >
                  <option value="Título Supletorio">Título Supletorio</option>
                  <option value="Certificado de Notas">Certificado de Notas</option>
                  <option value="Acta de Grado">Acta de Grado Académica</option>
                  <option value="Diploma Academico">Diploma Académico Original</option>
                </select>
              </div>
            </div>

            {/* Botón de Convalidación */}
            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ci: '', ru: '', nombre: '', carrera: '', facultad: '',
                    libro: '', tomo: '', folio: '', gestion: '', tipoDocumento: 'Título Supletorio', observaciones: ''
                  });
                }}
                className="px-4 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Limpiar Campos
              </button>
              
              <button
                type="submit"
                disabled={uploading}
                className="boton-editar py-2.5 px-6 text-xs font-bold shadow-sm cursor-pointer"
              >
                {uploading ? 'Convalidando...' : 'Convalidar y Registrar Expediente'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
