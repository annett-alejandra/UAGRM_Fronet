import { useState, useRef } from 'react';
import { titulosApi } from '../titulos/api/titulos-api';

interface DocumentoLegajo {
  id: string;
  nombreArchivo: string;
  tipoDocumento: string;
  formato: 'pdf' | 'png' | 'jpg';
  fechaHora: string;
  tamano: string;
  confianzaOcr: string;
}

interface LegajoEstudiante {
  id: string;
  ci: string;
  ru: string;
  titularNombre: string;
  carrera: string;
  facultad: string;
  libro: string;
  tomo: string;
  folio: string;
  gestion: string;
  estadoOcr: 'Procesado (100%)' | 'Procesado (98%)' | 'Pendiente Convalidación';
  documentos: DocumentoLegajo[];
}

const LEGAJOS_PROCESADOS: LegajoEstudiante[] = [
  {
    id: 'LEG-01',
    ci: '3250858-SCZ',
    ru: '219084732',
    titularNombre: 'JENNY FLORES PEÑA',
    carrera: 'BACHILLER EN HUMANIDADES',
    facultad: 'FACULTAD DE HUMANIDADES',
    libro: '19/98',
    tomo: '02',
    folio: '115/98',
    gestion: '1998',
    estadoOcr: 'Procesado (98%)',
    documentos: [
      {
        id: 'DOC-101',
        nombreArchivo: 'CI_JENNY_FLORES_PEÑA.pdf',
        tipoDocumento: 'Cédula de Identidad Escaneada',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:15',
        tamano: '1.2 MB',
        confianzaOcr: '99%'
      },
      {
        id: 'DOC-102',
        nombreArchivo: 'HISTORICO_NOTAS_JENNY_FLORES.pdf',
        tipoDocumento: 'Histórico Académico & Certificado de Notas',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:16',
        tamano: '3.4 MB',
        confianzaOcr: '98%'
      },
      {
        id: 'DOC-103',
        nombreArchivo: 'DIPLOMA_BACHILLER_014863.pdf',
        tipoDocumento: 'Diploma de Bachiller / Título Académico',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:17',
        tamano: '2.8 MB',
        confianzaOcr: '97%'
      },
      {
        id: 'DOC-104',
        nombreArchivo: 'FORMULARIO_REQUISITOS_TRAMITE.pdf',
        tipoDocumento: 'Formularios de Trámite y Requisitos',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:18',
        tamano: '850 KB',
        confianzaOcr: '99%'
      }
    ]
  },
  {
    id: 'LEG-02',
    ci: '8072900-SCZ',
    ru: '21809931',
    titularNombre: 'CARLOS MENDOZA ARTEAGA',
    carrera: 'MEDICINA CIRUGÍA',
    facultad: 'FACULTAD DE MEDICINA',
    libro: '05/2022',
    tomo: '01',
    folio: '42/2022',
    gestion: '2022',
    estadoOcr: 'Procesado (100%)',
    documentos: [
      {
        id: 'DOC-201',
        nombreArchivo: 'CI_CARLOS_MENDOZA.pdf',
        tipoDocumento: 'Cédula de Identidad Escaneada',
        formato: 'pdf',
        fechaHora: '11/09/2026 09:40',
        tamano: '1.1 MB',
        confianzaOcr: '100%'
      },
      {
        id: 'DOC-202',
        nombreArchivo: 'HISTORICO_MEDICINA_MENDOZA.pdf',
        tipoDocumento: 'Histórico Académico & Certificado de Notas',
        formato: 'pdf',
        fechaHora: '11/09/2026 09:41',
        tamano: '4.1 MB',
        confianzaOcr: '99%'
      },
      {
        id: 'DOC-203',
        nombreArchivo: 'TITULO_PROVISION_NACIONAL_96071.pdf',
        tipoDocumento: 'Título en Provisión Nacional',
        formato: 'pdf',
        fechaHora: '11/09/2026 09:42',
        tamano: '2.5 MB',
        confianzaOcr: '100%'
      }
    ]
  },
  {
    id: 'LEG-03',
    ci: '4510293-CB',
    ru: '21500192',
    titularNombre: 'MARIA SUAREZ ROJAS',
    carrera: 'DERECHO',
    facultad: 'FACULTAD DE CIENCIAS JURÍDICAS',
    libro: '01/1995',
    tomo: '03',
    folio: '88/1995',
    gestion: '1995',
    estadoOcr: 'Pendiente Convalidación',
    documentos: [
      {
        id: 'DOC-301',
        nombreArchivo: 'CI_MARIA_SUAREZ.pdf',
        tipoDocumento: 'Cédula de Identidad Escaneada',
        formato: 'pdf',
        fechaHora: '11/09/2026 08:12',
        tamano: '980 KB',
        confianzaOcr: '95%'
      },
      {
        id: 'DOC-302',
        nombreArchivo: 'LIBRO_MATRIZ_1995_SCAN.png',
        tipoDocumento: 'Libro Matriz Antiguo Escaneado',
        formato: 'png',
        fechaHora: '11/09/2026 08:14',
        tamano: '5.6 MB',
        confianzaOcr: '90%'
      }
    ]
  }
];

export function SubidaDocumentos() {
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'scanner' | 'qr'>('upload');
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>('CI_JENNY_FLORES_PEÑA.pdf');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedLegajoId, setExpandedLegajoId] = useState<string | null>('LEG-01');

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
    setSelectedDocumentTitle(selectedFile.name);
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

  const handleSelectDocument = (legajo: LegajoEstudiante, doc: DocumentoLegajo) => {
    setFormData({
      ci: legajo.ci,
      ru: legajo.ru,
      nombre: legajo.titularNombre,
      carrera: legajo.carrera,
      facultad: legajo.facultad,
      libro: legajo.libro,
      tomo: legajo.tomo,
      folio: legajo.folio,
      gestion: legajo.gestion,
      tipoDocumento: doc.tipoDocumento,
      observaciones: `Cargado reactivamente desde el Legajo Digital (${doc.nombreArchivo})`
    });
    setSelectedDocumentTitle(doc.nombreArchivo);
    alert(`Documento '${doc.nombreArchivo}' cargado al visor para ${legajo.titularNombre}.`);
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
            3. Digitalización OCR & Legajos Académicos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de Carpetas Multidocumento por Estudiante y Convalidación OCR Institucional.
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
        
        {/* COLUMNA IZQUIERDA: Visor de Legajo (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold text-[#003366] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]">preview</span>
              Visor: <span className="font-mono text-slate-700">{selectedDocumentTitle}</span>
            </h3>
            
            {/* Controles del Visor */}
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

          {/* Área Previsualización */}
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
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>folder_open</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Visualizando: {selectedDocumentTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1">Seleccione un documento de la carpeta del legajo inferior o suba un nuevo PDF.</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Subir Nuevo Archivo
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
                <option value="Certificado de Autenticidad">Certificado de Autenticidad</option>
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
              className="w-full py-3 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {uploading ? 'Guardando Expediente...' : 'Convalidar y Registrar Expediente'}
            </button>
          </div>
        </form>

      </div>

      {/* 3. BANDEJA INFERIOR: LEGAJO ACADÉMICO COMO CARPETA MULTIDOCUMENTO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#003366]"></span>
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '20px' }}>folder_shared</span>
              Bandeja de Legajos Digitales (Estructura de Carpeta por Estudiante)
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#003366] font-mono text-xs font-bold rounded-full border border-blue-200">
            {LEGAJOS_PROCESADOS.length} Carpetas de Estudiantes
          </span>
        </div>

        <div className="space-y-3">
          {LEGAJOS_PROCESADOS.map((legajo) => {
            const isExpanded = expandedLegajoId === legajo.id;
            return (
              <div key={legajo.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all">
                
                {/* Cabecera de la Carpeta del Estudiante */}
                <div 
                  onClick={() => setExpandedLegajoId(isExpanded ? null : legajo.id)}
                  className="bg-slate-100/90 hover:bg-blue-50/60 p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#003366]" style={{ fontSize: '28px' }}>
                      {isExpanded ? 'folder_open' : 'folder'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#003366] font-heading uppercase">
                          {legajo.titularNombre}
                        </h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-[#003366] font-mono font-bold rounded text-[11px]">
                          C.I. {legajo.ci}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] rounded">
                          R.U. {legajo.ru}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {legajo.carrera} • Matriz: Libro {legajo.libro} | Folio {legajo.folio} ({legajo.gestion})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 font-bold rounded-full text-[10px] inline-flex items-center gap-1 ${
                      legajo.estadoOcr.includes('100%')
                        ? 'bg-emerald-100 text-emerald-800'
                        : legajo.estadoOcr.includes('98%')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {legajo.estadoOcr}
                    </span>

                    <span className="px-3 py-1 bg-white text-[#003366] font-bold text-xs rounded-lg border border-slate-300 flex items-center gap-1 shadow-2xs">
                      {legajo.documentos.length} PDFs en Carpeta
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Despliegue de los Documentos de la Carpeta del Estudiante */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">
                      📁 Documentos Digitalizados Asociados al C.I. {legajo.ci}:
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {legajo.documentos.map((doc) => (
                        <div 
                          key={doc.id}
                          className="p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="material-symbols-outlined text-red-600 shrink-0" style={{ fontSize: '24px' }}>
                              {doc.formato === 'pdf' ? 'picture_as_pdf' : 'image'}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-800 truncate">
                                {doc.tipoDocumento}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono truncate">
                                {doc.nombreArchivo} ({doc.tamano})
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectDocument(legajo, doc)}
                            className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                            Cargar al Visor
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
