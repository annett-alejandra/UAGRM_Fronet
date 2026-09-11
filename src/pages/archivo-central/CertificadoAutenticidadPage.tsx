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

  // Variables Editables del Documento (Plantilla Tipo 1 - Certificado de Autenticidad)
  const [correlativoInforme, setCorrelativoInforme] = useState('117/2026');
  const [fechaDoc, setFechaDoc] = useState('19 de enero del 2026');
  const [destinatarioNombre, setDestinatarioNombre] = useState('Lic. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('CERTIFICADO DE AUTENTICIDAD DE TÍTULO EN PROVISIÓN NACIONAL');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('13 de enero de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('INF N°094');
  const [solicitanteNombre, setSolicitanteNombre] = useState('GUALBERTO MEDINA VARGAS');
  const [titularNombre, setTitularNombre] = useState('GUALBERTO MEDINA VARGAS');
  const [titularCi, setTitularCi] = useState('8072900-SCZ.');
  const [gradoMencion, setGradoMencion] = useState('Título en Provisión Nacional de MÉDICO CIRUJANO');
  const [nroTitulo, setNroTitulo] = useState('96071');
  const [fechaEmisionOriginal, setFechaEmisionOriginal] = useState('11 de julio del año 2022');

  // Autoridades Editables para Firmas Estilo Word
  const [autoridadSecretario, setAutoridadSecretario] = useState('Lic. Edy Acosta Claros');
  const [autoridadRector, setAutoridadRector] = useState('Dr. Reinerio Vargas Banegas');

  // Filas de la Tabla Registro Matriz
  const [tableRows, setTableRows] = useState<TablaFila[]>([
    {
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
    }
  ]);

  // Consulta Automática al Backend
  const handleConsultarExpediente = async (term: string) => {
    if (!term) return;
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(term);
      if (data) {
        setCorrelativoInforme(data.informe_nro ? `${data.informe_nro}/2026` : '117/2026');
        setFechaDoc(data.fecha || '19 de enero del 2026');
        setFechaSolicitud(data.fecha_solicitud || '13 de enero de 2026');
        setNroTestimonio(data.nro_testimonio || 'INF N°094');
        setSolicitanteNombre(data.titular.nombre_completo || 'GUALBERTO MEDINA VARGAS');
        setTitularNombre(data.titular.nombre_completo || 'GUALBERTO MEDINA VARGAS');
        setTitularCi(data.titular.ci_expedido || '8072900-SCZ.');
        if (data.carrera_colegio?.mencion) {
          setGradoMencion(`Título en Provisión Nacional de ${data.carrera_colegio.mencion.toUpperCase()}`);
        }
        if (data.expediente?.nro_diploma) {
          setNroTitulo(data.expediente.nro_diploma);
        }
        if (data.autoridad?.secretario_general) {
          setAutoridadSecretario(data.autoridad.secretario_general);
        }
        if (data.autoridad?.rector_actual) {
          setAutoridadRector(data.autoridad.rector_actual);
        }

        setTableRows([
          {
            id: Date.now().toString(),
            nroDiploma: data.expediente.nro_diploma || term || '96071',
            nombreTitular: (data.titular.nombre_completo || 'GUALBERTO MEDINA VARGAS').toUpperCase(),
            ci: data.titular.ci_expedido || '8072900-SCZ.',
            diplomaDe: (data.carrera_colegio.mencion || 'MÉDICO CIRUJANO').toUpperCase(),
            fojas: data.archivo_fisico.fojas || '0027',
            libro: data.archivo_fisico.libro_matriz || '0017',
            fechaExtension: data.expediente.fecha_emision || '11 de julio del año 2022',
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
      diplomaDe: 'MÉDICO CIRUJANO',
      fojas: '0027',
      libro: '0017',
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
        filas: tableRows
      });
      alert('Certificado de Autenticidad (Plantilla Tipo 1) guardado correctamente.');
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
      {/* Barra Superior con Selector de Papel y Control de Edición */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#003366]/10 rounded-xl text-[#003366]">
            <span className="font-bold text-sm">📄 Plantilla Tipo 1</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Certificado de Autenticidad (Módulo de Títulos)
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Identificador: PlantillaTipo1_CertificadoAutenticidad
            </p>
          </div>
        </div>

        {/* Búsqueda de Expediente por N° Diploma / C.I. */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar Expediente N° / C.I..."
            value={searchDiploma}
            onChange={(e) => setSearchDiploma(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '96071')}
            disabled={isSearching}
            className="px-3.5 py-2 bg-[#003366] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors"
          >
            {isSearching ? 'Buscando...' : '🔍 Consultar Backend'}
          </button>
        </div>

        {/* Selector de Tamaño de Papel & Toggle Lateral */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setPaperSize('carta')}
              className={`px-3 py-1.5 rounded-lg transition-all ${paperSize === 'carta' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Carta
            </button>
            <button
              onClick={() => setPaperSize('oficio')}
              className={`px-3 py-1.5 rounded-lg transition-all ${paperSize === 'oficio' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Oficio
            </button>
            <button
              onClick={() => setPaperSize('a4')}
              className={`px-3 py-1.5 rounded-lg transition-all ${paperSize === 'a4' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              A4
            </button>
          </div>

          <button
            onClick={() => setShowWordEditor(!showWordEditor)}
            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            {showWordEditor ? 'Ocultar Panel Lateral' : 'Mostrar Panel Word'}
          </button>
        </div>
      </div>

      {/* Contenedor Principal: Vista Previa de Hoja Digital Clean + Panel Lateral Word */}
      <div className="flex-1 overflow-auto p-6 flex justify-center gap-6">
        
        {/* Contenedor Hoja Digital Impresa (100% Cero Sellos Digitales) */}
        <div className="bg-slate-200/80 p-8 rounded-2xl border border-slate-300 overflow-auto flex justify-center items-start shadow-inner flex-1">
          <div
            className={`${getPaperClass()} bg-white shadow-2xl text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full`}
          >
            <div>
              {/* Franja Superior Institucional */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[#C51D24]"></div>
              <div className="absolute top-3 left-0 w-full h-1 bg-[#003366]"></div>

              {/* Header Institucional UAGRM */}
              <header className="flex justify-between items-center border-b-2 border-[#003366] pb-4 mb-6 mt-4">
                <div className="text-left font-serif">
                  <h2 className="font-extrabold text-base text-[#003366] leading-snug uppercase tracking-tight">
                    UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
                  </h2>
                  <h3 className="font-bold text-xs text-[#C51D24] tracking-wider uppercase mt-0.5">
                    DEPARTAMENTO DE TÍTULOS Y GRADOS
                  </h3>
                  <p className="text-[10px] text-slate-600 font-sans tracking-widest mt-0.5">
                    SANTA CRUZ DE LA SIERRA - BOLIVIA
                  </p>
                </div>

                <div className="text-right font-sans text-xs space-y-1">
                  <p className="font-bold text-[#003366]">
                    N° CERTIFICADO: <span className="font-mono underline">{correlativoInforme}</span>
                  </p>
                  <p className="text-slate-700 text-[11px]">
                    REF: <span className="font-mono">{nroTestimonio}</span>
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    FECHA: <span>{fechaDoc}</span>
                  </p>
                </div>
              </header>

              {/* Título de Documento */}
              <div className="my-6 text-center">
                <h2 className="font-extrabold text-base text-[#003366] underline uppercase tracking-wide">
                  CERTIFICADO DE AUTENTICIDAD
                </h2>
              </div>

              {/* Texto Base en Prosa Legal Continua con Inyección de Datos */}
              <section className="mb-6 text-justify text-xs leading-relaxed space-y-4 font-serif text-slate-900">
                <p className="indent-8">
                  El que suscribe, Secretario General y el Rector de la Universidad Autónoma "Gabriel René Moreno", certifican que revisada la documentación existente en los libros matrices del Departamento de Títulos y Grados, se evidencia la emisión del{' '}
                  <strong className="font-bold underline text-slate-900">{gradoMencion}</strong> con Número de Título N°{' '}
                  <strong className="font-mono font-bold text-slate-900">{nroTitulo}</strong>, conferido legítimamente a favor del profesional Sr.(a){' '}
                  <strong className="font-bold uppercase text-slate-900">{titularNombre}</strong>, con Cédula de Identidad con Extensión N°{' '}
                  <strong className="font-mono font-bold text-slate-900">{titularCi}</strong>.
                </p>

                <p className="indent-8">
                  Asimismo, se verifica que la correspondiente matriz se encuentra debidamente asentada en el Libro de Registro N°{' '}
                  <strong className="font-mono font-bold text-slate-900">{tableRows[0]?.libro || '0017'}</strong>, Fojas N°{' '}
                  <strong className="font-mono font-bold text-slate-900">{tableRows[0]?.fojas || '0027'}</strong>, con Fecha de Emisión Original de{' '}
                  <strong className="font-bold text-slate-900">{fechaEmisionOriginal}</strong>.
                </p>

                <p className="indent-8">
                  Se extiende el presente Certificado de Autenticidad a solicitud del interesado para los fines legales y administrativos que convengan.
                </p>

                <p className="text-right pt-4 font-sans font-medium text-slate-700">
                  Santa Cruz de la Sierra, {fechaDoc}
                </p>
              </section>

              {/* Tabla de Registros en Matriz */}
              <section className="mb-6">
                <div className="overflow-x-auto border border-slate-300 rounded-sm">
                  <table className="w-full text-center text-[10px] font-sans border-collapse table-fixed">
                    <thead>
                      <tr className="bg-[#003366] text-white font-bold uppercase tracking-wider">
                        <th className="border-r border-slate-300 p-1.5 w-20">N° TÍTULO</th>
                        <th className="border-r border-slate-300 p-1.5">NOMBRE DEL TITULAR</th>
                        <th className="border-r border-slate-300 p-1.5 w-28">C.I. EXTENSIÓN</th>
                        <th className="border-r border-slate-300 p-1.5">GRADO / MENCIÓN</th>
                        <th className="border-r border-slate-300 p-1.5 w-16">LIBRO</th>
                        <th className="border-r border-slate-300 p-1.5 w-16">FOJAS</th>
                        <th className="p-1.5 w-28">FECHA EMISIÓN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border-r border-slate-200 p-1.5 font-mono font-bold text-[#C51D24]">
                            {row.nroDiploma}
                          </td>
                          <td className="border-r border-slate-200 p-1.5 font-bold uppercase">
                            {row.nombreTitular}
                          </td>
                          <td className="border-r border-slate-200 p-1.5 font-mono">
                            {row.ci}
                          </td>
                          <td className="border-r border-slate-200 p-1.5 font-medium">
                            {row.diplomaDe}
                          </td>
                          <td className="border-r border-slate-200 p-1.5 font-mono">
                            {row.libro}
                          </td>
                          <td className="border-r border-slate-200 p-1.5 font-mono">
                            {row.fojas}
                          </td>
                          <td className="p-1.5">
                            {row.fechaExtension}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Bloque de Firmas Institucionales (Estilo Word) */}
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
                Panel Lateral Word (Plantilla Tipo 1)
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                100% Reactivo
              </span>
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
                  Fecha del Informe / Expedición:
                </label>
                <input
                  type="text"
                  value={fechaDoc}
                  onChange={(e) => setFechaDoc(e.target.value)}
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
                  onChange={(e) => setFechaEmisionOriginal(e.target.value)}
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
