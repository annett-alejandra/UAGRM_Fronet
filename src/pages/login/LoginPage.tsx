import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/lib/auth';
import { Button, Input, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated, logout } = useAuthStore();
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ru, setRu] = useState('');
  const [password, setPassword] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState<'ARCHIVO_CENTRAL' | 'TITULOS' | 'SECRETARIA_GENERAL'>('ARCHIVO_CENTRAL');
  const [loadingSSO, setLoadingSSO] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  const handleModuleClick = (targetPath: string) => {
    navigate(targetPath);
  };

  const handleSSOLoginRedirect = () => {
    setShowSSOModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSsoError(null);
    if (!ru.trim() || !password.trim()) {
      setSsoError('Por favor ingrese su R.U. / C.I. y contraseña institucional.');
      return;
    }

    setLoadingSSO(true);
    setTimeout(() => {
      setLoadingSSO(false);
      setShowSSOModal(false);

      if (rolSeleccionado === 'ARCHIVO_CENTRAL') {
        navigate('/archivo');
      } else if (rolSeleccionado === 'TITULOS') {
        navigate('/titulos');
      } else {
        navigate('/secretaria');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between font-sans relative">
      {/* Header Institucional Limpio */}
      <header className="bg-white border-b border-slate-200/90 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto w-full px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/UAGRM-Bolivia.webp"
              alt="Escudo UAGRM"
              className="w-11 h-11 object-contain shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191A7D]">UAGRM</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">PORTAL OFICIAL</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Sistema de Certificación de Autenticidad, Títulos & Archivo Central
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Universidad Autónoma Gabriel René Moreno &bull; Santa Cruz de la Sierra
              </p>
            </div>
          </div>

          {/* Barra Superior de Operador / Herramientas & SSO */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Utilitarios de Operador (Reubicados en la barra superior según Hallazgo A) */}
            <div className="hidden md:flex items-center gap-1.5 pr-2 border-r border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#191A7D] hover:bg-slate-100 font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                title="Ir a la Portada Web Institucional"
              >
                <span>🏛️</span>
                <span>Portal Web</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/colores')}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-[#191A7D] hover:bg-slate-100 font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                title="Caja de Herramientas y Paleta Oficial UAGRM"
              >
                <span>🎨</span>
                <span>Caja de Herramientas</span>
              </button>
            </div>

            {/* Estado de Autenticación / Botón SSO */}
            {isAuthenticated && usuario ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">{usuario.nombre_completo}</p>
                  <p className="text-[10px] text-slate-500">{usuario.email || 'Sesión SSO Activa'}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={logout}
                  className="ml-2 h-7 px-2.5 text-[11px]"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSSOLoginRedirect}
                className="gap-2 shadow-sm bg-[#191A7D] hover:bg-[#12135E] text-white font-bold text-xs px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Ingreso Funcionarios (SSO)
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid: Módulos Operativos Principales con flujo vertical natural */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 space-y-8 flex-1">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge status="info">
            PORTAL INSTITUCIONAL DE SELECCIÓN DE MÓDULOS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Seleccione el Módulo Operativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Acceda a las áreas de consulta registral, tramitación supletoria o validación jurídica autorizada.
          </p>
        </div>

        {/* 4 Módulos Operativos en Tarjetas Limpias con Alto Contraste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Módulo 01: Archivo Central */}
          <Card 
            onClick={() => handleModuleClick('/archivo')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none"></div>

            <CardHeader className="space-y-3 relative z-10 p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl text-amber-700 group-hover:scale-110 transition-transform shadow-xs">
                📁
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block mb-1">
                  MÓDULO 01
                </span>
                <CardTitle className="text-lg font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Archivo Central
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Búsqueda con OCR y Reconstrucción de Libros Matrices históricos de actas y títulos.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 relative z-10 p-6 pt-2">
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Reconstrucción OCR con Split View
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Búsqueda por similitud semántica
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">✓</span> Certificados de Autenticidad QR
                </li>
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-0 relative z-10">
              <Button variant="outline" className="w-full text-amber-800 border-amber-300 hover:bg-amber-50 font-bold text-xs">
                Ingresar a Archivo →
              </Button>
            </CardFooter>
          </Card>

          {/* Módulo 02: Títulos y Grados */}
          <Card 
            onClick={() => handleModuleClick('/titulos')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-600 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>

            <CardHeader className="space-y-3 relative z-10 p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl text-blue-700 group-hover:scale-110 transition-transform shadow-xs">
                🎓
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-widest block mb-1">
                  MÓDULO 02
                </span>
                <CardTitle className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Títulos y Grados
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Emisión de Títulos Supletorios, plantillas institucionales y visor de expedientes.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 relative z-10 p-6 pt-2">
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Plantillas de Certificación Oficial
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Búsqueda en Sistema Informix
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">✓</span> Auditoría inmutable de firmas
                </li>
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-0 relative z-10">
              <Button variant="outline" className="w-full text-blue-800 border-blue-300 hover:bg-blue-50 font-bold text-xs">
                Ingresar a Títulos →
              </Button>
            </CardFooter>
          </Card>

          {/* Módulo 03: Secretaría General */}
          <Card 
            onClick={() => handleModuleClick('/secretaria')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>

            <CardHeader className="space-y-3 relative z-10 p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl text-emerald-700 group-hover:scale-110 transition-transform shadow-xs">
                📜
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                  MÓDULO 03
                </span>
                <CardTitle className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Secretaría General
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Resoluciones rectorales, firma electrónica y libro de resoluciones oficial.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 relative z-10 p-6 pt-2">
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Resoluciones Rectorales
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Firma Digital y Notificación
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span> Registro de Títulos Supletorios
                </li>
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-0 relative z-10">
              <Button variant="outline" className="w-full text-emerald-800 border-emerald-300 hover:bg-emerald-50 font-bold text-xs">
                Ingresar a Secretaría →
              </Button>
            </CardFooter>
          </Card>

          {/* Módulo 04: Portal del Solicitante & Convenios */}
          <Card 
            onClick={() => handleModuleClick('/solicitante')}
            className="group cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-600 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>

            <CardHeader className="space-y-3 relative z-10 p-6 pb-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl text-purple-700 group-hover:scale-110 transition-transform shadow-xs">
                👥
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest block mb-1">
                  PÚBLICO & ENTIDADES
                </span>
                <CardTitle className="text-lg font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Portal del Solicitante
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Solicitudes individuales de autenticidad y carpetas por lotes para convenios institucionales.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 relative z-10 p-6 pt-2">
              <ul className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span> Solicitud Individual + QR Gaby
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span> Entidades Públicas por Lotes
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600 font-bold">✓</span> Seguimiento por Código
                </li>
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-0 relative z-10">
              <Button variant="outline" className="w-full text-purple-800 border-purple-300 hover:bg-purple-50 font-bold text-xs">
                Ingresar al Portal →
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>

      {/* Modal SSO Institucional Interactivo */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="bg-white border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-slate-900">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 font-bold text-sm">
                  SSO
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Autenticación SSO UAGRM</h3>
                  <p className="text-xs text-slate-500">Servicio de Identidad Centralizada</p>
                </div>
              </div>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setShowSSOModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 h-auto"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {ssoError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {ssoError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registro Universitario / C.I.
                </label>
                <Input
                  type="text"
                  placeholder="Ej: 219084712 o 1234567"
                  value={ru}
                  onChange={(e) => setRu(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña Institucional
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Módulo de Acceso
                </label>
                <select
                  value={rolSeleccionado}
                  onChange={(e) => setRolSeleccionado(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-[var(--radius-base)] px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
                >
                  <option value="ARCHIVO_CENTRAL">Módulo 01 - Archivo Central</option>
                  <option value="TITULOS">Módulo 02 - Títulos y Grados</option>
                  <option value="SECRETARIA_GENERAL">Módulo 03 - Secretaría General</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSSOModal(false)}
                  className="flex-1 text-slate-700 border-slate-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loadingSSO}
                  className="flex-1 bg-[#191A7D] hover:bg-[#12135E] text-white font-bold"
                >
                  Ingresar con SSO
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Footer Institucional */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} DTIC &bull; Universidad Autónoma Gabriel René Moreno</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Autenticación SSO Institucional Activa
            </span>
            <span>&bull;</span>
            <span>Santa Cruz de la Sierra, Bolivia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
