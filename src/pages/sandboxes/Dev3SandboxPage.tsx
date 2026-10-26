import { useState } from 'react';
import { ArrowLeft, ShieldCheck, KeyRound, Award, BookOpen, Layers, Inbox, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SecretariaGeneral from '@/pages/secretaria/views/SecretariaGeneral';
import DashboardTitulos from '@/pages/titulos/views/DashboardTitulos';
import LotesInstitucionales from '@/pages/titulos/views/LotesInstitucionales';
import BandejaEntrada from '@/pages/titulos/views/BandejaEntrada';
import ConvalidacionEspejo from '@/pages/titulos/views/ConvalidacionEspejo';
import BovedaHistorica from '@/pages/titulos/views/BovedaHistorica';

export function Dev3SandboxPage() {
  const [vistaActiva, setVistaActiva] = useState<'secretaria' | 'titulos-dash' | 'titulos-lotes' | 'archivo-bandeja' | 'archivo-conval' | 'archivo-boveda'>('secretaria');
  const navigate = useNavigate();

  const pestanas = [
    {
      id: 'secretaria' as const,
      titulo: 'Secretaría General & Doble Auth',
      badge: 'NUEVO (cb98520)',
      icono: KeyRound,
      descripcion: 'Bandeja administrativa con autorización y modal de doble factor (CountdownTimer)',
    },
    {
      id: 'titulos-dash' as const,
      titulo: 'Dashboard Títulos',
      badge: 'DEV 3',
      icono: Award,
      descripcion: 'Métricas de emisión y estado de títulos',
    },
    {
      id: 'titulos-lotes' as const,
      titulo: 'Lotes Institucionales',
      badge: 'DEV 3',
      icono: Layers,
      descripcion: 'Control y auditoría de lotes masivos',
    },
    {
      id: 'archivo-bandeja' as const,
      titulo: 'Bandeja Archivo',
      badge: 'DEV 3',
      icono: Inbox,
      descripcion: 'Ingreso documental y triaje',
    },
    {
      id: 'archivo-conval' as const,
      titulo: 'Convalidación Espejo',
      badge: 'DEV 3',
      icono: Scale,
      descripcion: 'Estación de comparación y cotejo espejo',
    },
    {
      id: 'archivo-boveda' as const,
      titulo: 'Bóveda Histórica',
      badge: 'DEV 3',
      icono: BookOpen,
      descripcion: 'Libros y legajos históricos resguardados',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Banner superior de entorno aislado DEV 3 */}
      <div className="bg-blue-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-blue-300 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
            Sandbox Aislado DEV 3
          </span>
          <span>
            Visualizando cambios de la rama <strong>origin/juan-pablo</strong> (Secretaría General, Doble Autenticación y Módulos Dev 3).
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={14} /> Volver al Sistema Principal
        </button>
      </div>

      {/* Header Institucional de DEV 3 */}
      <header className="bg-[#191A2D] text-white px-8 py-4 border-b-4 border-blue-500 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-blue-500 text-white rounded-lg p-2 flex items-center justify-center font-bold text-lg shadow">
              JP
            </div>
            <div>
              <div className="text-xs tracking-wider text-blue-400 font-bold uppercase">
                UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Entorno Aislado DEV 3 — Rama Juan Pablo
              </h1>
              <span className="text-xs text-slate-300">
                Última actualización: Secretaría General con Doble Factor de Autenticación & CountdownTimer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2 rounded-lg border border-white/20">
            <ShieldCheck size={20} className="text-blue-400" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">
                Módulo Aislado: DEV 3
              </div>
              <div className="text-[11px] text-slate-300">
                Branch: <strong className="text-blue-300">origin/juan-pablo</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegación por pestañas */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 overflow-x-auto">
          {pestanas.map((p) => {
            const activa = vistaActiva === p.id;
            const Icono = p.icono;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setVistaActiva(p.id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  activa
                    ? 'border-blue-600 text-blue-700 bg-blue-50/60'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icono size={16} className={activa ? 'text-blue-600' : 'text-slate-400'} />
                <span>{p.titulo}</span>
                {p.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    p.badge.includes('NUEVO')
                      ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                      : activa ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenedor de la Vista Activa */}
      <main className="max-w-7xl mx-auto p-6 flex-1 w-full">
        {vistaActiva === 'secretaria' && <SecretariaGeneral />}
        {vistaActiva === 'titulos-dash' && <DashboardTitulos />}
        {vistaActiva === 'titulos-lotes' && <LotesInstitucionales />}
        {vistaActiva === 'archivo-bandeja' && <BandejaEntrada />}
        {vistaActiva === 'archivo-conval' && <ConvalidacionEspejo />}
        {vistaActiva === 'archivo-boveda' && <BovedaHistorica />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-12">
        <p className="font-semibold text-slate-700 mb-1">
          Universidad Autónoma Gabriel René Moreno &bull; Entorno de Inspección Aislado DEV 3
        </p>
        <p className="text-[11px] text-slate-400">
          Archivos integrados bajo arquitectura institucional FSD
        </p>
      </footer>
    </div>
  );
}

export default Dev3SandboxPage;
