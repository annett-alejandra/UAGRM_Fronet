
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, User, FileCheck, QrCode, UploadCloud, CheckCircle2, Clock,
  FolderPlus, Folder, FileText, ShieldCheck, Sparkles, Download, RefreshCw,
  Lock, Layers, ArrowRight, Award, Check, Eye, Plus
} from 'lucide-react';

interface TitularCarpeta {
  id: string;
  nombreTitular: string;
  ci: string;
  ciCargado: boolean;
  cartaCargada: boolean;
  tituloCargado: boolean;
  ocrVerificado: boolean;
}

export function PortalSolicitantePage() {
  const navigate = useNavigate();
  const [modalidad, setModalidad] = useState<'INDIVIDUAL' | 'ENTIDAD_PUBLICA'>('INDIVIDUAL');
  const [stepIndividual, setStepIndividual] = useState<1 | 2 | 3 | 4>(1);
  const [nombreIndividual, setNombreIndividual] = useState('Juan Carlos Flores Pinto');
  const [ciIndividual, setCiIndividual] = useState('8392041-SC');
  const [celularIndividual, setCelularIndividual] = useState('78492019');
  const [emailIndividual, setEmailIndividual] = useState('j.flores@gmail.com');
  const [numeroSolicitud] = useState('SOL-2026-94821');
  const [ciStatus, setCiStatus] = useState<'empty' | 'scanning' | 'done'>('done');
  const [cartaStatus, setCartaStatus] = useState<'empty' | 'scanning' | 'done'>('done');
  const [tituloStatus, setTituloStatus] = useState<'empty' | 'scanning' | 'done'>('done');
  const [pagoRealizado, setPagoRealizado] = useState(false);
  const [entidadNombre, setEntidadNombre] = useState('Ministerio de Educación - Bolivia');
  const [numeroOficio, setNumeroOficio] = useState('OFIC-MINEDU-2026-0482');
  const [lotes, setLotes] = useState<TitularCarpeta[]>([
    { id: '1', nombreTitular: 'Pepito Pérez Justiniano', ci: '4920412 LP', ciCargado: true, cartaCargada: true, tituloCargado: true, ocrVerificado: true },
    { id: '2', nombreTitular: 'María Fernanda Cabrera Paz', ci: '8492012 SC', ciCargado: true, cartaCargada: true, tituloCargado: true, ocrVerificado: true },
    { id: '3', nombreTitular: 'Juan Pablo Gutiérrez Roca', ci: '6192840 CB', ciCargado: true, cartaCargada: true, tituloCargado: false, ocrVerificado: false }
  ]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCi, setNuevoCi] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loteEnviado, setLoteEnviado] = useState(false);

  const handleAgregarTitular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoCi) return;
    if (lotes.length >= 20) { alert('Ha alcanzado el límite máximo de 20 personas por Lote.'); return; }
    setLotes([...lotes, { id: String(Date.now()), nombreTitular: nuevoNombre, ci: nuevoCi, ciCargado: true, cartaCargada: true, tituloCargado: true, ocrVerificado: true }]);
    setNuevoNombre(''); setNuevoCi(''); setShowAddModal(false);
  };

  const simularOcrCarga = (tipo: 'ci' | 'carta' | 'titulo') => {
    if (tipo === 'ci') { setCiStatus('scanning'); setTimeout(() => setCiStatus('done'), 1200); }
    else if (tipo === 'carta') { setCartaStatus('scanning'); setTimeout(() => setCartaStatus('done'), 1400); }
    else { setTituloStatus('scanning'); setTimeout(() => setTituloStatus('done'), 1600); }
  };
  return (
    <div className="min-h-screen bg-[#001429] text-white font-sans flex flex-col selection:bg-amber-400 selection:text-slate-900">
      <header className="bg-[#001E3D] border-b border-slate-800 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold shadow-md border border-amber-300">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                UAGRM • Portal del Solicitante
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">Certificación & Autenticidad</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">Trámites en Línea de Títulos y Grados</p>
            </div>
          </div>
          <button onClick={() => navigate('/login')} className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer">
            <Lock className="w-3.5 h-3.5 text-amber-400" /><span>Portal Interno UAGRM</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />Plataforma Digital Institucional UAGRM
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Solicitud de Autenticación y Veracidad de Título</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">Seleccione el tipo de solicitante para iniciar la carga de documentos, validación por escaneo OCR y seguimiento en tiempo real.</p>
          <div className="pt-4 flex justify-center">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700 shadow-xl inline-flex gap-2">
              <button onClick={() => setModalidad('INDIVIDUAL')} className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${modalidad === 'INDIVIDUAL' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border border-blue-400/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <User className="w-4 h-4 text-amber-300" /><span>1. Solicitud Individual (Persona)</span><span className="ml-1 px-2 py-0.5 rounded-md text-[10px] bg-amber-400 text-slate-950 font-bold">Bs. 30</span>
              </button>
              <button onClick={() => setModalidad('ENTIDAD_PUBLICA')} className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${modalidad === 'ENTIDAD_PUBLICA' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Building2 className="w-4 h-4 text-emerald-300" /><span>2. Entidades Públicas (Convenio)</span><span className="ml-1 px-2 py-0.5 rounded-md text-[10px] bg-emerald-400 text-slate-950 font-bold">Bs. 0 • Lote 20</span>
              </button>
            </div>
          </div>
        </div>
        {modalidad === 'INDIVIDUAL' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-[#001E3D] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setStepIndividual(1)} className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${stepIndividual === 1 ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${stepIndividual === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</div>
                  <div><h4 className="text-xs font-bold">Datos Personales</h4><p className="text-[10px] text-slate-400 font-mono">Registro & Celular</p></div>
                </div>
                <div onClick={() => setStepIndividual(2)} className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${stepIndividual === 2 ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${stepIndividual === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</div>
                  <div><h4 className="text-xs font-bold">Documentos & OCR</h4><p className="text-[10px] text-slate-400 font-mono">CI, Carta & Título</p></div>
                </div>
                <div onClick={() => setStepIndividual(3)} className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${stepIndividual === 3 ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${stepIndividual === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</div>
                  <div><h4 className="text-xs font-bold">Pago QR Gaby</h4><p className="text-[10px] text-slate-400 font-mono">Arancel Bs. 30</p></div>
                </div>
                <div onClick={() => setStepIndividual(4)} className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${stepIndividual === 4 ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${stepIndividual === 4 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>4</div>
                  <div><h4 className="text-xs font-bold">Ticket & Seguimiento</h4><p className="text-[10px] text-slate-400 font-mono">N° de Solicitud</p></div>
                </div>
              </div>
            </div>

            {stepIndividual === 1 && (
              <div className="bg-[#001E3D] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div><h3 className="text-lg font-bold text-white flex items-center gap-2"><User className="w-5 h-5 text-amber-400" />Paso 1: Identificación del Solicitante</h3><p className="text-xs text-slate-300 mt-1">Ingrese sus datos de contacto exactos para asociar la solicitud institucional.</p></div>
                  <div className="text-right"><span className="text-[10px] font-mono text-slate-400 block uppercase">N° Solicitud Generado</span><span className="text-sm font-mono font-extrabold text-amber-400">{numeroSolicitud}</span></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre Completo del Solicitante / Titular</label><input type="text" value={nombreIndividual} onChange={(e) => setNombreIndividual(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold" /></div>
                  <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Carnet de Identidad (C.I.)</label><input type="text" value={ciIndividual} onChange={(e) => setCiIndividual(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-semibold" /></div>
                  <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Celular / WhatsApp (Notificaciones)</label><input type="text" value={celularIndividual} onChange={(e) => setCelularIndividual(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono" /></div>
                  <div><label className="block text-xs font-bold text-slate-300 mb-1.5">Correo Electrónico Personal</label><input type="email" value={emailIndividual} onChange={(e) => setEmailIndividual(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500 font-mono" /></div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={() => setStepIndividual(2)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"><span>Continuar a Carga Documental (Paso 2)</span><ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
            {stepIndividual === 2 && (
              <div className="bg-[#001E3D] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2"><UploadCloud className="w-5 h-5 text-amber-400" />Paso 2: Carga de Documentos Obligatorios & OCR Backend</h3>
                  <p className="text-xs text-slate-300 mt-1">Adjunte los tres requisitos en formato PDF o imagen escaneada. El motor OCR los analizará automáticamente.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-[#001429] rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400"><FileText className="w-5 h-5" /></div><div><h4 className="text-xs font-bold text-white">1. Carnet de Identidad (C.I.)</h4><p className="text-[11px] text-slate-400">Vigente, fotocopia legible anverso y reverso.</p></div></div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {ciStatus === 'scanning' ? (<span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 border border-amber-500/30"><RefreshCw className="w-3.5 h-3.5 animate-spin" />Escaneando OCR...</span>) : ciStatus === 'done' ? (<div className="flex items-center gap-2"><span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />Completado (OCR 99.2%)</span><button onClick={() => simularOcrCarga('ci')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs"><RefreshCw className="w-3.5 h-3.5" /></button></div>) : (<button onClick={() => simularOcrCarga('ci')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Subir C.I. PDF</button>)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#001429] rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400"><FileCheck className="w-5 h-5" /></div><div><h4 className="text-xs font-bold text-white">2. Carta Dirigida al Rector (3 Copias)</h4><p className="text-[11px] text-slate-400">Escaneado de la solicitud formal al Señor Rector de la UAGRM.</p></div></div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {cartaStatus === 'scanning' ? (<span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 border border-amber-500/30"><RefreshCw className="w-3.5 h-3.5 animate-spin" />Escaneando OCR...</span>) : cartaStatus === 'done' ? (<div className="flex items-center gap-2"><span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />Completado (OCR 98.6%)</span><button onClick={() => simularOcrCarga('carta')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs"><RefreshCw className="w-3.5 h-3.5" /></button></div>) : (<button onClick={() => simularOcrCarga('carta')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Subir Carta PDF</button>)}
                    </div>
                  </div>
                  <div className="p-4 bg-[#001429] rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400"><Award className="w-5 h-5" /></div><div><h4 className="text-xs font-bold text-white">3. Título Anverso y Reverso</h4><p className="text-[11px] text-slate-400">Diploma Académico o Título en Provisión Nacional digitalizado.</p></div></div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {tituloStatus === 'scanning' ? (<span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 border border-amber-500/30"><RefreshCw className="w-3.5 h-3.5 animate-spin" />Escaneando OCR...</span>) : tituloStatus === 'done' ? (<div className="flex items-center gap-2"><span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />Completado (OCR 99.8%)</span><button onClick={() => simularOcrCarga('titulo')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs"><RefreshCw className="w-3.5 h-3.5" /></button></div>) : (<button onClick={() => simularOcrCarga('titulo')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">Subir Título PDF</button>)}
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStepIndividual(1)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer">Atrás</button>
                  <button onClick={() => setStepIndividual(3)} disabled={ciStatus !== 'done' || cartaStatus !== 'done' || tituloStatus !== 'done'} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"><span>Ir a Pago QR Gaby (Paso 3)</span><ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
            {stepIndividual === 3 && (
              <div className="bg-[#001E3D] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 max-w-4xl mx-auto">
                <div className="border-b border-slate-800 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div><h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start"><QrCode className="w-5 h-5 text-amber-400" />Paso 3: Pago en Línea mediante QR Oficial (Portal Gaby - UAGRM)</h3><p className="text-xs text-slate-300 mt-1">Escanee el código QR dinámico desde la app de su banco o banca móvil.</p></div>
                  <div className="px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-xl text-amber-300 text-center"><span className="text-[10px] font-mono block uppercase">Arancel de Certificación</span><span className="text-xl font-extrabold font-mono">Bs. 30,00</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center space-y-4 border-4 border-amber-400 relative">
                    <div className="absolute top-3 left-3 bg-[#003366] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono">PORTAL GABY UAGRM</div>
                    <div className="w-48 h-48 bg-slate-100 rounded-xl p-3 border-2 border-dashed border-slate-300 flex items-center justify-center relative group">
                      {pagoRealizado ? (<div className="text-center space-y-2"><CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" /><span className="text-xs font-extrabold text-emerald-700 block">PAGO CONFIRMADO</span></div>) : (<div className="relative"><QrCode className="w-40 h-40 text-slate-900" /><div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center font-bold text-xs text-blue-900 font-mono">[QR DINÁMICO 30 BS]</div></div>)}
                    </div>
                    <div className="text-center"><span className="text-[11px] text-slate-600 font-mono block font-bold">Expiración de QR: 14:48 min</span><p className="text-[10px] text-slate-500">Generado automáticamente para N° Solicitud {numeroSolicitud}</p></div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#001429] rounded-xl border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" />Instrucciones de Verificación Instantánea</h4>
                      <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed font-sans"><li>Abra la app de su Entidad Financiera (Banca Móvil).</li><li>Escanee el código QR institucional por el monto de **Bs. 30**.</li><li>El sistema de la Universidad (**Portal Gaby**) confirmará el pago en tiempo real.</li></ol>
                    </div>
                    {!pagoRealizado ? (<button onClick={() => setPagoRealizado(true)} className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-emerald-400/30"><CheckCircle2 className="w-4 h-4 text-emerald-200" /><span>Simular Verificación de Pago en Portal Gaby</span></button>) : (<div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2"><Check className="w-4 h-4 text-emerald-400" />Pago Registrado Exitosamente en Pasarela UAGRM</div>)}
                  </div>
                </div>
                <div className="pt-4 flex justify-between">
                  <button onClick={() => setStepIndividual(2)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer">Atrás</button>
                  <button onClick={() => setStepIndividual(4)} disabled={!pagoRealizado} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"><span>Finalizar & Generar Ticket (Paso 4)</span><ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
            {stepIndividual === 4 && (
              <div className="bg-[#001E3D] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 max-w-3xl mx-auto text-center">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg"><CheckCircle2 className="w-8 h-8" /></div>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">¡Solicitud Registrada Exitosamente!</span>
                  <h3 className="text-2xl font-extrabold text-white">N° Solicitud: {numeroSolicitud}</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">Su trámite ha ingresado a la bandeja de derivaciones de **Títulos y Grados**. Puede descargar su comprobante oficial a continuación.</p>
                </div>
                <div className="bg-[#001224] p-5 rounded-2xl border border-slate-800 text-left space-y-3 font-mono text-xs max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400"><span>Titular:</span><span className="text-white font-bold">{nombreIndividual}</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400"><span>C.I.:</span><span className="text-white font-bold">{ciIndividual}</span></div>
                  <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400"><span>Arancel Pagado:</span><span className="text-emerald-400 font-bold">Bs. 30,00 (Gaby Confirmed)</span></div>
                  <div className="flex justify-between text-slate-400"><span>Estado Actual:</span><span className="text-amber-400 font-bold">EN TRIAGE / DERIVADO</span></div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => alert('Imprimiendo comprobante de solicitud...')} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"><Download className="w-4 h-4" /><span>Descargar Comprobante PDF/A4</span></button>
                  <button onClick={() => navigate('/titulos/dashboard-notificaciones')} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"><Eye className="w-4 h-4" /><span>Ver en Bandeja Institucional</span></button>
                </div>
              </div>
            )}
          </div>
        )}
        {modalidad === 'ENTIDAD_PUBLICA' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-emerald-950/80 via-[#001E3D] to-teal-950/80 p-6 sm:p-8 rounded-2xl border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Convenio Institucional Vigente UAGRM</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Emisión Masiva para Entidades Públicas</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">Las entidades públicas en convenio no pagan el arancel de Bs. 30. Las solicitudes se agrupan en **Lotes de máximo 20 personas** para asegurar la capacidad del sistema y evitar saturación.</p>
              </div>
              <div className="px-5 py-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-center shrink-0">
                <span className="text-[10px] font-mono text-slate-300 block uppercase">Costo por Solicitud</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">Bs. 0,00</span>
                <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">EXENTO POR CONVENIO</span>
              </div>
            </div>

            <div className="bg-[#001E3D] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2"><Building2 className="w-4 h-4 text-amber-400" />Datos de la Entidad Pública Solicitante</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Institución Pública / Convenio</label>
                  <select value={entidadNombre} onChange={(e) => setEntidadNombre(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold">
                    <option value="Ministerio de Educación - Bolivia">Ministerio de Educación - Bolivia</option>
                    <option value="Yacimientos Petrolíferos Fiscales Bolivianos (YPFB)">Yacimientos Petrolíferos Fiscales Bolivianos (YPFB)</option>
                    <option value="Poder Judicial - Tribunal Supremo de Justicia">Poder Judicial - Tribunal Supremo de Justicia</option>
                    <option value="Gobierno Autónomo Departamental de Santa Cruz">Gobierno Autónomo Departamental de Santa Cruz</option>
                    <option value="Contraloría General del Estado">Contraloría General del Estado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">N° de Oficio Institucional</label>
                  <input type="text" value={numeroOficio} onChange={(e) => setNumeroOficio(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold" />
                </div>
              </div>
            </div>
            <div className="bg-[#001E3D] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-400" />Lote Actual de Solicitudes (Máx. 20 Personas)</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">Lote N° 01/2026</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Cada titular cuenta con su propia **Carpeta Digital** con CI, Solicitud al Rector y Título.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="px-3.5 py-1.5 bg-[#001224] border border-slate-700 rounded-xl text-xs font-mono"><span className="text-slate-400">Cupo de Lote: </span><span className="font-extrabold text-amber-400">{lotes.length} / 20</span></div>
                  <button onClick={() => setShowAddModal(true)} disabled={lotes.length >= 20} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"><Plus className="w-4 h-4" /><span>Agregar Titular al Lote</span></button>
                </div>
              </div>
              <div className="space-y-3">
                {lotes.map((item, idx) => (
                  <div key={item.id} className="p-4 bg-[#001224] rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><Folder className="w-5 h-5 text-emerald-400" /></div>
                      <div>
                        <div className="flex items-center gap-2"><span className="text-[11px] font-mono font-bold text-amber-400">Carpeta N° {idx + 1}</span><h5 className="text-xs font-bold text-white uppercase">{item.nombreTitular}</h5></div>
                        <p className="text-[11px] text-slate-400 font-mono">C.I.: {item.ci}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${item.ciCargado ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>✓ CI</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${item.cartaCargada ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>✓ Carta Rector</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${item.tituloCargado ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>{item.tituloCargado ? '✓ Título Anverso/Reverso' : 'Pending Título'}</span>
                      {item.ocrVerificado ? (<span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" />Carpeta Completa OCR</span>) : (<span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">Incompleta</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-400"><span>Nota: Al presionar enviar, este **Lote de {lotes.length} carpetas** ingresará directamente a la bandeja de derivaciones institucionales.</span></div>
                <button onClick={() => setLoteEnviado(true)} disabled={loteEnviado} className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30 active:scale-95"><ShieldCheck className="w-4 h-4 text-emerald-200" /><span>{loteEnviado ? 'LOTE ENVIADO A TÍTULOS Y GRADOS ✓' : `Cerrar & Enviar Lote (${lotes.length}/20 Carpetas)`}</span></button>
              </div>
            </div>
          </div>
        )}
      </main>
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001E3D] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><FolderPlus className="w-4 h-4 text-emerald-400" />Nueva Carpeta de Titular (Lote 20)</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>
            <form onSubmit={handleAgregarTitular} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Nombre Completo del Titular</label><input type="text" placeholder="Ej: Carlos Eduardo Morales" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500" required /></div>
              <div><label className="block text-xs font-bold text-slate-300 mb-1">Carnet de Identidad (C.I.)</label><input type="text" placeholder="Ej: 4920412 LP" value={nuevoCi} onChange={(e) => setNuevoCi(e.target.value)} className="w-full bg-[#001224] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" required /></div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">Crear Carpeta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#000E1C] border-t border-slate-800/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} DTIC • Universidad Autónoma Gabriel René Moreno</p>
          <div className="flex items-center gap-4"><span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>OCR Backend Active • Pasarela QR Gaby Online</span><span>•</span><span>Santa Cruz, Bolivia</span></div>
        </div>
      </footer>
    </div>
  );
}
