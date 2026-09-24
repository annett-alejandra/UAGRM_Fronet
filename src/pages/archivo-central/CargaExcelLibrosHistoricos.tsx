import { useState } from 'react';
import { ocrApi } from '../../features/flujo-ocr/api/ocr-api';

interface RegistroDobleConvalidacion {
  id: string;
  nroCorrelativo: string;
  detectadoNombre: string;
  detectadoCi: string;
  bdNombre: string;
  bdCi: string;
  coincidenciaExacta: boolean;
  estadoValidacion: 'COINCIDENCIA_EXACTA' | 'INCONSISTENCIA_NOMBRE' | 'DISCREPANCIA_CI' | 'EDITADO_MANUALMENTE';
}

export function CargaExcelLibrosHistoricos() {
  const [gestion, setGestion] = useState('2001');
  const [carrera, setCarrera] = useState('LIC. EN CIENCIAS JURÍDICAS');
  const [tomoLegajo, setTomoLegajo] = useState('LEGAJO # 01');
  const [rangoInicial, setRangoInicial] = useState('03399');
  const [rangoFinal, setRangoFinal] = useState('03010');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [, setFileName] = useState<string | null>(null);

  // Modal de Edición Directa
  const [editingRow, setEditingRow] = useState<RegistroDobleConvalidacion | null>(null);

  // Registros de Doble Convalidación con MARÍA S. ALPIRI LLANOS como ejemplo explícito
  const [registros, setRegistros] = useState<RegistroDobleConvalidacion[]>([
    {
      id: '1',
      nroCorrelativo: '03399',
      detectadoNombre: 'MARÍA S. ALPIRI LLANOS',
      detectadoCi: '4589214-SCZ',
      bdNombre: 'MARÍA S. ALPIRI LLANOS',
      bdCi: '4589214-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '2',
      nroCorrelativo: '03398',
      detectadoNombre: 'LILIANA I. NAVARRO PAZ',
      detectadoCi: '3892102-SCZ',
      bdNombre: 'LILIANA I. NAVARRO PAZ',
      bdCi: '3892102-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '3',
      nroCorrelativo: '03393',
      detectadoNombre: 'HERIBERTO ORELLANA VILLANUEVA',
      detectadoCi: '2981044-CB',
      bdNombre: 'HERIBERTO ORELLANA V.',
      bdCi: '2981044-CB',
      coincidenciaExacta: false,
      estadoValidacion: 'INCONSISTENCIA_NOMBRE'
    },
    {
      id: '4',
      nroCorrelativo: '03389',
      detectadoNombre: 'MIGUEL A. BARRIOS MONJE',
      detectadoCi: '5019231-SCZ',
      bdNombre: 'MIGUEL A. BARRIOS MONJE',
      bdCi: '5019231-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '5',
      nroCorrelativo: '03384',
      detectadoNombre: 'JUANA R. ESCALANTE FARFAN',
      detectadoCi: '3109283-TJ',
      bdNombre: 'JUANA R. ESCALANTE FARFAN',
      bdCi: '3109283-TJ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    }
  ]);

  const handleSubirArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      await ocrApi.registrarDocumento({
        department_id: 'archivo-central',
        title: `Planilla / Foto OCR Libros Históricos - ${gestion}`,
        description: `Doble Convalidación Visual para ${carrera} - ${tomoLegajo}`,
        object_key: `historicos/${gestion}/${file.name}`,
        content_type: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        file_size_bytes: file.size
      });
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmarYGuardar = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      alert(`¡Doble Convalidación completada! El Libro Matriz Histórico (${carrera} - ${tomoLegajo}) ha sido guardado exitosamente.`);
    }, 600);
  };

  const handleManualApprove = (id: string) => {
    setRegistros(prev => prev.map(r => r.id === id ? { ...r, coincidenciaExacta: true, estadoValidacion: 'COINCIDENCIA_EXACTA', bdNombre: r.detectadoNombre } : r));
  };

  const handleOpenEditModal = (r: RegistroDobleConvalidacion) => {
    setEditingRow({ ...r });
  };

  const handleSaveEditedRow = () => {
    if (!editingRow) return;
    setRegistros(prev => prev.map(r => r.id === editingRow.id ? {
      ...editingRow,
      coincidenciaExacta: true,
      estadoValidacion: 'EDITADO_MANUALMENTE'
    } : r));
    setEditingRow(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto bg-white min-h-screen font-sans">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-bold border border-emerald-200 shrink-0">
            <span className="material-symbols-outlined text-2xl">sync_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Opción 6 – Subida por Excel / Foto OCR (Libros Históricos)
            </div>
            <h2 className="text-xl font-extrabold text-[#003366] tracking-tight">
              Visor Espejo de Doble Convalidación y Edición Directa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Organizado por Gestión Anual y Libro Matriz. Permite comparar, editar celdas (ej. S por 5) y aprobar registros manualmente.
            </p>
          </div>
        </div>

        <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">upload_file</span>
          <span>{isProcessing ? 'Procesando OCR/Excel...' : 'Subir Archivo Excel / Foto OCR'}</span>
          <input
            type="file"
            accept=".xlsx, .xls, .csv, image/*, .pdf"
            onChange={handleSubirArchivo}
            className="hidden"
          />
        </label>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#003366] flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-amber-600">collections_bookmark</span>
          Asignación a Gestión Anual & Tomo / Libro Matriz
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gestión / Año:</label>
            <input
              type="text"
              value={gestion}
              onChange={(e) => setGestion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 2001"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Carrera / Programa:</label>
            <input
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-[#003366] focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="Ej. LIC. EN CIENCIAS JURÍDICAS"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Identificador Legajo / Tomo:</label>
            <input
              type="text"
              value={tomoLegajo}
              onChange={(e) => setTomoLegajo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="Ej. LEGAJO # 01"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rango Correlativo (Del / Al):</label>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={rangoInicial}
                onChange={(e) => setRangoInicial(e.target.value)}
                className="w-1/2 px-2 py-2 border border-slate-300 rounded-xl font-mono text-xs text-center font-bold"
                placeholder="03399"
              />
              <span className="text-xs text-slate-400 font-bold">-</span>
              <input
                type="text"
                value={rangoFinal}
                onChange={(e) => setRangoFinal(e.target.value)}
                className="w-1/2 px-2 py-2 border border-slate-300 rounded-xl font-mono text-xs text-center font-bold"
                placeholder="03010"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#003366] flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">compare</span>
              Visor Espejo: Columna A (Dato Detectado en Foto/Excel) VS. Columna B (Base de Datos)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verdes: Coincidencia 100% | Ámbar/Rojo: Requiere edición o aprobación del operador.
            </p>
          </div>

          <button
            onClick={handleConfirmarYGuardar}
            disabled={isSaved || isProcessing}
            className="px-6 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">verified_user</span>
            {isSaved ? 'Guardando Convalidación...' : 'Confirmar & Guardar Convalidación'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-28">N° Correlativo</th>
                <th className="p-3.5 bg-blue-50/60 border-l border-blue-200 text-blue-900">
                  COLUMNA A: Dato Detectado (Excel / Foto OCR)
                </th>
                <th className="p-3.5 bg-emerald-50/60 border-l border-emerald-200 text-emerald-900">
                  COLUMNA B: Dato Registrado (Base de Datos Gestión)
                </th>
                <th className="p-3.5 text-center w-36">Estado Convalidación</th>
                <th className="p-3.5 text-center w-48">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {registros.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#003366] text-xs">#{r.nroCorrelativo}</td>
                  
                  <td className={`p-3.5 border-l border-slate-200 ${
                    r.coincidenciaExacta ? 'bg-emerald-50/40 text-emerald-900' : 'bg-amber-50 text-amber-950 font-bold'
                  }`}>
                    <div className="font-bold uppercase">{r.detectadoNombre}</div>
                    <div className="font-mono text-[11px] text-slate-500">CI: {r.detectadoCi}</div>
                  </td>

                  <td className={`p-3.5 border-l border-slate-200 ${
                    r.coincidenciaExacta ? 'bg-emerald-50/40 text-emerald-900 font-bold' : 'bg-amber-50/80 text-amber-950'
                  }`}>
                    <div className="font-bold uppercase">{r.bdNombre}</div>
                    <div className="font-mono text-[11px] text-slate-500">CI: {r.bdCi}</div>
                  </td>

                  <td className="p-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border inline-block ${
                      r.estadoValidacion === 'EDITADO_MANUALMENTE'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : r.coincidenciaExacta
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                    }`}>
                      {r.estadoValidacion === 'EDITADO_MANUALMENTE'
                        ? '✏️ Editado & Validado'
                        : r.coincidenciaExacta
                        ? '✓ Coincidencia 100%'
                        : '⚠️ Revisión Manual'}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(r)}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Editar nombre/CI de este registro"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        Editar
                      </button>

                      {!r.coincidenciaExacta && (
                        <button
                          onClick={() => handleManualApprove(r.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Aprobar dato detectado"
                        >
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          Aprobar
                        </button>
                      )}

                      {r.coincidenciaExacta && (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          OK
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN DIRECTA DE CELDAS */}
      {editingRow && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#003366] flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">edit_square</span>
                Editar Registro Correlativo #{editingRow.nroCorrelativo}
              </h3>
              <button
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">description</span>
                  COLUMNA A: Dato Detectado (Excel / Foto OCR)
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nombre Completo:</label>
                  <input
                    type="text"
                    value={editingRow.detectadoNombre}
                    onChange={(e) => setEditingRow({ ...editingRow, detectadoNombre: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-xs font-bold uppercase bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Cédula de Identidad:</label>
                  <input
                    type="text"
                    value={editingRow.detectadoCi}
                    onChange={(e) => setEditingRow({ ...editingRow, detectadoCi: e.target.value })}
                    className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-xs font-mono font-bold bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">database</span>
                  COLUMNA B: Dato en Base de Datos de la Gestión
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Nombre Registrado:</label>
                  <input
                    type="text"
                    value={editingRow.bdNombre}
                    onChange={(e) => setEditingRow({ ...editingRow, bdNombre: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg text-xs font-bold uppercase bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Cédula de Identidad:</label>
                  <input
                    type="text"
                    value={editingRow.bdCi}
                    onChange={(e) => setEditingRow({ ...editingRow, bdCi: e.target.value })}
                    className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg text-xs font-mono font-bold bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditedRow}
                className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs rounded-xl shadow transition-all uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                Guardar Cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
);
}