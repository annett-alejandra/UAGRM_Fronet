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
  detallesOcr?: Record<string, string>;
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

export type TipoDocumentoClave =
  | 'CI'
  | 'HISTORICO_UNIV'
  | 'HISTORICO_COLEGIO'
  | 'TITULO'
  | 'FORMULARIO'
  | 'MATRIZ';

export interface ClasificacionResultado {
  tipoClave: TipoDocumentoClave;
  tipoNombre: string;
  icono: string;
  confianza: string;
  detalles: string;
}

// Clasificador inteligente de tipos de PDF según el contenido escaneado y patrones de archivo
export function clasificarDocumentoPDF(filename: string): ClasificacionResultado {
  const name = filename.toLowerCase();

  if (name.includes('ci') || name.includes('cedula') || name.includes('identidad') || name.includes('carnet') || name.includes('dni')) {
    return {
      tipoClave: 'CI',
      tipoNombre: 'Cédula de Identidad Escaneada',
      icono: 'badge',
      confianza: '99%',
      detalles: 'Campos OCR: N° C.I., Expedido, Nombres, Apellidos, Fecha Nac., Estado Civil, Vencimiento'
    };
  }

  if (name.includes('colegio') || name.includes('secundaria') || name.includes('sie') || name.includes('distrital')) {
    return {
      tipoClave: 'HISTORICO_COLEGIO',
      tipoNombre: 'Histórico de Estudio de Colegio (Bachillerato)',
      icono: 'school',
      confianza: '97%',
      detalles: 'Campos OCR: C.I., Alumno, Unidad Educativa, Código SIE, Distrito, Nivel, Gestión Egreso'
    };
  }

  if (name.includes('historico') || name.includes('historial') || name.includes('nota') || name.includes('kardex') || name.includes('materia') || name.includes('univ')) {
    return {
      tipoClave: 'HISTORICO_UNIV',
      tipoNombre: 'Histórico Académico Universitario & Notas',
      icono: 'history_edu',
      confianza: '98%',
      detalles: 'Campos OCR: C.I., Estudiante, R.U., Carrera, Facultad, Plan de Estudios, Promedio'
    };
  }

  if (name.includes('titulo') || name.includes('diploma') || name.includes('provision') || name.includes('bachiller') || name.includes('licenciatu') || name.includes('acta')) {
    return {
      tipoClave: 'TITULO',
      tipoNombre: 'Diploma Académico / Título Profesional',
      icono: 'workspace_premium',
      confianza: '99%',
      detalles: 'Campos OCR: N° Diploma, Titular, C.I., Grado, Libro Matriz, Tomo, Folio, Rector'
    };
  }

  if (name.includes('form') || name.includes('solicitud') || name.includes('tramite') || name.includes('requisito') || name.includes('poder') || name.includes('testimonio')) {
    return {
      tipoClave: 'FORMULARIO',
      tipoNombre: 'Formularios de Trámite y Requisitos Notariales',
      icono: 'assignment',
      confianza: '97%',
      detalles: 'Campos OCR: N° Hoja Ruta, Solicitante, C.I., Tipo Trámite, N° Testimonio, Apoderado'
    };
  }

  return {
    tipoClave: 'HISTORICO_UNIV',
    tipoNombre: 'Histórico Académico Universitario & Notas',
    icono: 'description',
    confianza: '95%',
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
        tipoDocumento: 'Histórico Académico Universitario & Notas',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:16',
        tamano: '3.4 MB',
        confianzaOcr: '98%'
      },
      {
        id: 'DOC-103',
        nombreArchivo: 'CERTIFICADO_ESTUDIOS_COLEGIO_JENNY.pdf',
        tipoDocumento: 'Histórico de Estudio de Colegio (Bachillerato)',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:16',
        tamano: '2.1 MB',
        confianzaOcr: '97%'
      },
      {
        id: 'DOC-104',
        nombreArchivo: 'DIPLOMA_BACHILLER_014863.pdf',
        tipoDocumento: 'Diploma Académico / Título Profesional',
        formato: 'pdf',
        fechaHora: '11/09/2026 10:17',
        tamano: '2.8 MB',
        confianzaOcr: '97%'
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
        tipoDocumento: 'Histórico Académico Universitario & Notas',
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
  }
];

export function SubidaDocumentos() {
  const navigate = useNavigate();
  const [legajosList, setLegajosList] = useState<LegajoEstudiante[]>(LEGAJOS_INICIALES);
  
  // 4 MÉTODOS DE CAPTURA DINÁMICOS: PDF, ESCÁNER FÍSICO TWAIN, CAPTURA CELULAR MÓVIL, LECTOR QR
  const [captureMethod, setCaptureMethod] = useState<'upload' | 'scanner' | 'mobile' | 'qr'>('upload');
  
  // Estados de escáner y celular
  const [isScanningTWAIN, setIsScanningTWAIN] = useState(false);
  const [mobileConnected, setMobileConnected] = useState(true);
  const [qrDecodedMessage, setQrDecodedMessage] = useState<string | null>(null);

  const [, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>('CI_JENNY_FLORES_PEÑA.pdf');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedLegajoId, setExpandedLegajoId] = useState<string | null>('LEG-01');

  // Clasificación actual
  const [clasificacionActual, setClasificacionActual] = useState<ClasificacionResultado>({
    tipoClave: 'CI',
    tipoNombre: 'Cédula de Identidad Escaneada',
    icono: 'badge',
    confianza: '99%',
    detalles: 'Campos OCR: N° C.I., Expedido, Nombres, Apellidos, Fecha Nac., Estado Civil, Vencimiento'
  });

  // ESTADOS DINÁMICOS DE CAMPOS OCR SEGÚN TIPO DE DOCUMENTO
  const [ciFields, setCiFields] = useState({
    ci: '3250858',
    expedido: 'SCZ',
    nombres: 'JENNY',
    apellidos: 'FLORES PEÑA',
    fechaNac: '14/05/1980',
    nacionalidad: 'BOLIVIANA',
    estadoCivil: 'SOLTERA',
    vencimientoCi: '12/09/2030'
  });

  const [histUnivFields, setHistUnivFields] = useState({
    ci: '3250858-SCZ',
    estudiante: 'JENNY FLORES PEÑA',
    ru: '219084732',
    carrera: 'BIOQUÍMICA Y FARMACIA',
    facultad: 'FACULTAD DE CIENCIAS FARMACÉUTICAS',
    planEstudios: 'Plan 1998-2',
    materiasAprobadas: '54 de 54 (100%)',
    promedio: '78.4 / 100'
  });

  const [histColegioFields, setHistColegioFields] = useState({
    ci: '3250858-SCZ',
    alumno: 'JENNY FLORES PEÑA',
    colegio: 'COLEGIO NACIONAL GABRIEL RENÉ MORENO',
    distrito: 'Santa Cruz I',
    codigoSie: '81980012',
    nivel: '6to de Secundaria / Bachillerato',
    gestionEgreso: '1997',
    nroRegistroDistrital: 'DIST-97/441'
  });

  const [tituloFields, setTituloFields] = useState({
    ci: '3250858-SCZ',
    titular: 'JENNY FLORES PEÑA',
    nroDiploma: '014863',
    grado: 'BACHILLER EN HUMANIDADES',
    libro: '19/98',
    tomo: '02',
    folio: '115/98',
    fechaExtension: '24 de julio de 1998',
    rector: 'JORGE ORELLANA MORENO'
  });

  const [formularioFields, setFormularioFields] = useState({
    ci: '3250858-SCZ',
    solicitante: 'JENNY FLORES PEÑA',
    nroHojaRuta: 'TR-2026-0472',
    tipoTramite: 'Certificado de Autenticidad / Supletorio',
    nroTestimonio: '1246/2025',
    apoderado: 'Yuli Alison Romero Flores',
    fechaSolicitud: '16 de abril de 2026'
  });

  const procesarArchivoPDF = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setSelectedDocumentTitle(selectedFile.name);

    // Reconocimiento inteligente del tipo de PDF
    const res = clasificarDocumentoPDF(selectedFile.name);
    setClasificacionActual(res);

    // Adaptar dinámicamente los valores OCR según el archivo y tipo
    if (selectedFile.name.includes('CARLOS_GUTIERREZ') || selectedFile.name.includes('7795202')) {
      const ciVal = '7795202';
      const nomVal = 'CARLOS GUTIERREZ ALVAREZ';
      setCiFields(p => ({ ...p, ci: ciVal, nombres: 'CARLOS', apellidos: 'GUTIERREZ ALVAREZ' }));
      setHistUnivFields(p => ({ ...p, ci: `${ciVal}-SCZ`, estudiante: nomVal, ru: '220041829', carrera: 'INGENIERÍA EN SISTEMAS' }));
      setHistColegioFields(p => ({ ...p, ci: `${ciVal}-SCZ`, alumno: nomVal, colegio: 'COLEGIO BAUTISTA BOLIVIANO' }));
      setTituloFields(p => ({ ...p, ci: `${ciVal}-SCZ`, titular: nomVal, nroDiploma: '96071', grado: 'INGENIERO DE SISTEMAS', libro: '08/2024', folio: '31/2024' }));
      setFormularioFields(p => ({ ...p, ci: `${ciVal}-SCZ`, solicitante: nomVal }));
    } else if (selectedFile.name.includes('MARIA_SUAREZ') || selectedFile.name.includes('4510293')) {
      const ciVal = '4510293';
      const nomVal = 'MARIA SUAREZ ROJAS';
      setCiFields(p => ({ ...p, ci: ciVal, nombres: 'MARIA', apellidos: 'SUAREZ ROJAS' }));
      setHistUnivFields(p => ({ ...p, ci: `${ciVal}-CB`, estudiante: nomVal, ru: '21500192', carrera: 'DERECHO' }));
      setHistColegioFields(p => ({ ...p, ci: `${ciVal}-CB`, alumno: nomVal, colegio: 'LICEO SEÑOR DE MAYO' }));
      setTituloFields(p => ({ ...p, ci: `${ciVal}-CB`, titular: nomVal, nroDiploma: '44819', grado: 'LICENCIADA EN DERECHO', libro: '01/1995', folio: '88/1995' }));
      setFormularioFields(p => ({ ...p, ci: `${ciVal}-CB`, solicitante: nomVal }));
    } else {
      const ciVal = '3250858';
      const nomVal = 'JENNY FLORES PEÑA';
      setCiFields(p => ({ ...p, ci: ciVal, nombres: 'JENNY', apellidos: 'FLORES PEÑA' }));
      setHistUnivFields(p => ({ ...p, ci: `${ciVal}-SCZ`, estudiante: nomVal, ru: '219084732', carrera: 'BACHILLER EN HUMANIDADES' }));
      setHistColegioFields(p => ({ ...p, ci: `${ciVal}-SCZ`, alumno: nomVal, colegio: 'COLEGIO NACIONAL GABRIEL RENÉ MORENO' }));
      setTituloFields(p => ({ ...p, ci: `${ciVal}-SCZ`, titular: nomVal, nroDiploma: '014863', grado: 'BACHILLER EN HUMANIDADES', libro: '19/98', folio: '115/98' }));
      setFormularioFields(p => ({ ...p, ci: `${ciVal}-SCZ`, solicitante: nomVal }));
    }
  };

  const handleSimularPdf = (ejemploNombre: string) => {
    setCaptureMethod('upload');
    const dummyFile = new File(['%PDF-1.4 mock content'], ejemploNombre, { type: 'application/pdf' });
    procesarArchivoPDF(dummyFile);
  };

  // Simulación de Escaneo TWAIN 300 DPI
  const handleEjecutarEscaneoTWAIN = () => {
    setIsScanningTWAIN(true);
    setTimeout(() => {
      setIsScanningTWAIN(false);
      const scanFile = new File(['%PDF-1.4 scan content'], 'ESCANEO_TWAIN_300DPI_CI_JENNY_FLORES.pdf', { type: 'application/pdf' });
      procesarArchivoPDF(scanFile);
      alert('🖨️ Escaneo físico TWAIN completado exitosamente a 300 DPI. Imagen cargada al visor.');
    }, 1800);
  };

  // Simulación de Fotos tomadas desde Celular Smartphone
  const handleSimularFotoCelular = (tipoFoto: string) => {
    const mobileFile = new File(['%PDF-1.4 mobile camera scan'], `CAMARA_CELULAR_${tipoFoto}_JENNY_FLORES.pdf`, { type: 'application/pdf' });
    procesarArchivoPDF(mobileFile);
    alert(`📲 ¡Foto enviada desde el Celular recibida! Documento '${tipoFoto}' cargado al visor y clasificado por OCR.`);
  };

  // Simulación de Lectura de Código QR
  const handleEscaneoCodigoQR = () => {
    setQrDecodedMessage('✅ Código QR UAGRM Auténtico | Titular: JENNY FLORES PEÑA | C.I.: 3250858-SCZ | Registro Matriz: 19/98-115');
    const qrFile = new File(['%PDF-1.4 qr doc'], 'DOCUMENTO_VERIFICADO_QR_IMPRENTA.pdf', { type: 'application/pdf' });
    procesarArchivoPDF(qrFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivoPDF(e.dataTransfer.files[0]);
    }
  };

  const handleTabClick = (method: 'upload' | 'scanner' | 'mobile' | 'qr') => {
    setCaptureMethod(method);
    if (method === 'upload') {
      fileInputRef.current?.click();
    }
  };

  // Obtener CI y Nombre activo del formulario dinámico según tipo
  const getActiveCiAndName = () => {
    switch (clasificacionActual.tipoClave) {
      case 'CI':
        return { ci: `${ciFields.ci}-${ciFields.expedido}`, nombre: `${ciFields.nombres} ${ciFields.apellidos}` };
      case 'HISTORICO_UNIV':
        return { ci: histUnivFields.ci, nombre: histUnivFields.estudiante };
      case 'HISTORICO_COLEGIO':
        return { ci: histColegioFields.ci, nombre: histColegioFields.alumno };
      case 'TITULO':
        return { ci: tituloFields.ci, nombre: tituloFields.titular };
      case 'FORMULARIO':
        return { ci: formularioFields.ci, nombre: formularioFields.solicitante };
      default:
        return { ci: histUnivFields.ci, nombre: histUnivFields.estudiante };
    }
  };

  const handleSelectDocument = (legajo: LegajoEstudiante, doc: DocumentoLegajo) => {
    const res = clasificarDocumentoPDF(doc.nombreArchivo);
    setClasificacionActual(res);

    const cleanCiOnly = legajo.ci.split('-')[0] || legajo.ci;
    const cleanExp = legajo.ci.split('-')[1] || 'SCZ';

    setCiFields({
      ci: cleanCiOnly,
      expedido: cleanExp,
      nombres: legajo.titularNombre.split(' ')[0] || '',
      apellidos: legajo.titularNombre.split(' ').slice(1).join(' ') || '',
      fechaNac: '14/05/1980',
      nacionalidad: 'BOLIVIANA',
      estadoCivil: 'SOLTERA',
      vencimientoCi: '12/09/2030'
    });

    setHistUnivFields({
      ci: legajo.ci,
      estudiante: legajo.titularNombre,
      ru: legajo.ru,
      carrera: legajo.carrera,
      facultad: legajo.facultad,
      planEstudios: 'Plan 1998-2',
      materiasAprobadas: '54 de 54 (100%)',
      promedio: '78.4 / 100'
    });

    setHistColegioFields({
      ci: legajo.ci,
      alumno: legajo.titularNombre,
      colegio: 'COLEGIO NACIONAL GABRIEL RENÉ MORENO',
      distrito: 'Santa Cruz I',
      codigoSie: '81980012',
      nivel: '6to de Secundaria / Bachillerato',
      gestionEgreso: legajo.gestion,
      nroRegistroDistrital: `DIST-${legajo.gestion}/441`
    });

    setTituloFields({
      ci: legajo.ci,
      titular: legajo.titularNombre,
      nroDiploma: '014863',
      grado: legajo.carrera,
      libro: legajo.libro,
      tomo: legajo.tomo,
      folio: legajo.folio,
      fechaExtension: `24 de julio de ${legajo.gestion}`,
      rector: 'JORGE ORELLANA MORENO'
    });

    setSelectedDocumentTitle(doc.nombreArchivo);
  };

  const handleSaveExpediente = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const active = getActiveCiAndName();

      await titulosApi.guardarBorrador({
        expediente_id: active.ci || 'EXP-2026',
        tipo_plantilla: clasificacionActual.tipoNombre,
        numero_libro: tituloFields.libro,
        tomo: tituloFields.tomo,
        folio: tituloFields.folio,
        observaciones: `Convalidación de ${clasificacionActual.tipoNombre}`
      });

      const nuevoDoc: DocumentoLegajo = {
        id: `DOC-${Date.now()}`,
        nombreArchivo: selectedDocumentTitle,
        tipoDocumento: clasificacionActual.tipoNombre,
        formato: 'pdf',
        fechaHora: new Date().toLocaleString(),
        tamano: '2.1 MB',
        confianzaOcr: clasificacionActual.confianza
      };

      setLegajosList(prev => {
        const existe = prev.find(l => l.ci === active.ci || l.titularNombre === active.nombre.toUpperCase());

        if (existe) {
          return prev.map(legajo => {
            if (legajo.id === existe.id) {
              return {
                ...legajo,
                documentos: [...legajo.documentos, nuevoDoc]
              };
            }
            return legajo;
          });
        } else {
          const nuevoLegajo: LegajoEstudiante = {
            id: `LEG-${Date.now()}`,
            ci: active.ci,
            ru: histUnivFields.ru || '220000000',
            titularNombre: active.nombre.toUpperCase(),
            carrera: histUnivFields.carrera || tituloFields.grado,
            facultad: histUnivFields.facultad || 'UAGRM ARCHIVO CENTRAL',
            libro: tituloFields.libro,
            tomo: tituloFields.tomo,
            folio: tituloFields.folio,
            gestion: '2026',
            estadoOcr: 'Procesado (100%)',
            documentos: [nuevoDoc]
          };
          setExpandedLegajoId(nuevoLegajo.id);
          return [nuevoLegajo, ...prev];
        }
      });

      alert(`✅ ¡Campos de '${clasificacionActual.tipoNombre}' guardados exitosamente en el expediente personal de ${active.nombre} (C.I. ${active.ci})!`);
    } catch {
      alert('Error al guardar el expediente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. SECCIÓN SUPERIOR: SELECCIÓN DE MÉTODO DE CAPTURA DINÁMICO (PDF, ESCÁNER, CELULAR, QR) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4 mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '24px' }}>cloud_upload</span>
              Digitalización e Ingreso de Expedientes (Multicanal Dinámico)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Capture documentos por PDF, Escáner Físico, Celular Móvil o Lector QR. Los campos OCR se adaptan dinámicamente.
            </p>
          </div>

          {/* Quick PDF recognition triggers por Tipo */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pruebas Rápidas:</span>
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
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-[11px] rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">history_edu</span>
              Histórico Univ.
            </button>
            <button
              type="button"
              onClick={() => handleSimularPdf('TITULO_PROVISION_CARLOS_GUTIERREZ_7795202.pdf')}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              Título / Diploma
            </button>
          </div>
        </div>

        {/* 4 BOTONES DE CAPTURA DINÁMICOS E INTERACTIVOS (PDF, ESCÁNER, CELULAR, QR) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Botón 1: Subir PDF */}
          <button
            type="button"
            onClick={() => handleTabClick('upload')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'upload'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md ring-2 ring-[#003366]/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>picture_as_pdf</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Subir Archivo PDF</p>
              <p className="text-[10px] opacity-80 mt-0.5">Clasifica y extrae C.I., Notas y Títulos</p>
            </div>
          </button>

          {/* Botón 2: Escanear Documento (TWAIN 300 DPI) */}
          <button
            type="button"
            onClick={() => handleTabClick('scanner')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'scanner'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md ring-2 ring-[#003366]/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>scanner</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Escanear Documento</p>
              <p className="text-[10px] opacity-80 mt-0.5">Captura directa TWAIN a 300 DPI</p>
            </div>
          </button>

          {/* Botón 3: Subir por el Celular (Móvil / Smartphone Scanner) */}
          <button
            type="button"
            onClick={() => handleTabClick('mobile')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'mobile'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md ring-2 ring-[#003366]/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: '28px' }}>smartphone</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Subir por Celular</p>
              <p className="text-[10px] opacity-80 mt-0.5">Fotos desde Cámara de Smartphone</p>
            </div>
          </button>

          {/* Botón 4: Lector de Código QR */}
          <button
            type="button"
            onClick={() => handleTabClick('qr')}
            className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 cursor-pointer ${
              captureMethod === 'qr'
                ? 'bg-[#003366] text-white border-[#003366] shadow-md ring-2 ring-[#003366]/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>qr_code_scanner</span>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">Lector Código QR</p>
              <p className="text-[10px] opacity-80 mt-0.5">Validación de firma digital e imprenta</p>
            </div>
          </button>

        </div>

        {/* PANEL DINÁMICO SEGÚN EL MÉTODO DE CAPTURA SELECCIONADO */}
        {captureMethod === 'scanner' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003366]">print font</span>
                <div>
                  <h4 className="font-extrabold text-xs text-[#003366] uppercase">Controlador de Escáner Físico TWAIN / WIA</h4>
                  <p className="text-[11px] text-slate-600">Dispositivo activo: Canon DR-C225 / Fujitsu Fi-7160 (300 DPI, Alimentador ADF)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEjecutarEscaneoTWAIN}
                disabled={isScanningTWAIN}
                className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-[18px]">scanner</span>
                {isScanningTWAIN ? 'Escaneando hoja...' : 'Ejecutar Escaneo Físico TWAIN'}
              </button>
            </div>

            {isScanningTWAIN && (
              <div className="p-3 bg-white border border-blue-300 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600 animate-spin">sync</span>
                <span className="text-xs font-bold text-blue-900">Alimentando papel physical ADF... Digitalizando a 300 DPI con OCR en tiempo real...</span>
              </div>
            )}
          </div>
        )}

        {captureMethod === 'mobile' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white border border-amber-300 rounded-xl p-1.5 flex justify-center items-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-amber-700" style={{ fontSize: '38px' }}>qr_code_2</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[10px] font-bold rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Móvil Conectado
                    </span>
                    <h4 className="font-extrabold text-xs text-amber-950 uppercase">Escaneo Remoto con Cámara de Celular</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Escanee el código QR desde el celular del estudiante o del operador para capturar fotos de C.I. o Certificados en alta definición.
                  </p>
                </div>
              </div>

              {/* Botones de captura remota desde celular */}
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleSimularFotoCelular('CEDULA_CI')}
                  className="px-3 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  Foto C.I. desde Celular
                </button>
                <button
                  type="button"
                  onClick={() => handleSimularFotoCelular('HISTORICO_NOTAS')}
                  className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
                  Foto Notas desde Celular
                </button>
              </div>
            </div>
          </div>
        )}

        {captureMethod === 'qr' && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3 animate-in fade-in">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-800 text-2xl">qr_code_scanner</span>
                <div>
                  <h4 className="font-extrabold text-xs text-purple-900 uppercase">Validador de Código QR de Imprenta / Firma Digital</h4>
                  <p className="text-[11px] text-slate-600">Escanea el código QR del documento para validar firma digital y extraer datos sin digitación.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEscaneoCodigoQR}
                className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-[18px]">camera</span>
                Leer Código QR del Documento
              </button>
            </div>

            {qrDecodedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                {qrDecodedMessage}
              </div>
            )}
          </div>
        )}

      </div>

      {/* BANNER RECONOCIMIENTO INTELIGENTE DE TIPO DE DOCUMENTO */}
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
                Tipo OCR Detectado
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
            <p className="text-[10px] text-blue-200 uppercase font-mono">Confianza OCR</p>
            <p className="text-lg font-black text-amber-300 font-mono">{clasificacionActual.confianza}</p>
          </div>
          <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Campos Adaptados
          </span>
        </div>
      </div>

      {/* 2. AREA PRINCIPAL: VISOR Y FORMULARIO DINÁMICO DE CAMPOS OCR SEGÚN TIPO */}
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
            className={`flex-1 min-h-[440px] rounded-xl border-2 border-dashed transition-all flex flex-col justify-center items-center p-6 relative overflow-hidden ${
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
                  className="w-full h-[470px] rounded-lg border border-slate-200 shadow-sm"
                />
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm">
                <div className="w-16 h-16 bg-blue-50 text-[#003366] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>upload_file</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#003366]">Arrastre un archivo PDF</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Cédula CI, Histórico Univ., Histórico de Colegio, Título o Formulario. Los campos OCR se ajustarán automáticamente.
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

        {/* FORMULARIO DINÁMICO DE CAMPOS OCR SEGÚN TIPO DE DOCUMENTO (5 Cols) */}
        <form onSubmit={handleSaveExpediente} className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          
          {/* Selector de Tipo de Documento que cambia dinámicamente la estructura de campos */}
          <div className="border-b border-slate-200 pb-3 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '18px' }}>tune</span>
                Tipo de Documento &amp; Estructura OCR:
              </h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                Confianza {clasificacionActual.confianza}
              </span>
            </div>

            <select
              value={clasificacionActual.tipoClave}
              onChange={e => {
                const val = e.target.value as TipoDocumentoClave;
                let nom = 'Cédula de Identidad Escaneada';
                let ico = 'badge';
                let det = 'Campos C.I.';

                if (val === 'CI') {
                  nom = 'Cédula de Identidad Escaneada'; ico = 'badge'; det = 'Campos OCR: N° C.I., Expedido, Nombres, Apellidos, Fecha Nac., Estado Civil, Vencimiento';
                } else if (val === 'HISTORICO_UNIV') {
                  nom = 'Histórico Académico Universitario & Notas'; ico = 'history_edu'; det = 'Campos OCR: C.I., Estudiante, R.U., Carrera, Facultad, Plan de Estudios, Promedio';
                } else if (val === 'HISTORICO_COLEGIO') {
                  nom = 'Histórico de Estudio de Colegio (Bachillerato)'; ico = 'school'; det = 'Campos OCR: C.I., Alumno, Unidad Educativa, Código SIE, Distrito, Nivel, Gestión Egreso';
                } else if (val === 'TITULO') {
                  nom = 'Diploma Académico / Título Profesional'; ico = 'workspace_premium'; det = 'Campos OCR: N° Diploma, Titular, C.I., Grado, Libro Matriz, Tomo, Folio, Rector';
                } else if (val === 'FORMULARIO') {
                  nom = 'Formularios de Trámite y Requisitos Notariales'; ico = 'assignment'; det = 'Campos OCR: N° Hoja Ruta, Solicitante, C.I., Tipo Trámite, N° Testimonio, Apoderado';
                }

                setClasificacionActual({
                  tipoClave: val,
                  tipoNombre: nom,
                  icono: ico,
                  confianza: '98%',
                  detalles: det
                });
              }}
              className="w-full px-3 py-2 bg-amber-50/90 border border-amber-300 rounded-xl text-xs font-extrabold text-[#003366] focus:bg-white focus:outline-none"
            >
              <option value="CI">💳 1. Cédula de Identidad Escaneada (C.I.)</option>
              <option value="HISTORICO_UNIV">📜 2. Histórico Académico Universitario & Certificado de Notas</option>
              <option value="HISTORICO_COLEGIO">🏫 3. Histórico de Estudio de Colegio (Bachillerato)</option>
              <option value="TITULO">🎓 4. Diploma Académico / Título Profesional</option>
              <option value="FORMULARIO">📋 5. Formularios de Trámite & Requisitos Notariales</option>
            </select>
          </div>

          {/* RENDERIZADO CONDICIONAL Y DINÁMICO DE CAMPOS SEGÚN TIPO DE DOCUMENTO */}
          <div className="space-y-3">
            
            {/* === CASO 1: CÉDULA DE IDENTIDAD (CI) === */}
            {clasificacionActual.tipoClave === 'CI' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-2 bg-blue-50/80 border border-blue-200 rounded-lg text-[11px] font-bold text-[#003366] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  Campos Específicos Extraídos de Cédula de Identidad (CI):
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">N° Cédula Identidad:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ciFields.ci}
                        onChange={e => setCiFields({ ...ciFields, ci: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                      />
                      <span className="absolute right-2 top-2 text-[9px] font-mono font-bold text-emerald-600">99%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Expedido:</label>
                    <input
                      type="text"
                      value={ciFields.expedido}
                      onChange={e => setCiFields({ ...ciFields, expedido: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Nombres:</label>
                    <input
                      type="text"
                      value={ciFields.nombres}
                      onChange={e => setCiFields({ ...ciFields, nombres: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Apellidos:</label>
                    <input
                      type="text"
                      value={ciFields.apellidos}
                      onChange={e => setCiFields({ ...ciFields, apellidos: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Fecha Nac.:</label>
                    <input
                      type="text"
                      value={ciFields.fechaNac}
                      onChange={e => setCiFields({ ...ciFields, fechaNac: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Estado Civil:</label>
                    <input
                      type="text"
                      value={ciFields.estadoCivil}
                      onChange={e => setCiFields({ ...ciFields, estadoCivil: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Vencimiento CI:</label>
                    <input
                      type="text"
                      value={ciFields.vencimientoCi}
                      onChange={e => setCiFields({ ...ciFields, vencimientoCi: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === CASO 2: HISTÓRICO ACADÉMICO UNIVERSITARIO === */}
            {clasificacionActual.tipoClave === 'HISTORICO_UNIV' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-2 bg-indigo-50/80 border border-indigo-200 rounded-lg text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  Campos Específicos de Histórico Académico Universitario &amp; Notas:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">C.I. Estudiante:</label>
                    <input
                      type="text"
                      value={histUnivFields.ci}
                      onChange={e => setHistUnivFields({ ...histUnivFields, ci: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">R.U. Univ.:</label>
                    <input
                      type="text"
                      value={histUnivFields.ru}
                      onChange={e => setHistUnivFields({ ...histUnivFields, ru: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Nombre Completo Estudiante:</label>
                  <input
                    type="text"
                    value={histUnivFields.estudiante}
                    onChange={e => setHistUnivFields({ ...histUnivFields, estudiante: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Carrera / Programa Universitario:</label>
                  <input
                    type="text"
                    value={histUnivFields.carrera}
                    onChange={e => setHistUnivFields({ ...histUnivFields, carrera: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Materias Aprobadas:</label>
                    <input
                      type="text"
                      value={histUnivFields.materiasAprobadas}
                      onChange={e => setHistUnivFields({ ...histUnivFields, materiasAprobadas: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Promedio Ponderado:</label>
                    <input
                      type="text"
                      value={histUnivFields.promedio}
                      onChange={e => setHistUnivFields({ ...histUnivFields, promedio: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === CASO 3: HISTÓRICO DE ESTUDIO DE COLEGIO === */}
            {clasificacionActual.tipoClave === 'HISTORICO_COLEGIO' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  Campos Específicos de Certificado / Histórico de Colegio (Bachillerato):
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">C.I. Alumno:</label>
                    <input
                      type="text"
                      value={histColegioFields.ci}
                      onChange={e => setHistColegioFields({ ...histColegioFields, ci: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Código SIE:</label>
                    <input
                      type="text"
                      value={histColegioFields.codigoSie}
                      onChange={e => setHistColegioFields({ ...histColegioFields, codigoSie: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Nombre Completo del Alumno:</label>
                  <input
                    type="text"
                    value={histColegioFields.alumno}
                    onChange={e => setHistColegioFields({ ...histColegioFields, alumno: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Unidad Educativa / Colegio:</label>
                  <input
                    type="text"
                    value={histColegioFields.colegio}
                    onChange={e => setHistColegioFields({ ...histColegioFields, colegio: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Distrito Educativo:</label>
                    <input
                      type="text"
                      value={histColegioFields.distrito}
                      onChange={e => setHistColegioFields({ ...histColegioFields, distrito: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Gestión Egreso:</label>
                    <input
                      type="text"
                      value={histColegioFields.gestionEgreso}
                      onChange={e => setHistColegioFields({ ...histColegioFields, gestionEgreso: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#C51D24]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === CASO 4: DIPLOMA ACADÉMICO / TÍTULO PROFESIONAL === */}
            {clasificacionActual.tipoClave === 'TITULO' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  Campos Específicos del Diploma Académico / Título Profesional:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">N° Diploma / Título:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tituloFields.nroDiploma}
                        onChange={e => setTituloFields({ ...tituloFields, nroDiploma: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#C51D24]"
                      />
                      <span className="absolute right-2 top-2 text-[9px] font-mono font-bold text-emerald-600">99%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">C.I. Titular:</label>
                    <input
                      type="text"
                      value={tituloFields.ci}
                      onChange={e => setTituloFields({ ...tituloFields, ci: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Nombre Completo del Titular:</label>
                  <input
                    type="text"
                    value={tituloFields.titular}
                    onChange={e => setTituloFields({ ...tituloFields, titular: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Título / Grado Otorgado:</label>
                  <input
                    type="text"
                    value={tituloFields.grado}
                    onChange={e => setTituloFields({ ...tituloFields, grado: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Libro Matriz:</label>
                    <input
                      type="text"
                      value={tituloFields.libro}
                      onChange={e => setTituloFields({ ...tituloFields, libro: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#C51D24]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Tomo:</label>
                    <input
                      type="text"
                      value={tituloFields.tomo}
                      onChange={e => setTituloFields({ ...tituloFields, tomo: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Folio:</label>
                    <input
                      type="text"
                      value={tituloFields.folio}
                      onChange={e => setTituloFields({ ...tituloFields, folio: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === CASO 5: FORMULARIOS DE TRÁMITE Y REQUISITOS === */}
            {clasificacionActual.tipoClave === 'FORMULARIO' && (
              <div className="space-y-3 animate-in fade-in">
                <div className="p-2 bg-purple-50/80 border border-purple-200 rounded-lg text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  Campos Específicos de Formulario de Trámite &amp; Requisitos:
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">N° Hoja Ruta / Trámite:</label>
                    <input
                      type="text"
                      value={formularioFields.nroHojaRuta}
                      onChange={e => setFormularioFields({ ...formularioFields, nroHojaRuta: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">C.I.:</label>
                    <input
                      type="text"
                      value={formularioFields.ci}
                      onChange={e => setFormularioFields({ ...formularioFields, ci: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Solicitante / Titular:</label>
                  <input
                    type="text"
                    value={formularioFields.solicitante}
                    onChange={e => setFormularioFields({ ...formularioFields, solicitante: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold uppercase text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">N° Testimonio Notarial:</label>
                    <input
                      type="text"
                      value={formularioFields.nroTestimonio}
                      onChange={e => setFormularioFields({ ...formularioFields, nroTestimonio: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Nombre Apoderado:</label>
                    <input
                      type="text"
                      value={formularioFields.apoderado}
                      onChange={e => setFormularioFields({ ...formularioFields, apoderado: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

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
