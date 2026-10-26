export interface TablaFilaArchivo {
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

export interface InformeArchivoCentralTipo1Props {
  correlativoInforme?: string;
  fechaDoc?: string;
  destinatarioNombre?: string;
  destinatarioCargo?: string;
  referencia?: string;
  fechaSolicitud?: string;
  nroTestimonio?: string;
  apoderadoNombre?: string;
  titularNombre?: string;
  titularCi?: string;
  gradoMencion?: string;
  nroTitulo?: string;
  tableRows?: TablaFilaArchivo[];
  incluirAclaratoriaHistorica?: boolean;
  gestionHistorica?: string;
  incluirSupletorio?: boolean;
  jefeArchivoNombre?: string;
}

export function InformeArchivoCentralTipo1({
  correlativoInforme = '0472',
  fechaDoc = '20 de abril de 2026',
  destinatarioNombre = 'MSc. Edy Acosta Claros',
  destinatarioCargo = 'SECRETARIO GENERAL - U.A.G.R.M.',
  referencia = 'INFORME DEL DIPLOMA DE BACHILLER.',
  fechaSolicitud = '16 de abril de 2026',
  nroTestimonio = '1246/2025',
  apoderadoNombre = 'Yuli Alison Romero Flores',
  titularNombre = '',
  titularCi = '',
  gradoMencion = 'Diploma de Bachiller',
  nroTitulo = '',
  tableRows = [
    {
      id: '1',
      nroDiploma: '',
      nombreTitular: '',
      ci: '',
      diplomaDe: 'BACHILLER EN HUMANIDADES',
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
    }
  ],
  incluirAclaratoriaHistorica = true,
  gestionHistorica = '1998',
  incluirSupletorio = true,
  jefeArchivoNombre = 'Moisés Cossio López'
}: InformeArchivoCentralTipo1Props) {
  return (
    <div 
      className="bg-white max-w-[210mm] mx-auto min-h-[297mm] max-h-[297mm] flex flex-col justify-between shadow-xl print:shadow-none print:m-0 print:w-full print:max-h-none text-slate-900 border border-slate-200 print:border-none relative box-border overflow-hidden print:overflow-visible break-inside-avoid"
      style={{
        paddingTop: '3.5cm',
        paddingLeft: '4cm',
        paddingRight: '2cm',
        paddingBottom: '2cm'
      }}
    >
      {/* Contenido Principal de la Hoja Única */}
      <div className="space-y-3">

        {/* 1. ENCABEZADO CENTRADO INSTITUCIONAL */}
        <header className="text-center font-serif pb-1 mb-2">
          <h1 className="font-extrabold text-base uppercase text-[#191A7D] tracking-wide leading-tight">
            UNIVERSIDAD AUTÓNOMA &quot;GABRIEL RENÉ MORENO&quot;
          </h1>
          <h2 className="font-bold text-xs uppercase text-slate-800 tracking-wider">
            SECRETARÍA GENERAL
          </h2>
          <h3 className="font-semibold text-xs uppercase text-slate-700">
            Archivo Central
          </h3>
        </header>

        {/* 2. FECHA Y CORRELATIVO UBICADOS JUSTO ARRIBA DEL DESTINATARIO (LIC ACOSTA) */}
        <section className="font-sans text-xs space-y-0.5 text-left mb-2">
          <p className="font-medium text-slate-800">
            Santa Cruz de la Sierra, <strong className="font-bold text-slate-900">{fechaDoc}</strong>
          </p>
          <p className="font-extrabold text-[#191A7D]">
            SECCION ARCHIVO / INF. No. <span className="underline font-mono">{correlativoInforme}</span>
          </p>
        </section>

        {/* 3. DESTINATARIO */}
        <section className="font-sans text-xs space-y-0.5 text-left">
          <p className="font-bold text-slate-800">Señor:</p>
          <p className="font-extrabold text-sm text-[#191A7D]">{destinatarioNombre}</p>
          <p className="font-bold uppercase text-slate-700">{destinatarioCargo}</p>
          <p className="font-bold text-slate-800">Presente.-</p>
        </section>

        <div className="my-2 text-center">
          <p className="font-extrabold text-xs text-[#191A7D] underline uppercase tracking-wide">
            Ref.: {referencia}
          </p>
        </div>

        <p className="font-bold text-xs text-slate-800 font-sans">
          De mi consideración:
        </p>

        {/* 4. Párrafo Legal Introductorio */}
        <section className="text-justify text-xs leading-normal font-serif text-slate-900">
          <p className="indent-6">
            En respuesta a solicitud de la interesada presentada el <span className="font-bold">{fechaSolicitud}</span>, con Testimonio Nº <span className="font-bold font-mono">{nroTestimonio}</span>, Poder Especial Bastante y Suficiente que confiere la señora <span className="font-bold">{apoderadoNombre}</span>, a favor de la señora <span className="font-extrabold underline text-[#191A7D]">{titularNombre}</span>, con Cédula de Identidad Nº <span className="font-bold font-mono">{titularCi}</span>, solicita la autenticidad del {gradoMencion} que fue emitido por la Universidad Autónoma Gabriel René Moreno, informo que, los datos impresos en el cuadro siguiente, es parte de la documentación en custodia del Archivo Central - UAGRM:
          </p>
        </section>

        {/* 5. Cuadro Tabular de 9 Columnas */}
        <section className="my-2">
          <div className="overflow-x-auto border border-slate-900 rounded-none">
            <table className="w-full text-center text-[10px] font-sans border-collapse table-fixed">
              <thead>
                <tr className="bg-[#191A7D] text-white font-bold uppercase tracking-wider">
                  <th className="border-r border-slate-400 p-1 w-16 whitespace-normal break-words">Número del Diploma</th>
                  <th className="border-r border-slate-400 p-1 whitespace-normal break-words">Nombre y Apellidos</th>
                  <th className="border-r border-slate-400 p-1 w-24 whitespace-normal break-words">Cédula de Identidad</th>
                  <th className="border-r border-slate-400 p-1 whitespace-normal break-words">Diploma de:</th>
                  <th className="border-r border-slate-400 p-1 w-12 whitespace-normal break-words">Fojas:</th>
                  <th className="border-r border-slate-400 p-1 w-12 whitespace-normal break-words">Libro:</th>
                  <th className="border-r border-slate-400 p-1 w-20 whitespace-normal break-words">Fecha de Extensión</th>
                  <th className="border-r border-slate-400 p-1 whitespace-normal break-words">Nombre del Rector</th>
                  <th className="p-1 w-16 whitespace-normal break-words">Pie de firma del Rector</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border-r border-slate-300 p-1 font-mono font-bold text-[#D31338] break-words">
                      {row.nroDiploma}
                    </td>
                    <td className="border-r border-slate-300 p-1 font-extrabold break-words uppercase">
                      {row.nombreTitular}
                    </td>
                    <td className="border-r border-slate-300 p-1 font-mono break-words">
                      {row.ci}
                    </td>
                    <td className="border-r border-slate-300 p-1 font-medium break-words">
                      {row.diplomaDe}
                    </td>
                    <td className="border-r border-slate-300 p-1 font-mono break-words">
                      {row.fojas}
                    </td>
                    <td className="border-r border-slate-300 p-1 font-mono break-words">
                      {row.libro}
                    </td>
                    <td className="border-r border-slate-300 p-1 break-words">
                      {row.fechaExtension}
                    </td>
                    <td className="border-r border-slate-300 p-1 break-words">
                      {row.nombreRector}
                    </td>
                    <td className="p-1 break-words">
                      {row.pieFirmaRector}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Párrafos Inferiores */}
        {incluirAclaratoriaHistorica && (
          <p className="text-justify text-xs font-serif text-slate-900 bg-amber-50/50 p-2 rounded border-l-2 border-amber-500">
            Aclarando que, en la gestión del <strong>{gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma está rotulado el nombre completo del Rector.
          </p>
        )}

        {incluirSupletorio && (
          <p className="text-justify text-xs font-sans text-slate-800">
            Así mismo y a solicitud de la interesada, se le extendió el{' '}
            <span className="font-bold underline">
              Supletorio del {tableRows[0]?.diplomaDe || 'Diploma de Bachiller'} Nº {tableRows[0]?.nroDiploma || nroTitulo}
            </span>
            , es dado en la ciudad de Santa Cruz de la Sierra, a los <span className="font-bold">{fechaDoc}</span>, firmado por las autoridades correspondientes.
          </p>
        )}

        <p className="text-justify text-xs font-sans text-slate-800">
          Es cuanto informo, para los fines que usted considere conveniente, me despido de usted con las atenciones más distinguidas.
        </p>

        {/* Firma Única de Jefe de Archivo */}
        <div className="pt-4 flex justify-center items-center text-center">
          <div className="text-center font-sans text-xs space-y-0.5 mx-auto w-72">
            <div className="w-60 border-b border-slate-800 mx-auto mb-1.5"></div>
            <p className="font-extrabold text-[#191A7D] text-xs">{jefeArchivoNombre}</p>
            <p className="font-bold text-[10px] uppercase text-slate-700 tracking-wider">
              JEFE DE ARCHIVO U.A.G.R.M.
            </p>
          </div>
        </div>
      </div>

      {/* Pie de Página Institucional */}
      <footer className="pt-2 border-t border-slate-300 font-sans text-[9px] text-slate-600 flex justify-between items-end mt-2">
        <div>
          <p className="font-bold">MCL/Sandra</p>
          <p>Adj: fotocopias de la documentación respectiva.</p>
          <p>Cc: /archivo</p>
        </div>

        <div className="text-right space-y-0.5">
          <p className="font-extrabold italic text-[#191A7D] text-[9.5px]">
            &quot;Autonomía y Cambio con Excelencia Académica&quot;
          </p>
          <p>Av. Busch entre 2do. y 3er. anillo &quot;Ciudad Universitaria&quot; | Santa Cruz de la Sierra - Bolivia</p>
        </div>
      </footer>
    </div>
  );
}

// Export alias for backward compatibility
export const InformeArchivoCentralTipo3 = InformeArchivoCentralTipo1;
export type InformeArchivoCentralTipo3Props = InformeArchivoCentralTipo1Props;
