import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { titulosApi, type PlantillaTituloResponse } from './api/titulos-api';

export function EmisionPlantillas() {
  const [searchParams] = useSearchParams();
  const [plantillas, setPlantillas] = useState<PlantillaTituloResponse[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('SUPLETORIO');

  const [formData, setFormData] = useState({
    expediente_id: searchParams.get('expedienteId') || 'c9b1d830-4e2a-4a55-891d-90c74f51e041',
    nombre: searchParams.get('nombre') || 'JUAN CARLOS PÉREZ GÓMEZ',
    ci: searchParams.get('ci') || '1234567',
    numero_libro: '42',
    tomo: 'II',
    folio: '105',
    observaciones: 'Verificado expediente académico completo.'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    titulosApi.getPlantillas().then(data => {
      if (isMounted) setPlantillas(data);
    });
    return () => { isMounted = false; };
  }, []);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await titulosApi.guardarBorrador({
        expediente_id: formData.expediente_id,
        tipo_plantilla: plantillaSeleccionada,
        numero_libro: formData.numero_libro,
        tomo: formData.tomo,
        folio: formData.folio,
        observaciones: formData.observaciones
      });
      setSavedSuccess(res.mensaje);
      setTimeout(() => setSavedSuccess(null), 4000);
    } catch {
      /* handled */
    } finally {
      setSaving(false);
    }
  };

  const handlePrintFinal = async () => {
    try {
      const blob = await titulosApi.generarPdf('t8888888-9999-0000-1111-222233334444');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      window.print();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Selector */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Módulo de Emisión y Plantillas (5 Tipos)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Endpoints: <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-blue-600">GET /api/v1/titulos/plantillas/</code> | <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded font-mono text-emerald-600">POST /api/v1/titulos/guardar-borrador/</code>
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="w-full md:w-auto">
          <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Seleccionar Tipo de Plantilla
          </label>
          <select
            value={plantillaSeleccionada}
            onChange={e => setPlantillaSeleccionada(e.target.value)}
            className="w-full md:w-72 px-4 py-2.5 rounded-lg border-2 border-blue-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {plantillas.map(p => (
              <option key={p.codigo} value={p.codigo}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-800 dark:text-emerald-200 font-bold text-sm animate-in fade-in">
          ✓ {savedSuccess}
        </div>
      )}

      {/* Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
              Parámetros de Guardado & Emisión
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Estudiante</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Carnet de Identidad (CI)</label>
                <input
                  type="text"
                  value={formData.ci}
                  onChange={e => setFormData({ ...formData, ci: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nro. Libro</label>
                  <input
                    type="text"
                    value={formData.numero_libro}
                    onChange={e => setFormData({ ...formData, numero_libro: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm font-bold text-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tomo</label>
                  <input
                    type="text"
                    value={formData.tomo}
                    onChange={e => setFormData({ ...formData, tomo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Folio</label>
                  <input
                    type="text"
                    value={formData.folio}
                    onChange={e => setFormData({ ...formData, folio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Observaciones de Emisión</label>
                <textarea
                  rows={3}
                  value={formData.observaciones}
                  onChange={e => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Live A4 Rendered Preview */}
        <div className="lg:col-span-7 bg-slate-200 dark:bg-slate-950 p-6 rounded-xl border border-slate-300 dark:border-slate-800 flex justify-center items-start overflow-auto shadow-inner min-h-[650px]">
          <div className="w-[190mm] min-h-[270mm] bg-white shadow-2xl p-[3rem] text-slate-900 shrink-0 relative flex flex-col justify-between">
            <div>
              <div className="absolute top-0 left-0 w-full h-3 bg-red-700"></div>
              <div className="absolute top-3 left-0 w-full h-1 bg-blue-900"></div>

              <div className="text-center mt-6 mb-10">
                <h1 className="text-lg font-bold font-serif uppercase tracking-wide">UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"</h1>
                <p className="text-[10px] font-serif uppercase text-slate-500 mt-0.5">República de Bolivia • Santa Cruz de la Sierra</p>
                <div className="w-20 h-0.5 bg-slate-800 mx-auto my-3"></div>
                <h2 className="text-base font-bold font-serif tracking-widest text-slate-900 uppercase mt-2">
                  {plantillas.find(p => p.codigo === plantillaSeleccionada)?.nombre.toUpperCase() || 'TÍTULO SUPLETORIO'}
                </h2>
              </div>

              <div className="text-justify leading-relaxed text-xs font-serif space-y-4">
                <p>
                  Por cuanto el ciudadano <strong>{formData.nombre}</strong>, con Carnet de Identidad N° <strong>{formData.ci}</strong>, ha cumplido con todos los requisitos exigidos por el Estatuto Orgánico de la Universidad Autónoma "Gabriel René Moreno".
                </p>

                <p>
                  Por tanto, habiéndose verificado el expediente en Libro N° <strong>{formData.numero_libro}</strong>, Tomo <strong>{formData.tomo}</strong>, Folio <strong>{formData.folio}</strong>, se le concede el presente <strong>{plantillas.find(p => p.codigo === plantillaSeleccionada)?.nombre}</strong>.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center pt-8 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto text-[10px] font-serif font-bold">
                <div className="border-t border-slate-900 pt-1">
                  FIRMA Y SELLO<br />
                  <span className="font-normal text-[9px] text-slate-500">Rector UAGRM</span>
                </div>
                <div className="border-t border-slate-900 pt-1">
                  FIRMA Y SELLO<br />
                  <span className="font-normal text-[9px] text-slate-500">Secretario General</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botonera Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-30 shadow-2xl flex justify-between items-center px-8">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Plantilla activa: <strong className="text-slate-900 dark:text-white">{plantillas.find(p => p.codigo === plantillaSeleccionada)?.nombre}</strong>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2"
          >
            💾 {saving ? 'Guardando Borrador...' : 'Guardar Borrador'}
          </button>
          
          <button
            onClick={handlePrintFinal}
            className="px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 transform active:scale-95"
          >
            🖨️ Imprimir Título Definitivo (WeasyPrint PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
