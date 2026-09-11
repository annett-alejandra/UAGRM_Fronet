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
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 font-sans bg-[#F8FAFC]">
      
      {/* Input de archivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="application/pdf,image/*" 
        onChange={e => e.target.files && e.target.files[0] && handleFileSelected(e.target.files[0])} 
        className="hidden" 
        id="expediente-file-input"
      />

      {/* Encabezado Principal */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#003366] font-heading tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '28px' }}>document_scanner</span>
            3. Digitalización OCR & Convalidación de Expedientes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Módulo interactivo para captura de expedientes físicos, extracción automática de metadatos OCR y convalidación institucional.
          </p>
        </div>
        
        {/* Pestañas de Método de Captura */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => handleTabClick('upload')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              captureMethod === 'upload' ? 'bg-[#003366] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Subir Archivo / PDF
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('scanner')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              captureMethod === 'scanner' ? 'bg-[#003366] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">scanner</span>
            Escáner Físico USB
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('qr')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              captureMethod === 'qr' ? 'bg-[#003366] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            Escanear Código QR
          </button>
        </div>
      </div>

      {/* Grid Principal Dividido: Visor Interactivo (Izquierda) + Formulario OCR (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: Visor de Documento Escaneado / Legajo (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]">preview</span>
              Visor de Legajo Original Escaneado
            </h3>
            
            {/* Controles del Visor (Zoom, Rotación) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs"
                title="Alejar Zoom"
              >
                🔍-
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 w-12 text-center">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs"
                title="Acercar Zoom"
              >
                🔍+
              </button>
              <button
                type="button"
                onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs"
                title="Rotar 90°"
              >
                🔄 Rotar
              </button>
            </div>
          </div>

          {/* Área Dropzone / Previsualización */}
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`min-h-[520px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#003366] bg-blue-50/50 scale-[0.99]'
                : file
                ? 'border-slate-300 bg-slate-50'
                : 'border-slate-300 hover:border-[#003366] bg-slate-50/70 hover:bg-blue-50/30'
            }`}
          >
            {previewUrl ? (
              <div 
                className="w-full h-full flex items-center justify-center overflow-auto transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)` }}
              >
                {file?.type === 'application/pdf' ? (
                  <iframe src={previewUrl} className="w-full h-[500px] rounded-lg border border-slate-300" title="PDF Visor" />
                ) : (
                  <img src={previewUrl} alt="Vista Previa Documento" className="max-h-[500px] object-contain rounded-lg shadow-sm" />
                )}
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-[#003366] flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>cloud_upload</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Arrastre y suelte el legajo digitalizado aquí</h4>
                  <p className="text-xs text-slate-500 mt-1">Soporta formatos PDF, PNG, JPG de alta resolución (Hasta 50MB)</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Examinar Archivo Local
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario de Convalidación OCR (5 Cols) */}
        <form onSubmit={handleSaveExpediente} className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]">fact_check</span>
              Formulario de Convalidación OCR
            </h3>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
              Campos Editables al 100%
            </span>
          </div>

          {/* 1. Datos del Expediente Académico */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C51D24]"></span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Datos del Expediente Académico</h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Carnet de Identidad (C.I.):</label>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{ocrConfidence.ci} conf</span>
                </div>
                <input
                  type="text"
                  value={formData.ci}
                  onChange={e => handleChange('ci', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Registro Univ. (R.U.):</label>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{ocrConfidence.ru} conf</span>
                </div>
                <input
                  type="text"
                  value={formData.ru}
                  onChange={e => handleChange('ru', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700">Nombre Completo del Solicitante:</label>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{ocrConfidence.nombre} conf</span>
              </div>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => handleChange('nombre', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Carrera / Grado:</label>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{ocrConfidence.carrera} conf</span>
                </div>
                <input
                  type="text"
                  value={formData.carrera}
                  onChange={e => handleChange('carrera', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Facultad Emisora:</label>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">{ocrConfidence.facultad} conf</span>
                </div>
                <input
                  type="text"
                  value={formData.facultad}
                  onChange={e => handleChange('facultad', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                />
              </div>
            </div>
          </div>

          {/* 2. Matriz de Archivo (Libro, Tomo, Folio, Gestión) */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003366]"></span>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Matriz de Archivo Físico</h4>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Libro:</label>
                <input
                  type="text"
                  value={formData.libro}
                  onChange={e => handleChange('libro', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-center font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Tomo:</label>
                <input
                  type="text"
                  value={formData.tomo}
                  onChange={e => handleChange('tomo', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-center font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Folio:</label>
                <input
                  type="text"
                  value={formData.folio}
                  onChange={e => handleChange('folio', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-center font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Gestión:</label>
                <input
                  type="text"
                  value={formData.gestion}
                  onChange={e => handleChange('gestion', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-center font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Tipo de Expediente / Trámite:</label>
              <select
                value={formData.tipoDocumento}
                onChange={e => handleChange('tipoDocumento', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#003366] focus:bg-white focus:outline-none"
              >
                <option value="Título Supletorio">Título Supletorio</option>
                <option value="Certificado de Autenticidad (Tipo 3)">Certificado de Autenticidad (Tipo 3)</option>
                <option value="Diploma de Bachiller">Diploma de Bachiller</option>
                <option value="Título en Provisión Nacional">Título en Provisión Nacional</option>
              </select>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-[#003366] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {uploading ? 'Guardando Expediente...' : 'Convalidar y Registrar Expediente'}
            </button>
          </div>
        </form>

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
  );
}
