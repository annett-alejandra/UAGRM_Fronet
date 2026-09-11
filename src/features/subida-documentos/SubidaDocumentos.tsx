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

  const handleTabClick = (method: 'upload' | 'scanner' | 'qr') => {
    setCaptureMethod(method);
    if (method === 'upload') {
      fileInputRef.current?.click();
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
    <div className="max-w-[1600px] mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 font-sans bg-[#F8FAFC]">
      
      {/* Input de archivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="application/pdf,image/*" 
        onChange={e => e.target.files && e.target.files[0] && handleFileSelected(e.target.files[0])} 
        className="hidden" 
        id="expediente-file-input"
      />

      {/* 1. Barra de Métodos de Captura */}
      <div className="card p-4 space-y-3 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#E2E8F0] pb-3">
          <div>
            <h1 className="text-lg font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003366]">document_scanner</span>
              Digitalización & Escaneo OCR de Expedientes
            </h1>
            <p className="text-[#64748B] text-xs mt-0.5">
              Haga clic en 'Subir PDF / Archivo' para explorar en su equipo o arrastre directamente en el visor de la izquierda
            </p>
          </div>
          
          <span className="badge-status-publicado font-mono text-[10px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#1B7A43]" style={{ fontSize: '14px' }}>bolt</span>
            Motor OCR Activo (300 DPI)
          </span>
        </div>

        {/* 3 Pestañas de Métodos de Captura Directa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleTabClick('upload')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              captureMethod === 'upload'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-[#003366] flex items-center justify-center font-bold text-base shrink-0">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>upload_file</span>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">1. Subir PDF / Archivo</div>
              <div className={`text-[10px] ${captureMethod === 'upload' ? 'text-slate-200' : 'text-[#64748B]'}`}>Explorar en equipo / Carga inmediata</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('scanner')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              captureMethod === 'scanner'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#1B7A43] flex items-center justify-center font-bold text-base shrink-0">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>print</span>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">2. Escanear Documento</div>
              <div className={`text-[10px] ${captureMethod === 'scanner' ? 'text-slate-200' : 'text-[#64748B]'}`}>Conexión Escáner TWAIN</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('qr')}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
              captureMethod === 'qr'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-[#E5A823] flex items-center justify-center font-bold text-base shrink-0">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>qr_code_scanner</span>
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">3. Captura Móvil / Celular</div>
              <div className={`text-[10px] ${captureMethod === 'qr' ? 'text-slate-200' : 'text-[#64748B]'}`}>Escanear QR con Cámara</div>
            </div>
          </button>
        </div>

        {/* Paneles Informativos Slim */}
        {captureMethod === 'scanner' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#1E293B]">
              <span className="w-2 h-2 rounded-full bg-[#1B7A43] animate-pulse"></span>
              <span className="font-bold">Escáner TWAIN Ventanilla (Fujitsu fi-7160):</span> Listo para capturar
            </div>
            <button
              type="button"
              onClick={() => alert('Escaneo TWAIN iniciado. Imagen capturada y enviada al visor.')}
              className="btn-secundario-curvo py-1.5 px-4 text-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>play_arrow</span>
              Iniciar Escaneo Directo
            </button>
          </div>
        )}

        {captureMethod === 'qr' && (
          <div className="p-3 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center gap-4">
            <div className="w-12 h-12 bg-white p-1 rounded-lg border border-[#E2E8F0] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#003366]" style={{ fontSize: '32px' }}>qr_code_2</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#003366]">Escanee este Código QR desde su Celular</h4>
              <p className="text-[11px] text-[#64748B]">Sincronice la fotografía directamente al visor. Session: <span className="font-mono font-bold text-[#E5A823]">QR-UAGRM-99014</span></p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Split-Screen 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: Visor de Legajo Original */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm flex flex-col min-h-[620px]">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003366]">image</span>
              Visor de Legajo Original
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-bold text-[#003366] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                title="Cambiar o cargar otro archivo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>folder_open</span>
                <span>{previewUrl ? 'Cambiar archivo' : 'Examinar'}</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-[#E2E8F0] text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 15, 50))}
                  className="p-1 hover:bg-slate-200 rounded text-[#1E293B] flex items-center"
                  title="Alejar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>zoom_out</span>
                </button>
                <span className="font-mono text-[10px] text-[#003366] font-bold px-1">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 15, 200))}
                  className="p-1 hover:bg-slate-200 rounded text-[#1E293B] flex items-center"
                  title="Acercar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>zoom_in</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                  className="p-1 hover:bg-slate-200 rounded text-[#C51D24] ml-1 flex items-center gap-0.5"
                  title="Rotar 90°"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rotate_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setZoomLevel(100); setRotationAngle(0); }}
                  className="p-1 hover:bg-slate-200 rounded text-[#64748B] flex items-center"
                  title="Restablecer"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
                </button>
              </div>
            </div>
          </div>

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
              /* DROPZONE EMBEBIDA EN VISOR VACÍO */
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
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>cloud_upload</span>
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
                  className="boton-crear text-xs py-2.5 px-6 font-bold shadow-sm cursor-pointer hover:bg-[#002244] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>folder_open</span>
                  Examinar archivo...
                </button>
              </div>
            )}

          </div>

          {file && (
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-1 px-1 border-t border-[#E2E8F0]">
              <span className="font-medium truncate max-w-[300px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[#003366]" style={{ fontSize: '16px' }}>description</span>
                Archivo: <strong className="text-[#003366]">{file.name}</strong>
              </span>
              <span className="font-mono text-[10px] text-[#1B7A43] bg-[#1B7A43]/10 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                Carga completada
              </span>
            </div>
          )}

        </div>

        {/* PANEL DERECHO: Formulario de Convalidación OCR */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003366]">edit_note</span>
              Formulario de Convalidación OCR
            </h3>
            <span className="text-[10px] font-mono font-extrabold text-[#1B7A43] bg-[#1B7A43]/10 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
              Campos Editables al 100%
            </span>
          </div>

          <form onSubmit={handleSaveExpediente} className="space-y-4">
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2 flex items-center gap-1">
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

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ci: '', ru: '', nombre: '', carrera: '', facultad: '',
                    libro: '', tomo: '', folio: '', gestion: '', tipoDocumento: 'Título Supletorio', observaciones: ''
                  });
                }}
                className="px-4 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cleaning_services</span>
                Limpiar Campos
              </button>
              
              <button
                type="submit"
                disabled={uploading}
                className="boton-editar py-2.5 px-6 text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                {uploading ? 'Convalidando...' : 'Convalidar y Registrar Expediente'}
              </button>
            </div>

          </form>

        </div>
      </div>
    
      {/* 3. BANDEJA INFERIOR DE ARCHIVOS / EXPEDIENTES PROCESADOS EN LOTE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#003366]"></span>
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '20px' }}>folder_managed</span>
              Historial de Expedientes & Legajos Procesados (Lote Actual)
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#003366] font-mono text-xs font-bold rounded-full border border-blue-200">
            3 Archivos en Lista
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 rounded-l-xl">Archivo / Vista Previa</th>
                <th className="p-3">Fecha / Hora Carga</th>
                <th className="p-3">C.I. Detectado</th>
                <th className="p-3">Titular / Expediente</th>
                <th className="p-3">Estado OCR</th>
                <th className="p-3 text-right rounded-r-xl">Acción Directa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-[#003366] flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                  <span>EXPEDIENTE_JENNY_FLORES_3250858.pdf</span>
                </td>
                <td className="p-3 text-slate-600 font-mono">11/09/2026 10:15</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-[#003366] font-mono font-bold rounded text-[11px]">
                    3250858-SCZ
                  </span>
                </td>
                <td className="p-3 font-bold text-slate-800">JENNY FLORES PEÑA</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Procesado (98%)
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
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
                        observaciones: 'Cargado reactivamente desde el historial'
                      });
                      alert('Expediente de JENNY FLORES PEÑA cargado al visor y formulario OCR.');
                    }}
                    className="px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Cargar al Visor
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-[#003366] flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">picture_as_pdf</span>
                  <span>CERT_CARLOS_MENDOZA_8072900.pdf</span>
                </td>
                <td className="p-3 text-slate-600 font-mono">11/09/2026 09:40</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-blue-100 text-[#003366] font-mono font-bold rounded text-[11px]">
                    8072900-SCZ
                  </span>
                </td>
                <td className="p-3 font-bold text-slate-800">CARLOS MENDOZA ARTEAGA</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    Procesado (100%)
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ci: '8072900-SCZ',
                        ru: '21809931',
                        nombre: 'CARLOS MENDOZA ARTEAGA',
                        carrera: 'MEDICINA CIRUGÍA',
                        facultad: 'FACULTAD DE MEDICINA',
                        libro: '05/2022',
                        tomo: '01',
                        folio: '42/2022',
                        gestion: '2022',
                        tipoDocumento: 'Título en Provisión Nacional',
                        observaciones: 'Expediente digitalizado con validación automatizada'
                      });
                      alert('Expediente de CARLOS MENDOZA ARTEAGA cargado al visor y formulario OCR.');
                    }}
                    className="px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Cargar al Visor
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-semibold text-[#003366] flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">image</span>
                  <span>HISTORICO_MARIA_SUAREZ_SCAN.png</span>
                </td>
                <td className="p-3 text-slate-600 font-mono">11/09/2026 08:12</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold rounded text-[11px]">
                    4510293-CB
                  </span>
                </td>
                <td className="p-3 font-bold text-slate-800">MARIA SUAREZ ROJAS</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px] inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Pendiente Convalidación
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ci: '4510293-CB',
                        ru: '21500192',
                        nombre: 'MARIA SUAREZ ROJAS',
                        carrera: 'DERECHO',
                        facultad: 'FACULTAD DE CIENCIAS JURÍDICAS',
                        libro: '01/1995',
                        tomo: '03',
                        folio: '88/1995',
                        gestion: '1995',
                        tipoDocumento: 'Título Académico',
                        observaciones: 'Libro antiguo con desgaste de tinta'
                      });
                      alert('Expediente de MARIA SUAREZ ROJAS cargado al visor y formulario OCR.');
                    }}
                    className="px-3 py-1.5 bg-[#003366] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 ml-auto shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Cargar al Visor
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>