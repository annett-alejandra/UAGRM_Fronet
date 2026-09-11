import { useState } from 'react';
import { titulosApi } from '../titulos/api/titulos-api';

export function SubidaDocumentos() {
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'scanner' | 'qr'>('upload');
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);

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
    
    setOcrSuccess(true);
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
      alert('✅ Expediente convalidado y registrado exitosamente en el sistema.');
    } catch {
      alert('❌ Error al guardar el expediente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-16 font-sans">
      
      {/* 1. Barra de Métodos de Captura (Fondo Blanco #FFFFFF y Bordes #E2E8F0) */}
      <div className="card p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-xl font-extrabold text-[#003366] tracking-tight font-heading">
              Digitalización & Escaneo OCR de Expedientes
            </h1>
            <p className="text-[#64748B] text-xs mt-0.5">
              Seleccione el método de captura para procesar el legajo físico mediante Celery OCR Engine
            </p>
          </div>
          
          <span className="badge-status-publicado font-mono">
            ● Motor OCR Activo (300 DPI)
          </span>
        </div>

        {/* 3 Pestañas de Métodos de Captura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCaptureMethod('upload')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'upload'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#003366] flex items-center justify-center font-bold text-lg">
              📄
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">1. Subir PDF / Archivo</div>
              <div className={`text-[10px] ${captureMethod === 'upload' ? 'text-slate-200' : 'text-[#64748B]'}`}>Explorador local y Arrastre</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('scanner')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'scanner'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#1B7A43] flex items-center justify-center font-bold text-lg">
              🖨️
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">2. Escanear Documento</div>
              <div className={`text-[10px] ${captureMethod === 'scanner' ? 'text-slate-200' : 'text-[#64748B]'}`}>Conexión directa Escáner TWAIN</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('qr')}
            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
              captureMethod === 'qr'
                ? 'bg-[#003366] border-[#003366] text-white font-bold shadow-sm'
                : 'bg-slate-50 border-[#E2E8F0] text-[#1E293B] hover:bg-slate-100'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#E5A823] flex items-center justify-center font-bold text-lg">
              📱
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase">3. Captura Móvil / Celular</div>
              <div className={`text-[10px] ${captureMethod === 'qr' ? 'text-slate-200' : 'text-[#64748B]'}`}>Escanear código QR con cámara</div>
            </div>
          </button>
        </div>

        <div className="pt-2">
          {captureMethod === 'upload' && (
            <div 
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-slate-50 ${
                dragActive 
                  ? 'border-[#003366] bg-blue-50/50' 
                  : 'border-[#E2E8F0] hover:border-[#003366]'
              }`}
            >
              <p className="text-sm font-bold text-[#1E293B]">
                {file ? `Archivo seleccionado: ${file.name}` : 'Arrastre y suelte el documento PDF del expediente aquí'}
              </p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Soporta PDF o imágenes escaneadas hasta 50MB</p>
              
              <input 
                type="file" 
                accept="application/pdf,image/*" 
                onChange={e => e.target.files && e.target.files[0] && handleFileSelected(e.target.files[0])} 
                className="hidden" 
                id="expediente-file"
              />
              <label 
                htmlFor="expediente-file"
                className="boton-crear inline-block mt-3 text-xs py-2 px-4 cursor-pointer"
              >
                Seleccionar PDF / Imagen
              </label>
            </div>
          )}

          {captureMethod === 'scanner' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-[#E2E8F0] text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1B7A43]/10 text-[#1B7A43] rounded-full text-xs font-mono">
                ● Estado del Escáner: Listo (Fujitsu fi-7160 Ventanilla)
              </div>
              <p className="text-xs text-[#1E293B]">Coloque las fojas físicas en el alimentador y presione Iniciar Escaneo</p>
              <button
                type="button"
                onClick={() => {
                  setOcrSuccess(true);
                  alert('🖨️ Escaneo iniciado. Fojas capturadas y enviadas al visor.');
                }}
                className="btn-secundario-curvo py-2.5 px-6"
              >
                Iniciar Escaneo Directo TWAIN
              </button>
            </div>
          )}

          {captureMethod === 'qr' && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
              <div className="w-28 h-28 bg-white p-2 rounded-xl border border-[#E2E8F0] flex items-center justify-center shadow-sm shrink-0">
                <div className="w-full h-full border-2 border-[#1E293B] p-1 flex flex-wrap gap-1">
                  <div className="w-4 h-4 bg-[#003366]"></div>
                  <div className="w-4 h-4 bg-[#003366]"></div>
                  <div className="w-4 h-4 bg-[#003366]"></div>
                  <div className="w-4 h-4 bg-[#C51D24]"></div>
                  <div className="w-4 h-4 bg-[#003366]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#003366]">Escanee este Código QR desde su Celular</h4>
                <p className="text-xs text-[#64748B] max-w-md">
                  Abra la cámara de su teléfono móvil para capturar y sincronizar la fotografía del título directamente al visor de cotejo.
                </p>
                <span className="text-[10px] text-[#E5A823] font-mono font-bold block pt-1">Session ID: QR-UAGRM-99014</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 2. Split-Screen 50/50 en Tarjetas Blancas Purísimas #FFFFFF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: Visor del Documento Original */}
        <div className="card p-5 space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span>🖼️</span> Visor de Legajo Original
            </h3>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-[#E2E8F0] text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 15, 50))}
                className="px-2 py-1 hover:bg-slate-200 rounded font-bold text-[#1E293B]"
                title="Alejar"
              >
                -
              </button>
              <span className="font-mono text-[10px] text-[#003366] font-bold px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 15, 200))}
                className="px-2 py-1 hover:bg-slate-200 rounded font-bold text-[#1E293B]"
                title="Acercar"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                className="px-2.5 py-1 hover:bg-slate-200 rounded font-bold text-[#C51D24] ml-1"
                title="Rotar 90°"
              >
                🔄 90°
              </button>
              <button
                type="button"
                onClick={() => { setZoomLevel(100); setRotationAngle(0); }}
                className="px-2 py-1 hover:bg-slate-200 rounded text-[10px] text-[#64748B]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Lienzo del Documento */}
          <div className="relative min-h-[580px] bg-slate-100 rounded-xl border border-[#E2E8F0] flex items-center justify-center overflow-auto p-4">
            
            {previewUrl ? (
              <div 
                className="transition-transform duration-200 ease-out flex justify-center"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`,
                }}
              >
                <img 
                  src={previewUrl} 
                  alt="Previsualización Expediente" 
                  className="max-h-[540px] w-auto object-contain rounded shadow-lg"
                />
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-64 h-80 bg-white text-[#1E293B] rounded shadow-lg mx-auto p-4 text-left font-serif text-[9px] space-y-2 border border-[#E2E8F0]">
                  <div className="border-b border-[#E2E8F0] pb-1 font-bold text-[#003366]">UAGRM - DEPARTAMENTO ARCHIVO CENTRAL</div>
                  <div className="font-extrabold text-xs text-[#C51D24]">DIPLOMA DE BACHILLER N° 014863</div>
                  <p>Titular: JENNY FLORES PEÑA</p>
                  <p>C.I.: 3250858-SCZ | R.U.: 219084732</p>
                  <p className="pt-2">Fojas: 115/98 | Libro: 19/98 | Tomo: 02</p>
                  <div className="pt-12 text-center border-t border-dashed border-[#E2E8F0]">
                    <p className="font-bold">Moisés Cossío López</p>
                    <p>JEFE DE ARCHIVO UAGRM</p>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#64748B] pt-2">
                  Vista Previa del Documento para Cotejo Visual
                </p>
              </div>
            )}
          </div>

        </div>

        {/* PANEL DERECHO: Formulario de Convalidación OCR */}
        <form onSubmit={handleSaveExpediente} className="card p-5 space-y-5 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span>✍️</span> Formulario de Convalidación OCR
            </h3>
            
            {ocrSuccess && (
              <span className="badge-status-publicado">
                ✓ OCR Auto-rellenado
              </span>
            )}
          </div>

          {/* Sección 1: Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
              1. Datos del Expediente Académico
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="space-y-4 border-t border-[#E2E8F0] pt-4">
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
              className="px-4 py-2.5 border border-[#E2E8F0] text-[#64748B] rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Limpiar Campos
            </button>
            
            <button
              type="submit"
              disabled={uploading}
              className="boton-editar py-2.5 px-6 text-xs font-bold shadow-sm"
            >
              {uploading ? 'Convalidando...' : 'Convalidar y Registrar Expediente'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
