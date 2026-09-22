import { useState, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarNavWidgetProps {
  children: ReactNode;
  pageTitle: string;
}

interface NavItem {
  path: string;
  label: string;
  iconName: string;
}

const ARCHIVO_NAV: readonly NavItem[] = [
  {
    path: '/archivo/autenticidad',
    label: '1. Certificado Autenticidad',
    iconName: 'verified',
  },
  {
    path: '/archivo/triaje',
    label: '2. Triaje Documental (Bandeja)',
    iconName: 'filter_alt',
  },
  {
    path: '/archivo/subida',
    label: '3. Digitalización OCR',
    iconName: 'document_scanner',
  },
  {
    path: '/archivo/reconstruccion',
    label: '4. Reconstrucción Libros',
    iconName: 'menu_book',
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
];

const TITULOS_NAV: readonly NavItem[] = [
  {
    path: '/titulos/busqueda',
    label: '1. Búsqueda Global (Dashboard)',
    iconName: 'search',
  },
  {
    path: '/titulos/expediente/TIT-9901',
    label: '2. Visor Expediente Digital',
    iconName: 'visibility',
  },
  {
    path: '/titulos/emision',
    label: '3. Emisión & Plantillas A4',
    iconName: 'print',
  },
  {
    path: '/titulos/carga-libros',
    label: '4. Carga Libros Matrices',
    iconName: 'collections_bookmark',
  },
];

const SECRETARIA_NAV: readonly NavItem[] = [
  {
    path: '/secretaria/reconstruccion-ocr',
    label: '1. Validación OCR & Dictamen',
    iconName: 'gavel',
  },
  {
    path: '/secretaria/autenticidad',
    label: '2. Emisión & Firma Digital',
    iconName: 'draw',
  },
];

export function SidebarNavWidget({ children, pageTitle }: SidebarNavWidgetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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

  const cleanHeaderTitle = pageTitle.replace(/\s*-\s*UAGRM\s*/gi, '').trim();

  const isActive = (path: string) => {
    if (path === '/archivo/autenticidad' && location.pathname === '/archivo') return true;
    return location.pathname.startsWith(path);
  };

  const notifications = [
    { id: '1', titulo: 'Nueva solicitud derivada de Títulos', desc: 'Trámite TR-88421 (Jenny Flores Peña) derivado a Archivo Central', tiempo: 'Hace 10 min' },
    { id: '2', titulo: 'Transferencia a Secretaría General', desc: 'Informe INF N° 0472 enviado a revisión de Secretaría', tiempo: 'Hace 45 min' },
    { id: '3', titulo: 'Digitalización por Excel Lista', desc: 'Tomo Jurídicas #01 (2001) guardado correctamente', tiempo: 'Hace 2 horas' }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans relative overflow-hidden">
      
      {/* Sidebar Izquierdo (#003366 Azul UAGRM) con Opcion 6 */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 bg-[#003366] text-white shadow-xl transition-all duration-300 flex flex-col justify-between ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-center gap-3 px-2 py-2 border-b border-white/15 pb-4">
            <div 
              onClick={() => navigate('/login')} 
              className="w-10 h-10 rounded-xl bg-[#C51D24] text-white flex items-center justify-center font-extrabold text-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
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
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#C51D24] text-white font-bold shadow-md border-l-4 border-[#E5A823]'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title={item.label}
                >
                  <span className={`material-symbols-outlined ${active ? 'text-[#E5A823]' : 'text-slate-300'}`} style={{ fontSize: '20px' }}>
                    {item.iconName}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/15 space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-3 bg-[#C51D24] hover:bg-[#a3151b] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider cursor-pointer"
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

      {/* Contenido Principal con Barra Superior Limpia y Campanita de Notificaciones */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-16 bg-white border-b border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-extrabold text-[#003366] tracking-tight font-heading flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C51D24]"></span>
              {cleanHeaderTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Campanita de Notificaciones en la Barra Superior */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all relative flex items-center justify-center"
                title="Notificaciones de Derivaciones"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white animate-pulse">
                  3
                </span>
              </button>

              {/* Menú Desplegable de Notificaciones */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="p-3 bg-[#003366] text-white flex justify-between items-center border-b border-slate-800">
                    <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#E5A823]">notifications_active</span>
                      Notificaciones & Derivaciones
                    </h4>
                    <span className="text-[10px] font-mono bg-blue-600 px-2 py-0.5 rounded-full font-bold">3 Nuevas</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-64 overflow-auto text-xs">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => { setShowNotifications(false); navigate('/archivo/triaje'); }}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <strong className="text-slate-900 text-[11px] font-extrabold">{n.titulo}</strong>
                          <span className="text-[9px] text-slate-400 font-mono">{n.tiempo}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => { setShowNotifications(false); navigate('/archivo/triaje'); }}
                      className="text-[11px] font-bold text-[#003366] hover:underline"
                    >
                      Ver Bandeja de Triaje y Derivaciones ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="hidden sm:inline-flex px-3 py-1 bg-slate-100 border border-[#E2E8F0] text-[#1E293B] text-xs font-mono rounded-full items-center gap-2">
              <span className="material-symbols-outlined text-[#1B7A43]" style={{ fontSize: '16px' }}>verified_user</span>
              Operador Sistema UAGRM
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
