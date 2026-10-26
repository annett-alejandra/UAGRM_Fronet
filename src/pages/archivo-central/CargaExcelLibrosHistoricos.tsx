import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { BookOpen, FileSpreadsheet, UploadCloud, CheckCircle2, AlertTriangle, Edit3, Save, Trash2, Sparkles } from 'lucide-react';
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
  const [carrera, setCarrera] = useState('LIC. EN CIENCIAS JURÃDICAS');
  const [tomoLegajo, setTomoLegajo] = useState('LEGAJO # 01');
  const [rangoInicial, setRangoInicial] = useState('03399');
  const [rangoFinal, setRangoFinal] = useState('03010');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [, setFileName] = useState<string | null>(null);

  // Modal de EdiciÃ³n Directa
  const [editingRow, setEditingRow] = useState<RegistroDobleConvalidacion | null>(null);

  // Registros de Doble ConvalidaciÃ³n con MARÃA S. ALPIRI LLANOS como ejemplo
  const [registros, setRegistros] = useState<RegistroDobleConvalidacion[]>([
    {
      id: '1',
      nroCorrelativo: '#03399',
      detectadoNombre: 'MARÃA S. ALPIRI LLANOS',
      detectadoCi: '4589214-SCZ',
      bdNombre: 'MARÃA S. ALPIRI LLANOS',
      bdCi: '4589214-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '2',
      nroCorrelativo: '#03398',
      detectadoNombre: 'LILIANA I. NAVARRO PAZ',
      detectadoCi: '3892102-SCZ',
      bdNombre: 'LILIANA I. NAVARRO PAZ',
      bdCi: '3892102-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '3',
      nroCorrelativo: '#03393',
      detectadoNombre: 'HERIBERTO ORELLANA VILLANUEVA',
      detectadoCi: '2981044-CB',
      bdNombre: 'HERIBERTO ORELLANA V.',
      bdCi: '2981044-CB',
      coincidenciaExacta: false,
      estadoValidacion: 'INCONSISTENCIA_NOMBRE'
    },
    {
      id: '4',
      nroCorrelativo: '#03389',
      detectadoNombre: 'MIGUEL A. BARRIOS MONJE',
      detectadoCi: '5019231-SCZ',
      bdNombre: 'MIGUEL A. BARRIOS MONJE',
      bdCi: '5019231-SCZ',
      coincidenciaExacta: true,
      estadoValidacion: 'COINCIDENCIA_EXACTA'
    },
    {
      id: '5',
      nroCorrelativo: '#03384',
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
        title: `Planilla / Foto OCR Libros HistÃ³ricos - ${gestion}`,
        description: `Doble ConvalidaciÃ³n Visual para ${carrera} - ${tomoLegajo}`,
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
      alert(`Â¡Doble ConvalidaciÃ³n completada! El Libro Matriz HistÃ³rico (${carrera} - ${tomoLegajo}) ha sido guardado exitosamente.`);
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
      
      {/* SECCIÃ“N 1: ASIGNACIÃ“N A GESTIÃ“N ANUAL & TOMO / LIBRO MATRIZ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex items-center gap-2.5 text-[#191A7D] font-extrabold text-base border-b border-slate-100 pb-3">
          <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-200/60 flex items-center justify-center shadow-2xs">
            <BookOpen className="w-5 h-5 text-amber-600" />
          </span>
          <h3>AsignaciÃ³n a GestiÃ³n Anual &amp; Tomo / Libro Matriz</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">GestiÃ³n / AÃ±o:</label>
            <Input value={gestion} onChange={(e) => setGestion(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Carrera / Programa:</label>
            <Input value={carrera} onChange={(e) => setCarrera(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Identificador Legajo / Tomo:</label>
            <Input value={tomoLegajo} onChange={(e) => setTomoLegajo(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Rango Correlativo (Del / Al):</label>
            <div className="flex items-center justify-between gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-2xs">
              <Input value={rangoInicial} onChange={(e) => setRangoInicial(e.target.value)} className="w-20 text-center" />
              <span className="text-slate-400 font-bold text-xs">-</span>
              <Input value={rangoFinal} onChange={(e) => setRangoFinal(e.target.value)} className="w-20 text-center" />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÃ“N 2: VISOR ESPEJO TABLA DE CONVALIDACIÃ“N */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2.5 text-[#191A7D] font-extrabold text-base">
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200/60 flex items-center justify-center shadow-2xs">
                <span className="material-symbols-outlined text-lg">find_in_page</span>
              </span>
              <h3>Visor Espejo: Columna A (Dato Detectado en Foto/Excel) VS. Columna B (Base de Datos)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Verdes: Coincidencia 100%</span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Ãmbar/Rojo: Requiere ediciÃ³n o aprobaciÃ³n del operador.</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200/70">
              <span className="material-symbols-outlined text-sm">upload_file</span>
              {isProcessing ? 'Procesando...' : 'Cargar Excel / Foto OCR'}
              <Input type="file" accept=".xlsx,.xls,.csv,image/*" onChange={handleSubirArchivo} className="hidden" />
            </label>

            <Button variant="primary" onClick={handleConfirmarYGuardar} disabled={isSaved}>
              <span className="material-symbols-outlined text-base">shield</span>
              {isSaved ? 'GUARDANDO...' : 'CONFIRMAR & GUARDAR CONVALIDACIÃ“N'}
            </Button>
          </div>
        </div>

        {/* TABLA PRINCIPAL VISOR ESPEJO */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-extrabold uppercase border-b border-slate-200 tracking-wider text-[10px]">
                <th className="p-3.5 text-center w-28 border-r border-slate-200/60">NÂ° CORRELATIVO</th>
                <th className="p-3.5 border-r border-slate-200/60 bg-blue-50/40 text-blue-950">COLUMNA A: DATO DETECTADO (EXCEL / FOTO OCR)</th>
                <th className="p-3.5 border-r border-slate-200/60 bg-emerald-50/30 text-emerald-950">COLUMNA B: DATO REGISTRADO (BASE DE DATOS GESTIÃ“N)</th>
                <th className="p-3.5 text-center w-48 border-r border-slate-200/60">ESTADO CONVALIDACIÃ“N</th>
                <th className="p-3.5 text-center w-44">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 bg-white font-medium">
              {registros.map((r) => (
                <tr key={r.id} className={`transition-colors ${r.coincidenciaExacta ? 'hover:bg-slate-50/80' : 'bg-amber-50/40 hover:bg-amber-50/70'}`}>
                  <td className="p-3.5 text-center font-mono font-extrabold text-slate-800 border-r border-slate-200/60">
                    {r.nroCorrelativo}
                  </td>

                  <td className="p-3.5 border-r border-slate-200/60">
                    <div className="font-extrabold text-emerald-800 uppercase tracking-tight">{r.detectadoNombre}</div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">CI: {r.detectadoCi}</div>
                  </td>

                  <td className={`p-3.5 border-r border-slate-200/60 ${r.coincidenciaExacta ? '' : 'bg-amber-50/60'}`}>
                    <div className="font-extrabold text-emerald-800 uppercase tracking-tight">{r.bdNombre}</div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5">CI: {r.bdCi}</div>
                  </td>

                  <td className="p-3.5 text-center border-r border-slate-200/60">
                    {r.estadoValidacion === 'EDITADO_MANUALMENTE' ? (
                      <span className="px-3.5 py-1.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-full font-extrabold text-[11px] inline-flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-xs">edit_note</span>
                        Editado &amp; Validado
                      </span>
                    ) : r.coincidenciaExacta ? (
                      <span className="px-4 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full font-extrabold text-[11px] inline-flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-xs">check</span>
                        Coincidencia 100%
                      </span>
                    ) : (
                      <span className="px-4 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full font-extrabold text-[11px] inline-flex items-center gap-1 shadow-2xs animate-pulse">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        RevisiÃ³n Manual
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {!r.coincidenciaExacta ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleManualApprove(r.id)} className="h-7 text-[11px] gap-1">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            Aprobar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(r)} className="h-7 text-[11px] gap-1">
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Editar
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1.5 bg-slate-100 text-emerald-700 font-extrabold text-[11px] rounded-xl border border-slate-200 inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
                            OK
                          </span>
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(r)} className="h-7 text-[11px] gap-1">
                            <span className="material-symbols-outlined text-xs">edit</span>
                            Editar
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÃ“N DIRECTA DE CELDAS */}
      {editingRow && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#191A7D] flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">edit_square</span>
                Editar Registro Correlativo {editingRow.nroCorrelativo}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingRow(null)} className="h-7 w-7 p-0">
                <span className="material-symbols-outlined text-lg">close</span>
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">description</span>
                  COLUMNA A: Dato Detectado (Excel / Foto OCR)
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Completo:</label>
                  <Input value={editingRow.detectadoNombre} onChange={(e) => setEditingRow({ ...editingRow, detectadoNombre: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">CÃ©dula de Identidad:</label>
                  <Input value={editingRow.detectadoCi} onChange={(e) => setEditingRow({ ...editingRow, detectadoCi: e.target.value })} />
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-600">database</span>
                  COLUMNA B: Dato en Base de Datos de la GestiÃ³n
                </h4>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Registrado:</label>
                  <Input value={editingRow.bdNombre} onChange={(e) => setEditingRow({ ...editingRow, bdNombre: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">CÃ©dula de Identidad:</label>
                  <Input value={editingRow.bdCi} onChange={(e) => setEditingRow({ ...editingRow, bdCi: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setEditingRow(null)}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={handleSaveEditedRow} className="gap-1"><span className="material-symbols-outlined text-sm">save</span>Guardar Cambio</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


