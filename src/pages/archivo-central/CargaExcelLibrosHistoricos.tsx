import { useState } from 'react';

interface GraduadoExcel {
  nroCorrelativo: string;
  nombreCompleto: string;
  ci: string;
  observacion: string;
}

export function CargaExcelLibrosHistoricos() {
  const [gestion, setGestion] = useState('2001');
  const [carrera, setCarrera] = useState('LIC. EN CIENCIAS JURÍDICAS');
  const [tomoLegajo, setTomoLegajo] = useState('LEGAJO # 01');
  const [rangoInicial, setRangoInicial] = useState('03399');
  const [rangoFinal, setRangoFinal] = useState('03010');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [fileName, setFileName] = useState<string | null>('Digitalizacion_Libro_Juridicas_2001.xlsx');

  // Datos simulados idénticos a los cuadernos históricos físicos (Fotos del Archivo)
  const [rows, setRows] = useState<GraduadoExcel[]>([
    { nroCorrelativo: '03399', nombreCompleto: 'MARIA S. ARISPE LLANOS', ci: '4589214-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03398', nombreCompleto: 'LILIANA I. NAVARRO PAZ', ci: '3892102-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03393', nombreCompleto: 'HERIBERTO ORELLANA VILLANUEVA', ci: '2981044-CB', observacion: 'Foja Reconstruida por OCR' },
    { nroCorrelativo: '03389', nombreCompleto: 'MIGUEL A. BARRIOS MONJE', ci: '5019231-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03384', nombreCompleto: 'JUANA R. ESCALANTE FARFAN', ci: '3109283-TJ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03375', nombreCompleto: 'BENEBIL D. HIDALGO TAPIA', ci: '4091823-OR', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03365', nombreCompleto: 'JOSE S. FLORES MAESSE', ci: '3819201-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03356', nombreCompleto: 'MARIA L. CASTILLO OLAGUIVEL', ci: '4109283-LP', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03353', nombreCompleto: 'MARIA E. REYES MELGAR', ci: '2908123-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03352', nombreCompleto: 'SAUL BALCAZAR REYES', ci: '3908124-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03351', nombreCompleto: 'MARIA D. PHILLIPS URQUIDI', ci: '4192038-CB', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03323', nombreCompleto: 'ADALID R. DIAS PARRILLA', ci: '3019284-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03307', nombreCompleto: 'JENNY RIVERO TOLEDO', ci: '4819203-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03306', nombreCompleto: 'JARDLEY JACKELINE DORADO SUAREZ', ci: '5019283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03294', nombreCompleto: 'MARIA Y. ACACIA PANIAGUA SANSUSTE', ci: '3910293-SCZ', observacion: 'Marcado en Negrita (Foco)' },
    { nroCorrelativo: '03293', nombreCompleto: 'ELIO ROJO PANTOJA', ci: '4019283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03289', nombreCompleto: 'ESTELA A. SANCHEZ ORTIZ', ci: '3109284-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03288', nombreCompleto: 'SERGIO L. SOSA VARGAS', ci: '4291023-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03287', nombreCompleto: 'MARIA S. CHAVEZ MENACHO', ci: '3910283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03275', nombreCompleto: 'GABRIEL RIOS TERCEROS', ci: '4109284-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03271', nombreCompleto: 'MARIA G. ROJAS VARGAS', ci: '3819023-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03270', nombreCompleto: 'CONSUELITO SALAS SUSANO', ci: '4019284-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03257', nombreCompleto: 'RUTH G. MONTEVERDE GOMEZ', ci: '3109283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03256', nombreCompleto: 'ANA RODRIGUEZ FACUSSE', ci: '4910283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03250', nombreCompleto: 'YENNY ORTIZ HURTADO', ci: '3819204-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03244', nombreCompleto: 'FELIX ESTRADA ESPINOZA', ci: '4019283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03241', nombreCompleto: 'JAVIER E. HINOJOSA ALVAREZ', ci: '3910284-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03225', nombreCompleto: 'FREDDY GARCIA GUACHALLA', ci: '4819203-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03224', nombreCompleto: 'LORIBAI CAMPOS OLIVEIRA', ci: '5019283-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03219', nombreCompleto: 'CARLOS A. GUTIERREZ MENDEZ', ci: '3910293-SCZ', observacion: 'Foja Físicamente Intacta' },
    { nroCorrelativo: '03217', nombreCompleto: 'DAVID WALDEREDO REJAS GOMEZ', ci: '4019283-SCZ', observacion: 'Foja Físicamente Intacta' }
  ]);

  const handleSimularCargaExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 800);
    }
  };

  const handleGuardarLibroEnSistema = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      alert(`¡Libro Histórico (${carrera} - ${tomoLegajo}) guardado exitosamente en el sistema con ${rows.length} graduados!`);
    }, 600);
  };

  const handleDescargarPlantillaExcel = () => {
    alert('Descargando plantilla modelo "Plantilla_Libros_Historicos_UAGRM.xlsx"...');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Banner Encabezado */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#334155] p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-700">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Digitalización Masiva por Excel · Archivo Central UAGRM
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Importación de Libros Matrices Históricos (Manuscritos)
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Permite al operador de archivo subir las planillas Excel donde se han transcrito los tomos y legajos físicos manuscritos para salvaguardar y catalogar los registros de graduados.
          </p>
        </div>
        <button
          onClick={handleDescargarPlantillaExcel}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 shrink-0 border border-emerald-400/30"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Descargar Plantilla Excel Modelo
        </button>
      </div>

      {/* Formulario de Cabecera del Libro Matriz */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-amber-600">book</span>
          Cabecera del Tomo / Legajo Histórico
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
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] focus:ring-2 focus:ring-blue-500 outline-none uppercase"
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

      {/* Zona de Carga de Archivo Excel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-emerald-600">upload_file</span>
          Cargar Archivo Excel (.xlsx / .csv)
        </h3>

        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center transition-all bg-slate-50/50 hover:bg-emerald-50/20 relative group cursor-pointer">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleSimularCargaExcel}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-all">
              <span className="material-symbols-outlined text-2xl">table_chart</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">
                {fileName ? `Archivo Seleccionado: ${fileName}` : 'Haz clic o arrastra tu archivo Excel aquí'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Formato soportado: .XLSX, .CSV con columnas: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">NroCorrelativo | NombreCompleto | CI | Observacion</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Previsualización de la Tabla de Graduados Extraída */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">format_list_numbered</span>
              Previsualización de la Lista de Graduados ({rows.length} registros extraídos)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ordenados por número de título correlativo tal cual el cuaderno manuscrito físico.
            </p>
          </div>

          <button
            onClick={handleGuardarLibroEnSistema}
            disabled={isSaved || isProcessing}
            className="px-6 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {isSaved ? 'Guardando...' : 'Guardar Libro en el Sistema'}
          </button>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider sticky top-0 border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center w-16">#</th>
                <th className="p-3.5 w-36">N° Correlativo</th>
                <th className="p-3.5">Nombre Completo del Graduado</th>
                <th className="p-3.5 w-40">Cédula de Identidad</th>
                <th className="p-3.5">Estado / Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {rows.map((row, idx) => {
                const isHighlight = row.nroCorrelativo === '03294';
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 transition-colors ${
                      isHighlight ? 'bg-amber-100/60 font-bold border-l-4 border-amber-500' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-3.5 font-mono font-bold text-[#0F172A] text-xs">#{row.nroCorrelativo}</td>
                    <td className="p-3.5 font-bold text-slate-800 uppercase tracking-wide">{row.nombreCompleto}</td>
                    <td className="p-3.5 font-mono text-slate-600">{row.ci}</td>
                    <td className="p-3.5 text-xs">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        isHighlight
                          ? 'bg-amber-200 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {row.observacion}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
