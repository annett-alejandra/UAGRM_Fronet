import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Printer,
  FileCheck,
  Award,
  Sparkles,
  Download,
  CheckCircle2,
  Edit3,
  Layers,
  FileText
} from 'lucide-react';
import { CertificadoTituloTipo1 } from '../../modules/titulos/templates/CertificadoTituloTipo1';
import { CertificadoTituloTipo2 } from '../../modules/titulos/templates/CertificadoTituloTipo2';
import { CertificadoTituloTipo3 } from '../../modules/titulos/templates/CertificadoTituloTipo3';
import { CertificadoTituloTipo4 } from '../../modules/titulos/templates/CertificadoTituloTipo4';

export function EmisionPlantillasTitulosPage() {
  const [tipoPlantilla, setTipoPlantilla] = useState<1 | 2 | 3 | 4>(1);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Form State para actualizar la plantilla en vivo
  const [nombreTitular, setNombreTitular] = useState('GUALBERTO MEDINA VARGAS');
  const [cui, setCui] = useState('8072900-SCZ');
  const [nroTitulo, setNroTitulo] = useState('TIT-96071');
  const [carrera, setCarrera] = useState('MEDICINA HUMANA');
  const [gestion, setGestion] = useState('1995');

  const datosTemplate = {
    nombreTitular,
    cui,
    nroTitulo,
    carrera,
    gestion,
    fechaEmision: '24 de Septiembre de 2026',
    autoridadFirma: 'Dr. Manfredo Menacho • Vicerrector UAGRM'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-7xl mx-auto font-sans"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#003366] to-[#002244] text-[#E5A823] rounded-2xl shadow-md">
            <Printer className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-[#003366] border border-blue-200">
                Títulos y Grados • Opción 4
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Emisión & Plantillas A4 Oficiales de Títulos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Seleccione entre los 4 tipos de plantilla oficial, edite los datos y genere la impresión.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPrintModal(true)}
          className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Exportar PDF</span>
        </button>
      </div>

      {/* SELECCIÓN DE LAS 4 PLANTILLAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setTipoPlantilla(1)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            tipoPlantilla === 1
              ? 'bg-blue-50/90 border-[#003366] ring-2 ring-[#003366]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-[#003366] bg-blue-100 px-2 py-0.5 rounded">TIPO 01</span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Certificado Título Supletorio</h4>
          <p className="text-[11px] text-slate-500 mt-1">Formato Oficial A4 con QR de validación.</p>
        </button>

        <button
          onClick={() => setTipoPlantilla(2)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            tipoPlantilla === 2
              ? 'bg-blue-50/90 border-[#003366] ring-2 ring-[#003366]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-[#003366] bg-blue-100 px-2 py-0.5 rounded">TIPO 02</span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Certificación de Veracidad</h4>
          <p className="text-[11px] text-slate-500 mt-1">Dictamen con membrete para Entidades.</p>
        </button>

        <button
          onClick={() => setTipoPlantilla(3)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            tipoPlantilla === 3
              ? 'bg-blue-50/90 border-[#003366] ring-2 ring-[#003366]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-[#003366] bg-blue-100 px-2 py-0.5 rounded">TIPO 03</span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Dictamen de Autenticidad</h4>
          <p className="text-[11px] text-slate-500 mt-1">Informe histórico de folios y tomos.</p>
        </button>

        <button
          onClick={() => setTipoPlantilla(4)}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            tipoPlantilla === 4
              ? 'bg-blue-50/90 border-[#003366] ring-2 ring-[#003366]/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-mono font-bold text-[#003366] bg-blue-100 px-2 py-0.5 rounded">TIPO 04</span>
          <h4 className="text-xs font-bold text-slate-900 mt-2">Certificación Académica</h4>
          <p className="text-[11px] text-slate-500 mt-1">Constancia de registro universitario.</p>
        </button>
      </div>

      {/* VISTA DIVIDIDA: FORMULARIO EDICIÓN EN VIVO + PREVISUALIZACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* COLUMNA IZQUIERDA: FORMULARIO EN VIVO */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#003366]" />
            Editar Datos de la Plantilla
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nombre Completo Titular</label>
              <input
                type="text"
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CUI / C.I.</label>
              <input
                type="text"
                value={cui}
                onChange={(e) => setCui(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Número de Título / Diploma</label>
              <input
                type="text"
                value={nroTitulo}
                onChange={(e) => setNroTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold text-[#003366] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Carrera / Titulación</label>
              <input
                type="text"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Gestión Académica</label>
              <input
                type="text"
                value={gestion}
                onChange={(e) => setGestion(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PREVISUALIZACIÓN DE LA PLANTILLA OFICIAL */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Previsualización Formato A4 Oficial (Plantilla Tipo {tipoPlantilla})
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              210 x 297 mm
            </span>
          </div>

          <div className="bg-slate-100 rounded-2xl p-4 overflow-auto min-h-[500px] flex items-center justify-center">
            {tipoPlantilla === 1 && <CertificadoTituloTipo1 datos={datosTemplate} />}
            {tipoPlantilla === 2 && <CertificadoTituloTipo2 datos={datosTemplate} />}
            {tipoPlantilla === 3 && <CertificadoTituloTipo3 datos={datosTemplate} />}
            {tipoPlantilla === 4 && <CertificadoTituloTipo4 datos={datosTemplate} />}
          </div>
        </div>

      </div>

      {/* MODAL IMPRESIÓN */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Imprimir Documento Oficial (Tipo {tipoPlantilla})
              </h3>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                El documento está listo para ser enviado a la impresora matricial u oficial de UAGRM con código QR de verificación firmado digitalmente.
              </p>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1 font-mono">
                <p><span className="font-bold text-slate-700 font-sans">Documento:</span> Plantilla Tipo {tipoPlantilla}</p>
                <p><span className="font-bold text-slate-700 font-sans">Titular:</span> {nombreTitular}</p>
                <p><span className="font-bold text-slate-700 font-sans">Código QR:</span> Generado OK</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(false);
                    window.print();
                  }}
                  className="flex-1 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ahora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
