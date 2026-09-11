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
  const [expediente, setExpediente] = useState<ExpedienteTitulos | null>(null);

  // Variables Editables del Documento
  const [correlativoInforme, setCorrelativoInforme] = useState('0471');
  const [fechaDoc, setFechaDoc] = useState('20 de abril de 2026');
  const [destinatarioNombre, setDestinatarioNombre] = useState('MSc. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('INFORME DEL DIPLOMA DE BACHILLER');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('16 de abril de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('1246/2025');
  const [solicitanteNombre, setSolicitanteNombre] = useState('Yuli Alison Romero Flores');
  const [titularNombre, setTitularNombre] = useState('Jenny Flores Peña');
  const [titularCi, setTitularCi] = useState('3250858-SCZ');

  // 3. Filas de la Tabla en blanco por defecto (se llenan automáticamente al consultar)
  const [tableRows, setTableRows] = useState<TablaFila[]>([
    {
      id: '1',
      nroDiploma: '',
      nombreTitular: '',
      ci: '',
      diplomaDe: '',
      fojas: '',
      libro: '',
      fechaExtension: '',
      nombreRector: '',
      pieFirmaRector: ''
    }
  ]);

  // 4. Consulta Automática al Backend (GET /api/expedientes/{id}/documentos/)
  const handleConsultarExpediente = async (term: string) => {
    if (!term) return;
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(term);
      if (data) {
        setCorrelativoInforme(data.informe_nro || '0471');
        setFechaDoc(data.fecha || '20 de abril de 2026');
        setFechaSolicitud(data.fecha_solicitud || '16 de abril de 2026');
        setNroTestimonio(data.nro_testimonio || '1246/2025');
        setSolicitanteNombre(data.apoderado || 'Yuli Alison Romero Flores');
        setTitularNombre(data.titular.nombre_completo || 'Jenny Flores Peña');
        setTitularCi(data.titular.ci_expedido || '3250858-SCZ');

        // Inyección de registros dinámicos a las celdas de la tabla
        setTableRows([
          {
            id: Date.now().toString(),
            nroDiploma: data.expediente.nro_diploma || term || '014863',
            nombreTitular: (data.titular.nombre_completo || 'JENNY FLORES PEÑA').toUpperCase(),
            ci: data.titular.ci_expedido || '3250858-SCZ',
            diplomaDe: (data.carrera_colegio.mencion || 'BACHILLER EN HUMANIDADES').replace('.', '').toUpperCase(),
            fojas: data.archivo_fisico.fojas || '115/98',
            libro: data.archivo_fisico.libro_matriz || '19/98',
            fechaExtension: data.expediente.fecha_emision || '24 de julio de 1998',
            nombreRector: (data.autoridad.rector_nombre || 'JORGE ORELLANA MORENO').toUpperCase(),
            pieFirmaRector: data.archivo_fisico.observacion_firma || 'No tiene'
          }
        ]);
      }
    } catch {
      /* fallback silencioso */
    } finally {
      setIsSearching(false);
    }
  };

  // Handlers para el Panel de Edición Derecho
  const handleAddRow = () => {
    const newRow: TablaFila = {
      id: Date.now().toString(),
      nroDiploma: '',
      nombreTitular: titularNombre.toUpperCase(),
      ci: titularCi,
      diplomaDe: 'BACHILLER EN HUMANIDADES',
      fojas: '',
      libro: '',
      fechaExtension: '',
      nombreRector: '',
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

  // Guardar Certificado en el Backend
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
      alert('Documento e informe guardados exitosamente.');
    } catch {
      alert('Error al guardar el documento.');
    } finally {
      setIsSaving(false);
    }
  };

  // Dimensiones del papel
  const getPaperClass = () => {
    switch (paperSize) {
      case 'oficio':
        return 'w-[216mm] min-h-[356mm] p-[18mm]';
      case 'a4':
        return 'w-[210mm] min-h-[297mm] p-[16mm]';
      case 'carta':
      default:
        return 'w-[215.9mm] min-h-[279.4mm] p-[15mm]';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 5. Top Action Bar: Búsqueda y Botón "Ocultar Panel Word" en la parte superior sin iconos feos */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        
        {/* Búsqueda por C.I. o Trámite */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleConsultarExpediente(searchDiploma);
          }}
          className="flex items-center gap-3"
        >
          <span className="text-xs font-bold text-[#2A3964] uppercase tracking-wider">
            CONSULTAR EXPEDIENTE:
          </span>
          <input
            type="text"
            value={searchDiploma}
            onChange={(e) => setSearchDiploma(e.target.value)}
            placeholder="Ingrese C.I. o N°..."
            className="select-estilo w-48 font-mono font-bold"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="boton-crear py-2 px-4 text-xs font-bold"
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* 5. Botón de Ocultar/Mostrar Panel Word ARRIBA (Sin iconos feos) */}
        <div>
          <button
            onClick={() => setShowWordEditor((prev) => !prev)}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          >
            {showWordEditor ? 'Ocultar Panel Word' : 'Mostrar Panel Word'}
          </button>
        </div>
      </div>

      {/* Layout Principal: Documento al Centro + Panel Derecho Word (Zona Verde) */}
      <div className="flex gap-6 items-start">
        
        {/* Centro: Vista Previa del Documento Imprimible */}
        <div className="flex-1 flex justify-center bg-[#e2e8f0]/40 p-4 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
          
          <div
            className={`bg-white text-slate-900 shadow-xl transition-all print:shadow-none print:m-0 print:p-0 font-serif leading-relaxed relative ${getPaperClass()}`}
            style={{ color: '#111827' }}
          >
            {/* 1 & 7. Encabezado Centrado con Logo UAGRM (img1) y Metadatos al lado */}
            <header className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
              
              {/* Logo UAGRM (img1) */}
              <div className="w-24 shrink-0">
                <img
                  src="/images/img1.jpeg"
                  alt="Logo UAGRM"
                  className="h-20 w-auto object-contain"
                  onError={(e) => {
                    // Fallback visual en caso de que img1 no se cargue correctamente
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Encabezado Institucional Centrado */}
              <div className="text-center flex-1 px-4 font-sans">
                <h2 className="font-extrabold text-sm text-[#2A3964] leading-snug uppercase tracking-tight">
                  UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                </h2>
                <h3 className="font-extrabold text-xs text-[#880000] tracking-wider uppercase mt-0.5">
                  DEPARTAMENTO DE ARCHIVO CENTRAL
                </h3>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">
                  SANTA CRUZ - BOLIVIA
                </p>
              </div>

              {/* Metadatos del Documento al lado */}
              <div className="text-right font-sans text-xs space-y-1 shrink-0">
                <p className="font-extrabold text-[#2A3964]">
                  SECCIÓN ARCHIVO / INF. No. <span className="underline font-mono">{correlativoInforme}</span>
                </p>
                <p className="text-slate-700 font-medium text-[11px]">
                  Santa Cruz de la Sierra, <span className="font-bold">{fechaDoc}</span>
                </p>
              </div>
            </header>

            {/* Destinatario Formal */}
            <section className="mb-4 font-sans text-xs space-y-1">
              <p className="font-bold text-slate-800">Señor:</p>
              <p className="font-extrabold text-sm text-[#2A3964]">{destinatarioNombre}</p>
              <p className="font-bold uppercase text-slate-700">{destinatarioCargo}</p>
            </section>

            {/* 2. Referencia CENTRADA en medio */}
            <div className="my-6 text-center">
              <p className="font-extrabold text-sm text-[#2A3964] underline uppercase tracking-wide">
                Ref.: {referencia}
              </p>
            </div>

            {/* Párrafo Legal Introductorio */}
            <section className="mb-6 text-justify text-xs leading-relaxed space-y-3 font-serif">
              <p>
                En atención a la solicitud presentada en fecha <span className="font-bold">{fechaSolicitud}</span>, mediante Testimonio N° <span className="font-bold font-mono">{nroTestimonio}</span>, incoado por el/la <span className="font-bold">{solicitanteNombre}</span>, a favor de <span className="font-extrabold underline text-[#2A3964]">{titularNombre}</span>, con C.I. N° <span className="font-bold font-mono">{titularCi}</span>, quien solicita la extensión del Certificado de Autenticidad de su Diploma de Bachiller.
              </p>
              <p>
                Al respecto, revisada la documentación existente en el Archivo Central de esta Casa de Estudios Superiores, se evidencia el registro del asiento del Diploma de Bachiller correspondiente, según el siguiente detalle:
              </p>
            </section>

            {/* 6. Cuadro Dinámico Central (Sin corte de palabras en celdas) */}
            <section className="mb-6">
              <div className="overflow-x-auto border border-slate-400 rounded-sm">
                <table className="w-full text-center text-[10px] font-sans border-collapse table-fixed">
                  <thead>
                    <tr className="bg-[#2A3964] text-white font-bold uppercase tracking-wider">
                      <th className="border-r border-slate-400 p-1.5 w-16 whitespace-normal break-words">N° DIPLOMA</th>
                      <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">NOMBRES Y APELLIDOS</th>
                      <th className="border-r border-slate-400 p-1.5 w-24 whitespace-normal break-words">CÉDULA IDENTIDAD</th>
                      <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">DIPLOMA DE</th>
                      <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">FOJAS</th>
                      <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">LIBRO</th>
                      <th className="border-r border-slate-400 p-1.5 w-20 whitespace-normal break-words">FECHA EXTENSIÓN</th>
                      <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">RECTOR</th>
                      <th className="p-1.5 w-16 whitespace-normal break-words">PIE FIRMA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                      >
                        <td className="border-r border-slate-300 p-1.5 font-mono font-bold text-[#880000] break-words">
                          {row.nroDiploma}
                        </td>
                        <td className="border-r border-slate-300 p-1.5 font-extrabold break-words">
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

            {/* Párrafo Aclaratorio */}
            <p className="text-justify text-xs font-sans text-slate-800 mb-4">
              Aclarando que, en la gestión 1998, no se estilaba colocar pie de firma, toda vez que se evidencia el nombre impreso en la parte superior del Diploma del Rector.
            </p>

            {/* Párrafo Supletorio */}
            <p className="text-justify text-xs font-sans text-slate-800 mb-4">
              Así mismo y a solicitud de la interesada, se le extendió el{' '}
              <span className="font-bold underline">
                Supletorio del Diploma de {tableRows[0]?.diplomaDe || 'Bachiller en Humanidades.'} N° {tableRows[0]?.nroDiploma || searchDiploma || '014863'}
              </span>
              , es dado en la ciudad de Santa Cruz de la Sierra, a los <span className="font-bold">{fechaDoc}</span>, firmado por las autoridades correspondientes.
            </p>

            {/* Cierre */}
            <p className="text-justify text-xs font-sans text-slate-800 mb-12">
              Es cuanto informo, para los fines que usted considere conveniente, me despido de usted con las atenciones más distinguidas.
            </p>

            {/* 8. Firma del Señor alineada a un lado para dejar espacio a los dos sellos físicos */}
            <div className="pt-8 flex justify-start items-end pl-8">
              <div className="text-center font-sans text-xs space-y-1">
                <div className="w-56 border-b border-slate-800 mx-auto mb-2"></div>
                <p className="font-extrabold text-[#2A3964]">Moisés Cossío López</p>
                <p className="font-bold text-[10px] uppercase text-slate-700">
                  JEFE DE ARCHIVO U.A.G.R.M.
                </p>
              </div>
            </div>

            {/* Pie de Página */}
            <footer className="pt-6 border-t border-slate-300 font-sans text-[9px] text-slate-600 flex justify-between items-end mt-8">
              <div>
                <p className="font-bold">MCL/Sandra</p>
                <p>Adj: fotocopias de la documentación respectiva.</p>
                <p>Cc: /archivo</p>
              </div>

              <div className="text-right">
                <p className="font-extrabold italic text-[#2A3964] text-[10px]">
                  "Autonomía y Cambio con Excelencia Académica"
                </p>
                <p>📍 Av. Busch entre 2do. y 3er. anillo "Ciudad Universitaria" | Santa Cruz de la Sierra - Bolivia</p>
              </div>
            </footer>
          </div>
        </div>

        {/* 5. Panel Lateral de Edición Word (Derecha) con Guardar e Imprimir ABAJO (Sin iconos feos) */}
        {showWordEditor && (
          <div className="w-96 card p-5 space-y-6 print:hidden shadow-lg border-l-4 border-[#880000] shrink-0">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-[#2A3964] font-heading">
                PANEL DE EDICIÓN (ESTILO WORD)
              </h3>
              <span className="badge-status-publicado font-mono">
                Sincronizado
              </span>
            </div>

            {/* Formato de Papel */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-[#2A3964] uppercase tracking-wider">
                Formato de Papel para Impresión:
              </label>
              <div className="flex items-center justify-between gap-2">
                {(['carta', 'oficio', 'a4'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPaperSize(size)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase transition-all ${
                      paperSize === size
                        ? 'bg-[#2A3964] text-white shadow-sm ring-2 ring-[#880000]/40'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Sección 1: Informe Metadata */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2A3964] uppercase tracking-wider border-l-2 border-[#880000] pl-2">
                Encabezado & Correlativo
              </h4>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Correlativo de Informe:
                </label>
                <input
                  type="text"
                  value={correlativoInforme}
                  onChange={(e) => setCorrelativoInforme(e.target.value)}
                  className="select-estilo font-mono"
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
                  className="select-estilo"
                />
              </div>
            </div>

            {/* Sección 2: Destinatario */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2A3964] uppercase tracking-wider border-l-2 border-[#880000] pl-2">
                Destinatario Formal
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Destinatario:
                </label>
                <input
                  type="text"
                  value={destinatarioNombre}
                  onChange={(e) => setDestinatarioNombre(e.target.value)}
                  className="select-estilo"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cargo Destinatario:
                </label>
                <input
                  type="text"
                  value={destinatarioCargo}
                  onChange={(e) => setDestinatarioCargo(e.target.value)}
                  className="select-estilo"
                />
              </div>
            </div>

            {/* Sección 3: Datos del Titular */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#2A3964] uppercase tracking-wider border-l-2 border-[#880000] pl-2">
                Datos del Solicitante y Titular
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Completo Titular:
                </label>
                <input
                  type="text"
                  value={titularNombre}
                  onChange={(e) => setTitularNombre(e.target.value)}
                  className="select-estilo font-bold text-[#2A3964]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cédula de Identidad (CI):
                </label>
                <input
                  type="text"
                  value={titularCi}
                  onChange={(e) => setTitularCi(e.target.value)}
                  className="select-estilo font-mono"
                />
              </div>
            </div>

            {/* Sección 4: Filas Dinámicas de la Tabla */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#2A3964] uppercase tracking-wider border-l-2 border-[#880000] pl-2">
                  Tabla Dinámica de Registro
                </h4>
                
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="boton-crear text-xs py-1.5 px-3"
                >
                  Agregar Fila
                </button>
              </div>

              {tableRows.map((row, idx) => (
                <div
                  key={row.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-bold text-[#880000] text-[10px]">
                      Fila #{idx + 1} {row.nroDiploma ? `- Diploma N° ${row.nroDiploma}` : ''}
                    </span>
                    
                    {tableRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="text-red-600 hover:text-red-700 text-[10px] font-bold"
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
                        className="select-estilo text-[11px] h-[36px] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Diploma De:</label>
                      <input
                        type="text"
                        value={row.diplomaDe}
                        onChange={(e) => handleUpdateRow(row.id, 'diplomaDe', e.target.value)}
                        className="select-estilo text-[11px] h-[36px]"
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
                        className="select-estilo text-[11px] h-[36px] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Libro:</label>
                      <input
                        type="text"
                        value={row.libro}
                        onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                        className="select-estilo text-[11px] h-[36px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Acciones al final del Panel Word (Guardar e Imprimir sin iconos feos) */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full boton-editar justify-center py-2.5 shadow-sm text-xs font-bold"
              >
                {isSaving ? 'Guardando Cambios...' : 'Guardar Documento'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full btn-secundario-curvo justify-center py-2.5 shadow-sm text-xs font-bold"
              >
                IMPRIMIR DOCUMENTO ({paperSize.toUpperCase()})
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
