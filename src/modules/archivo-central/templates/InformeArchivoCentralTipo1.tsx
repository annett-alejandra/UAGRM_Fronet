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
  textoFirmaPersonalizable?: string;
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
  titularNombre = 'Jenny Flores Peña',
  titularCi = '3250858-SCZ',
  gradoMencion = 'Diploma de Bachiller',
  tableRows = [],
  incluirAclaratoriaHistorica = true,
  gestionHistorica = '1998',
  jefeArchivoNombre = 'Moisés Cossio López',
  textoFirmaPersonalizable = 'Es cuanto informo a su autoridad para los fines legales convenientes. Documento verificado físicamente contra Libro Matriz N° 19/98 y Folio N° 115/98.'
}: InformeArchivoCentralTipo1Props) {
  return (
    <div 
      className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shrink-0 relative flex flex-col justify-between font-serif print:p-0 print:shadow-none print:w-full border border-slate-200 print:border-none box-border shadow-2xl"
      style={{
        paddingTop: '3.5cm',
        paddingLeft: '4cm',
        paddingRight: '2cm',
        paddingBottom: '2cm'
      }}
    >
      <div>
        {/* Encabezado Membretado Oficial de Archivo Central */}
        <header className="flex justify-between items-start border-b border-slate-300 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[60px] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[60px] h-auto object-contain">
                <circle cx="100" cy="100" r="96" fill="#003366" stroke="#C51D24" strokeWidth="6"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5A823" strokeWidth="3" strokeDasharray="6,3"/>
                <path d="M100 25 L120 70 L170 70 L130 100 L145 150 L100 120 L55 150 L70 100 L30 70 L80 70 Z" fill="#E5A823"/>
                <text x="100" y="105" textAnchor="middle" fill="#003366" fontFamily="serif" fontWeight="bold" fontSize="22">UAGRM</text>
                <text x="100" y="170" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="bold" fontSize="11" letterSpacing="1">SANTA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-wider uppercase text-slate-700 leading-tight">
              SECCIÓN ARCHIVO CENTRAL<br />U.A.G.R.M.
            </div>
          </div>

          <div className="text-right font-sans text-xs shrink-0">
            <p className="font-extrabold text-[#003366] text-sm">
              INF N° {correlativoInforme}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">{fechaDoc}</p>
          </div>
        </header>

        {/* Datos del Destinatario y Referencia */}
        <div className="space-y-1.5 text-xs font-serif leading-relaxed mb-6">
          <p><strong>A:</strong> <span className="uppercase font-bold text-[#003366]">{destinatarioNombre}</span></p>
          <p className="pl-4 text-slate-700 uppercase font-bold text-[11px]">{destinatarioCargo}</p>
          <p className="pt-2"><strong>REF.:</strong> <span className="uppercase font-extrabold border-b border-slate-400 pb-0.5">{referencia}</span></p>
        </div>

        {/* Párrafo Narrativo Inicial */}
        <div className="space-y-3 text-xs font-serif text-slate-900 leading-relaxed text-justify mb-6">
          <p>
            En atención a la solicitud presentada en fecha <strong>{fechaSolicitud}</strong>, por la señora <strong>{apoderadoNombre}</strong>, apoderada de la señora <strong>{titularNombre}</strong> con C.I. N° <strong>{titularCi}</strong>, según Testimonio N° <strong>{nroTestimonio}</strong>; sobre el <strong>{gradoMencion}</strong>, me me me me permito informar a su autoridad lo siguiente:
          </p>

          <p>
            Revisada la base de datos informáticos y los Libros Matrices Físicos que se custodian en esta Sección de Archivo Central, se constató el siguiente registro oficial:
          </p>
        </div>

        {/* TABLA TABULAR DE 9 COLUMNAS */}
        <div className="my-6 overflow-x-auto border border-slate-300 rounded">
          <table className="w-full text-left text-[10px] font-sans border-collapse">
            <thead className="bg-slate-100 text-slate-800 uppercase font-extrabold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">N° Diploma</th>
                <th className="p-2 border-r border-slate-300">Nombres y Apellidos</th>
                <th className="p-2 border-r border-slate-300">C.I.</th>
                <th className="p-2 border-r border-slate-300">Diploma De</th>
                <th className="p-2 border-r border-slate-300">Fojas</th>
                <th className="p-2 border-r border-slate-300">Libro</th>
                <th className="p-2 border-r border-slate-300">Fecha Extensión</th>
                <th className="p-2 border-r border-slate-300">Rector que Firmó</th>
                <th className="p-2">Pie Firma Rector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tableRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold border-r border-slate-200 text-center">{r.nroDiploma}</td>
                  <td className="p-2 font-bold border-r border-slate-200 uppercase">{r.nombreTitular}</td>
                  <td className="p-2 font-mono border-r border-slate-200">{r.ci}</td>
                  <td className="p-2 border-r border-slate-200 font-medium">{r.diplomaDe}</td>
                  <td className="p-2 font-mono border-r border-slate-200 text-center">{r.fojas}</td>
                  <td className="p-2 font-mono border-r border-slate-200 text-center">{r.libro}</td>
                  <td className="p-2 border-r border-slate-200">{r.fechaExtension}</td>
                  <td className="p-2 border-r border-slate-200 font-bold uppercase">{r.nombreRector}</td>
                  <td className="p-2 text-slate-600 italic">{r.pieFirmaRector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nota Aclaratoria de Libro Histórico */}
        {incluirAclaratoriaHistorica && (
          <div className="my-4 p-3 bg-amber-50/70 border border-amber-300 rounded text-[11px] text-amber-950 font-sans italic leading-normal">
            <strong>Nota Aclaratoria de Libro Histórico (Gestión {gestionHistorica}):</strong> El presente informe certifica el registro físico reconvalidado de los Libros Matrices pertenecientes a la gestión {gestionHistorica}, custodiados en la Sección de Archivo Central de la Universidad Autónoma Gabriel René Moreno.
          </div>
        )}

        {/* Párrafo Personalizable de Cierre de Firma */}
        <div className="mt-6 text-xs font-serif text-slate-900 leading-relaxed text-justify bg-slate-50/60 p-3 border-l-2 border-blue-600 rounded-r">
          <p>{textoFirmaPersonalizable}</p>
        </div>
      </div>

      {/* Pie de Página de Firmas */}
      <footer className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs font-serif">
        <div>
          <div className="h-16 border-b border-slate-400 mb-2 border-dashed"></div>
          <p className="font-extrabold uppercase">{jefeArchivoNombre}</p>
          <p className="text-[10px] text-slate-600 font-sans uppercase tracking-wider">JEFE SECCIÓN ARCHIVO CENTRAL - UAGRM</p>
        </div>
        <div>
          <div className="h-16 border-b border-slate-400 mb-2 border-dashed"></div>
          <p className="font-extrabold uppercase">{destinatarioNombre}</p>
          <p className="text-[10px] text-slate-600 font-sans uppercase tracking-wider">{destinatarioCargo}</p>
        </div>
      </footer>
    </div>
  );
}
