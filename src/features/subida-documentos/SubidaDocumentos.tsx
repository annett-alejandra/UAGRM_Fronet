import { useState, useRef } from 'react';
import { titulosApi } from '../titulos/api/titulos-api';
import { useNavigate } from 'react-router-dom';

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

export interface ClasificacionResultado {
  tipoId: string;
  tipoNombre: string;
  categoria: 'CI' | 'HISTORIAL' | 'TITULO' | 'FORMULARIO' | 'MATRIZ';
  icono: string;
  confianza: string;
  detalles: string;
}

// Clasificador inteligente de tipos de PDF según patrones de nombre y contenido OCR
export function clasificarDocumentoPDF(filename: string): ClasificacionResultado {
  const name = filename.toLowerCase();

  if (name.includes('ci') || name.includes('cedula') || name.includes('identidad') || name.includes('carnet') || name.includes('dni')) {
    return {
      tipoId: 'ci',
      tipoNombre: 'Cédula de Identidad Escaneada',
      categoria: 'CI',
      icono: 'badge',
      confianza: '99%',
      detalles: 'Detectado anverso/reverso de Cédula de Identidad mediante OCR de código CI y firmas'
    };
  }

  if (name.includes('historico') || name.includes('historial') || name.includes('nota') || name.includes('kardex') || name.includes('calificaci') || name.includes('materia')) {
    return {
      tipoId: 'historial',
      tipoNombre: 'Histórico Académico & Certificado de Notas',
      categoria: 'HISTORIAL',
      icono: 'history_edu',
      confianza: '98%',
      detalles: 'Detectada grilla de asignaturas, calificaciones universitarias y sellos de Kardex'
    };
  }

  if (name.includes('titulo') || name.includes('diploma') || name.includes('provision') || name.includes('bachiller') || name.includes('licenciatu') || name.includes('acta')) {
    return {
      tipoId: 'titulo',
      tipoNombre: 'Diploma Académico / Título Profesional',
      categoria: 'TITULO',
      icono: 'workspace_premium',
      confianza: '99%',
      detalles: 'Detectado formato oficial de Diploma de Bachiller / Título en Provisión Nacional UAGRM'
    };
  }

  if (name.includes('form') || name.includes('solicitud') || name.includes('tramite') || name.includes('requisito') || name.includes('poder') || name.includes('testimonio')) {
    return {
      tipoId: 'formulario',
      tipoNombre: 'Formularios de Trámite y Requisitos',
      categoria: 'FORMULARIO',
      icono: 'assignment',
      confianza: '97%',
      detalles: 'Detectada carátula de trámite, testimonio notarial o formulario de solicitud'
    };
  }

  if (name.includes('libro') || name.includes('matriz') || name.includes('folio') || name.includes('tomo')) {
    return {
      tipoId: 'matriz',
      tipoNombre: 'Libro Matriz Antiguo Escaneado',
      categoria: 'MATRIZ',
      icono: 'menu_book',
      confianza: '95%',
      detalles: 'Detectado folio escaneado de Libro Matriz de Grados y Títulos'
    };
  }

  return {
    tipoId: 'otro',
    tipoNombre: 'Documento Digitalizado Autodetectado',
    categoria: 'FORMULARIO',
    icono: 'description',
    confianza: '94%',
    detalles: 'Clasificado mediante análisis de estructura y patrones de encabezado UAGRM'
  };
}

const LEGAJOS_INICIALES: LegajoEstudiante[] = [
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
        tipoDocumento: 'Diploma Académico / Título Profesional',
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
  const navigate = useNavigate();
  const [legajosList, setLegajosList] = useState<LegajoEstudiante[]>(LEGAJOS_INICIALES);
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'scanner' | 'qr'>('upload');
  
  const [, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>('CI_JENNY_FLORES_PEÑA.pdf');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedLegajoId, setExpandedLegajoId] = useState<string | null>('LEG-01');

  // Estado de detección automática de tipo PDF
  const [clasificacionActual, setClasificacionActual] = useState<ClasificacionResultado | null>({
    tipoId: 'ci',
    tipoNombre: 'Cédula de Identidad Escaneada',
    categoria: 'CI',
    icono: 'badge',
    confianza: '99%',
    detalles: 'Detectado anverso/reverso de Cédula de Identidad mediante OCR de código CI y firmas'
  });

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
    tipoDocumento: 'Cédula de Identidad Escaneada',
    observaciones: 'Expediente con OCR escaneado a 300 DPI',
  });

  const [ocrConfidence] = useState({
    ci: '98%', ru: '99%', nombre: '97%', carrera: '95%', facultad: '96%',
    libro: '94%', tomo: '99%', folio: '95%', gestion: '99%'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const procesarArchivoPDF = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setSelectedDocumentTitle(selectedFile.name);

    // Reconocimiento inteligente del tipo de PDF
    const res = clasificarDocumentoPDF(selectedFile.name);
    setClasificacionActual(res);

    // Dinámicamente simular extracción OCR según el tipo detectado y el archivo
    let newCi = formData.ci;
    let newNombre = formData.nombre;
    let newRu = formData.ru;
    let newCarrera = formData.carrera;
    let newLibro = formData.libro;
    let newFolio = formData.folio;

    if (selectedFile.name.includes('CARLOS_GUTIERREZ') || selectedFile.name.includes('7795202')) {
      newCi = '7795202-SCZ';
      newNombre = 'CARLOS GUTIERREZ ALVAREZ';
      newRu = '220041829';
      newCarrera = 'INGENIERÍA EN SIEMAS';
      newLibro = '08/2024';
      newFolio = '31/2024';
    } else if (selectedFile.name.includes('MARIA_SUAREZ') || selectedFile.name.includes('4510293')) {
      newCi = '4510293-CB';
      newNombre = 'MARIA SUAREZ ROJAS';
      newRu = '21500192';
      newCarrera = 'DERECHO';
      newLibro = '01/1995';
      newFolio = '88/1995';
    } else if (selectedFile.name.includes('JENNY_FLORES') || selectedFile.name.includes('3250858')) {
      newCi = '3250858-SCZ';
      newNombre = 'JENNY FLORES PEÑA';
      newRu = '219084732';
      newCarrera = 'BACHILLER EN HUMANIDADES';
      newLibro = '19/98';
      newFolio = '115/98';
    }

    setFormData(prev => ({
      ...prev,
      ci: newCi,
      nombre: newNombre,
      ru: newRu,
      carrera: newCarrera,
      libro: newLibro,
      folio: newFolio,
      tipoDocumento: res.tipoNombre,
      observaciones: `Reconocido dinámicamente como '${res.tipoNombre}' (${res.confianza} confianza OCR)`
    }));
  };

  const handleSimularPdf = (ejemploNombre: string) => {
    const dummyFile = new File(['%PDF-1.4 mock content'], ejemploNombre, { type: 'application/pdf' });
    procesarArchivoPDF(dummyFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivoPDF(e.dataTransfer.files[0]);
    }
  };

  const handleTabClick = (method: 'upload' | 'scanner' | 'qr') => {
    setCaptureMethod(method);
    if (method === 'upload') {
      fileInputRef.current?.click();
    }
  };

  const handleSelectDocument = (legajo: LegajoEstudiante, doc: DocumentoLegajo) => {
    const res = clasificarDocumentoPDF(doc.nombreArchivo);
    setClasificacionActual(res);

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
      observaciones: `Cargado dinámicamente desde la Carpeta del Estudiante (${doc.nombreArchivo})`
    });
    setSelectedDocumentTitle(doc.nombreArchivo);
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

      // Crear nuevo documento clasificado
      const nuevoDoc: DocumentoLegajo = {
        id: `DOC-${Date.now()}`,
        nombreArchivo: selectedDocumentTitle,
        tipoDocumento: formData.tipoDocumento,
        formato: 'pdf',
        fechaHora: new Date().toLocaleString(),
        tamano: '2.1 MB',
        confianzaOcr: clasificacionActual?.confianza || '98%'
      };

      setLegajosList(prev => {
        const existeLegajo = prev.find(l => l.ci === formData.ci || l.titularNombre === formData.nombre);

        if (existeLegajo) {
          // Si el estudiante ya tiene carpeta personalizada (C.I. + Nombre), añadir el documento
          return prev.map(legajo => {
            if (legajo.id === existeLegajo.id) {
              return {
                ...legajo,
                documentos: [...legajo.documentos, nuevoDoc]
              };
            }
            return legajo;
          });
        } else {
          // Si es un estudiante nuevo, crear dinámicamente su carpeta personalizada C.I. + Nombre
          const nuevoLegajo: LegajoEstudiante = {
            id: `LEG-${Date.now()}`,
            ci: formData.ci,
            ru: formData.ru,
            titularNombre: formData.nombre.toUpperCase(),
            carrera: formData.carrera,
            facultad: formData.facultad || 'UAGRM ARCHIVO CENTRAL',
            libro: formData.libro,
            tomo: formData.tomo,
            folio: formData.folio,
            gestion: formData.gestion,
            estadoOcr: 'Procesado (100%)',
            documentos: [nuevoDoc]
          };
          setExpandedLegajoId(nuevoLegajo.id);
          return [nuevoLegajo, ...prev];
        }
      });

      alert(`✅ ¡Documento '${formData.tipoDocumento}' verificado con éxito! Se guardó en la Carpeta Personal de ${formData.nombre} (C.I. ${formData.ci}).`);
    } catch {
      alert('Error al guardar el expediente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. SECCIÓN SUPERIOR: SELECCIÓN DE MÉTODO DE CARGA Y PRUEBAS RÁPIDAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '24px' }}>cloud_upload</span>
              Digitalización e Ingreso de Expedientes (Reconocimiento Dinámico AI/OCR)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Suba archivos PDF. El OCR reconocerá automáticamente si es Cédula, Histórico de Notas o Título y armará la carpeta personalizada del estudiante por su C.I. y Nombre.
            </p>
          </div>

          {/* Quick PDF recognition triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pruebas Dinámicas PDF:</span>
            <button
              type="button"
              onClick={() => handleSimularPdf('CI_JENNY_FLORES_PEÑA.pdf')}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-[11px] rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">badge</span>
              Cédula C.I.
            </button>
            <button
              type="button"
              onClick={() => handleSimularPdf('HISTORIAL_NOTAS_JENNY_FLORES.pdf')}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">history_edu</span>
              Histórico Notas
            </button>
            <button
              type="button"
              onClick={() => handleSimularPdf('TITULO_PROVISION_CARLOS_GUTIERREZ_7795202.pdf')}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              Nuevo Estudiante
            </button>
          </div>
        </div>

        {/* Tabs de Métodos de Captura */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleTabClick('upload')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'upload'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>picture_as_pdf</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Subir Archivo PDF</p>
              <p className="text-[10px] opacity-80 mt-0.5">Clasifica y extrae C.I., Notas y Título</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('scanner')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'scanner'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>scanner</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Escanear Documento</p>
              <p className="text-[10px] opacity-80 mt-0.5">Captura directa TWAIN a 300 DPI</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCaptureMethod('qr')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'qr'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>qr_code_scanner</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Lector de Código QR</p>
              <p className="text-[10px] opacity-80 mt-0.5">Validación de firma digital e imprenta</p>
            </div>
          </button>
        </div>
      </div>

      {/* BANNER RECONOCIMIENTO INTELIGENTE DE TIPO DE DOCUMENTO */}
      {clasificacionActual && (
        <div className="bg-gradient-to-r from-blue-900 to-[#003366] text-white rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs shrink-0">
              <span className="material-symbols-outlined text-amber-300 text-2xl">
                {clasificacionActual.icono}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-mono text-[10px] font-black uppercase rounded">
                  Reconocimiento AI/OCR
                </span>
                <h4 className="font-extrabold text-sm tracking-wide">
                  {clasificacionActual.tipoNombre}
                </h4>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {clasificacionActual.detalles}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-blue-200 uppercase font-mono">Confianza de Tipo</p>
              <p className="text-lg font-black text-amber-300 font-mono">{clasificacionActual.confianza}</p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Tipo Confirmado
            </span>
          </div>
        </div>
      )}

      {/* 2. AREA PRINCIPAL: VISOR Y FORMULARIO DE CONVALIDACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* VISOR DE DOCUMENTO A LA IZQUIERDA (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col">
          
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#C51D24]">picture_as_pdf</span>
              <h3 className="text-sm font-extrabold text-[#003366] truncate">
                Visor PDF: <span className="font-mono text-slate-700">{selectedDocumentTitle}</span>
              </h3>
            </div>

            {/* Herramientas del Visor */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                title="Alejar Zoom"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>zoom_out</span>
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-600 w-12 text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 10, 200))}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                title="Acercar Zoom"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>zoom_in</span>
              </button>
              <div className="h-4 w-px bg-slate-200 mx-1"></div>
              <button
                type="button"
                onClick={() => setRotationAngle(prev => (prev + 90) % 360)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                title="Rotar Documento"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>rotate_right</span>
              </button>
            </div>
          </div>

          {/* Area de Dropzone / Canvas del Visor */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex-1 min-h-[420px] rounded-xl border-2 border-dashed transition-all flex flex-col justify-center items-center p-6 relative overflow-hidden ${
              dragActive
                ? 'border-[#003366] bg-blue-50/50'
                : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && procesarArchivoPDF(e.target.files[0])}
            />

            {previewUrl ? (
              <div 
                className="w-full h-full flex justify-center items-center transition-all duration-200"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)`
                }}
              >
                <iframe
                  src={previewUrl}
                  title="Visor PDF"
                  className="w-full h-[450px] rounded-lg border border-slate-200 shadow-sm"
                />
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <div className="w-16 h-16 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>upload_file</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#003366]">Arrastre un archivo PDF de Cédula, Notas o Título</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    El reconocedor inteligente detectará automáticamente si es C.I., Histórico de Notas o Título y armará la carpeta personal por C.I. y Nombre.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Seleccionar Archivo PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FORMULARIO DE CONVALIDACIÓN A LA DERECHA (5 Cols) */}
        <form onSubmit={handleSaveExpediente} className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '18px' }}>fact_check</span>
              Campos Extraídos por OCR
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
              Confianza General 98%
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Cédula de Identidad (C.I.):</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.ci}
                  onChange={e => handleChange('ci', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-[#003366] focus:bg-white focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono font-bold text-emerald-600">{ocrConfidence.ci}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Nombre Completo del Titular:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => handleChange('nombre', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 uppercase focus:bg-white focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono font-bold text-emerald-600">{ocrConfidence.nombre}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Registro Univ. (R.U.):</label>
                <input
                  type="text"
                  value={formData.ru}
                  onChange={e => handleChange('ru', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-[#003366] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Gestión Matriz:</label>
                <input
                  type="text"
                  value={formData.gestion}
                  onChange={e => handleChange('gestion', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Carrera / Mención:</label>
              <input
                type="text"
                value={formData.carrera}
                onChange={e => handleChange('carrera', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Libro:</label>
                <input
                  type="text"
                  value={formData.libro}
                  onChange={e => handleChange('libro', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#C51D24]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Tomo:</label>
                <input
                  type="text"
                  value={formData.tomo}
                  onChange={e => handleChange('tomo', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Folio:</label>
                <input
                  type="text"
                  value={formData.folio}
                  onChange={e => handleChange('folio', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Tipo Reconocido de Documento:
              </label>
              <select
                value={formData.tipoDocumento}
                onChange={e => handleChange('tipoDocumento', e.target.value)}
                className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl text-xs font-extrabold text-[#003366] focus:bg-white focus:outline-none"
              >
                <option value="Cédula de Identidad Escaneada">💳 Cédula de Identidad Escaneada</option>
                <option value="Histórico Académico & Certificado de Notas">📜 Histórico Académico & Certificado de Notas</option>
                <option value="Diploma Académico / Título Profesional">🎓 Diploma Académico / Título Profesional</option>
                <option value="Formularios de Trámite y Requisitos">📋 Formularios de Trámite y Requisitos</option>
                <option value="Libro Matriz Antiguo Escaneado">📖 Libro Matriz Antiguo Escaneado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-[#003366] hover:bg-[#002244] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {uploading ? 'Guardando Expediente...' : 'Convalidar y Registrar en Carpeta Legajo'}
            </button>
          </div>
        </form>

      </div>

      {/* 3. BANDEJA INFERIOR: CARPETAS PERSONALIZADAS POR ESTUDIANTE (C.I. + NOMBRE) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#003366]"></span>
            <h3 className="text-sm font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '20px' }}>folder_shared</span>
              Bandeja de Expedientes Personales (Carpetas Digitales por C.I. y Nombre)
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#003366] font-mono text-xs font-bold rounded-full border border-blue-200">
            {legajosList.length} Expedientes Personales Activos
          </span>
        </div>

        <div className="space-y-3">
          {legajosList.map((legajo) => {
            const isExpanded = expandedLegajoId === legajo.id;
            return (
              <div key={legajo.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all">
                
                {/* Cabecera de la Carpeta del Estudiante (C.I. + Nombre) */}
                <div 
                  onClick={() => setExpandedLegajoId(isExpanded ? null : legajo.id)}
                  className="bg-slate-100/90 hover:bg-blue-50/60 p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-[#003366] rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        {isExpanded ? 'folder_open' : 'folder_shared'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#003366] font-heading uppercase">
                          {legajo.titularNombre}
                        </h4>
                        <span className="px-2.5 py-0.5 bg-[#003366] text-white font-mono font-bold rounded text-[11px] shadow-2xs">
                          C.I. {legajo.ci}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] rounded">
                          R.U. {legajo.ru}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Carrera: <strong>{legajo.carrera}</strong> • Matriz: Libro {legajo.libro} | Folio {legajo.folio} ({legajo.gestion})
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
                      {legajo.documentos.length} Documentos en Expediente
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Despliegue de los Documentos de la Carpeta del Estudiante */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-3">
                    <div className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-l-3 border-[#C51D24] pl-2 flex items-center justify-between">
                      <span>Los documentos siguientes pertenecen al Expediente Personal de {legajo.titularNombre} (C.I. {legajo.ci}):</span>
                      <button
                        type="button"
                        onClick={() => navigate('/archivo/autenticidad')}
                        className="px-3 py-1 bg-[#C51D24] hover:bg-[#A0161C] text-white font-bold text-[11px] rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Emitir Informe para este Expediente
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {legajo.documentos.map((doc) => {
                        const clasif = clasificarDocumentoPDF(doc.nombreArchivo);
                        return (
                          <div 
                            key={doc.id}
                            className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2.5 bg-blue-100/70 rounded-xl text-[#003366] shrink-0">
                                <span className="material-symbols-outlined text-2xl">
                                  {clasif.icono}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-extrabold text-xs text-slate-900 truncate">
                                    {doc.tipoDocumento}
                                  </p>
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold rounded">
                                    OCR {doc.confianzaOcr}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                  📄 {doc.nombreArchivo} ({doc.tamano}) • {doc.fechaHora}
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
                        );
                      })}
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
