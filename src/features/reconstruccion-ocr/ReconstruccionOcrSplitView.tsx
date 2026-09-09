import { useState } from 'react';

export function ReconstruccionOcrSplitView() {
  const [datosEditados, setDatosEditados] = useState({
    ci: '1234S67', // Con posible error OCR
    ru: '219084732',
    nombre: 'JUAN PÉREZ GARCÍA',
    carrera: 'INGENIERÍA INFORMÁTICA',
    facultad: 'FACULTAD DE CIENCIAS DE LA COMPUTACIÓN Y TELECOMUNICACIONES',
    libro: 'L-45',
    tomo: 'T-02',
    folio: 'F-128',
    gestion: '1999',
    pagina: '44',
    tipoDocumento: 'Título Supletorio'
  });

  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500 pb-8">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Validación y Reconstrucción OCR</span>
            <span className="text-xs px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-semibold rounded-full">
              Revisión de IA Requerida
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Verifique los datos extraídos de la Matriz de Archivo antes de consolidar en la Base de Datos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors">
            Consolidar y Guardar Expediente
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-200">
          ✓ Datos del expediente validados y guardados exitosamente.
        </div>
      )}

      {/* Split View Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* PDF Viewer Mock */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-inner">
          <div className="bg-slate-800 p-3 text-slate-300 text-xs font-semibold flex justify-between items-center border-b border-slate-700">
            <span>Visor PDF Original - Documento Digitalizado</span>
            <span className="font-mono bg-slate-700 px-2 py-0.5 rounded">Expediente_1999_L45.pdf</span>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-700 m-4 rounded-lg bg-slate-950/50">
            <div className="w-16 h-20 border-2 border-slate-500 rounded p-2 mb-3 flex flex-col justify-between">
              <div className="w-full h-2 bg-slate-600 rounded"></div>
              <div className="w-3/4 h-1.5 bg-slate-700 rounded"></div>
              <div className="w-full h-1.5 bg-slate-700 rounded"></div>
            </div>
            <p className="text-sm font-bold text-slate-300">Documento de Matriz de Archivo (UAGRM)</p>
            <p className="text-xs text-slate-500 mt-1">Escaneo de alta resolución (300 DPI)</p>
          </div>
        </div>

        {/* Panel de Formulario OCR Extraido */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-3 font-bold text-sm flex justify-between items-center">
            <span>Ficha Extraída por IA / OCR</span>
            <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono">Confianza: 92%</span>
          </div>

          <div className="p-6 flex-1 overflow-auto space-y-6">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg text-xs text-amber-800 dark:text-amber-200">
              Corrija cualquier error detectado en la digitalización física de Libro, Tomo, Folio o Datos del Estudiante.
            </div>

            {/* Datos Academicos */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1">
                Datos del Estudiante
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Carnet de Identidad (CI)</label>
                  <input
                    type="text"
                    value={datosEditados.ci}
                    onChange={e => setDatosEditados({...datosEditados, ci: e.target.value})}
                    className="w-full p-2.5 rounded-lg border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none text-sm font-semibold"
                  />
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">Verifique el caracter "S"</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Registro Univ. (RU)</label>
                  <input
                    type="text"
                    value={datosEditados.ru}
                    onChange={e => setDatosEditados({...datosEditados, ru: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={datosEditados.nombre}
                  onChange={e => setDatosEditados({...datosEditados, nombre: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Carrera</label>
                  <input
                    type="text"
                    value={datosEditados.carrera}
                    onChange={e => setDatosEditados({...datosEditados, carrera: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Facultad</label>
                  <input
                    type="text"
                    value={datosEditados.facultad}
                    onChange={e => setDatosEditados({...datosEditados, facultad: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Datos de Libro */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-1">
                Datos de Registro de Libro (Matriz)
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nro. Libro</label>
                  <input
                    type="text"
                    value={datosEditados.libro}
                    onChange={e => setDatosEditados({...datosEditados, libro: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-mono text-sm font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nro. Tomo</label>
                  <input
                    type="text"
                    value={datosEditados.tomo}
                    onChange={e => setDatosEditados({...datosEditados, tomo: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-mono text-sm font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nro. Folio</label>
                  <input
                    type="text"
                    value={datosEditados.folio}
                    onChange={e => setDatosEditados({...datosEditados, folio: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-mono text-sm font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gestión</label>
                  <input
                    type="text"
                    value={datosEditados.gestion}
                    onChange={e => setDatosEditados({...datosEditados, gestion: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Página</label>
                  <input
                    type="text"
                    value={datosEditados.pagina}
                    onChange={e => setDatosEditados({...datosEditados, pagina: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Confirmar Consolidación de Registro</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              ¿Desea validar y guardar el registro de Libro <strong>{datosEditados.libro}</strong>, Tomo <strong>{datosEditados.tomo}</strong>, Folio <strong>{datosEditados.folio}</strong> para el estudiante <strong>{datosEditados.nombre}</strong> en el sistema Postgres de Archivo Central?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">Cancelar</button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setSaved(true);
                }} 
                className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                Sí, Guardar en Archivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
