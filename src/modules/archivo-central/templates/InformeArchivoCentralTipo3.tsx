import React from 'react';

export interface InformeArchivoCentralTipo3Props {
  correlativoInforme: string;
  fechaDoc: string;
  destinatarioNombre: string;
  destinatarioCargo: string;
  referencia: string;
  fechaSolicitud: string;
  nroTestimonio: string;
  apoderadoNombre: string;
  titularNombre: string;
  titularCi: string;
  gradoMencion: string;
  nroTitulo: string;
  tableRows: Array<{
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
  }>;
  incluirAclaratoriaHistorica: boolean;
  gestionHistorica: string;
  incluirSupletorio: boolean;
  jefeArchivoNombre: string;
}

export function InformeArchivoCentralTipo3(props: InformeArchivoCentralTipo3Props) {
  const {
    correlativoInforme,
    fechaDoc,
    destinatarioNombre,
    destinatarioCargo,
    referencia,
    fechaSolicitud,
    nroTestimonio,
    apoderadoNombre,
    titularNombre,
    titularCi,
    gradoMencion,
    nroTitulo,
    tableRows,
    incluirAclaratoriaHistorica,
    gestionHistorica,
    incluirSupletorio,
    jefeArchivoNombre
  } = props;

  return (
    <div className="printable-document w-[210mm] min-h-[297mm] bg-white shadow-xl p-[3.5rem] text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full font-serif">
      <div>
        {/* 1. Encabezado Físico Exacto */}
        <header className="flex justify-between items-start border-b-2 border-slate-300 pb-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Escudo UAGRM circular oficial desde public/images/img1.jpeg */}
            <div className="w-[70px] shrink-0">
              <img
                src="/images/img1.jpeg"
                alt="Escudo UAGRM"
                className="w-[70px] h-auto object-contain rounded-full border border-slate-200 shadow-xs"
              />
            </div>
            {/* Barra Vertical: A R C H I V O   C E N T R A L */}
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

        {/* 2. Destinatario y Referencia (Carta Formal) */}
        <section className="mb-4 font-sans text-xs space-y-0.5 text-left">
          <p className="font-bold text-slate-800">Señor:</p>
          <p className="font-extrabold text-sm text-[#003366]">{destinatarioNombre}</p>
          <p className="font-bold uppercase text-slate-700">{destinatarioCargo}</p>
          <p className="font-bold text-slate-800 pt-0.5">Presente.-</p>
        </section>

        <div className="my-5 text-center">
          <p className="font-extrabold text-xs text-[#003366] underline uppercase tracking-wide">
            Ref.: {referencia}
          </p>
        </div>

        <p className="font-bold text-xs text-slate-800 mb-3 font-sans">
          De mi consideración:
        </p>

        {/* 3. Párrafo Legal Introductorio */}
        <section className="mb-5 text-justify text-xs leading-relaxed space-y-3 font-serif text-slate-900">
          <p className="indent-6">
            En respuesta a solicitud de la interesada presentada el <span className="font-bold">{fechaSolicitud}</span>, con Testimonio Nº <span className="font-bold font-mono">{nroTestimonio}</span>, Poder Especial Bastante y Suficiente que confiere la señora <span className="font-bold">{apoderadoNombre}</span>, a favor de la señora <span className="font-extrabold underline text-[#003366]">{titularNombre}</span>, con Cédula de Identidad Nº <span className="font-bold font-mono">{titularCi}</span>, solicita la autenticidad del {gradoMencion} que fué emitido por la Universidad Autónoma Gabriel René Moreno, informo qué, los datos impresos en el cuadro siguiente, es parte de la documentación en custodia del Archivo Central - UAGRM:
          </p>
        </section>

        {/* 4. Cuadro Tabular de 9 Columnas */}
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

        {/* 5. Párrafos Inferiores */}
        {incluirAclaratoriaHistorica && (
          <p className="text-justify text-xs font-serif text-slate-900 mb-3 bg-amber-50/50 p-2.5 rounded border-l-2 border-amber-500">
            Aclarando que, en la gestión del <strong>{gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma esta rotulado el nombre completo del Rector.
          </p>
        )}

        {incluirSupletorio && (
          <p className="text-justify text-xs font-sans text-slate-800 mb-4">
            Así mismo y a solicitud de la interesada, se le extendió el{' '}
            <span className="font-bold underline">
              Supletorio del {tableRows[0]?.diplomaDe || 'Diploma de Bachiller'} N° {tableRows[0]?.nroDiploma || nroTitulo}
            </span>
            , es dado en la ciudad de Santa Cruz de la Sierra, a los <span className="font-bold">{fechaDoc}</span>, firmado por las autoridades correspondientes.
          </p>
        )}

        <p className="text-justify text-xs font-sans text-slate-800 mb-10">
          Es cuanto informo, para los fines que usted considere conveniente, me despido de usted con las atenciones más distinguidas.
        </p>

        {/* Firma Única de Jefe de Archivo - Centrado Horizontal Estricto */}
        <div className="pt-12 flex justify-center items-center my-6 text-center">
          <div className="text-center font-sans text-xs space-y-1 mx-auto w-72">
            <div className="w-64 border-b border-slate-800 mx-auto mb-2"></div>
            <p className="font-extrabold text-[#003366] text-sm">{jefeArchivoNombre}</p>
            <p className="font-bold text-[10px] uppercase text-slate-700 tracking-wider">
              JEFE DE ARCHIVO U.A.G.R.M.
            </p>
          </div>
        </div>
      </div>

      {/* Pie de Página Institucional */}
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
  );
}
