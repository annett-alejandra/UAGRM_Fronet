export interface CertificadoTituloTipo4Props {
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

export function CertificadoTituloTipo4({
  nroCertificado = '117/2026',
  informeRef = 'SECCION ARCHIVO/ INF N°094',
  fechaInforme = '13 de enero de 2026',
  gradoMencion = 'Título Supletorio de LICENCIADO EN DERECHO',
  nroTitulo = '96071',
  nombreTitular = 'GUALBERTO MEDINA VARGAS',
  ciTitular = '8072900-SCZ',
  libroRegistro = '0017',
  fojas = '0027',
  fechaEmisionOriginal = '11 de julio del año 2022',
  gestionHistorica = '1999',
  incluirAclaratoriaHistorica = true,
  lugarFechaCertificacion = 'Santa Cruz de la Sierra, 19 de enero del 2026',
  autoridadSecretario = 'LIC. EDY ACOSTA CLAROS',
  autoridadRector = 'DR. REINERIO VARGAS BANEGAS'
}: CertificadoTituloTipo4Props) {
  return (
    <div 
      className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shrink-0 relative flex flex-col justify-between font-serif print:p-0 print:shadow-none print:w-full border border-slate-200 print:border-none box-border"
      style={{
        paddingTop: '3.5cm',
        paddingLeft: '4cm',
        paddingRight: '2cm',
        paddingBottom: '2cm'
      }}
    >
      <div>
        {/* Encabezado Membretado Oficial */}
        <header className="flex justify-between items-start border-b border-slate-300 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[65px] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[65px] h-auto object-contain">
                <circle cx="100" cy="100" r="96" fill="#191A7D" stroke="#D31338" strokeWidth="6"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5A823" strokeWidth="3" strokeDasharray="6,3"/>
                <path d="M100 25 L120 70 L170 70 L130 100 L145 150 L100 120 L55 150 L70 100 L30 70 L80 70 Z" fill="#E5A823"/>
                <text x="100" y="105" textAnchor="middle" fill="#191A7D" fontFamily="serif" fontWeight="bold" fontSize="22">UAGRM</text>
                <text x="100" y="170" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="bold" fontSize="11" letterSpacing="1">SANTA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-[0.2em] uppercase text-slate-700 leading-tight">
              SECRETARÍA<br />GENERAL
            </div>
          </div>

          <div className="text-center font-serif flex-1 px-4">
            <h1 className="text-base font-extrabold uppercase tracking-wide text-[#191A7D]">
              UNIVERSIDAD AUTÓNOMA &quot;GABRIEL RENÉ MORENO&quot;
            </h1>
            <p className="text-[10px] uppercase text-slate-500 font-sans tracking-widest mt-0.5 font-bold">
              SANTA CRUZ DE LA SIERRA - BOLIVIA
            </p>
          </div>

          <div className="text-right font-sans text-xs shrink-0">
            <p className="font-extrabold text-[#191A7D] text-sm">
              CERTIFICADO N° {nroCertificado}
            </p>
          </div>
        </header>

        {/* Encabezado Autoridades */}
        <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed mt-4">
          <p className="uppercase font-bold text-slate-900 text-justify">
            EL SUSCRITO SECRETARIO GENERAL DE LA UNIVERSIDAD AUTÓNOMA &quot;GABRIEL RENÉ MORENO&quot;, EN CUMPLIMIENTO A LAS DISPOSICIONES LEGALES VIGENTES CERTIFICA QUE:
          </p>

          <div className="my-6 p-4 border-l-4 border-[#191A7D] bg-slate-50 space-y-2">
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#191A7D]">
              {nombreTitular}
            </p>
            <p className="text-xs text-slate-700">
              Cédula de Identidad: <strong>{ciTitular}</strong>
            </p>
            <p className="text-xs font-bold text-slate-900">
              Grado / Mención: {gradoMencion}
            </p>
          </div>

          <p className="text-justify leading-relaxed">
            Se encuentra debidamente registrado en el Libro Matriz N° <strong>{libroRegistro}</strong>, Foja <strong>{fojas}</strong>, habiéndosele expedido el Título Profesional / Diploma N° <strong>{nroTitulo}</strong> con fecha <strong>{fechaEmisionOriginal}</strong>.
          </p>

          <div className="my-4 p-3 bg-slate-100 border border-slate-300 rounded text-xs text-slate-900 font-sans">
            <strong>Resolución Supletorio:</strong> Expedido en conformidad con el Testimonio Notarial de reposición de título y resolución vicerrectoral.
          </div>

          <p className="mt-8 text-right font-serif text-xs">
            {lugarFechaCertificacion}
          </p>
        </div>
      </div>

      {/* Firmas y Pie de Página */}
      <footer className="mt-16 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs font-serif">
        <div>
          <div className="h-16 border-b border-slate-400 mb-2 border-dashed"></div>
          <p className="font-extrabold uppercase">{autoridadSecretario}</p>
          <p className="text-[10px] text-slate-600 font-sans uppercase tracking-wider">Secretario General - UAGRM</p>
        </div>
        <div>
          <div className="h-16 border-b border-slate-400 mb-2 border-dashed"></div>
          <p className="font-extrabold uppercase">{autoridadRector}</p>
          <p className="text-[10px] text-slate-600 font-sans uppercase tracking-wider">Rector - UAGRM</p>
        </div>
      </footer>
    </div>
  );
}
