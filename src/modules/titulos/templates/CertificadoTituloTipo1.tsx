import React from 'react';

export interface CertificadoTituloTipo1Props {
  nroCertificado: string;
  informeRef: string;
  fechaInforme: string;
  gradoMencion: string;
  nroTitulo: string;
  nombreTitular: string;
  ciTitular: string;
  libroRegistro: string;
  fojas: string;
  fechaEmisionOriginal: string;
  lugarFechaCertificacion: string;
  autoridadSecretario: string;
  autoridadRector: string;
}

export function CertificadoTituloTipo1(props: CertificadoTituloTipo1Props) {
  const {
    nroCertificado,
    informeRef,
    fechaInforme,
    gradoMencion,
    nroTitulo,
    nombreTitular,
    ciTitular,
    libroRegistro,
    fojas,
    fechaEmisionOriginal,
    lugarFechaCertificacion,
    autoridadSecretario,
    autoridadRector
  } = props;

  return (
    <div className="printable-document w-[210mm] min-h-[297mm] bg-white shadow-xl p-[3.5rem] text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full font-serif">
      <div>
        {/* Encabezado Superior con Escudo UAGRM a la izquierda y Cintillo SECRETARÍA GENERAL */}
        <header className="flex justify-between items-start border-b-2 border-[#003366] pb-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Escudo UAGRM circular oficial */}
            <div className="w-[70px] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[70px] h-auto object-contain">
                <circle cx="100" cy="100" r="96" fill="#003366" stroke="#C51D24" strokeWidth="6"/>
                <circle cx="100" cy="100" r="80" fill="none" stroke="#E5A823" strokeWidth="3" strokeDasharray="6,3"/>
                <path d="M100 25 L120 70 L170 70 L130 100 L145 150 L100 120 L55 150 L70 100 L30 70 L80 70 Z" fill="#E5A823"/>
                <text x="100" y="105" textAnchor="middle" fill="#003366" fontFamily="serif" fontWeight="bold" fontSize="22">UAGRM</text>
                <text x="100" y="170" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="bold" fontSize="11" letterSpacing="1">SANTA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            {/* Barra Vertical: S E C R E T A R Í A   G E N E R A L */}
            <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-[0.2em] uppercase text-slate-700 leading-tight">
              S E C R E T A R Í A<br />G E N E R A L
            </div>
          </div>

          <div className="text-center font-serif flex-1 px-4">
            <h1 className="text-base font-bold uppercase tracking-wide text-[#003366]">
              UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
            </h1>
            <p className="text-[10px] uppercase text-slate-500 font-sans tracking-widest mt-0.5">
              DEPARTAMENTO DE TÍTULOS Y GRADOS — SANTA CRUZ DE LA SIERRA, BOLIVIA
            </p>
            <div className="w-20 h-0.5 bg-[#C51D24] mx-auto my-2"></div>
            <h2 className="text-sm font-bold tracking-widest text-[#003366] uppercase mt-1">
              CERTIFICADO DE AUTENTICIDAD
            </h2>
          </div>

          <div className="text-right font-sans text-xs space-y-1 shrink-0">
            <p className="font-bold text-[#003366]">
              N° CERTIFICADO: <span className="font-mono underline">{nroCertificado}</span>
            </p>
            <p className="text-slate-700 text-[11px]">
              REF: <span className="font-mono">{informeRef}</span>
            </p>
            <p className="text-slate-600 text-[11px]">
              FECHA: <span>{fechaInforme}</span>
            </p>
          </div>
        </header>

        {/* Prosa Legal Corrida (NO lleva tabla) */}
        <div className="text-justify leading-relaxed text-xs font-serif space-y-4 text-slate-900 mt-8">
          <p className="indent-8">
            El que suscribe, Secretario General y el Rector de la Universidad Autónoma "Gabriel René Moreno", certifican que revisada la documentación existente en los libros matrices del Departamento de Títulos y Grados, se evidencia la emisión del{' '}
            <strong className="font-bold underline text-slate-900">{gradoMencion}</strong>, con Número de Título N°{' '}
            <strong className="font-mono font-bold text-slate-900">{nroTitulo}</strong>, conferido legítimamente a favor del profesional Sr.(a){' '}
            <strong className="font-bold uppercase text-slate-900">{nombreTitular}</strong>, con Cédula de Identidad N°{' '}
            <strong className="font-mono font-bold text-slate-900">{ciTitular}</strong>.
          </p>

          <p className="indent-8">
            Asimismo, se verifica que la correspondiente matriz se encuentra debidamente asentada en el Libro de Registro N°{' '}
            <strong className="font-mono font-bold text-slate-900">{libroRegistro}</strong>, Fojas N°{' '}
            <strong className="font-mono font-bold text-slate-900">{fojas}</strong>, habiéndose expedido el documento original en fecha{' '}
            <strong className="font-bold text-slate-900">{fechaEmisionOriginal}</strong>.
          </p>

          <p className="indent-8">
            Se extiende el presente Certificado de Autenticidad a solicitud del interesado para los fines legales y administrativos que convengan.
          </p>

          <p className="text-right pt-6 font-sans font-medium text-slate-700">
            {lugarFechaCertificacion}
          </p>
        </div>
      </div>

      {/* Bloque de Dos Firmas Estilo Word con Sello Institucional Centrado */}
      <div className="relative mt-[80px]">
        {/* Sello institucional en opacidad suave centrado exactamente entre las dos firmas */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-24 h-24">
            <circle cx="100" cy="100" r="96" fill="#003366" stroke="#000" strokeWidth="4"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="2"/>
            <text x="100" y="105" textAnchor="middle" fill="#000" fontFamily="serif" fontWeight="bold" fontSize="20">UAGRM</text>
          </svg>
        </div>

        <div className="firmas-container flex justify-around items-end w-full page-break-inside-avoid relative z-10">
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
  );
}
