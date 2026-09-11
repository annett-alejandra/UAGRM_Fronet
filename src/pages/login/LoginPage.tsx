import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F1524] text-slate-100 flex flex-col justify-between p-6 sm:p-12 font-poppins relative overflow-hidden">
      {/* Ambient UAGRM Glow Effects (#2A3964 & #880000) */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#2A3964]/30 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#880000]/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header Brand */}
      <header className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto w-full z-10 gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A3964] to-[#1a2542] flex items-center justify-center font-extrabold text-amber-400 text-2xl shadow-xl shadow-[#2A3964]/50 border border-amber-500/30">
            🎓
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-outfit uppercase">
              UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
            </h1>
            <p className="text-xs text-[#93A3D2] font-semibold tracking-wide uppercase">
              Sistema de Gestión de Títulos Supletorios & Expedientes Digitales
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-[#222845] border border-slate-700/80 text-amber-400 text-xs font-mono rounded-full font-semibold shadow-inner">
            v2.0 • Estilos Institucionales UAGRM
          </span>
        </div>
      </header>

      {/* Main Content Module Cards */}
      <main className="max-w-6xl mx-auto w-full my-10 z-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2A3964]/40 border border-[#4B66B4]/40 text-[#D4DAED] rounded-full text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Portal Oficial de Ingreso Institucional
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-outfit">
            Seleccione el Módulo de Operación
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Acceda directamente a las pantallas y flujos de trabajo correspondientes a su departamento.
          </p>
        </div>

        {/* 3 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Module 1: Archivo Central */}
          <div 
            onClick={() => navigate('/archivo')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-amber-500/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl text-amber-400 group-hover:scale-110 transition-transform shadow-lg">
                📂
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1.5">
                  MÓDULO 01
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors font-outfit">
                  Archivo Central
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Plantilla Oficial de Informe de Autenticidad, digitalización, escaneo OCR asistido y consulta catalográfica de Libros, Tomos y Folios.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-slate-700/80 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Plantilla Oficial de Autenticidad
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Impresión en Carta, Oficio y A4
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Acciones de Guardar, Enviar e Imprimir
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3.5 bg-[#2A3964] hover:bg-[#880000] text-white font-extrabold text-xs rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-2 shadow-md relative z-10">
              Ingresar a Archivo Central →
            </button>
          </div>

          {/* Module 2: Títulos y Grados */}
          <div 
            onClick={() => navigate('/titulos')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-sky-400/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6F85C3]/20 border border-[#6F85C3]/40 flex items-center justify-center text-3xl text-sky-300 group-hover:scale-110 transition-transform shadow-lg">
                📜
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1.5">
                  MÓDULO 02
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors font-outfit">
                  Títulos y Grados
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Búsqueda multiparamétrica global, visor de expediente en pantalla dividida con MinIO PDF, emisión de 5 plantillas A4 y carga de libros matrices.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-slate-700/80 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> Buscador Multiparamétrico CI/Título
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> Visor Split Screen (PDF + Dossier)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span> Emisión de 5 Plantillas A4
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3.5 bg-gradient-to-r from-[#2A3964] to-[#4B66B4] hover:from-[#3C5290] hover:to-[#6F85C3] text-white font-extrabold text-xs rounded-xl border border-sky-400/30 transition-all flex items-center justify-center gap-2 shadow-md relative z-10">
              Ingresar a Títulos y Grados →
            </button>
          </div>

          {/* Module 3: Secretaría General */}
          <div 
            onClick={() => navigate('/secretaria')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
                🏛️
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1.5">
                  MÓDULO 03
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors font-outfit">
                  Secretaría General
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Validación legal de dictámenes,Vo.Bo. de autoridades universitaras, firma digital certificada y auditoría final de títulos supletorios.
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-slate-700/80 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Control de Legalidad & Dictámenes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Firma Digital Certificada (PKI)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Auditoría e Histórico de Actas
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3.5 bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 font-extrabold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center justify-center gap-2 shadow-md relative z-10">
              Ingresar a Secretaría General →
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full z-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
        <p>© {new Date().getFullYear()} DTIC • Universidad Autónoma Gabriel René Moreno</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Servidor Activo (UAGRM #2A3964 / #880000 Theme)
          </span>
          <span>•</span>
          <span>Santa Cruz de la Sierra, Bolivia</span>
        </div>
      </footer>
    </div>
  );
}
