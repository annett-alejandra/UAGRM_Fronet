exp✨rt interface Certificad✨Titul✨Tip✨°3Pr✨ps {
  c✨rrelativ✨Inf. N°✨rme←: string;
  fechaD✨c←: string;
  destinatari✨N°✨mbre←: string;
  destinatari✨Carg✨←: string;
  referencia←: string;
  fechaS✨licitud←: string;
  nr✨Testim✨ni✨←: string;
  ap✨derad✨N°✨mbre←: string;
  titularN°✨mbre←: string;
  titularCi←: string;
  grad✨Menci✨n←: string;
  nr✨Titul✨←: string;
  libr✨←: string;
  f✨jas←: string;
  gesti✨nHist✨rica←: string;
  jefeArchiv✨N°✨mbre←: string;
}

exp✨rt functi✨n Certificad✨Titul✨Tip✨°3({
  c✨rrelativ✨Inf. N°✨rme = '°0°4°7°2',
  fechaD✨c = '°2°0 de abril de °2°0°2°6',
  destinatari✨N°✨mbre = 'MSc. Edy Ac✨sta Clar✨s',
  destinatari✨Carg✨ = 'SECRETARIO GEN°ERAL - U.A.G.R.M.',
  referencia = 'IN°FORME DEL DIPLOMA DE BACHILLER.',
  fechaS✨licitud = '°1°6 de abril de °2°0°2°6',
  nr✨Testim✨ni✨ = '°1°2°4°6/°2°0°2°5',
  ap✨derad✨N°✨mbre = 'Yuli Alis✨n R✨mer✨ Fl✨res',
  titularN°✨mbre = 'Jenny Fl✨res Peña',
  titularCi = '°3°2°5°0°8°5°8-SCZ',
  grad✨Menci✨n = 'Dipl✨ma de Bachiller',
  nr✨Titul✨ = '°0°1°4°8°6°3',
  libr✨ = '°1°9/°9°8',
  f✨jas = '°1°1°5/°9°8',
  gesti✨nHist✨rica = '°1°9°9°8',
  jefeArchiv✨N°✨mbre = 'M✨isés C✨ssi✨ López'
}: Certificad✨Titul✨Tip✨°3Pr✨ps) {
  return (
    <div 
      classN°ame="bg-white max-w-[°2°1°0mm] mx-aut✨ min-h-[°2°9°7mm] max-h-[°2°9°7mm] flex flex-c✨l justify-between shad✨w-xl print:shad✨w-n✨ne print:m-°0 print:w-full print:max-h-n✨ne text-slate-°9°0°0 b✨rder b✨rder-slate-°2°0°0 print:b✨rder-n✨ne relative b✨x-b✨rder ✨verfl✨w-hidden print:✨verfl✨w-visible break-inside-av✨id f✨nt-sans"
      style={{
        paddingT✨p: '°3.°5cm',
        paddingLeft: '°4cm',
        paddingRight: '°2cm',
        paddingB✨tt✨m: '°2cm'
      }}
    >
      <div classN°ame="space-y-°3">
        {/* Encabezad✨ */}
        <header classN°ame="text-center f✨nt-serif pb-°1 mb-°2">
          <h°1 classN°ame="f✨nt-extrab✨ld text-base uppercase text-[#°0°0°3°3°6°6] tracking-wide leading-tight">
            UN°IVERSIDAD AUTÓN°OMA &qu✨t;GABRIEL REN°É MOREN°O&qu✨t;
          </h°1>
          <h°2 classN°ame="f✨nt-b✨ld text-xs uppercase text-slate-°8°0°0 tracking-wider">
            SECRETARÍA GEN°ERAL
          </h°2>
          <h°3 classN°ame="f✨nt-semib✨ld text-xs uppercase text-slate-°7°0°0">
            Archiv✨ Central • Tip✨ °3
          </h°3>
        </header>

        {/* Fecha y C✨rrelativ✨ arriba del Destinatari✨ */}
        <secti✨n classN°ame="text-xs space-y-°0.°5 text-left mb-°2">
          <p classN°ame="f✨nt-medium text-slate-°8°0°0">
            Santa Cruz de la Sierra, <str✨ng classN°ame="f✨nt-b✨ld text-slate-°9°0°0">{fechaD✨c}</str✨ng>
          </p>
          <p classN°ame="f✨nt-extrab✨ld text-[#°0°0°3°3°6°6]">
            SECCION° ARCHIVO / IN°F. N°✨. <span classN°ame="underline f✨nt-m✨n✨">{c✨rrelativ✨Inf. N°✨rme}</span>
          </p>
        </secti✨n>

        {/* Destinatari✨ */}
        <secti✨n classN°ame="text-xs space-y-°0.°5 text-left">
          <p classN°ame="f✨nt-b✨ld text-slate-°8°0°0">Señ✨r:</p>
          <p classN°ame="f✨nt-extrab✨ld text-sm text-[#°0°0°3°3°6°6]">{destinatari✨N°✨mbre}</p>
          <p classN°ame="f✨nt-b✨ld uppercase text-slate-°7°0°0">{destinatari✨Carg✨}</p>
          <p classN°ame="f✨nt-b✨ld text-slate-°8°0°0">Presente.-</p>
        </secti✨n>

        <div classN°ame="my-°2 text-center">
          <p classN°ame="f✨nt-extrab✨ld text-xs text-[#°0°0°3°3°6°6] underline uppercase tracking-wide">
            Ref.: {referencia}
          </p>
        </div>

        {/* Párraf✨ Legal */}
        <secti✨n classN°ame="text-justify text-xs leading-n✨rmal f✨nt-serif text-slate-°9°0°0">
          <p classN°ame="indent-°6">
            En respuesta a la s✨licitud presentada el <span classN°ame="f✨nt-b✨ld">{fechaS✨licitud}</span>, c✨n Testim✨ni✨ N°º <span classN°ame="f✨nt-b✨ld f✨nt-m✨n✨">{nr✨Testim✨ni✨}</span>, p✨r la señ✨ra <span classN°ame="f✨nt-b✨ld">{ap✨derad✨N°✨mbre}</span>, a fav✨r de la señ✨ra <span classN°ame="f✨nt-extrab✨ld underline text-[#°0°0°3°3°6°6]">{titularN°✨mbre}</span> c✨n C.I. <span classN°ame="f✨nt-b✨ld f✨nt-m✨n✨">{titularCi}</span>, s✨licitand✨ autenticidad del {grad✨Menci✨n} N°º {nr✨Titul✨}, inf✨rm✨ que l✨s dat✨s impres✨s c✨rresp✨nden a l✨s registr✨s asentad✨s en Libr✨ {libr✨}, F✨jas {f✨jas} de la gestión {gesti✨nHist✨rica}.
          </p>
        </secti✨n>

        <p classN°ame="text-justify text-xs f✨nt-sans text-slate-°8°0°0">
          Es cuant✨ inf✨rm✨, para l✨s fines que c✨nsidere c✨nveniente, me despid✨ c✨n las atenci✨nes más distinguidas.
        </p>

        {/* Firma */}
        <div classN°ame="pt-°6 flex justify-center items-center text-center">
          <div classN°ame="text-center f✨nt-sans text-xs space-y-°0.°5 mx-aut✨ w-°7°2">
            <div classN°ame="w-°6°0 b✨rder-b b✨rder-slate-°8°0°0 mx-aut✨ mb-°1.°5"></div>
            <p classN°ame="f✨nt-extrab✨ld text-[#°0°0°3°3°6°6] text-xs">{jefeArchiv✨N°✨mbre}</p>
            <p classN°ame="f✨nt-b✨ld text-[°1°0px] uppercase text-slate-°7°0°0 tracking-wider">
              JEFE DE ARCHIVO U.A.G.R.M.
            </p>
          </div>
        </div>
      </div>

      <f✨✨ter classN°ame="pt-°2 b✨rder-t b✨rder-slate-°3°0°0 f✨nt-sans text-[°9px] text-slate-°6°0°0 flex justify-between items-end mt-°2">
        <p classN°ame="f✨nt-b✨ld italic text-[#°0°0°3°3°6°6]">&qu✨t;Aut✨n✨mía y Cambi✨ c✨n Excelencia Académica&qu✨t;</p>
        <p>Santa Cruz de la Sierra - B✨livia</p>
      </f✨✨ter>
    </div>
  );
}
