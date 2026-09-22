import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SidebarNavWidget } from '../../widgets/SidebarNavWidget/SidebarNavWidget';
import { CertificadoAutenticidadPage } from './CertificadoAutenticidadPage';
import { BandejaPendientesPage } from './BandejaPendientesPage';
import { ReconstruccionExpedientePage } from './ReconstruccionExpedientePage';
import { BusquedaExpedientesArchivoPage } from './BusquedaExpedientesArchivoPage';
import { CargaExcelLibrosHistoricos } from './CargaExcelLibrosHistoricos';
import { SubidaDocumentos } from '../../features/subida-documentos/SubidaDocumentos';

export function ArchivoCentralLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', titulo: 'Nueva solicitud derivada de Títulos', desc: 'Trámite TR-88421 (Jenny Flores Peña) derivado a Archivo Central', tiempo: 'Hace 10 min', unread: true },
    { id: '2', titulo: 'Transferencia a Secretaría General', desc: 'Informe INF N° 0472 enviado a revisión de Secretaría', tiempo: 'Hace 45 min', unread: fontUnread('2') },
    { id: '3', titulo: 'Verificación OCR Completada', desc: 'Legajo Jurídicas #01 (2001) digitalizado al 100%', tiempo: 'Hace 2 horas', unread: false }
  ];

  function fontUnread(id: string) {
    return id === '1' || id === '2';
  }

  const isCurrentPath = (path: string) => location.pathname.includes(path);

  return (
    <SidebarNavWidget pageTitle="Archivo Central - UAGRM">
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* DASHBOARD EXECUTIVE HEADER: BANDEJA DE ENTRADA, CAMPANITA & DERIVACIONES */}
        <header className="bg-[#0F172A] text-white px-6 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 shrink-0 shadow-md">
          {/* Métricas e Indicadores de Entrada */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-xl">folder_special</span>
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Modulo Archivo Central</h2>
                <p className="text-[11px] font-mono text-emerald-400 font-bold">Unidad de Gestión & Digitalización UAGRM</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

            {/* Badges de Estado del Dashboard */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('triaje')}
                className="px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 rounded-xl border border-slate-700 text-left transition-all active:scale-95 group"
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Bandeja Entrada (Títulos):</span>
                <span className="text-xs font-mono font-bold text-amber-400 group-hover:underline">12 Pendientes</span>
              </button>

              <div className="px-3 py-1.5 bg-slate-800/90 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Derivados a Otras Unidades:</span>
                <span className="text-xs font-mono font-bold text-blue-400">8 En Transferencia</span>
              </div>
            </div>
          </div>

          {/* Campanita de Notificaciones y Perfil */}
          <div className="flex items-center gap-3 self-end md:self-auto relative">
            {/* Campanita de Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition-all relative active:scale-95 flex items-center justify-center"
                title="Notificaciones y Derivaciones"
              >
                <span className="material-symbols-outlined text-lg">notifications</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                  3
                </span>
              </button>

              {/* Menú Desplegable de la Campanita */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="p-3 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
                    <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-amber-400">notifications_active</span>
                      Notificaciones & Derivaciones
                    </h4>
                    <span className="text-[10px] font-mono bg-blue-600 px-2 py-0.5 rounded-full font-bold">3 Nuevas</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-64 overflow-auto text-xs">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                          n.unread ? 'bg-blue-50/50 font-medium' : ''
                        }`}
                        onClick={() => { setShowNotifications(false); navigate('triaje'); }}
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
                      onClick={() => { setShowNotifications(false); navigate('triaje'); }}
                      className="text-[11px] font-bold text-blue-700 hover:underline"
                    >
                      Ver todas las derivaciones e ingresos ➔
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right font-sans text-xs">
              <p className="font-extrabold text-white text-[11px]">Operador Archivo</p>
              <p className="text-[10px] text-emerald-400 font-mono font-bold">UAGRM Central</p>
            </div>
          </div>
        </header>

        {/* BARRA DE NAVEGACIÓN SECUNDARIA (PESTAÑAS DE ARCHIVO CENTRAL) */}
        <nav className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0 shadow-sm">
          <button
            onClick={() => navigate('autenticidad')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isCurrentPath('autenticidad')
                ? 'bg-[#003366] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            Certificado de Autenticidad
          </button>

          <button
            onClick={() => navigate('busqueda-expedientes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isCurrentPath('busqueda-expedientes')
                ? 'bg-[#003366] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            Libros Matrices (Jerárquicos)
          </button>

          <button
            onClick={() => navigate('subida-excel')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isCurrentPath('subida-excel')
                ? 'bg-[#003366] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">table_view</span>
            Subida por Excel (Libros Históricos)
          </button>

          <button
            onClick={() => navigate('triaje')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isCurrentPath('triaje')
                ? 'bg-[#003366] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-sm">move_to_inbox</span>
            Bandeja & Derivaciones
          </button>
        </nav>

        {/* VISTAS INTERNAS */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="autenticidad" replace />} />
            <Route path="autenticidad" element={<CertificadoAutenticidadPage />} />
            <Route path="busqueda-expedientes" element={<BusquedaExpedientesArchivoPage />} />
            <Route path="subida-excel" element={<CargaExcelLibrosHistoricos />} />
            <Route path="triaje" element={<BandejaPendientesPage />} />
            <Route path="subida" element={<SubidaDocumentos />} />
            <Route path="reconstruccion" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos" element={<ReconstruccionExpedientePage />} />
            <Route path="reconstruccion-legajos/:id" element={<ReconstruccionExpedientePage />} />
            <Route path="*" element={<Navigate to="autenticidad" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarNavWidget>
  );
}
