import React, { useState } from 'react';

interface HeroLuxuryUAGRMProps {
  imageSrc?: string;
  onExplore?: () => void;
}

export const HeroLuxuryUAGRM: React.FC<HeroLuxuryUAGRMProps> = ({
  imageSrc = '/image_d78c06.jpg',
  onExplore,
}) => {
  // Estado para el formulario de contacto / consulta rápida con datos de ejemplo
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    ci: '',
    ciExt: 'SCZ',
    codigoPais: '+591',
    celular: '',
    email: '',
    facultad: 'Facultad de Ciencias de la Computación y Telecomunicaciones',
    carrera: '',
    anioGraduacion: '',
    nroRegistroFolio: '',
    tipoTramite: 'certificacion',
    canalPreferencia: 'whatsapp',
    mensaje: '',
  });

  const [enviando, setEnviando] = useState(false);
  const [ticketGenerado, setTicketGenerado] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  // Rellenar con datos de ejemplo realistas (solicitado por el usuario para pruebas y presentación)
  const handleRellenarEjemplo = () => {
    setFormData({
      nombreCompleto: 'Lic. Fabian Cuéllar Mercado',
      ci: '8392104',
      ciExt: 'SCZ',
      codigoPais: '+591',
      celular: '77391024',
      email: 'f.cuellar@uagrm.edu.bo',
      facultad: 'Facultad de Ciencias de la Computación y Telecomunicaciones',
      carrera: 'Ingeniería en Redes y Telecomunicaciones',
      anioGraduacion: '2021',
      nroRegistroFolio: 'Libro XXI - Folio 348 - Acta 12098',
      tipoTramite: 'certificacion',
      canalPreferencia: 'whatsapp',
      mensaje: 'Solicito la Certificación de Autenticidad con firma digital institucional y código QR para trámite de homologación y beca de postgrado en el extranjero.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      const ticketId = `UAGRM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketGenerado(ticketId);
      setEnviado(true);
    }, 700);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] text-[#262825] font-sans selection:bg-[#ccb494] selection:text-[#191A2D] overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION INMERSIVO (Inspirado en Azimute Residencial)
          ========================================================================= */}
      <section className="relative h-[100svh] min-h-[660px] overflow-hidden text-[#fff7ec] flex flex-col justify-between">
        {/* Fondo 4K Real de la UAGRM con Zoom Sutil */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[1] transition-transform duration-[25s] ease-in-out hover:scale-105"
          style={{
            backgroundImage: `url('${imageSrc}')`,
            animation: 'slowZoom 25s ease-in-out infinite alternate',
          }}
        />

        {/* Capa de Gradiente Cinematográfico */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background:
              'linear-gradient(90deg, rgba(23, 24, 23, 0.65) 0%, rgba(23, 24, 23, 0.32) 48%, transparent 72%), linear-gradient(0deg, rgba(24, 28, 34, 0.90) 0%, transparent 60%, rgba(22, 24, 20, 0.40) 100%)',
          }}
        />

        {/* Header Superior Transparente */}
        <header className="relative z-20 flex justify-between items-center px-6 md:px-14 py-8 max-w-7xl mx-auto w-full">
          <a href="/" className="flex items-center gap-3.5 no-underline text-white group shrink-0">
            <img
              src="/UAGRM-Bolivia.webp"
              alt="Escudo UAGRM"
              className="w-11 h-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span
                className="text-3xl font-normal tracking-[0.06em] text-white leading-none drop-shadow"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic' }}
              >
                UAGRM
              </span>
              <span className="font-sans text-[8.5px] font-semibold tracking-[0.16em] text-white/90 uppercase mt-1 leading-tight drop-shadow hidden sm:block">
                UNIVERSIDAD AUTÓNOMA<br />GABRIEL RENÉ MORENO
              </span>
            </div>
          </a>

          {/* Menú de Navegación Editorial */}
          <nav className="hidden lg:flex items-center gap-7 list-none">
            {[
              { label: 'El Proyecto', target: 'historia' },
              { label: 'Servicios', target: 'servicios' },
              { label: 'El Campus', target: 'campus' },
              { label: 'Contacto', target: 'contacto' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.target)}
                className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-[#fff7ec]/90 hover:text-[#ccb494] transition-colors bg-transparent border-0 cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-[#ccb494] after:transition-all"
              >
                {item.label}
              </button>
            ))}
            <a
              href="/solicitante"
              className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase text-white bg-white/10 hover:bg-[#ccb494] hover:text-[#191A2D] border border-white/30 px-4 py-2 rounded-full transition-all no-underline backdrop-blur-sm"
            >
              Portal Trámites →
            </a>
          </nav>

          {/* Badge Excelencia */}
          <div className="hidden xl:flex items-center gap-2.5 text-[#fff7ec]/90 text-[10px] font-semibold tracking-[0.18em] uppercase text-right leading-tight drop-shadow shrink-0">
            <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-xs backdrop-blur-sm">
              ★
            </div>
            <div>
              UAGRM - EXCELENCIA<br />ACADÉMICA
            </div>
          </div>
        </header>

        {/* Título Principal Institucional (Adaptado al sistema UAGRM) */}
        <div className="relative z-10 px-6 md:px-14 mt-auto mb-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3 font-sans text-xs font-semibold tracking-[0.28em] uppercase text-white/95 mb-4 drop-shadow">
            <span className="w-8 h-px bg-[#ccb494]" />
            <span>SISTEMA DE CERTIFICACIÓN DE AUTENTICIDAD &bull; SANTA CRUZ</span>
          </div>

          <h1 className="leading-[0.82] tracking-tight m-0">
            <span className="block font-sans text-5xl sm:text-7xl md:text-[5.5rem] font-light uppercase tracking-[0.1em] text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.65)]">
              TU LOGRO
            </span>
            <span
              className="block text-7xl sm:text-9xl md:text-[13rem] font-normal italic lowercase text-white tracking-[-0.02em] -ml-2 -mt-3 sm:-mt-6 drop-shadow-[0_6px_35px_rgba(0,0,0,0.7)]"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              certificado.
            </span>
          </h1>
        </div>

        {/* Footer Inferior del Hero con Acciones Directas */}
        <footer className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-6 md:px-14 pb-10 pt-4 max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-6">
              <p className="font-sans text-sm sm:text-base font-light leading-snug tracking-wide text-white/95 drop-shadow max-w-md">
                Cotejo directo contra Libros Matrices en Archivo Central.<br />
                Seguridad jurídica, firma digital y fe pública universitaria.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (onExplore) onExplore();
                  else scrollToSection('historia');
                }}
                aria-label="Explorar Portal"
                className="w-12 h-12 rounded-full border border-white/45 bg-white/10 hover:bg-[#ccb494] hover:border-[#ccb494] hover:text-[#211f1c] hover:translate-y-1 transition-all flex items-center justify-center text-[#fff7ec] backdrop-blur-md cursor-pointer shadow-lg group shrink-0"
              >
                <svg
                  className="w-5 h-5 stroke-current group-hover:stroke-[#211f1c] transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </button>
            </div>

            {/* Acciones Rápidas Directas en el Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('contacto')}
                className="px-5 py-2.5 rounded-full bg-[#ccb494] hover:bg-white text-[#191A2D] text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Consultar Trámite</span>
                <span>↓</span>
              </button>
              <a
                href="/solicitante"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[11px] font-semibold tracking-[0.14em] uppercase transition-all backdrop-blur-sm no-underline"
              >
                Portal Solicitante →
              </a>
              <a
                href="/verificar"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[11px] font-semibold tracking-[0.14em] uppercase transition-all backdrop-blur-sm no-underline"
              >
                Verificar QR
              </a>
            </div>

            <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/70">
              EXPLORE
            </span>
          </div>

          <div className="font-sans text-xs sm:text-sm font-light tracking-wide text-white/85 drop-shadow">
            Perspectiva del Campus Universitario UAGRM
          </div>
        </footer>
      </section>

      {/* =========================================================================
          2. CAPÍTULO 01: EL PROYECTO & LA HISTORIA (#historia)
          ========================================================================= */}
      <section id="historia" className="py-24 px-6 md:px-14 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-[#ccb494] uppercase mb-4">
          <span>01 / HISTORIA & EXCELENCIA ACADÉMICA</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#191A2D] leading-[1.05] tracking-tight mb-8">
              LA HISTORIA EN <br />
              <span
                className="font-normal italic text-[#191A7D]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                buena dirección.
              </span>
            </h2>

            <p className="text-lg text-[#6B7280] leading-relaxed font-light mb-6">
              Fundada en 1880, la <strong className="text-[#191A2D] font-medium">Universidad Autónoma Gabriel René Moreno</strong> custodia la trayectoria académica y el esfuerzo de generaciones de profesionales en el oriente boliviano.
            </p>
            <p className="text-base text-[#6B7280] leading-relaxed font-light">
              Nuestro sistema de Certificación de Autenticidad Académica y Títulos Supletorios digitaliza, salvaguarda y valida los Libros Matrices históricos mediante tecnología de reconocimiento óptico e inteligencia documental, confiriendo plena seguridad jurídica a cada egresado.
            </p>
          </div>

          {/* Grilla de Métricas Institucionales */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 pt-4">
            <div className="p-6 border border-[#E2E8F0] rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <span className="text-4xl sm:text-5xl font-light text-[#191A7D]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                144+
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mt-3">
                Años de Autonomía & Prestigio
              </span>
            </div>

            <div className="p-6 border border-[#E2E8F0] rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <span className="text-4xl sm:text-5xl font-light text-[#191A7D]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                18
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mt-3">
                Facultades Universitarias
              </span>
            </div>

            <div className="p-6 border border-[#E2E8F0] rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <span className="text-4xl sm:text-5xl font-light text-[#191A7D]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                100%
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mt-3">
                Custodia en Libros Matrices
              </span>
            </div>

            <div className="p-6 border border-[#E2E8F0] rounded-xl bg-white shadow-sm flex flex-col justify-between">
              <span className="text-4xl sm:text-5xl font-light text-[#191A7D]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
                QR
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mt-3">
                Verificación Criptográfica 24/7
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CAPÍTULO 02: SERVICIOS Y MÓDULOS DE CERTIFICACIÓN (#servicios)
          ========================================================================= */}
      <section id="servicios" className="py-24 bg-white border-y border-[#E2E8F0]">
        <div className="px-6 md:px-14 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-[#ccb494] uppercase mb-4">
                <span>02 / SERVICIOS & TRÁMITES OFICIALES</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#191A2D] leading-tight">
                Tu logro.{' '}
                <span
                  className="font-normal italic text-[#191A7D]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  En buenas manos.
                </span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#6B7280] font-light max-w-md">
              Agilizamos la emisión de tus documentos académicos y validamos tu excelencia profesional de forma transparente y segura.
            </p>
          </div>

          {/* Tarjetas Editoriales de Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 border border-[#E2E8F0] rounded-2xl bg-[#FAF8F5] hover:border-[#191A7D] hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <span
                  className="text-4xl font-normal italic text-[#ccb494] group-hover:text-[#191A7D] transition-colors"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  01
                </span>
                <h3 className="text-xl font-bold text-[#191A2D] mt-6 mb-3">
                  Certificación de Autenticidad
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed font-light">
                  Cotejo directo contra Libros Matrices en Archivo Central. Validación mediante firma electrónica de Rectorado y Secretaría General con plena validez nacional e internacional.
                </p>
              </div>
              <a
                href="/solicitante"
                className="inline-flex items-center gap-2 mt-8 text-xs font-semibold tracking-[0.16em] uppercase text-[#191A7D] group-hover:text-[#2B6CB0] no-underline"
              >
                <span>Solicitar Certificación</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Card 2 */}
            <div className="p-8 border border-[#191A7D] rounded-2xl bg-[#DAEFFE]/20 hover:shadow-md transition-all group flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-[#191A7D] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                Custodia Legal
              </div>
              <div>
                <span
                  className="text-4xl font-normal italic text-[#191A7D]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  02
                </span>
                <h3 className="text-xl font-bold text-[#191A7D] mt-6 mb-3">
                  Título Supletorio
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed font-light">
                  Procedimiento de reposición formal con respaldo de resolución rectoral y dictamen jurídico de Secretaría General para diplomas académicos extraviados o deteriorados.
                </p>
              </div>
              <a
                href="/solicitante?tab=admision"
                className="inline-flex items-center gap-2 mt-8 text-xs font-semibold tracking-[0.16em] uppercase text-[#191A7D] group-hover:text-[#2B6CB0] no-underline"
              >
                <span>Iniciar Trámite Supletorio</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Card 3 */}
            <div className="p-8 border border-[#E2E8F0] rounded-2xl bg-[#FAF8F5] hover:border-[#191A7D] hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <span
                  className="text-4xl font-normal italic text-[#ccb494] group-hover:text-[#191A7D] transition-colors"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  03
                </span>
                <h3 className="text-xl font-bold text-[#191A2D] mt-6 mb-3">
                  Convenios Institucionales
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed font-light">
                  Ventanilla prioritaria y trámite gratuito por lote para ministerios, colegios de profesionales, gobernaciones y entidades públicas con convenio vigente con la UAGRM.
                </p>
              </div>
              <a
                href="/solicitante?tab=convenio"
                className="inline-flex items-center gap-2 mt-8 text-xs font-semibold tracking-[0.16em] uppercase text-[#191A7D] group-hover:text-[#2B6CB0] no-underline"
              >
                <span>Acceso por Convenio</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CAPÍTULO 03: EL CAMPUS & LA PERSPECTIVA (#campus)
          ========================================================================= */}
      <section id="campus" className="relative py-32 px-6 md:px-14 overflow-hidden text-white flex items-center justify-center">
        {/* Fondo con imagen 4K real */}
        <div
          className="absolute inset-0 bg-cover bg-center z-[1]"
          style={{ backgroundImage: `url('${imageSrc}')` }}
        />
        <div className="absolute inset-0 bg-[#191A2D]/75 z-[2] backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-[#ccb494]">
            <span>03 / EL CAMPUS UNIVERSITARIO</span>
          </div>

          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-normal italic text-white leading-tight"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            El lugar donde todo comenzó.
          </h2>

          <p className="text-base sm:text-lg text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            La Ciudad Universitaria de la UAGRM: más de 100 hectáreas de conocimiento, ciencia y naturaleza en el centro de Santa Cruz de la Sierra. La memoria de tus años de estudio custodiada para siempre.
          </p>

          <div className="pt-4">
            <a
              href="/verificar"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#ccb494] text-[#191A2D] font-semibold text-xs tracking-[0.2em] uppercase hover:bg-white hover:scale-105 transition-all shadow-xl no-underline"
            >
              <span>Verificar Título con Código QR</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CAPÍTULO 04: CONTACTO & CONSULTA RÁPIDA (#contacto)
          ========================================================================= */}
      <section id="contacto" className="py-24 px-6 md:px-14 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-[#ccb494] uppercase mb-4">
          <span>04 / CONTACTO & CONSULTA RÁPIDA</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          {/* Información Institucional a la Izquierda */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl font-light text-[#191A2D] leading-tight">
                Inicia tu trámite.{' '}
                <span
                  className="font-normal italic text-[#191A7D] block mt-1"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  Converse con nuestro equipo.
                </span>
              </h2>
              <p className="text-base text-[#6B7280] font-light mt-4 leading-relaxed">
                ¿Tienes dudas sobre los requisitos de tu Certificación de Autenticidad o el trámite de Título Supletorio? Déjanos tus datos y un oficial de Secretaría General se comunicará contigo.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <div className="w-10 h-10 rounded-full bg-[#DAEFFE] text-[#191A7D] flex items-center justify-center shrink-0 text-sm font-bold">
                  📍
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191A2D]">Atención Presencial</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                    Edificio Central de Secretaría General, Campus Universitario, Av. Busch y 2do Anillo, Santa Cruz de la Sierra.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <div className="w-10 h-10 rounded-full bg-[#DAEFFE] text-[#191A7D] flex items-center justify-center shrink-0 text-sm font-bold">
                  📞
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191A2D]">Mesa de Ayuda</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    +591 (3) 334-2222 &bull; Interno 105 / 108
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-white">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-sm font-bold">
                  💬
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#191A2D]">Canal WhatsApp Directo</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Atención automatizada 24/7 y derivación a operadores.
                  </p>
                  <a
                    href="https://wa.me/59177012345?text=Hola,%20solicito%20orientaci%C3%B3n%20para%20la%20Certificaci%C3%B3n%20de%20Autenticidad%20UAGRM"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Abrir chat de WhatsApp (+591 77012345) →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto Editorial a la Derecha */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-sm relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-xl font-bold text-[#191A2D]">
                  Formulario de Orientación y Consulta Registral
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Complete los datos del titular para cotejo directo en Archivo Central.
                </p>
              </div>

              {/* Botón para rellenar con datos de ejemplo (Requerimiento del usuario) */}
              <button
                type="button"
                onClick={handleRellenarEjemplo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#DAEFFE] border border-[#E2E8F0] hover:border-[#191A7D] text-[11px] font-semibold text-[#191A7D] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                title="Carga automáticamente un ejemplo con número de celular, CI, facultad y trámite"
              >
                <span>🪄</span>
                <span>Cargar Datos de Ejemplo</span>
              </button>
            </div>

            {enviado ? (
              <div className="p-6 bg-[#FAF8F5] border-2 border-emerald-500/40 rounded-xl space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3 text-emerald-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">¡Consulta Registrada Exitosamente!</h4>
                    <p className="text-xs text-emerald-700 font-normal">
                      Se ha generado su ticket oficial de atención institucional.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Nro. de Ticket:</span>
                    <span className="font-mono font-bold text-[#191A7D] bg-[#DAEFFE] px-2 py-0.5 rounded">
                      #{ticketGenerado}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Titular:</span>
                    <span className="font-semibold text-[#191A2D]">{formData.nombreCompleto}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">C.I.:</span>
                    <span className="font-medium text-[#191A2D]">{formData.ci} {formData.ciExt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Celular / WhatsApp:</span>
                    <span className="font-medium text-emerald-700">{formData.codigoPais} {formData.celular}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Trámite:</span>
                    <span className="font-medium text-[#191A2D] capitalize">{formData.tipoTramite}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B7280]">Canal Preferente:</span>
                    <span className="font-medium text-[#191A2D] uppercase">{formData.canalPreferencia}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/59177012345?text=Hola,%20acabo%20de%20registrar%20la%20consulta%20con%20ticket%20${ticketGenerado}%20para%20${encodeURIComponent(formData.nombreCompleto)}%20(CI:%20${formData.ci})`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase rounded-lg text-center transition-all no-underline shadow flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    <span>Continuar por WhatsApp Oficial</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEnviado(false);
                      setTicketGenerado(null);
                    }}
                    className="py-3 px-4 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-xs font-semibold text-[#191A2D] rounded-lg transition-all cursor-pointer"
                  >
                    Nueva Consulta
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre Completo */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#191A2D]">
                      Nombre Completo del Titular o Solicitante <span className="text-[#D31338]">*</span>
                    </label>
                    <span className="text-[10px] text-[#6B7280]">Como figura en el Diploma / C.I.</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Andrés Mamani Aguilera"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                  />
                </div>

                {/* CI y Teléfono Celular / WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Cédula de Identidad (C.I.) <span className="text-[#D31338]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Ej. 8941254"
                        value={formData.ci}
                        onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                      />
                      <select
                        value={formData.ciExt}
                        onChange={(e) => setFormData({ ...formData, ciExt: e.target.value })}
                        className="text-xs p-3 rounded-lg border border-[#E2E8F0] bg-white outline-none w-24 shrink-0 font-medium"
                      >
                        {['SCZ', 'LPZ', 'CBB', 'ORU', 'PTS', 'TJA', 'CHU', 'BEN', 'PND', 'EXT'].map((ext) => (
                          <option key={ext} value={ext}>{ext}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-[#191A2D]">
                        Número de Celular / WhatsApp <span className="text-[#D31338]">*</span>
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-600">WhatsApp activo</span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={formData.codigoPais}
                        onChange={(e) => setFormData({ ...formData, codigoPais: e.target.value })}
                        className="text-xs p-3 rounded-lg border border-[#E2E8F0] bg-white outline-none w-24 shrink-0 font-medium"
                      >
                        <option value="+591">+591 (BO)</option>
                        <option value="+54">+54 (AR)</option>
                        <option value="+55">+55 (BR)</option>
                        <option value="+56">+56 (CL)</option>
                        <option value="+51">+51 (PE)</option>
                        <option value="+34">+34 (ES)</option>
                        <option value="+1">+1 (US)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 77012345"
                        value={formData.celular}
                        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                        className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Correo Electrónico y Tipo de Trámite */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Correo Electrónico <span className="text-[#D31338]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. graduado@correo.com o @uagrm.edu.bo"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Tipo de Trámite Requerido
                    </label>
                    <select
                      value={formData.tipoTramite}
                      onChange={(e) => setFormData({ ...formData, tipoTramite: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] bg-white outline-none font-medium"
                    >
                      <option value="certificacion">Certificación de Autenticidad (Diploma / Título)</option>
                      <option value="supletorio">Título Supletorio (Extravío, Robo o Deterioro)</option>
                      <option value="apostilla">Validación para Apostilla (Cancillería)</option>
                      <option value="convenio">Convenio Institucional / Empresas Públicas o Privadas</option>
                      <option value="seguimiento">Seguimiento de Trámite ya Ingresado</option>
                    </select>
                  </div>
                </div>

                {/* Facultad y Carrera */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Facultad Universitaria
                    </label>
                    <select
                      value={formData.facultad}
                      onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] bg-white outline-none truncate"
                    >
                      <option value="Facultad de Ciencias de la Computación y Telecomunicaciones">FCCT - Computación y Telecomunicaciones</option>
                      <option value="Facultad de Ciencias Exactas y Tecnología">FCET - Tecnología / Ingeniería</option>
                      <option value="Facultad de Ciencias Económicas, Administrativas y Financieras">FCEAF - Ciencias Económicas y Financieras</option>
                      <option value="Facultad de Ciencias Jurídicas, Políticas, Sociales y RR.II.">FCJPS - Derecho y Ciencias Jurídicas</option>
                      <option value="Facultad de Ciencias de la Salud Humana">FCSH - Medicina, Odontología y Salud</option>
                      <option value="Facultad de Humanidades">Facultad de Humanidades</option>
                      <option value="Facultad de Ciencias Veterinarias">Facultad de Ciencias Veterinarias</option>
                      <option value="Facultad de Ciencias Agrícolas">Facultad de Ciencias Agrícolas</option>
                      <option value="Facultad Politécnica">Facultad Politécnica</option>
                      <option value="Facultad Integral del Norte (FINOR)">FINOR - Montero</option>
                      <option value="Otra Unidad o Postgrado">Otra Unidad Académica / Postgrado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Carrera de Egreso
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ingeniería Informática, Derecho, Auditoría..."
                      value={formData.carrera}
                      onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Año de Graduación y Referencia de Folio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Año de Graduación o Emisión (Aproximado)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 2018 o 2021"
                      value={formData.anioGraduacion}
                      onChange={(e) => setFormData({ ...formData, anioGraduacion: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                      Nro. de Folio / Libro / Registro (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Libro 45, Acta 1289 (si lo conoce)"
                      value={formData.nroRegistroFolio}
                      onChange={(e) => setFormData({ ...formData, nroRegistroFolio: e.target.value })}
                      className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Canal Preferido para Recibir Respuesta */}
                <div>
                  <label className="block text-xs font-semibold text-[#191A2D] mb-2">
                    Canal Preferente de Contacto
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
                      { id: 'llamada', label: 'Llamada', icon: '📞' },
                      { id: 'email', label: 'Correo', icon: '✉️' },
                    ].map((canal) => (
                      <label
                        key={canal.id}
                        className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                          formData.canalPreferencia === canal.id
                            ? 'bg-[#191A7D] text-white border-[#191A7D] shadow-sm'
                            : 'bg-[#FAF8F5] text-[#191A2D] border-[#E2E8F0] hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="canalPreferencia"
                          value={canal.id}
                          checked={formData.canalPreferencia === canal.id}
                          onChange={(e) => setFormData({ ...formData, canalPreferencia: e.target.value })}
                          className="sr-only"
                        />
                        <span>{canal.icon}</span>
                        <span>{canal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-xs font-semibold text-[#191A2D] mb-1">
                    Detalle de la Consulta u Observaciones
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Indique requerimientos específicos (apostilla, postgrado en el extranjero, reposición por extravío o cotejo)..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full text-xs p-3 rounded-lg border border-[#E2E8F0] focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D] outline-none transition-all resize-none"
                  />
                </div>

                {/* Botón de Envío */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#191A7D] hover:bg-[#12135E] text-white text-xs font-bold tracking-[0.18em] uppercase rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {enviando ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verificando Archivo...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Consulta Oficial</span>
                        <span>→</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-[#6B7280]">
                    🔒 Fe pública y resguardo de datos institucionales UAGRM.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Botón Flotante de WhatsApp Discreto (No obstruye campos del formulario) */}
      <aside aria-label="Mesa de ayuda WhatsApp" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/59177012345?text=Hola,%20solicito%20orientaci%C3%B3n%20para%20la%20Certificaci%C3%B3n%20de%20Autenticidad%20UAGRM"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:scale-110 transition-transform no-underline group relative"
          title="WhatsApp Mesa de Ayuda UAGRM (+591 77012345)"
        >
          <span className="text-2xl leading-none">💬</span>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#191A2D] text-white text-[11px] font-semibold rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            Mesa de Ayuda (+591 77012345)
          </span>
        </a>
      </aside>

      {/* =========================================================================
          6. FOOTER EDITORIAL INSTITUCIONAL
          ========================================================================= */}
      <footer className="bg-[#191A2D] text-[#FAF8F5] pt-16 pb-12 border-t border-white/10">
        <div className="px-6 md:px-14 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Logo y Misión */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/UAGRM-Bolivia.webp"
                  alt="Escudo UAGRM"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span
                    className="text-2xl font-normal italic text-white"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    UAGRM
                  </span>
                  <div className="text-[9px] tracking-widest text-[#ccb494] uppercase font-bold">
                    Universidad Autónoma Gabriel René Moreno
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/70 max-w-sm leading-relaxed font-light">
                Plataforma oficial del Sistema de Certificación de Autenticidad Académica, Títulos Supletorios y Archivo Central. Garantía y fe pública institucional desde 1880.
              </p>
            </div>

            {/* Enlaces de Navegación */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#ccb494]">
                Navegación
              </h4>
              <ul className="list-none space-y-2 p-0 m-0 text-xs text-white/80 font-light">
                <li><a href="#historia" className="hover:text-white transition-colors no-underline text-inherit">El Proyecto</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors no-underline text-inherit">Servicios & Trámites</a></li>
                <li><a href="#campus" className="hover:text-white transition-colors no-underline text-inherit">Campus Universitario</a></li>
                <li><a href="#contacto" className="hover:text-white transition-colors no-underline text-inherit">Mesa de Ayuda</a></li>
              </ul>
            </div>

            {/* Trámites y Canales */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#ccb494]">
                Accesos Directos
              </h4>
              <ul className="list-none space-y-2 p-0 m-0 text-xs text-white/80 font-light">
                <li><a href="/solicitante" className="hover:text-[#ccb494] transition-colors no-underline text-inherit">Portal del Solicitante</a></li>
                <li><a href="/solicitante?tab=convenio" className="hover:text-[#ccb494] transition-colors no-underline text-inherit">Convenios & Nóminas Masivas</a></li>
                <li><a href="/verificar" className="hover:text-[#ccb494] transition-colors no-underline text-inherit">Verificación QR Pública</a></li>
                <li><a href="/login" className="hover:text-[#ccb494] transition-colors no-underline text-inherit">Acceso Funcionarios / Módulos Internos</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/60 font-light">
            <div>
              &copy; {new Date().getFullYear()} Universidad Autónoma Gabriel René Moreno. Santa Cruz de la Sierra &bull; Bolivia.
            </div>
            <div>
              Plataforma Institucional Oficial &bull; Custodia y Fe Pública Universitaria
            </div>
          </div>
        </div>
      </footer>

      {/* Animación slowZoom */}
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default HeroLuxuryUAGRM;
