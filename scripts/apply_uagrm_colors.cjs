// scripts/apply_uagrm_colors.cjs
const fs = require('fs');

// 1. DashboardNotificacionesTitulosPage.tsx
const titulosPage = 'src/pages/titulos/DashboardNotificacionesTitulosPage.tsx';
if (fs.existsSync(titulosPage)) {
  let content = fs.readFileSync(titulosPage, 'utf8');
  content = content
    .replace(/bg-blue-50\/90 border-\[#191A7D\]/g, 'bg-[#DAEFFE]/40 border-[#191A7D]')
    .replace(/bg-blue-100 text-\[#191A7D\]/g, 'bg-[#DAEFFE] text-[#191A7D]')
    .replace(/bg-indigo-50\/90 border-indigo-600 ring-2 ring-indigo-600\/20/g, 'bg-[#DAEFFE]/40 border-[#2B6CB0] ring-2 ring-[#2B6CB0]/20')
    .replace(/w-1\.5 h-full bg-indigo-600/g, 'w-1.5 h-full bg-[#2B6CB0]')
    .replace(/text-indigo-700/g, 'text-[#2B6CB0]')
    .replace(/bg-indigo-100/g, 'bg-[#DAEFFE]')
    .replace(/bg-indigo-50 text-\[#2B6CB0\] border border-indigo-200/g, 'bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60')
    .replace(/<Building2 className="w-3 h-3" \/> Archivo Central/g, '<Building2 className="w-3 h-3 text-[#191A7D]" /> Archivo Central')
    .replace(/bg-purple-50 text-purple-800 border-purple-200/g, 'bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60');
  fs.writeFileSync(titulosPage, content, 'utf8');
  console.log('Updated:', titulosPage);
}

// 2. DashboardNotificacionesPage.tsx (Archivo Central)
const archivoPage = 'src/pages/archivo-central/DashboardNotificacionesPage.tsx';
if (fs.existsSync(archivoPage)) {
  let content = fs.readFileSync(archivoPage, 'utf8');
  content = content
    .replace(/bg-blue-50\/90 border-\[#191A7D\]/g, 'bg-[#DAEFFE]/40 border-[#191A7D]')
    .replace(/bg-blue-100 text-\[#191A7D\]/g, 'bg-[#DAEFFE] text-[#191A7D]')
    .replace(/bg-indigo-50\/90 border-indigo-600 ring-2 ring-indigo-600\/20/g, 'bg-[#DAEFFE]/40 border-[#2B6CB0] ring-2 ring-[#2B6CB0]/20')
    .replace(/w-1\.5 h-full bg-indigo-600/g, 'w-1.5 h-full bg-[#2B6CB0]')
    .replace(/text-indigo-700/g, 'text-[#2B6CB0]')
    .replace(/bg-indigo-100/g, 'bg-[#DAEFFE]')
    .replace(/bg-indigo-50 text-\[#2B6CB0\] border border-indigo-200/g, 'bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60');
  fs.writeFileSync(archivoPage, content, 'utf8');
  console.log('Updated:', archivoPage);
}

// 3. VerLibrosPorTomoPage.tsx
const librosPage = 'src/pages/archivo-central/VerLibrosPorTomoPage.tsx';
if (fs.existsSync(librosPage)) {
  let content = fs.readFileSync(librosPage, 'utf8');
  content = content
    .replace(/text-indigo-700 bg-indigo-50 px-2 py-0\.5 rounded border border-indigo-200/g, 'text-[#191A7D] bg-[#DAEFFE] px-2 py-0.5 rounded border border-[#85BDEF]/60');
  fs.writeFileSync(librosPage, content, 'utf8');
  console.log('Updated:', librosPage);
}

// 4. BusquedaExpedientesArchivoPage.tsx
const busquedaPage = 'src/pages/archivo-central/BusquedaExpedientesArchivoPage.tsx';
if (fs.existsSync(busquedaPage)) {
  let content = fs.readFileSync(busquedaPage, 'utf8');
  content = content
    .replace(/border-indigo-600 bg-indigo-50\/70 shadow-xs ring-1 ring-indigo-600/g, 'border-[#2B6CB0] bg-[#DAEFFE]/30 shadow-xs ring-1 ring-[#2B6CB0]')
    .replace(/bg-indigo-600 text-white/g, 'bg-[#2B6CB0] text-white')
    .replace(/text-indigo-950/g, 'text-[#191A7D]')
    .replace(/bg-indigo-100 text-indigo-700/g, 'bg-[#DAEFFE] text-[#2B6CB0]')
    .replace(/bg-indigo-50 text-indigo-700 border border-indigo-200/g, 'bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60')
    .replace(/bg-indigo-600\"><\/span>/g, 'bg-[#191A7D]"></span>');
  fs.writeFileSync(busquedaPage, content, 'utf8');
  console.log('Updated:', busquedaPage);
}
