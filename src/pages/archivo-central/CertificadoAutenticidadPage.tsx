import { useState, useEffect } from 'react';
import { titulosApi, type ExpedienteTitulos } from '../../features/titulos/api/titulos-api';

interface TablaFila {
  id: string;
  nroDiploma: string;
  nombreTitular: string;
  ci: string;
  diplomaDe: string;
  fojas: string;
  libro: string;
  fechaExtension: string;
  nombreRector: string;
  pieFirmaRector: string;
}

export function CertificadoAutenticidadPage() {
  // Configuración de Papel y Modos
  const [paperSize, setPaperSize] = useState<'carta' | 'oficio' | 'a4'>('carta');
  const [showWordEditor, setShowWordEditor] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDiploma, setSearchDiploma] = useState('');

  // Estado del Expediente
  const [, setExpediente] = useState<ExpedienteTitulos | null>(null);

  // Lógica de Negocio: Tipo 1 vs Tipo 2
  const [tipoPlantilla, setTipoPlantilla] = useState<'PlantillaTipo1' | 'PlantillaTipo2'>('PlantillaTipo2');
  const [incluirAclaratoriaHistorica, setIncluirAclaratoriaHistorica] = useState(true);
  const [gestionHistorica, setGestionHistorica] = useState('1999');

  // Variables Editables del Documento
  const [correlativoInforme, setCorrelativoInforme] = useState('749/2026');
  const [fechaDoc, setFechaDoc] = useState('22 de abril del 2026');
  const [destinatarioNombre, setDestinatarioNombre] = useState('Lic. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('CERTIFICADO DE AUTENTICIDAD DE ARCHIVO CENTRAL');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('20 de abril de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('SECCION ARCHIVO/ INF N°472');
  const [titularNombre, setTitularNombre] = useState('LYNNE DENISSE PEREZ REVILLA');
  const [titularCi, setTitularCi] = useState('4716343-SCZ.');
  const [gradoMencion, setGradoMencion] = useState('Diploma de Bachiller en Humanidades');
  const [nroTitulo, setNroTitulo] = useState('019741');
  const [fechaEmisionOriginal, setFechaEmisionOriginal] = useState('5 de marzo del año 1999');

  // Autoridades Editables para Firmas Estilo Word
  const [autoridadSecretario, setAutoridadSecretario] = useState('Lic. Edy Acosta Claros');
  const [autoridadRector, setAutoridadRector] = useState('Dr. Reinerio Vargas Banegas');

  // Filas de la Tabla Registro Matriz
  const [tableRows, setTableRows] = useState<TablaFila[]>([
    {
      id: '1',
      nroDiploma: '019741',
      nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
      ci: '4716343-SCZ.',
      diplomaDe: 'Diploma de Bachiller en Humanidades',
      fojas: '181',
      libro: '026/99',
      fechaExtension: '5 de marzo del año 1999',
      nombreRector: 'Dr. Reinerio Vargas Banegas',
      pieFirmaRector: 'Firma Manual'
    }
  ]);

  // Evalúa el año de emisión original y aplica Tipo 1 (≥2000) o Tipo 2 (≤1999)
  const evaluarAnoEmision = (fecha: string) => {
    const match = fecha.match(/\b(19\d\d|20\d\d)\b/);
    const ano = match ? parseInt(match[0], 10) : 1999;
    setGestionHistorica(String(ano));

    if (ano <= 1999) {
      setTipoPlantilla('PlantillaTipo2');
      setIncluirAclaratoriaHistorica(true);
    } else {
      setTipoPlantilla('PlantillaTipo1');
      setIncluirAclaratoriaHistorica(false);
    }
  };

  // Presets de Prueba
  const cargarEjemploTipo2 = () => {
    setTipoPlantilla('PlantillaTipo2');
    setIncluirAclaratoriaHistorica(true);
    setGestionHistorica('1999');
    setCorrelativoInforme('749/2026');
    setFechaDoc('22 de abril del 2026');
    setNroTestimonio('SECCION ARCHIVO/ INF N°472');
    setTitularNombre('LYNNE DENISSE PEREZ REVILLA');
    setTitularCi('4716343-SCZ.');
    setGradoMencion('Diploma de Bachiller en Humanidades');
    setNroTitulo('019741');
    setFechaEmisionOriginal('5 de marzo del año 1999');
    setAutoridadSecretario('Lic. Edy Acosta Claros');
    setAutoridadRector('Dr. Reinerio Vargas Banegas');
    setTableRows([{
      id: '1',
      nroDiploma: '019741',
      nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
      ci: '4716343-SCZ.',
      diplomaDe: 'Diploma de Bachiller en Humanidades',
      fojas: '181',
      libro: '026/99',
      fechaExtension: '5 de marzo del año 1999',
      nombreRector: 'Dr. Reinerio Vargas Banegas',
      pieFirmaRector: 'Firma Manual'
    }]);
  };

  const cargarEjemploTipo1 = () => {
    setTipoPlantilla('PlantillaTipo1');
    setIncluirAclaratoriaHistorica(false);
    setGestionHistorica('2022');
    setCorrelativoInforme('117/2026');
    setFechaDoc('19 de enero del 2026');
    setNroTestimonio('SECCION ARCHIVO/ INF N°094');
    setTitularNombre('GUALBERTO MEDINA VARGAS');
    setTitularCi('8072900-SCZ.');
    setGradoMencion('Título en Provisión Nacional de MÉDICO CIRUJANO');
    setNroTitulo('96071');
    setFechaEmisionOriginal('11 de julio del año 2022');
    setAutoridadSecretario('Lic. Edy Acosta Claros');
    setAutoridadRector('Dr. Reinerio Vargas Banegas');
    setTableRows([{
      id: '1',
      nroDiploma: '96071',
      nombreTitular: 'GUALBERTO MEDINA VARGAS',
      ci: '8072900-SCZ.',
      diplomaDe: 'MÉDICO CIRUJANO',
      fojas: '0027',
      libro: '0017',
      fechaExtension: '11 de julio del año 2022',
      nombreRector: 'Dr. Reinerio Vargas Banegas',
      pieFirmaRector: 'Firma Manual'
    }]);
  };

  // Consulta Automática al Backend
  const handleConsultarExpediente = async (term: string) => {
    if (!term) return;
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(term);
      if (data) {
        setCorrelativoInforme(data.informe_nro ? `${data.informe_nro}/2026` : '749/2026');
        setFechaDoc(data.fecha || '22 de abril del 2026');
        setFechaSolicitud(data.fecha_solicitud || '20 de abril de 2026');
        setNroTestimonio(`SECCION ARCHIVO/ INF N°${data.informe_nro || '472'}`);
        setTitularNombre(data.titular.nombre_completo || 'LYNNE DENISSE PEREZ REVILLA');
        setTitularCi(data.titular.ci_expedido || '4716343-SCZ.');
        if (data.carrera_colegio?.mencion) {
          setGradoMencion(data.carrera_colegio.mencion);
        }
        if (data.expediente?.nro_diploma) {
          setNroTitulo(data.expediente.nro_diploma);
        }
        const fechaEm = data.expediente?.fecha_emision || '5 de marzo del año 1999';
        setFechaEmisionOriginal(fechaEm);
        evaluarAnoEmision(fechaEm);

        if (data.autoridad?.secretario_general) setAutoridadSecretario(data.autoridad.secretario_general);
        if (data.autoridad?.rector_actual) setAutoridadRector(data.autoridad.rector_actual);

        setTableRows([
          {
            id: Date.now().toString(),
            nroDiploma: data.expediente.nro_diploma || term || '019741',
            nombreTitular: (data.titular.nombre_completo || 'LYNNE DENISSE PEREZ REVILLA').toUpperCase(),
            ci: data.titular.ci_expedido || '4716343-SCZ.',
            diplomaDe: data.carrera_colegio.mencion || 'Diploma de Bachiller en Humanidades',
            fojas: data.archivo_fisico.fojas || '181',
            libro: data.archivo_fisico.libro_matriz || '026/99',
            fechaExtension: fechaEm,
            nombreRector: (data.autoridad.rector_nombre || 'Dr. Reinerio Vargas Banegas').toUpperCase(),
            pieFirmaRector: 'Firma Manual'
          }
        ]);
      }
    } catch {
      /* fallback */
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddRow = () => {
    const newRow: TablaFila = {
      id: Date.now().toString(),
      nroDiploma: nroTitulo,
      nombreTitular: titularNombre.toUpperCase(),
      ci: titularCi,
      diplomaDe: gradoMencion,
      fojas: tableRows[0]?.fojas || '181',
      libro: tableRows[0]?.libro || '026/99',
      fechaExtension: fechaEmisionOriginal,
      nombreRector: autoridadRector,
      pieFirmaRector: 'Firma Manual'
    };
    setTableRows((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (tableRows.length <= 1) return;
    setTableRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof TablaFila, value: string) => {
    setTableRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      await titulosApi.guardarCertificado({
        correlativo: correlativoInforme,
        titular: titularNombre,
        ci: titularCi,
        diploma: tableRows[0]?.nroDiploma || searchDiploma,
        tipoPlantilla,
        filas: tableRows
      });
      alert(`Certificado (${tipoPlantilla}) guardado correctamente.`);
    } catch {
      alert('Error al guardar el certificado.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPaperClass = () => {
    switch (paperSize) {
      case 'oficio':
        return 'w-[216mm] min-h-[356mm] p-[18mm]';
      case 'a4':
        return 'w-[210mm] min-h-[297mm] p-[16mm]';
      case 'carta':
      default:
        return 'w-[216mm] min-h-[279mm] p-[18mm]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Barra Superior con Control de Negocio */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'}`}>
            <span className="font-bold text-xs">
              {tipoPlantilla === 'PlantillaTipo2' ? '📜 Plantilla Tipo 2 (≤1999)' : '✨ Plantilla Tipo 1 (≥2000)'}
            </span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Certificado de Autenticidad — Archivo Central & Títulos
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Evaluación Automática por Año de Emisión ({gestionHistorica})
            </p>
          </div>
        </div>

        {/* Presets de Prueba y Búsqueda */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cargarEjemploTipo2}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            Ejemplo 1999 (Tipo 2)
          </button>
          <button
            type="button"
            onClick={cargarEjemploTipo1}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            Ejemplo 2022 (Tipo 1)
          </button>

          <input
            type="text"
            placeholder="N° Diploma / C.I..."
            value={searchDiploma}
            onChange={(e) => setSearchDiploma(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '019741')}
            disabled={isSearching}
            className="px-3 py-1.5 bg-[#003366] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors"
          >
            {isSearching ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {/* Selector de Papel & Toggle Lateral */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setPaperSize('carta')}
              className={`px-2.5 py-1 rounded-lg transition-all ${paperSize === 'carta' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Carta
            </button>
            <button
              onClick={() => setPaperSize('oficio')}
              className={`px-2.5 py-1 rounded-lg transition-all ${paperSize === 'oficio' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Oficio
            </button>
            <button
              onClick={() => setPaperSize('a4')}
              className={`px-2.5 py-1 rounded-lg transition-all ${paperSize === 'a4' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              A4
            </button>
          </div>

          <button
            onClick={() => setShowWordEditor(!showWordEditor)}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            {showWordEditor ? 'Ocultar Panel' : 'Panel Word'}
          </button>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 overflow-auto p-6 flex justify-center gap-6">
        
        {/* Vista Previa del Documento Clean (Cero Sellos Digitales) */}
        <div className="bg-slate-200/80 p-8 rounded-2xl border border-slate-300 overflow-auto flex justify-center items-start shadow-inner flex-1">
          <div
            className={`${getPaperClass()} bg-white shadow-2xl text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full`}
          >
            <div>
              {/* Franja Superior Institucional */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[#C51D24]"></div>
              <div className="absolute top-3 left-0 w-full h-1 bg-[#003366]"></div>

              {/* Header Institucional UAGRM */}
              <header className="text-center mt-6 mb-8 font-serif">
                <h1 className="text-lg font-bold uppercase tracking-wide text-[#003366]">
                  UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
                </h1>
                <p className="text-[10px] uppercase text-slate-500 font-sans tracking-widest mt-0.5">
                  "2025 BICENTENARIO DE BOLIVIA"
                </p>
                <div className="w-24 h-0.5 bg-[#C51D24] mx-auto my-3"></div>
                <h2 className="text-base font-bold tracking-widest text-[#003366] uppercase mt-2">
                  CERTIFICADO N°{correlativoInforme}
                </h2>
              </header>

              {/* Estructura Condicional: Tipo 2 (Reconstructiva ≤1999) vs Tipo 1 (Nativa ≥2000) */}
              {tipoPlantilla === 'PlantillaTipo2' ? (
                /* PLANTILLA TIPO 2 */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <p className="indent-8 uppercase font-bold text-slate-900">
                    LA UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO POR MEDIO DE SUS AUTORIDADES EL RECTOR {autoridadRector.toUpperCase()} Y EL SECRETARIO GENERAL {autoridadSecretario.toUpperCase()}.
                  </p>

                  <p className="font-bold text-center text-xs tracking-widest my-3 uppercase text-slate-900">
                    CERTIFICAN:
                  </p>

                  <p className="indent-8 text-justify">
                    Que, en atención al informe <strong className="font-mono">{nroTestimonio}</strong> de fecha <strong>{fechaSolicitud}</strong>, tenemos a bien Certificar que el <strong>{gradoMencion}</strong> consignado con el N° <strong className="font-mono">{nroTitulo}</strong> le fue otorgado a la ciudadana <strong className="font-bold uppercase text-slate-900">{titularNombre}</strong>, con Cédula de Identidad N° <strong className="font-mono">{titularCi}</strong>, mismo que se encuentra registrado en el Libro N° <strong className="font-mono">{tableRows[0]?.libro || '026/99'}</strong> a Fojas N° <strong className="font-mono">{tableRows[0]?.fojas || '181'}</strong>, emitido en fecha <strong>{fechaEmisionOriginal}</strong>, documentación original que se encuentra en Archivo Central de esta Casa Superior de Estudios.
                  </p>

                  {incluirAclaratoriaHistorica && (
                    <p className="indent-8 text-justify font-serif leading-relaxed text-slate-900 p-3 bg-amber-50/60 rounded-lg border-l-4 border-amber-600 my-3">
                      Aclarando que, en la gestión del <strong>{gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma esta rotulado el nombre completo del Rector.
                    </p>
                  )}

                  <p className="indent-8 text-justify">
                    Es cuanto certificamos sobre la autenticidad y validez del mencionado documento.
                  </p>

                  <p className="text-right pt-4 font-sans font-medium text-slate-700">
                    Santa Cruz de la Sierra, {fechaDoc}
                  </p>
                </div>
              ) : (
                /* PLANTILLA TIPO 1 */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <p className="indent-8 text-justify">
                    El que suscribe, Secretario General y el Rector de la Universidad Autónoma "Gabriel René Moreno", certifican que revisada la documentación existente en los libros matrices del Departamento de Títulos y Grados, se evidencia la emisión del <strong className="font-bold underline text-slate-900">{gradoMencion}</strong>, con Número de Título N° <strong className="font-mono font-bold text-slate-900">{nroTitulo}</strong>, conferido legítimamente a favor del profesional Sr.(a) <strong className="font-bold uppercase text-slate-900">{titularNombre}</strong>, con Cédula de Identidad N° <strong className="font-mono font-bold text-slate-900">{titularCi}</strong>.
                  </p>

                  <p className="indent-8 text-justify">
                    Asimismo, se verifica que la correspondiente matriz se encuentra debidamente asentada en el Libro de Registro N° <strong className="font-mono font-bold text-slate-900">{tableRows[0]?.libro || '0017'}</strong>, Fojas N° <strong className="font-mono font-bold text-slate-900">{tableRows[0]?.fojas || '0027'}</strong>, habiéndose expedido el documento original en fecha <strong className="font-bold text-slate-900">{fechaEmisionOriginal}</strong>.
                  </p>

                  <p className="indent-8 text-justify">
                    Se extiende el presente Certificado de Autenticidad a solicitud del interesado para los fines legales y administrativos que convengan.
                  </p>

                  <p className="text-right pt-4 font-sans font-medium text-slate-700">
                    Santa Cruz de la Sierra, {fechaDoc}
                  </p>
                </div>
              )}
            </div>

            {/* Bloque de Firmas Institucionales (Estilo Word - 2 Columnas) */}
            <div className="firmas-container mt-[80px] flex justify-around items-end w-full page-break-inside-avoid">
              {/* Firma 1: Secretario General */}
              <div className="firma-box text-center min-w-[240px]">
                <div className="linea-guia border-t border-[#1e293b] mb-2 w-full"></div>
                <p className="autoridad-nombre text-[13px] font-semibold text-[#1e293b] m-0">
                  {autoridadSecretario}
                </p>
                <p className="autoridad-cargo text-[11px] text-[#475569] leading-snug mt-0.5 uppercase font-semibold">
                  SECRETARIO GENERAL<br />U.A.G.R.M.
                </p>
              </div>

              {/* Firma 2: Rector */}
              <div className="firma-box text-center min-w-[240px]">
                <div className="linea-guia border-t border-[#1e293b] mb-2 w-full"></div>
                <p className="autoridad-nombre text-[13px] font-semibold text-[#1e293b] m-0">
                  {autoridadRector}
                </p>
                <p className="autoridad-cargo text-[11px] text-[#475569] leading-snug mt-0.5 uppercase font-semibold">
                  RECTOR<br />U.A.G.R.M.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Panel Lateral de Edición Estilo Word (Derecha) */}
        {showWordEditor && (
          <div className="w-96 bg-white p-5 space-y-5 print:hidden shadow-sm border border-slate-200 rounded-2xl shrink-0 overflow-y-auto max-h-[85vh]">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                Panel Lateral Word (Tipo 1 / Tipo 2)
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                100% Reactivo
              </span>
            </div>

            {/* Selector de Lógica de Negocio */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider">
                Lógica Condicional de Negocio
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipoPlantilla('PlantillaTipo1');
                    setIncluirAclaratoriaHistorica(false);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${tipoPlantilla === 'PlantillaTipo1' ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  Tipo 1 (≥2000)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipoPlantilla('PlantillaTipo2');
                    setIncluirAclaratoriaHistorica(true);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-300'}`}
                >
                  Tipo 2 (≤1999)
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-800">
                  <span>Párrafo Aclaratorio:</span>
                  <input
                    type="checkbox"
                    checked={incluirAclaratoriaHistorica}
                    onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>

                {incluirAclaratoriaHistorica && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-600 font-medium">Año Gestión:</span>
                    <input
                      type="text"
                      value={gestionHistorica}
                      onChange={(e) => setGestionHistorica(e.target.value)}
                      className="w-20 px-2 py-1 border border-slate-300 font-mono text-xs text-center rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sección 1: Certificado & Referencia */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                1. Encabezado & Informe
              </h4>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  N° de Certificado:
                </label>
                <input
                  type="text"
                  value={correlativoInforme}
                  onChange={(e) => setCorrelativoInforme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Informe de Referencia:
                </label>
                <input
                  type="text"
                  value={nroTestimonio}
                  onChange={(e) => setNroTestimonio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Fecha del Informe:
                </label>
                <input
                  type="text"
                  value={fechaSolicitud}
                  onChange={(e) => setFechaSolicitud(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Sección 2: Datos del Titular y Grado */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                2. Titular & Grado Académico
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Completo del Titular:
                </label>
                <input
                  type="text"
                  value={titularNombre}
                  onChange={(e) => setTitularNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-[#003366]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cédula de Identidad con Extensión:
                </label>
                <input
                  type="text"
                  value={titularCi}
                  onChange={(e) => setTitularCi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Número de Título:
                </label>
                <input
                  type="text"
                  value={nroTitulo}
                  onChange={(e) => setNroTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Grado / Mención Académica:
                </label>
                <input
                  type="text"
                  value={gradoMencion}
                  onChange={(e) => setGradoMencion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Sección 3: Matriz & Autoridades */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                3. Matriz & Autoridades de Firma
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Fecha Emisión Original:
                </label>
                <input
                  type="text"
                  value={fechaEmisionOriginal}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFechaEmisionOriginal(val);
                    evaluarAnoEmision(val);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Secretario General:
                </label>
                <input
                  type="text"
                  value={autoridadSecretario}
                  onChange={(e) => setAutoridadSecretario(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Rector de la UAGRM:
                </label>
                <input
                  type="text"
                  value={autoridadRector}
                  onChange={(e) => setAutoridadRector(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Acciones al Final del Panel Lateral */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full py-2.5 bg-[#003366] hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                {isSaving ? 'Guardando Cambios...' : 'Guardar Certificado'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                🖨️ IMPRIMIR CERTIFICADO ({paperSize.toUpperCase()})
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
