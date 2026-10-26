import React from 'react';

interface HeroLuxuryUAGRMProps {
  imageSrc?: string;
  titleSans?: string;
  titleSerif?: string;
  subtitle?: string;
  desc?: string;
  footerRightText?: string;
  onExplore?: () => void;
}

export const HeroLuxuryUAGRM: React.FC<HeroLuxuryUAGRMProps> = ({
  imageSrc = '/image_d78c06.jpg',
  titleSans = 'Tu logro',
  titleSerif = 'certificado.',
  subtitle = 'SISTEMA DE VERIFICACIÓN Y TITULACIÓN',
  desc = 'Agilizamos la emisión de tus documentos académicos y validamos tu excelencia profesional de forma segura.',
  footerRightText = 'Plataforma Oficial de Títulos UAGRM',
  onExplore,
}) => {
  return (
    <section className="relative sticky top-0 h-[100svh] min-h-[620px] overflow-hidden text-[#fff7ec] flex flex-col justify-between selection:bg-[#c4a386] selection:text-[#211f1c]">
      {/* 1. Fondo Fotográfico Aéreo 4K Real de la UAGRM con animación de respiración sutil */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-[1] transition-transform duration-[20s] ease-in-out hover:scale-105"
        style={{
          backgroundImage: `url('${imageSrc}')`,
          animation: 'slowZoom 25s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Capa de Oscurecimiento & Gradiente Cinematográfico Exacto */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            'linear-gradient(90deg, rgba(23, 24, 23, 0.58) 0%, rgba(23, 24, 23, 0.28) 45%, transparent 68%), linear-gradient(0deg, rgba(24, 28, 34, 0.85) 0%, transparent 58%, rgba(22, 24, 20, 0.35) 100%)',
        }}
      />

      {/* 3. Header Superior */}
      <header className="relative z-10 flex justify-between items-center px-6 md:px-14 py-8">
        {/* Marca: Escudo Oficial + Tipografía */}
        <a href="/" className="flex items-center gap-3.5 no-underline text-white group">
          <img
            src="/UAGRM-Bolivia.webp"
            alt="Escudo UAGRM"
            className="w-11 h-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
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
            <span className="font-sans text-[9px] font-semibold tracking-[0.16em] text-white/90 uppercase mt-1 leading-tight drop-shadow">
              UNIVERSIDAD AUTÓNOMA<br />GABRIEL RENÉ MORENO
            </span>
          </div>
        </a>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8 list-none">
          {[
            { label: 'Inicio', href: '/' },
            { label: 'Verificar Título', href: '/verificar' },
            { label: 'Mis Trámites', href: '/solicitante' },
            { label: 'Contacto', href: '#contacto' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-[#fff7ec]/90 hover:text-[#ccb494] transition-colors no-underline relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-px after:bg-[#ccb494] after:transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Badge Institucional */}
        <div className="hidden lg:flex items-center gap-2.5 text-[#fff7ec]/90 text-[10px] font-semibold tracking-[0.18em] uppercase text-right leading-tight drop-shadow">
          <div className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-xs backdrop-blur-sm">
            ★
          </div>
          <div>
            UAGRM - EXCELENCIA<br />ACADÉMICA
          </div>
        </div>
      </header>

      {/* 4. Cuerpo Principal: Títulos */}
      <div className="relative z-10 px-6 md:px-14 mt-auto mb-4 max-w-7xl">
        <div className="flex items-center gap-3 font-sans text-xs font-semibold tracking-[0.24em] uppercase text-white/95 mb-4 drop-shadow">
          <span className="w-8 h-px bg-white/70" />
          <span>{subtitle}</span>
        </div>

        <h1 className="leading-[0.82] tracking-tight m-0">
          <span className="block font-sans text-5xl sm:text-7xl md:text-[5rem] font-light uppercase tracking-[0.12em] text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.65)]">
            {titleSans}
          </span>
          <span
            className="block text-7xl sm:text-9xl md:text-[12.5rem] font-normal italic lowercase text-white tracking-[-0.02em] -ml-2 -mt-3 sm:-mt-6 drop-shadow-[0_6px_35px_rgba(0,0,0,0.7)]"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {titleSerif}
          </span>
        </h1>
      </div>

      {/* 5. Footer Inferior */}
      <footer className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-6 md:px-14 pb-8 pt-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <p className="font-sans text-sm sm:text-base font-light leading-snug tracking-wide text-white/95 drop-shadow max-w-md">
              {desc}
            </p>

            <button
              type="button"
              onClick={onExplore}
              aria-label="Explorar Portal"
              className="w-11 h-11 rounded-full border border-white/40 bg-white/10 hover:bg-[#ccb494] hover:border-[#ccb494] hover:text-[#211f1c] hover:translate-y-1 transition-all flex items-center justify-center text-[#fff7ec] backdrop-blur-md cursor-pointer shadow-lg group"
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

          <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/70">
            EXPLORE
          </span>
        </div>

        <div className="font-sans text-xs sm:text-sm font-light tracking-wide text-white/85 drop-shadow">
          {footerRightText}
        </div>
      </footer>

      {/* Estilo CSS in-line para animación slowZoom */}
      <style>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default HeroLuxuryUAGRM;
