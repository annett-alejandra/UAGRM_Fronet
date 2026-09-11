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

  // Variables de Negocio (Tipo 3 - Informe de Archivo Central Físico)
  const [correlativoInforme, setCorrelativoInforme] = useState('0472');
  const [fechaDoc, setFechaDoc] = useState('20 de abril de 2026');
  const [destinatarioNombre, setDestinatarioNombre] = useState('MSc. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('INFORME DEL DIPLOMA DE BACHILLER.');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('16 de abril de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('1246/2025');
  const [apoderadoNombre, setApoderadoNombre] = useState('Yuli Alison Romero Flores');
  const [titularNombre, setTitularNombre] = useState('Jenny Flores Peña');
  const [titularCi, setTitularCi] = useState('3250858-SCZ');
  const [gradoMencion, setGradoMencion] = useState('Diploma de Bachiller');
  const [nroTitulo, setNroTitulo] = useState('014863');

  const [incluirAclaratoriaHistorica, setIncluirAclaratoriaHistorica] = useState(true);
  const [gestionHistorica, setGestionHistorica] = useState('1998');
  const [incluirSupletorio, setIncluirSupletorio] = useState(true);
  const [jefeArchivoNombre, setJefeArchivoNombre] = useState('Moisés Cossio López');

  // Filas de la Tabla Tabular (8-9 Columnas del Documento Físico)
  const [tableRows, setTableRows] = useState<TablaFila[]>([
    {
      id: '1',
      nroDiploma: '014863',
      nombreTitular: 'JENNY FLORES PEÑA',
      ci: '3250858-SCZ',
      diplomaDe: 'BACHILLER EN HUMANIDADES',
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
    }
  ]);

  // Handler para consultar Backend
  const handleConsultarExpediente = async (term: string) => {
    if (!term) return;
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(term);
      if (data) {
        setCorrelativoInforme(data.informe_nro || '0472');
        setFechaDoc(data.fecha || '20 de abril de 2026');
        setFechaSolicitud(data.fecha_solicitud || '16 de abril de 2026');
        setNroTestimonio(data.nro_testimonio || '1246/2025');
        setApoderadoNombre(data.apoderado || 'Yuli Alison Romero Flores');
        setTitularNombre(data.titular.nombre_completo || 'Jenny Flores Peña');
        setTitularCi(data.titular.ci_expedido || '3250858-SCZ');
        if (data.carrera_colegio?.mencion) {
          setGradoMencion(data.carrera_colegio.mencion);
        }

        const fechaEm = data.expediente?.fecha_emision || '24 de julio de 1998';
        const match = fechaEm.match(/\b(19\d\d|20\d\d)\b/);
        const ano = match ? match[0] : '1998';
        setGestionHistorica(ano);
        setIncluirAclaratoriaHistorica(parseInt(ano, 10) <= 1999);

        setTableRows([
          {
            id: Date.now().toString(),
            nroDiploma: data.expediente.nro_diploma || term || '014863',
            nombreTitular: (data.titular.nombre_completo || 'JENNY FLORES PEÑA').toUpperCase(),
            ci: data.titular.ci_expedido || '3250858-SCZ',
            diplomaDe: (data.carrera_colegio.mencion || 'BACHILLER EN HUMANIDADES').replace('.', '').toUpperCase(),
            fojas: data.archivo_fisico.fojas || '115/98',
            libro: data.archivo_fisico.libro_matriz || '19/98',
            fechaExtension: fechaEm,
            nombreRector: (data.autoridad.rector_nombre || 'JORGE ORELLANA MORENO').toUpperCase(),
            pieFirmaRector: data.archivo_fisico.observacion_firma || 'No tiene'
          }
        ]);
      }
    } catch {
      /* fallback */
    } finally {
      setIsSearching(false);
    }
  };

  // Presets Rápidos
  const cargarEjemploOriginalFisico = () => {
    setCorrelativoInforme('0472');
    setFechaDoc('20 de abril de 2026');
    setDestinatarioNombre('MSc. Edy Acosta Claros');
    setDestinatarioCargo('SECRETARIO GENERAL - U.A.G.R.M.');
    setReferencia('INFORME DEL DIPLOMA DE BACHILLER.');
    setFechaSolicitud('16 de abril de 2026');
    setNroTestimonio('1246/2025');
    setApoderadoNombre('Yuli Alison Romero Flores');
    setTitularNombre('Jenny Flores Peña');
    setTitularCi('3250858-SCZ');
    setGradoMencion('Diploma de Bachiller');
    setNroTitulo('014863');
    setIncluirAclaratoriaHistorica(true);
    setGestionHistorica('1998');
    setIncluirSupletorio(true);
    setJefeArchivoNombre('Moisés Cossio López');

    setTableRows([{
      id: '1',
      nroDiploma: '014863',
      nombreTitular: 'JENNY FLORES PEÑA',
      ci: '3250858-SCZ',
      diplomaDe: 'BACHILLER EN HUMANIDADES',
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
    }]);
  };

  const handleAddRow = () => {
    const newRow: TablaFila = {
      id: Date.now().toString(),
      nroDiploma: nroTitulo,
      nombreTitular: titularNombre.toUpperCase(),
      ci: titularCi,
      diplomaDe: gradoMencion.toUpperCase(),
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
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
        tipoPlantilla: 'Tipo3_InformeArchivo',
        filas: tableRows
      });
      alert('Informe de Archivo Central (Tipo 3) guardado exitosamente.');
    } catch {
      alert('Error al guardar el documento.');
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
      {/* Barra Superior con Acciones y Búsqueda */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#003366] text-white rounded-xl shadow-sm">
            <span className="font-bold text-xs">📄 Tipo 3</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Informe de Archivo Central (Formato Carta Formal con Cuadro Tabulado)
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Réplica Exacta del Documento Físico Original — Archivo Central UAGRM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cargarEjemploOriginalFisico}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-xs rounded-xl border border-blue-200 transition-colors"
          >
            📋 Cargar Ejemplo Físico Original (0472)
          </button>

          <input
            type="text"
            placeholder="N° Diploma / C.I..."
            value={searchDiploma}
            onChange={(e) => setSearchDiploma(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
            disabled={isSearching}
            className="px-3.5 py-2 bg-[#003366] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors"
          >
            {isSearching ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </div>

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
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            {showWordEditor ? 'Ocultar Panel' : 'Panel Word'}
          </button>
        </div>
      </div>

      {/* Contenedor Hoja Impresa Clean + Panel Word */}
      <div className="flex-1 overflow-auto p-6 flex justify-center gap-6">
        
        {/* Documento A4 / Carta (100% Cero Sellos Digitales de Tinta) */}
        <div className="bg-slate-200/80 p-8 rounded-2xl border border-slate-300 overflow-auto flex justify-center items-start shadow-inner flex-1">
          <div
            className={`${getPaperClass()} bg-white shadow-2xl text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full`}
          >
            <div>
              {/* 1. Encabezado Físico Exacto (Escudo UAGRM + Barra Vertical ARCHIVO CENTRAL) */}
              <header className="flex justify-between items-start border-b-2 border-slate-300 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  {/* Escudo UAGRM o Placeholder Institucional */}
                  <div className="w-16 h-16 bg-[#003366] text-white flex items-center justify-center font-bold text-xs rounded-sm shadow-sm text-center p-1 font-serif">
                    UAGRM
                  </div>
                  {/* Barra Vertical de Texto ARCHIVO CENTRAL */}
                  <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-[0.25em] uppercase text-slate-700 leading-tight">
                    A R C H I V O<br />C E N T R A L
                  </div>
                </div>

                {/* Encabezado Centrado Formal */}
                <div className="text-center font-serif flex-1 px-4">
                  <h2 className="font-extrabold text-sm text-[#003366] leading-snug uppercase tracking-tight">
                    UNIVERSIDAD AUTÓNOMA “GABRIEL RENÉ MORENO”
                  </h2>
                  <h3 className="font-extrabold text-xs text-slate-800 tracking-wider uppercase mt-0.5">
                    SECRETARÍA GENERAL
                  </h3>
                  <p className="text-[11px] font-bold text-[#C51D24] uppercase tracking-wide mt-0.5 font-sans">
                    Archivo Central
                  </p>
                </div>

                {/* Ubicación y Correlativo Alineados a la Derecha */}
                <div className="text-right font-sans text-xs space-y-1 shrink-0">
                  <p className="text-slate-800 font-medium">
                    Santa Cruz de la Sierra, <strong className="font-bold">{fechaDoc}</strong>
                  </p>
                  <p className="font-extrabold text-[#003366]">
                    SECCION ARCHIVO /INF. No. <span className="underline font-mono">{correlativoInforme}</span>
                  </p>
                </div>
              </header>

              {/* 2. Bloque de Destinatario y Referencia (Estructura de Carta Formal) */}
              <section className="mb-4 font-sans text-xs space-y-0.5 text-left">
                <p className="font-bold text-slate-800">Señor:</p>
                <p className="font-extrabold text-sm text-[#003366]">{destinatarioNombre}</p>
                <p className="font-bold uppercase text-slate-700">{destinatarioCargo}</p>
                <p className="font-bold text-slate-800 pt-0.5">Presente.-</p>
              </section>

              {/* Línea de Referencia Centrada */}
              <div className="my-5 text-center">
                <p className="font-extrabold text-xs text-[#003366] underline uppercase tracking-wide">
                  Ref.: {referencia}
                </p>
              </div>

              <p className="font-bold text-xs text-slate-800 mb-3 font-sans">
                De mi consideración:
              </p>

              {/* 3. Párrafo Legal Introductorio Con Redacción Exacta del Físico */}
              <section className="mb-5 text-justify text-xs leading-relaxed space-y-3 font-serif text-slate-900">
                <p className="indent-6">
                  En respuesta a solicitud de la interesada presentada el <span className="font-bold">{fechaSolicitud}</span>, con Testimonio Nº <span className="font-bold font-mono">{nroTestimonio}</span>, Poder Especial Bastante y Suficiente que confiere la señora <span className="font-bold">{apoderadoNombre}</span>, a favor de la señora <span className="font-extrabold underline text-[#003366]">{titularNombre}</span>, con Cédula de Identidad Nº <span className="font-bold font-mono">{titularCi}</span>, solicita la autenticidad del {gradoMencion} que fué emitido por la Universidad Autónoma Gabriel René Moreno, informo qué, los datos impresos en el cuadro siguiente, es parte de la documentación en custodia del Archivo Central - UAGRM:
                </p>
              </section>

              {/* 4. Cuadro Tabular Formal (8-9 Columnas con Bordes Negros Delgados) */}
              <section className="mb-5">
                <div className="overflow-x-auto border border-slate-900 rounded-none">
                  <table className="w-full text-center text-[10px] font-sans border-collapse table-fixed">
                    <thead>
                      <tr className="bg-[#003366] text-white font-bold uppercase tracking-wider">
                        <th className="border-r border-slate-400 p-1.5 w-16 whitespace-normal break-words">Número del Diploma</th>
                        <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Nombre y Apellidos</th>
                        <th className="border-r border-slate-400 p-1.5 w-24 whitespace-normal break-words">Cédula de Identidad</th>
                        <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Diploma de:</th>
                        <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">Fojas:</th>
                        <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">Libro:</th>
                        <th className="border-r border-slate-400 p-1.5 w-20 whitespace-normal break-words">Fecha de Extensión</th>
                        <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Nombre del Rector</th>
                        <th className="p-1.5 w-16 whitespace-normal break-words">Pie de firma del Rector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border-r border-slate-300 p-1.5 font-mono font-bold text-[#C51D24] break-words">
                            {row.nroDiploma}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 font-extrabold break-words uppercase">
                            {row.nombreTitular}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                            {row.ci}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 font-medium break-words">
                            {row.diplomaDe}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                            {row.fojas}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                            {row.libro}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 break-words">
                            {row.fechaExtension}
                          </td>
                          <td className="border-r border-slate-300 p-1.5 break-words">
                            {row.nombreRector}
                          </td>
                          <td className="p-1.5 break-words">
                            {row.pieFirmaRector}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 5. Párrafos Inferiores (Aclaratoria Histórica + Supletorio) */}
              {incluirAclaratoriaHistorica && (
                <p className="text-justify text-xs font-serif text-slate-900 mb-3 bg-amber-50/50 p-2.5 rounded border-l-2 border-amber-500">
                  Aclarando que, en la gestión del <strong>{gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma esta rotulado el nombre completo del Rector.
                </p>
              )}

              {incluirSupletorio && (
                <p className="text-justify text-xs font-sans text-slate-800 mb-4">
                  Así mismo y a solicitud de la interesada, se le extendió el{' '}
                  <span className="font-bold underline">
                    Supletorio del {tableRows[0]?.diplomaDe || 'Diploma de Bachiller en Humanidades'} N° {tableRows[0]?.nroDiploma || nroTitulo}
                  </span>
                  , es dado en la ciudad de Santa Cruz de la Sierra, a los <span className="font-bold">{fechaDoc}</span>, firmado por las autoridades correspondientes.
                </p>
              )}

              {/* Cierre Formal */}
              <p className="text-justify text-xs font-sans text-slate-800 mb-10">
                Es cuanto informo, para los fines que usted considere conveniente, me despido de usted con las atenciones más distinguidas.
              </p>

              {/* Firma de Jefe de Archivo Alineada (Sin Sellos ni Estampados de Tinta) */}
              <div className="pt-6 flex justify-start items-end pl-8">
                <div className="text-center font-sans text-xs space-y-1">
                  <div className="w-56 border-b border-slate-800 mx-auto mb-2"></div>
                  <p className="font-extrabold text-[#003366]">{jefeArchivoNombre}</p>
                  <p className="font-bold text-[10px] uppercase text-slate-700">
                    JEFE DE ARCHIVO U.A.G.R.M.
                  </p>
                </div>
              </div>
            </div>

            {/* Pie de Página Institucional con Lema y Cintillo de Dirección */}
            <footer className="pt-4 border-t border-slate-300 font-sans text-[9px] text-slate-600 flex justify-between items-end mt-8">
              <div>
                <p className="font-bold">MCL/Sandra</p>
                <p>Adj: fotocopias de la documentación respectiva.</p>
                <p>Cc: /archivo</p>
              </div>

              <div className="text-right space-y-0.5">
                <p className="font-extrabold italic text-[#003366] text-[10px]">
                  "Autonomía y Cambio con Excelencia Académica"
                </p>
                <p>📍 Av. Busch entre 2do. y 3er. anillo "Ciudad Universitaria" | Santa Cruz de la Sierra - Bolivia</p>
              </div>
            </footer>

          </div>
        </div>

        {/* Panel Lateral de Edición Estilo Word (Derecha) */}
        {showWordEditor && (
          <div className="w-96 bg-white p-5 space-y-5 print:hidden shadow-sm border border-slate-200 rounded-2xl shrink-0 overflow-y-auto max-h-[85vh]">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                Panel Word (Tipo 3 - Archivo)
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                Físico 100% Identico
              </span>
            </div>

            {/* Sección 1: Encabezado & Destinatario */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                1. Encabezado & Carta
              </h4>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Correlativo (INF N°):
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
                  Fecha del Documento:
                </label>
                <input
                  type="text"
                  value={fechaDoc}
                  onChange={(e) => setFechaDoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Destinatario (Nombre):
                </label>
                <input
                  type="text"
                  value={destinatarioNombre}
                  onChange={(e) => setDestinatarioNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-[#003366]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Línea de Referencia:
                </label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Sección 2: Solicitud Legal & Titular */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                2. Solicitud Legal & Interesada
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Titular / Interesada:
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
                  Cédula de Identidad (C.I.):
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
                  Apoderado / Poder Especial:
                </label>
                <input
                  type="text"
                  value={apoderadoNombre}
                  onChange={(e) => setApoderadoNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha Solicitud:
                  </label>
                  <input
                    type="text"
                    value={fechaSolicitud}
                    onChange={(e) => setFechaSolicitud(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    N° Testimonio:
                  </label>
                  <input
                    type="text"
                    value={nroTestimonio}
                    onChange={(e) => setNroTestimonio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Tabla & Cláusulas Condicionales */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                  3. Tabla Matriz & Opciones
                </h4>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-2 py-1 bg-blue-50 text-[#003366] text-[10px] font-bold rounded border border-blue-200"
                >
                  + Fila
                </button>
              </div>

              {tableRows.map((row, idx) => (
                <div key={row.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-bold text-[#C51D24] text-[10px]">
                      Fila #{idx + 1} - Diploma N° {row.nroDiploma}
                    </span>
                    {tableRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="text-red-600 text-[10px] font-bold"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">N° Diploma:</label>
                      <input
                        type="text"
                        value={row.nroDiploma}
                        onChange={(e) => handleUpdateRow(row.id, 'nroDiploma', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Diploma De:</label>
                      <input
                        type="text"
                        value={row.diplomaDe}
                        onChange={(e) => handleUpdateRow(row.id, 'diplomaDe', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Fojas:</label>
                      <input
                        type="text"
                        value={row.fojas}
                        onChange={(e) => handleUpdateRow(row.id, 'fojas', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Libro:</label>
                      <input
                        type="text"
                        value={row.libro}
                        onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2 pt-2">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Párrafo Aclaratorio Histórico:</span>
                  <input
                    type="checkbox"
                    checked={incluirAclaratoriaHistorica}
                    onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Párrafo Supletorio:</span>
                  <input
                    type="checkbox"
                    checked={incluirSupletorio}
                    onChange={(e) => setIncluirSupletorio(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Jefe de Archivo (Firma):
                  </label>
                  <input
                    type="text"
                    value={jefeArchivoNombre}
                    onChange={(e) => setJefeArchivoNombre(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-[#003366]"
                  />
                </div>
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
                {isSaving ? 'Guardando Cambios...' : 'Guardar Documento'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                🖨️ IMPRIMIR INFORME FÍSICO ({paperSize.toUpperCase()})
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
