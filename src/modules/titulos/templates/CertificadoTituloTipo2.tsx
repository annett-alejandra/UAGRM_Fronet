export interface CertificadoTituloTipo2Props {
  nroCertificado?: string;
  informeRef?: string;
  fechaInforme?: string;
  gradoMencion?: string;
  nroTitulo?: string;
  nombreTitular?: string;
  ciTitular?: string;
  libroRegistro?: string;
  fojas?: string;
  fechaEmisionOriginal?: string;
  gestionHistorica?: string;
  incluirAclaratoriaHistorica?: boolean;
  lugarFechaCertificacion?: string;
  autoridadSecretario?: string;
  autoridadRector?: string;
}

export function CertificadoTituloTipo2({
  nroCertificado = '749/2026',
  informeRef = 'SECCION ARCHIVO/ INF N°472',
  fechaInforme = '20 de abril de 2026',
  gradoMencion = 'Diploma de Bachiller en Humanidades',
  nroTitulo = '019741',
  nombreTitular = 'LYNNE DENISSE PEREZ REVILLA',
  ciTitular = '4716343-SCZ',
  libroRegistro = '026/99',
  fojas = '181',
  fechaEmisionOriginal = '5 de marzo del año 1999',
  gestionHistorica = '1999',
  incluirAclaratoriaHistorica = true,
  lugarFechaCertificacion = 'Santa Cruz de la Sierra, 22 de abril del 2026',
  autoridadSecretario = 'LIC. EDY ACOSTA CLAROS',
  autoridadRector = 'DR. REINERIO VARGAS BANEGAS'
}: CertificadoTituloTipo2Props) {
  return (
    <div 
      className="w-[210mm] min-h-[297mm] bg-white shadow-xl text-slate-900 shrink-0 relative flex flex-col justify-between rounded-none print:p-0 print:shadow-none print:w-full font-serif border border-slate-200 print:border-none box-border"
      style={{
        paddingTop: '3.5cm',
        paddingLeft: '4cm',
        paddingRight: '2cm',
        paddingBottom: '2cm'
      }}
    >
      <div>
        {/* Encabezado Superior Membretado */}
        <header className="flex justify-between items-start border-b border-slate-300 pb-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Escudo UAGRM oficial */}
            <div className="w-[65px] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[65px] h-auto object-contain">
                <circle cx="100" cy="100" r="96" fill="#003366" stroke="#C51D24" strokeWidth="6"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5A823" strokeWidth="3" strokeDasharray="6,3"/>
                <path d="M100 25 L120 70 L170 70 L130 100 L145 150 L100 120 L55 150 L70 100 L30 70 L80 70 Z" fill="#E5A823"/>
                <text x="100" y="105" textAnchor="middle" fill="#003366" fontFamily="serif" fontWeight="bold" fontSize="22">UAGRM</text>
                <text x="100" y="170" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="bold" fontSize="11" letterSpacing="1">SANTA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            {/* Cintillo SECRETARÍA GENERAL */}
            <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-[0.2em] uppercase text-slate-700 leading-tight">
              SECRETARÍA<br />GENERAL
            </div>
          </div>

          <div className="text-center font-serif flex-1 px-4">
            <h1 className="text-base font-extrabold uppercase tracking-wide text-[#003366]">
              UNIVERSIDAD AUTÓNOMA &quot;GABRIEL RENÉ MORENO&quot;
            </h1>
            <p className="text-[10px] uppercase text-slate-500 font-sans tracking-widest mt-0.5 font-bold">
              2025 BICENTENARIO DE BOLIVIA
            </p>
          </div>

          <div className="text-right font-sans text-xs shrink-0">
            <p className="font-extrabold text-[#003366] text-sm">
              CERTIFICADO N°{nroCertificado}
            </p>
          </div>
        </header>

        {/* Encabezado Autoridades Fijas */}
        <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed mt-4">
          <p className="uppercase font-bold text-slate-900 text-justify">
            LA UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO POR MEDIO DE SUS AUTORIDADES EL RECTOR {autoridadRector.toUpperCase()} Y EL SECRETARIO GENERAL {autoridadSecretario.toUpperCase()}.
          </p>

          <p className="font-extrabold text-center text-sm tracking-widest my-4 uppercase text-[#003366]">
            CERTIFICAN:
          </p>

          {/* Prosa Legal Corrida de Certificación (Tipo 2: Del 2000 para atrás / 1999 y anteriores - Base PosgreTS) */}
          <p className="text-justify leading-relaxed">
            Que, en atención al informe <strong className="font-mono">{informeRef}</strong> de fecha <strong>{fechaInforme}</strong>, tenemos a bien Certificar que el <strong>{gradoMencion}</strong> consignado con el N°<strong className="font-mono">{nroTitulo}</strong> le fue otorgado a la ciudadana <strong className="font-bold uppercase">{nombreTitular}</strong>, con Cédula de Identidad N°<strong className="font-mono">{ciTitular}</strong>., mismo que se encuentra registrado en el Libro N°<strong className="font-mono">{libroRegistro}</strong> a Fojas N°<strong className="font-mono">{fojas}</strong>, emitido en fecha <strong>{fechaEmisionOriginal}</strong>, documentación original que se encuentra en Archivo Central de esta Casa Superior de Estudios.
          </p>

          {/* Párrafo Histórico Obligatorio para Tipo 2 */}
          {incluirAclaratoriaHistorica && (
            <p className="text-justify leading-relaxed bg-amber-50/60 p-3 rounded-lg border-l-4 border-amber-600 my-3 font-serif text-slate-900">
              Aclarando que, en la gestión del <strong>{gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma está rotulado el nombre completo del Rector.
            </p>
          )}

          <p className="text-justify pt-2">
            Es cuanto certificamos sobre la autenticidad y validez del mencionado documento.
          </p>

          <p className="text-right pt-6 font-sans font-semibold text-slate-800">
            {lugarFechaCertificacion}.
          </p>
        </div>
      </div>

      {/* Bloque de Dos Firmas Oficiales */}
      <div className="mt-16">
        <div className="flex justify-around items-end w-full">
          {/* Firma 1: Secretario General */}
          <div className="text-center min-w-[220px]">
            <div className="border-t border-slate-900 mb-2 w-full"></div>
            <p className="text-xs font-bold text-slate-900">
              {autoridadSecretario}
            </p>
            <p className="text-[10px] text-slate-700 uppercase font-semibold">
              SECRETARIO GENERAL<br />U.A.G.R.M.
            </p>
          </div>

          {/* Firma 2: Rector */}
          <div className="text-center min-w-[220px]">
            <div className="border-t border-slate-900 mb-2 w-full"></div>
            <p className="text-xs font-bold text-slate-900">
              {autoridadRector}
            </p>
            <p className="text-[10px] text-slate-700 uppercase font-semibold">
              RECTOR<br />U.A.G.R.M.
            </p>
          </div>
        </div>

        {/* Pie de Página Institucional */}
        <footer className="pt-6 border-t border-slate-300 font-sans text-[9px] text-slate-600 flex justify-between items-center mt-6">
          <p className="font-bold italic text-[#003366]">
            &quot;Autonomía y Cambio con Excelencia Académica&quot;
          </p>
          <p>Telf: (591-3) 334-2160 | sgeneral@uagrm.edu.bo | Campus Universitario, Santa Cruz - Bolivia</p>
        </footer>
      </div>

    </div>
  );
}
