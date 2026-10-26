import { useState, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarNavWidgetProps {
  children: ReactNode;
  pageTitle?: string;
}

interface NavItem {
  path: string;
  label: string;
  iconName: string;
}

const ARCHIVO_NAV: readonly NavItem[] = [
  {
    path: '/archivo/dashboard-notificaciones',
    label: '1. Dashboard de Notificaciones',
    iconName: 'dashboard',
  },
  {
    path: '/archivo/triaje',
    label: '2. Triaje Documental (Bandeja)',
    iconName: 'filter_alt',
  },
  {
    path: '/archivo/autenticidad',
    label: '3. Certificado Autenticidad',
    iconName: 'verified',
  },
  {
    path: '/archivo/subida',
    label: '4. Digitalización OCR (Solicitud)',
    iconName: 'document_scanner',
  },
  {
    path: '/archivo/busqueda-expedientes',
    label: '5. Búsqueda de Expedientes',
    iconName: 'search_insights',
  },
  {
    path: '/archivo/subida-excel',
    label: '6. Subida por Excel (Libros Históricos)',
    iconName: 'table_view',
  },
  {
    path: '/archivo/ver-libros-tomo',
    label: '7. Ver Libros por Tomo',
    iconName: 'menu_book',
  },
];

const TITULOS_NAV: readonly NavItem[] = [
  {
    path: '/titulos/dashboard-notificaciones',
    label: '1. Dashboard & Notificaciones',
    iconName: 'dashboard',
  },
  {
    path: '/titulos/convalidacion',
    label: '2. Convalidación Espejo (Dev 3)',
    iconName: 'compare_arrows',
  },
  {
    path: '/titulos/boveda',
    label: '3. Bóveda Histórica (Dev 3)',
    iconName: 'account_balance',
  },
  {
    path: '/titulos/lotes-institucionales',
    label: '4. Lotes Institucionales (Dev 3)',
    iconName: 'domain',
  },
  {
    path: '/titulos/bandeja-entrada',
    label: '5. Bandeja de Entrada (Dev 3)',
    iconName: 'move_to_inbox',
  },
  {
    path: '/titulos/busqueda-informix',
    label: '6. Búsqueda Informix (CUI/Título)',
    iconName: 'search',
  },
  {
    path: '/titulos/visor-expediente',
    label: '7. Reconstrucción & Visor Digital',
    iconName: 'visibility',
  },
  {
    path: '/titulos/emision-plantillas',
    label: '8. Emisión & Plantillas A4',
    iconName: 'print',
  },
  {
    path: '/titulos/carga-libros',
    label: '9. Carga Libros Matrices',
    iconName: 'collections_bookmark',
  },
];

const SECRETARIA_NAV: readonly NavItem[] = [
  {
    path: '/secretaria/admision',
    label: '1. Bandeja de Admisión (Previa)',
    iconName: 'inbox',
  },
  {
    path: '/secretaria/apostillamiento',
    label: '2. Gestión Apostillamiento',
    iconName: 'public',
  },
  {
    path: '/secretaria/despacho-seguro',
    label: '3. Despacho Seguro (Custodia)',
    iconName: 'shield',
  },
  {
    path: '/secretaria/convenios',
    label: '4. Catálogo de Convenios',
    iconName: 'handshake',
  },
  {
    path: '/secretaria/modulo-completo',
    label: '5. Módulo Integrado Dev 2',
    iconName: 'dashboard_customize',
  },
  {
    path: '/secretaria/reconstruccion-ocr',
    label: '6. Evaluación OCR & Dictamen',
    iconName: 'gavel',
  },
  {
    path: '/secretaria/autenticidad',
    label: '7. Emisión & Firma Digital',
    iconName: 'draw',
  },
  {
    path: '/secretaria/general',
    label: '8. Secretaría General (Doble Auth)',
    iconName: 'verified_user',
  },
  {
    path: '/secretaria/convenios-radicacion',
    label: '9. Radicación Convenios & Nóminas',
    iconName: 'assignment_add',
  },
];

export function SidebarNavWidget({ children }: SidebarNavWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const isActive = (path: string) => {
    if (path === '/archivo/dashboard-notificaciones' && (location.pathname === '/archivo' || location.pathname === '/archivo/')) return true;
    if (path === '/titulos/dashboard-notificaciones' && (location.pathname === '/titulos' || location.pathname === '/titulos/')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F9F9F6] text-[#191A2D] font-sans overflow-hidden">
      <aside className={`fixed top-0 left-0 bottom-0 z-50 bg-[#191A7D] text-white shadow-xl transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col gap-5 p-4">
          <div className="flex items-center gap-3 px-2 py-2 border-b border-white/15 pb-4">
            <div 
              onClick={() => navigate('/login')} 
              className="w-10 h-10 rounded-xl bg-[#D31338] text-white flex items-center justify-center font-extrabold text-lg shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
              title="Ir a selección de módulo"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>account_balance</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="font-extrabold text-xs tracking-tight text-white font-heading truncate">{moduleTitle}</h2>
                <p className="text-[9px] text-[#E5A823] font-mono tracking-wider truncate">{moduleSubtitle}</p>
              </div>
            )}
          </div>

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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D31338] text-white font-bold shadow-md border-l-4 border-[#E5A823]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  <span className={`material-symbols-outlined shrink-0 ${active ? 'text-[#E5A823]' : 'text-slate-300'}`} style={{ fontSize: '20px' }}>
                    {item.iconName}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/15 space-y-2.5">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-3 bg-[#D31338] hover:bg-[#B70F2F] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>swap_horiz</span>
            {!isCollapsed && <span>CAMBIAR MÓDULO</span>}
          </button>

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-slate-200 text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
            {!isCollapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>

      <div className={`flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="flex-1 overflow-y-auto bg-[#F9F9F6] flex flex-col p-2">
          {children}
        </main>
      </div>
    </div>
  );
}



