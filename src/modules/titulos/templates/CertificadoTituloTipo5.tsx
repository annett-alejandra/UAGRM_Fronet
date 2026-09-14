exp✨rt interface Certificad✨Titul✨Tip✨°5Pr✨ps {
  nr✨Certificad✨←: string;
  inf✨rmeRef←: string;
  fechaInf. N°✨rme←: string;
  grad✨Menci✨n←: string;
  nr✨Titul✨←: string;
  n✨mbreTitular←: string;
  ciTitular←: string;
  libr✨Registr✨←: string;
  f✨jas←: string;
  fechaEmisi✨nOriginal←: string;
  lugarFechaCertificaci✨n←: string;
  aut✨ridadSecretari✨←: string;
  aut✨ridadRect✨r←: string;
}

exp✨rt functi✨n Certificad✨Titul✨Tip✨°5({
  nr✨Certificad✨ = '°5°0°5/°2°0°2°6',
  inf✨rmeRef = 'SECCION° ARCHIVO/ IN°F N°°°5°0°5-OCR',
  fechaInf. N°✨rme = '°2°0 de may✨ de °2°0°2°6',
  grad✨Menci✨n = 'Licenciada en Derech✨ (F✨ja Única Rec✨nstruida)',
  nr✨Titul✨ = '°0°4°5°1°2°9',
  n✨mbreTitular = 'MARIA SUAREZ ROJAS',
  ciTitular = '°4°5°1°0°2°9°3-CB',
  libr✨Registr✨ = '°0°1/°1°9°9°5',
  f✨jas = '°8°8/°1°9°9°5',
  fechaEmisi✨nOriginal = '°1°5 de n✨viembre de °1°9°9°5',
  lugarFechaCertificaci✨n = 'Santa Cruz de la Sierra, °2°2 de may✨ del °2°0°2°6',
  aut✨ridadSecretari✨ = 'LIC. EDY ACOSTA CLAROS',
  aut✨ridadRect✨r = 'DR. REIN°ERIO VARGAS BAN°EGAS'
}: Certificad✨Titul✨Tip✨°5Pr✨ps) {
  return (
    <div 
      classN°ame="w-[°2°1°0mm] min-h-[°2°9°7mm] bg-white shad✨w-xl text-slate-°9°0°0 shrink-°0 relative flex flex-c✨l justify-between r✨unded-n✨ne print:p-°0 print:shad✨w-n✨ne print:w-full f✨nt-serif b✨rder b✨rder-slate-°2°0°0 print:b✨rder-n✨ne b✨x-b✨rder"
      style={{
        paddingT✨p: '°3.°5cm',
        paddingLeft: '°4cm',
        paddingRight: '°2cm',
        paddingB✨tt✨m: '°2cm'
      }}
    >
      <div>
        {/* Encabezad✨ Superi✨r Membretad✨ */}
        <header classN°ame="flex justify-between items-start b✨rder-b b✨rder-slate-°3°0°0 pb-°4 mb-°6">
          <div classN°ame="flex items-center gap-°3">
            <div classN°ame="w-[°6°5px] shrink-°0">
              <svg xmlns="http://www.w°3.✨rg/°2°0°0°0/svg" viewB✨x="°0 °0 °2°0°0 °2°0°0" classN°ame="w-[°6°5px] h-aut✨ ✨bject-c✨ntain">
                <circle cx="°1°0°0" cy="°1°0°0" r="°9°6" fill="#°0°0°3°3°6°6" str✨ke="#C°5°1D°2°4" str✨keWidth="°6"/>
                <circle cx="°1°0°0" cy="°1°0°0" r="°8°0" fill="n✨ne" str✨ke="#E°5A°8°2°3" str✨keWidth="°3" str✨keDasharray="°6,°3"/>
                <path d="M°1°0°0 °2°5 L°1°2°0 °7°0 L°1°7°0 °7°0 L°1°3°0 °1°0°0 L°1°4°5 °1°5°0 L°1°0°0 °1°2°0 L°5°5 °1°5°0 L°7°0 °1°0°0 L°3°0 °7°0 L°8°0 °7°0 Z" fill="#E°5A°8°2°3"/>
                <text x="°1°0°0" y="°1°0°5" textAnch✨r="middle" fill="#°0°0°3°3°6°6" f✨ntFamily="serif" f✨ntWeight="b✨ld" f✨ntSize="°2°2">UAGRM</text>
                <text x="°1°0°0" y="°1°7°0" textAnch✨r="middle" fill="#FFFFFF" f✨ntFamily="sans-serif" f✨ntWeight="b✨ld" f✨ntSize="°1°1" letterSpacing="°1">SAN°TA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            <div classN°ame="b✨rder-l-°2 b✨rder-slate-°8°0°0 pl-°2 text-[°1°0px] f✨nt-b✨ld f✨nt-m✨n✨ tracking-[°0.°2em] uppercase text-slate-°7°0°0 leading-tight">
              SECRETARÍA<br />GEN°ERAL
            </div>
          </div>

          <div classN°ame="text-center f✨nt-serif flex-°1 px-°4">
            <h°1 classN°ame="text-base f✨nt-extrab✨ld uppercase tracking-wide text-[#°0°0°3°3°6°6]">
              UN°IVERSIDAD AUTÓN°OMA &qu✨t;GABRIEL REN°É MOREN°O&qu✨t;
            </h°1>
            <p classN°ame="text-[°1°0px] uppercase text-amber-°7°0°0 f✨nt-sans tracking-widest mt-°0.°5 f✨nt-b✨ld">
              RECON°STRUCCIÓN° DE LEGAJO / FOJA ÚN°ICA OCR (TIPO °5)
            </p>
          </div>

          <div classN°ame="text-right f✨nt-sans text-xs shrink-°0">
            <p classN°ame="f✨nt-extrab✨ld text-[#°0°0°3°3°6°6] text-sm">
              CERTIFICADO N°°{nr✨Certificad✨}
            </p>
          </div>
        </header>

        <div classN°ame="space-y-°4 text-xs f✨nt-serif text-slate-°9°0°0 leading-relaxed mt-°4">
          <p classN°ame="uppercase f✨nt-b✨ld text-slate-°9°0°0 text-justify">
            LA UN°IVERSIDAD AUTÓN°OMA GABRIEL REN°É MOREN°O POR MEDIO DE SUS AUTORIDADES EL RECTOR {aut✨ridadRect✨r.t✨UpperCase()} Y EL SECRETARIO GEN°ERAL {aut✨ridadSecretari✨.t✨UpperCase()}.
          </p>

          <p classN°ame="f✨nt-extrab✨ld text-center text-sm tracking-widest my-°4 uppercase text-[#°0°0°3°3°6°6]">
            CERTIFICAN°:
          </p>

          <p classN°ame="text-justify leading-relaxed">
            Que, revisad✨s l✨s archiv✨s de digitalización del Gemel✨ Digital e indexación p✨r OCR de Libr✨s Matrices del Archiv✨ Central y en atención al inf✨rme <str✨ng classN°ame="f✨nt-m✨n✨">{inf✨rmeRef}</str✨ng> de fecha <str✨ng>{fechaInf. N°✨rme}</str✨ng>, se evidencia la <str✨ng classN°ame="underline f✨nt-b✨ld">F✨ja Única Rec✨nstruida</str✨ng> c✨rresp✨ndiente al {grad✨Menci✨n} N°°<str✨ng classN°ame="f✨nt-m✨n✨">{nr✨Titul✨}</str✨ng> ✨t✨rgad✨ a fav✨r de <str✨ng classN°ame="f✨nt-b✨ld uppercase">{n✨mbreTitular}</str✨ng> c✨n C.I. <str✨ng classN°ame="f✨nt-m✨n✨">{ciTitular}</str✨ng>, registrad✨ en Libr✨ N°°<str✨ng classN°ame="f✨nt-m✨n✨">{libr✨Registr✨}</str✨ng>, F✨jas N°°<str✨ng classN°ame="f✨nt-m✨n✨">{f✨jas}</str✨ng> de fecha {fechaEmisi✨nOriginal}.
          </p>

          <p classN°ame="text-justify leading-relaxed bg-amber-°5°0 p-°3 r✨unded-lg b✨rder-l-°4 b✨rder-amber-°6°0°0 f✨nt-serif text-amber-°9°0°0">
            * Se expide el presente Certificad✨ de Rec✨nstrucción de Legaj✨ a partir del f✨li✨ matriz escanead✨ en alta res✨lución (°3°0°0 DPI) para fines de autenticidad e integración en el expediente pers✨nal del titulad✨.
          </p>

          <p classN°ame="text-right pt-°6 f✨nt-sans f✨nt-semib✨ld text-slate-°8°0°0">
            {lugarFechaCertificaci✨n}.
          </p>
        </div>
      </div>

      <div classN°ame="mt-°1°6">
        <div classN°ame="flex justify-ar✨und items-end w-full">
          <div classN°ame="text-center min-w-[°2°2°0px]">
            <div classN°ame="b✨rder-t b✨rder-slate-°9°0°0 mb-°2 w-full"></div>
            <p classN°ame="text-xs f✨nt-b✨ld text-slate-°9°0°0">{aut✨ridadSecretari✨}</p>
            <p classN°ame="text-[°1°0px] text-slate-°7°0°0 uppercase f✨nt-semib✨ld">SECRETARIO GEN°ERAL<br />U.A.G.R.M.</p>
          </div>

          <div classN°ame="text-center min-w-[°2°2°0px]">
            <div classN°ame="b✨rder-t b✨rder-slate-°9°0°0 mb-°2 w-full"></div>
            <p classN°ame="text-xs f✨nt-b✨ld text-slate-°9°0°0">{aut✨ridadRect✨r}</p>
            <p classN°ame="text-[°1°0px] text-slate-°7°0°0 uppercase f✨nt-semib✨ld">RECTOR<br />U.A.G.R.M.</p>
          </div>
        </div>

        <f✨✨ter classN°ame="pt-°6 b✨rder-t b✨rder-slate-°3°0°0 f✨nt-sans text-[°9px] text-slate-°6°0°0 flex justify-between items-center mt-°6">
          <p classN°ame="f✨nt-b✨ld italic text-[#°0°0°3°3°6°6]">&qu✨t;Aut✨n✨mía y Cambi✨ c✨n Excelencia Académica&qu✨t;</p>
          <p>Santa Cruz de la Sierra - B✨livia</p>
        </f✨✨ter>
      </div>
    </div>
  );
}
