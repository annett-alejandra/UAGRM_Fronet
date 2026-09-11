import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarNavWidgetProps {
  readonly children: ReactNode;
  readonly pageTitle: string;
}

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly icon: ReactNode;
}

// Navegación Local por Módulo (Menú Izquierdo Exclusivo)
const ARCHIVO_NAV: readonly NavItem[] = [
  {
    path: '/archivo/autenticidad',
    label: '1. Certificado de Autenticidad',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    path: '/archivo/triaje',
    label: '2. Triaje Documental & Recepción',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    path: '/archivo/subida',
    label: '3. Digitalización & Escaneo OCR',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    path: '/archivo/reconstruccion',
    label: '4. Reconstrucción de Legajos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
  },
];

const TITULOS_NAV: readonly NavItem[] = [
  {
    path: '/titulos/busqueda',
    label: '1. Búsqueda Global (Dashboard)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    path: '/titulos/expediente/TIT-9901',
    label: '2. Visor Expediente Digital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    path: '/titulos/emision',
    label: '3. Emisión & Plantillas A4',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    path: '/titulos/carga-libros',
    label: '4. Carga Libros Matrices',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
  },
];

const SECRETARIA_NAV: readonly NavItem[] = [
  {
    path: '/secretaria/reconstruccion-ocr',
    label: '1. Validación OCR & Dictamen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
  },
  {
    path: '/secretaria/autenticidad',
    label: '2. Emisión & Firma Digital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
];

export function SidebarNavWidget({ children, pageTitle }: SidebarNavWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determinar Módulo Activo
  let currentNav = ARCHIVO_NAV;
  let moduleTitle = 'ARCHIVO CENTRAL';
  let moduleSubtitle = 'DEPARTAMENTO DE ARCHIVO UAGRM';

  if (location.pathname.startsWith('/titulos')) {
    currentNav = TITULOS_NAV;
    moduleTitle = 'TÍTULOS Y GRADOS';
    moduleSubtitle = 'DEPARTAMENTO DE TÍTULOS UAGRM';
  } else if (location.pathname.startsWith('/secretaria')) {
    currentNav = SECRETARIA_NAV;
    moduleTitle = 'SECRETARÍA GENERAL';
    moduleSubtitle = 'DESPACHO SECRETARÍA GENERAL';
  }

  const cleanHeaderTitle = pageTitle.replace(/\s*-\s*UAGRM\s*/gi, '').trim();

  const isActive = (path: string) => {
    if (path === '/archivo/autenticidad' && location.pathname === '/archivo') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans relative overflow-hidden">
      
      {/* Sidebar Izquierdo: Azul UAGRM Primario (#003366) */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 bg-[#003366] text-white shadow-xl transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        <div className="flex flex-col gap-6 p-4">
          {/* Header del Módulo Activo */}
          <div className="flex items-center gap-3 px-2 py-2 border-b border-white/15 pb-4">
            <div 
              onClick={() => navigate('/login')} 
              className="w-10 h-10 rounded-xl bg-[#C51D24] text-white flex items-center justify-center font-extrabold text-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
              title="Ir a selección de módulo"
            >
              🎓
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="font-extrabold text-xs tracking-tight text-white font-heading truncate">{moduleTitle}</h2>
                <p className="text-[9px] text-[#E5A823] font-mono tracking-wider truncate">{moduleSubtitle}</p>
              </div>
            )}
          </div>

          {/* Navegación Local del Módulo (Ítem Activo con Rojo #C51D24 y Borde Dorado #E5A823) */}
          <nav className="space-y-1.5">
            {!isCollapsed && (
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest px-3 block mb-2 opacity-90">
                Menú de Opciones
              </span>
            )}

            {currentNav.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#C51D24] text-white font-bold shadow-md border-l-4 border-[#E5A823]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  <span className={active ? 'text-[#E5A823]' : 'text-slate-300'}>{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer del Menú Izquierdo: Botón Rojo Cardenal (#C51D24) "CAMBIAR MÓDULO" */}
        <div className="p-4 border-t border-white/15 space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-3 bg-[#C51D24] hover:bg-[#a3151b] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
          >
            <span>🔄</span>
            {!isCollapsed && <span>CAMBIAR MÓDULO</span>}
          </button>

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs rounded-xl transition-all text-center"
          >
            {isCollapsed ? '→' : '← Colapsar'}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* Top Header Bar en Blanco Institucional con Borde #E2E8F0 */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16 bg-white border-b border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C51D24]"></span>
              {cleanHeaderTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex px-3 py-1 bg-slate-100 border border-[#E2E8F0] text-[#1E293B] text-xs font-mono rounded-full items-center gap-2">
              <span className="text-[#1B7A43] font-bold">●</span> Operador Sistema UAGRM
            </span>
          </div>
        </header>

        {/* Content Area en Gris Hielo (#F8FAFC) */}
        <main className="flex-1 p-6 overflow-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
