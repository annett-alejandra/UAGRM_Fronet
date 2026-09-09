import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../app/providers/ThemeProvider';
import {
  Sidebar,
  SidebarBrand,
  SidebarNav,
  SidebarNavItem,
  SidebarSectionLabel,
} from '../../shared/ui/Sidebar/Sidebar';

interface SidebarNavWidgetProps {
  readonly children: ReactNode;
  readonly pageTitle: string;
}

interface NavItem {
  readonly path: string;
  readonly label: string;
  readonly icon: ReactNode;
}

const TRAMITES_NAV: readonly NavItem[] = [
  {
    path: '/titulos/triage',
    label: 'Bandeja de Pendientes',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    path: '/archivo/expediente/1',
    label: 'Libros de Matrices',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
  },
];

const DOCUMENTOS_NAV: readonly NavItem[] = [
  {
    path: '/archivo/subida',
    label: 'Subir Expediente (OCR)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    path: '/titulos/busqueda-universal',
    label: 'Busqueda Universal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export function SidebarNavWidget({ children, pageTitle }: SidebarNavWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Sidebar
        isCollapsed={isCollapsed}
        isOpen={isMobileOpen}
        onToggle={() => setIsCollapsed((prev) => !prev)}
      >
        <SidebarBrand
          logoText="TS"
          name="Titulos UAGRM"
          subtitle="Sistema de Gestion"
        />
        <SidebarNav>
          <SidebarSectionLabel>Gestion</SidebarSectionLabel>
          {TRAMITES_NAV.map((item) => (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.path)}
              onClick={() => handleNavigate(item.path)}
            />
          ))}

          <SidebarSectionLabel>Consultas</SidebarSectionLabel>
          {DOCUMENTOS_NAV.map((item) => (
            <SidebarNavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.path)}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </SidebarNav>
      </Sidebar>

      <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsMobileOpen((prev) => !prev)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
