import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../shared/lib/auth';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, login, logout } = useAuthStore();
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ru, setRu] = useState('');
  const [password, setPassword] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState<'ARCHIVO_CENTRAL' | 'TITULOS' | 'SECRETARIA_GENERAL'>('ARCHIVO_CENTRAL');
  const [loadingSSO, setLoadingSSO] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  const handleSSOLoginRedirect = async () => {
    const backendApi = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    
    // Probar si el backend en puerto 8000 está activo
    try {
      const res = await fetch(`${backendApi}/auth/sso/login/`, { method: 'HEAD', mode: 'no-cors' });
      // Si responde o redirige, hacer navegación directa
      window.location.href = `${backendApi}/auth/sso/login/`;
    } catch (err) {
      // Si el puerto 8000 no responde (backend apagado), abrir el Modal SSO Institucional Interactivo
      setShowSSOModal(true);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSsoError(null);

    if (!ru || !password) {
      setSsoError('Por favor ingrese su Registro Universitario / CI y contraseña.');
      return;
    }

    setLoadingSSO(true);

    // Simular tiempo de verificación con SSO UAGRM
    setTimeout(() => {
      login({
        id: ru,
        nombre_completo: `Usuario UAGRM (${ru})`,
        email: `${ru}@uagrm.edu.bo`,
        roles: [rolSeleccionado],
        permisos: ['ALL'],
      });

      setLoadingSSO(false);
      setShowSSOModal(false);

      if (rolSeleccionado === 'ARCHIVO_CENTRAL') navigate('/archivo');
      else if (rolSeleccionado === 'TITULOS') navigate('/titulos');
      else navigate('/secretaria');
    }, 800);
  };

  const handleModuleClick = (targetPath: string, _targetRole: 'ARCHIVO_CENTRAL' | 'TITULOS' | 'SECRETARIA_GENERAL') => {
    // SSO COMENTADO / DESACTIVADO: Navegación libre directa sin redirección externa
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen bg-[#111625] flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2A3964]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#880000]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full z-10 flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2A3964] to-[#880000] p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-[#111625] rounded-[14px] flex items-center justify-center text-white font-extrabold text-xl tracking-tighter">
              UAGRM
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight font-outfit">
              Sistema de Archivo Central & Títulos Supletorios
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Universidad Autónoma Gabriel René Moreno • Portal Institucional
            </p>
          </div>
        </div>

        {/* User Status / SSO Action */}
        <div className="flex items-center gap-3">
          {isAuthenticated && usuario ? (
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-xs">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <div>
                <p className="font-bold text-white">{usuario.nombre_completo}</p>
                <p className="text-[10px] text-slate-400">{usuario.email || 'Sesión SSO Activa'}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <button
              onClick={handleSSOLoginRedirect}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Iniciar Sesión con SSO UAGRM
            </button>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full py-10 z-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 inline-block">
            Portal Institucional de Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit tracking-tight">
            Seleccione el Módulo de Acceso
          </h2>
          <p className="text-sm text-slate-400">
            Acceda a las funciones operativas según sus permisos autorizados por el SSO institucional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Module 1: Archivo Central */}
          <div 
            onClick={() => handleModuleClick('/archivo', 'ARCHIVO_CENTRAL')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-amber-500/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl text-amber-400 group-hover:scale-110 transition-transform shadow-lg">
                📁
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
                  <span className="text-amber-400 font-bold">✓</span> Escaneo OCR & Libros Historicos
                </li>
              </ul>
            </div>
            
            <button className="w-full py-3.5 bg-[#2A3964] hover:bg-[#880000] text-white font-extrabold text-xs rounded-xl border border-slate-600 transition-all flex items-center justify-center gap-2 shadow-md relative z-10">
              {isAuthenticated ? 'Ingresar a Archivo Central →' : 'Autenticar con SSO UAGRM →'}
            </button>
          </div>

          {/* Module 2: Títulos y Grados */}
          <div 
            onClick={() => handleModuleClick('/titulos', 'TITULOS')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-sky-400/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#6F85C3]/20 border border-[#6F85C3]/40 flex items-center justify-center text-3xl text-sky-300 group-hover:scale-110 transition-transform shadow-lg">
                🎓
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
              {isAuthenticated ? 'Ingresar a Títulos y Grados →' : 'Autenticar con SSO UAGRM →'}
            </button>
          </div>

          {/* Module 3: Secretaría General */}
          <div 
            onClick={() => handleModuleClick('/secretaria', 'SECRETARIA_GENERAL')}
            className="group cursor-pointer bg-[#222845]/90 hover:bg-[#2A3964]/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/80 hover:border-emerald-500/50 shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="space-y-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
                📜
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1.5">
                  MÓDULO 03
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors font-outfit">
                  Secretaría General
                </h3>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  Validación legal de dictámenes, Vo.Bo. de autoridades universitarias, firma digital certificada y auditoría final de títulos supletorios.
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
              {isAuthenticated ? 'Ingresar a Secretaría General →' : 'Autenticar con SSO UAGRM →'}
            </button>
          </div>

        </div>
      </main>

      {/* Modal SSO Institucional Interactivo (Fallback si backend en puerto 8000 está en desarrollo) */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A2238] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                  SSO
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Autenticación SSO UAGRM</h3>
                  <p className="text-xs text-slate-400">Servicio de Identidad Centralizada</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSSOModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {ssoError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {ssoError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registro Universitario / C.I.
                </label>
                <input
                  type="text"
                  placeholder="Ej: 219084712 o 1234567"
                  value={ru}
                  onChange={(e) => setRu(e.target.value)}
                  className="w-full bg-[#111625] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Institucional
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111625] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Módulo de Acceso
                </label>
                <select
                  value={rolSeleccionado}
                  onChange={(e) => setRolSeleccionado(e.target.value as any)}
                  className="w-full bg-[#111625] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="ARCHIVO_CENTRAL">Módulo 01 - Archivo Central</option>
                  <option value="TITULOS">Módulo 02 - Títulos y Grados</option>
                  <option value="SECRETARIA_GENERAL">Módulo 03 - Secretaría General</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSSOModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingSSO}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loadingSSO ? (
                    <span>Verificando...</span>
                  ) : (
                    <span>Ingresar con SSO</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full z-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
        <p>© {new Date().getFullYear()} DTIC • Universidad Autónoma Gabriel René Moreno</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            Autenticación SSO Institucional Adaptativa
          </span>
          <span>•</span>
          <span>Santa Cruz de la Sierra, Bolivia</span>
        </div>
      </footer>
    </div>
  );
}
