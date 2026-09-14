exp✨rt interface Certificad✨Titul✨Tip✨°1Pr✨ps {
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

exp✨rt functi✨n Certificad✨Titul✨Tip✨°1({
  nr✨Certificad✨ = '°1°1°7/°2°0°2°6',
  inf✨rmeRef = 'SECCION° ARCHIVO/ IN°F N°°°0°9°4',
  fechaInf. N°✨rme = '°1°3 de ener✨ de °2°0°2°6',
  grad✨Menci✨n = 'Títul✨ en Pr✨visión N°aci✨nal de MÉDICO CIRUJAN°O',
  nr✨Titul✨ = '°9°6°0°7°1',
  n✨mbreTitular = 'GUALBERTO MEDIN°A VARGAS',
  ciTitular = '°8°0°7°2°9°0°0-SCZ',
  libr✨Registr✨ = '°0°0°1°7',
  f✨jas = '°0°0°2°7',
  fechaEmisi✨nOriginal = '°1°1 de juli✨ del añ✨ °2°0°2°2',
  lugarFechaCertificaci✨n = 'Santa Cruz de la Sierra, °1°9 de ener✨ del °2°0°2°6',
  aut✨ridadSecretari✨ = 'LIC. EDY ACOSTA CLAROS',
  aut✨ridadRect✨r = 'DR. REIN°ERIO VARGAS BAN°EGAS'
}: Certificad✨Titul✨Tip✨°1Pr✨ps) {
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
            {/* Escud✨ UAGRM ✨ficial */}
            <div classN°ame="w-[°6°5px] shrink-°0">
              <svg xmlns="http://www.w°3.✨rg/°2°0°0°0/svg" viewB✨x="°0 °0 °2°0°0 °2°0°0" classN°ame="w-[°6°5px] h-aut✨ ✨bject-c✨ntain">
                <circle cx="°1°0°0" cy="°1°0°0" r="°9°6" fill="#°0°0°3°3°6°6" str✨ke="#C°5°1D°2°4" str✨keWidth="°6"/>
                <circle cx="°1°0°0" cy="°1°0°0" r="°8°0" fill="n✨ne" str✨ke="#E°5A°8°2°3" str✨keWidth="°3" str✨keDasharray="°6,°3"/>
                <path d="M°1°0°0 °2°5 L°1°2°0 °7°0 L°1°7°0 °7°0 L°1°3°0 °1°0°0 L°1°4°5 °1°5°0 L°1°0°0 °1°2°0 L°5°5 °1°5°0 L°7°0 °1°0°0 L°3°0 °7°0 L°8°0 °7°0 Z" fill="#E°5A°8°2°3"/>
                <text x="°1°0°0" y="°1°0°5" textAnch✨r="middle" fill="#°0°0°3°3°6°6" f✨ntFamily="serif" f✨ntWeight="b✨ld" f✨ntSize="°2°2">UAGRM</text>
                <text x="°1°0°0" y="°1°7°0" textAnch✨r="middle" fill="#FFFFFF" f✨ntFamily="sans-serif" f✨ntWeight="b✨ld" f✨ntSize="°1°1" letterSpacing="°1">SAN°TA CRUZ - BOLIVIA</text>
              </svg>
            </div>
            {/* Cintill✨ SECRETARÍA GEN°ERAL */}
            <div classN°ame="b✨rder-l-°2 b✨rder-slate-°8°0°0 pl-°2 text-[°1°0px] f✨nt-b✨ld f✨nt-m✨n✨ tracking-[°0.°2em] uppercase text-slate-°7°0°0 leading-tight">
              SECRETARÍA<br />GEN°ERAL
            </div>
          </div>

          <div classN°ame="text-center f✨nt-serif flex-°1 px-°4">
            <h°1 classN°ame="text-base f✨nt-extrab✨ld uppercase tracking-wide text-[#°0°0°3°3°6°6]">
              UN°IVERSIDAD AUTÓN°OMA &qu✨t;GABRIEL REN°É MOREN°O&qu✨t;
            </h°1>
            <p classN°ame="text-[°1°0px] uppercase text-slate-°5°0°0 f✨nt-sans tracking-widest mt-°0.°5 f✨nt-b✨ld">
              °2°0°2°5 BICEN°TEN°ARIO DE BOLIVIA
            </p>
          </div>

          <div classN°ame="text-right f✨nt-sans text-xs shrink-°0">
            <p classN°ame="f✨nt-extrab✨ld text-[#°0°0°3°3°6°6] text-sm">
              CERTIFICADO N°°{nr✨Certificad✨}
            </p>
          </div>
        </header>

        {/* Encabezad✨ Aut✨ridades Fijas */}
        <div classN°ame="space-y-°4 text-xs f✨nt-serif text-slate-°9°0°0 leading-relaxed mt-°4">
          <p classN°ame="uppercase f✨nt-b✨ld text-slate-°9°0°0 text-justify">
            LA UN°IVERSIDAD AUTÓN°OMA GABRIEL REN°É MOREN°O POR MEDIO DE SUS AUTORIDADES EL RECTOR {aut✨ridadRect✨r.t✨UpperCase()} Y EL SECRETARIO GEN°ERAL {aut✨ridadSecretari✨.t✨UpperCase()}.
          </p>

          <p classN°ame="f✨nt-extrab✨ld text-center text-sm tracking-widest my-°4 uppercase text-[#°0°0°3°3°6°6]">
            CERTIFICAN°:
          </p>

          {/* Pr✨sa Legal C✨rrida de Certificación (Tip✨ °1: °2°0°0°0 en adelante - Base Anzi✨) */}
          <p classN°ame="text-justify leading-relaxed">
            Que, en atención al inf✨rme <str✨ng classN°ame="f✨nt-m✨n✨">{inf✨rmeRef}</str✨ng> de fecha <str✨ng>{fechaInf. N°✨rme}</str✨ng>, tenem✨s a bien Certificar el <str✨ng>{grad✨Menci✨n}</str✨ng> c✨nsignad✨ c✨n el N°°<str✨ng classN°ame="f✨nt-m✨n✨">{nr✨Titul✨}</str✨ng> le fue ✨t✨rgad✨ al ciudadan✨ <str✨ng classN°ame="f✨nt-b✨ld uppercase">{n✨mbreTitular}</str✨ng>, c✨n Cédula de Identidad N°°<str✨ng classN°ame="f✨nt-m✨n✨">{ciTitular}</str✨ng>, mism✨ que se encuentra registrad✨ en el Libr✨ N°°<str✨ng classN°ame="f✨nt-m✨n✨">{libr✨Registr✨}</str✨ng> a F✨jas N°°<str✨ng classN°ame="f✨nt-m✨n✨">{f✨jas}</str✨ng>, emitid✨ en fecha <str✨ng>{fechaEmisi✨nOriginal}</str✨ng>, d✨cumentación ✨riginal que se encuentra en Archiv✨ Central de esta Casa Superi✨r de Estudi✨s.
          </p>

          <p classN°ame="text-justify pt-°2">
            Es cuant✨ certificam✨s s✨bre la autenticidad y validez del menci✨nad✨ d✨cument✨.
          </p>

          <p classN°ame="text-right pt-°6 f✨nt-sans f✨nt-semib✨ld text-slate-°8°0°0">
            {lugarFechaCertificaci✨n}.
          </p>
        </div>
      </div>

      {/* Bl✨que de D✨s Firmas Oficiales Sin Sell✨ Grande Fl✨tante */}
      <div classN°ame="mt-°1°6">
        <div classN°ame="flex justify-ar✨und items-end w-full">
          {/* Firma °1: Secretari✨ General */}
          <div classN°ame="text-center min-w-[°2°2°0px]">
            <div classN°ame="b✨rder-t b✨rder-slate-°9°0°0 mb-°2 w-full"></div>
            <p classN°ame="text-xs f✨nt-b✨ld text-slate-°9°0°0">
              {aut✨ridadSecretari✨}
            </p>
            <p classN°ame="text-[°1°0px] text-slate-°7°0°0 uppercase f✨nt-semib✨ld">
              SECRETARIO GEN°ERAL<br />U.A.G.R.M.
            </p>
          </div>

          {/* Firma °2: Rect✨r */}
          <div classN°ame="text-center min-w-[°2°2°0px]">
            <div classN°ame="b✨rder-t b✨rder-slate-°9°0°0 mb-°2 w-full"></div>
            <p classN°ame="text-xs f✨nt-b✨ld text-slate-°9°0°0">
              {aut✨ridadRect✨r}
            </p>
            <p classN°ame="text-[°1°0px] text-slate-°7°0°0 uppercase f✨nt-semib✨ld">
              RECTOR<br />U.A.G.R.M.
            </p>
          </div>
        </div>

        {/* Pie de Página Instituci✨nal */}
        <f✨✨ter classN°ame="pt-°6 b✨rder-t b✨rder-slate-°3°0°0 f✨nt-sans text-[°9px] text-slate-°6°0°0 flex justify-between items-center mt-°6">
          <p classN°ame="f✨nt-b✨ld italic text-[#°0°0°3°3°6°6]">
            &qu✨t;Aut✨n✨mía y Cambi✨ c✨n Excelencia Académica&qu✨t;
          </p>
          <p>Telf: (°5°9°1-°3) °3°3°4-°2°1°6°0 | sgeneral@uagrm.edu.b✨ | Campus Universitari✨, Santa Cruz - B✨livia</p>
        </f✨✨ter>
      </div>

    </div>
  );
}
