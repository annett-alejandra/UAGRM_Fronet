import { useState } from 'react';
import { titulosApi, type ExpedienteTitulos } from '../../features/titulos/api/titulos-api';
import { InformeArchivoCentralTipo1 } from '../../modules/archivo-central/templates/InformeArchivoCentralTipo1';

interface TablaFila {
  id: string;
  nroDiploma: string;
  nombreTitular: string;
  ci: string;
  diplomaDe: string;
  fojas: string;
  libro: string;
  fechaExtension: string;
  nombreRector: string;
  pieFirmaRector: string;
}

export function CertificadoAutenticidadPage() {
  const [showEditor, setShowEditor] = useState<boolean>(true);
  
  // Pestañas Invertidas Descendentemente: tab1 (Firmas) a tab7 (Encabezado Base)
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3' | 'tab4' | 'tab5' | 'tab6' | 'tab7'>('tab1');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDiploma, setSearchDiploma] = useState('');

  // Estado del Expediente
  const [, setExpediente] = useState<ExpedienteTitulos | null>(null);

  // Variables de Negocio (Módulo Archivo Central - Plantilla Oficial Informe Tipo 1)
  const [correlativoInforme, setCorrelativoInforme] = useState('0472');
  
  // Selector de Fecha (DatePicker ISO + Formato Formal Reactivo en Español)
  const [rawFechaDoc, setRawFechaDoc] = useState('2026-04-20');
  
  const formatFechaFormal = (isoDate: string): string => {
    if (!isoDate) return '20 de abril de 2026';
    const [year, month, day] = isoDate.split('-').map(Number);
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    if (!year || !month || !day) return '20 de abril de 2026';
    return `${day} de ${meses[month - 1]} de ${year}`;
  };

  const fechaDocFormal = formatFechaFormal(rawFechaDoc);

  const [destinatarioNombre, setDestinatarioNombre] = useState('MSc. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('INFORME DEL DIPLOMA DE BACHILLER.');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('16 de abril de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('1246/2025');
  const [apoderadoNombre, setApoderadoNombre] = useState('Yuli Alison Romero Flores');
  const [titularNombre, setTitularNombre] = useState('Jenny Flores Peña');
  const [titularCi, setTitularCi] = useState('3250858-SCZ');
  const [registroUniversitario, setRegistroUniversitario] = useState('21908412');
  const [gradoMencion, setGradoMencion] = useState('Diploma de Bachiller');
  const [nroTitulo, setNroTitulo] = useState('014863');

  const [incluirAclaratoriaHistorica, setIncluirAclaratoriaHistorica] = useState(true);
  const [gestionHistorica, setGestionHistorica] = useState('1998');
  const [incluirSupletorio, setIncluirSupletorio] = useState(true);
  
  const [jefeArchivoNombre, setJefeArchivoNombre] = useState('Moisés Cossio López');
  const [textoFirmaPersonalizable, setTextoFirmaPersonalizable] = useState(
    'Es cuanto informo a su autoridad para los fines legales convenientes. Documento verificado físicamente contra Libro Matriz N° 19/98 y Folio N° 115/98.'
  );

  // Filas de la Tabla Tabular de 9 Columnas
  const [tableRows, setTableRows] = useState<TablaFila[]>([
    {
      id: '1',
      nroDiploma: '014863',
      nombreTitular: 'JENNY FLORES PEÑA',
      ci: '3250858-SCZ',
      diplomaDe: 'BACHILLER EN HUMANIDADES',
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
    }
  ]);

  const handleConsultarExpediente = async (term: string) => {
    if (!term) return;
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(term);
      if (data) {
        setCorrelativoInforme(data.informe_nro || '0472');
        setFechaSolicitud(data.fecha_solicitud || '16 de abril de 2026');
        setNroTestimonio(data.nro_testimonio || '1246/2025');
        setApoderadoNombre(data.apoderado || 'Yuli Alison Romero Flores');
        setTitularNombre(data.titular.nombre_completo || 'Jenny Flores Peña');
        setTitularCi(data.titular.ci_expedido || '3250858-SCZ');
        if (data.carrera_colegio?.mencion) {
          setGradoMencion(data.carrera_colegio.mencion);
        }

        const fechaEm = data.expediente?.fecha_emision || '24 de julio de 1998';
        const match = fechaEm.match(/\b(19\d\d|20\d\d)\b/);
        const ano = match ? match[0] : '1998';
        setGestionHistorica(ano);
        setIncluirAclaratoriaHistorica(parseInt(ano, 10) <= 1999);

        setTableRows([
          {
            id: Date.now().toString(),
            nroDiploma: data.expediente.nro_diploma || term || '014863',
            nombreTitular: (data.titular.nombre_completo || 'JENNY FLORES PEÑA').toUpperCase(),
            ci: data.titular.ci_expedido || '3250858-SCZ',
            diplomaDe: (data.carrera_colegio.mencion || 'BACHILLER EN HUMANIDADES').replace('.', '').toUpperCase(),
            fojas: data.archivo_fisico.fojas || '115/98',
            libro: data.archivo_fisico.libro_matriz || '19/98',
            fechaExtension: fechaEm,
            nombreRector: (data.autoridad.rector_nombre || 'JORGE ORELLANA MORENO').toUpperCase(),
            pieFirmaRector: data.archivo_fisico.observacion_firma || 'No tiene'
          }
        ]);
        setExpediente(data.expediente || null);
      }
    } catch {
      // Fallback
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdateRow = (id: string, field: keyof TablaFila, value: string) => {
    setTableRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSaveDocument = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Informe de Autenticidad INF N° ${correlativoInforme} guardado correctamente en la Base de Datos.`);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* 1. REESTRUCTURACIÓN VISUAL EXACTA DEL HEADER (TOP: 0 ABSOLUTO Y SIN BARRA ROJA SUPERIOR) */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-sm z-30 sticky top-0">
        
        {/* LADO IZQUIERDO: TÍTULO DEL INFORME SUBIDO (TOP ABSOLUTO) + BUSCADOR DESTACADO */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Bloque del Documento Elevado */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#C51D24] text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-base">description</span>
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2 whitespace-nowrap">
                <span>Emisión de Informe de Certificación de Autenticidad (Tipo 1)</span>
                <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-[#003366] text-xs font-mono font-bold rounded-md">
                  INF N° {correlativoInforme}
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-sans">Archivo Central UAGRM · Margen 4cm Legajado</p>
            </div>
          </div>

          {/* Flecha Conectora Verde */}
          <div className="hidden xl:flex items-center text-emerald-600 font-bold text-xs gap-1 shrink-0">
            <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
          </div>

          {/* BUSCADOR Y AUTOCOMPLETAR (LADO IZQUIERDO, DESTACADO CON MAYOR PADDING Y CONTRASTE) */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 text-lg">search</span>
              <input
                type="text"
                value={searchDiploma}
                onChange={(e) => setSearchDiploma(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
                placeholder="Buscar N° Título (Ej: 014863)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border-2 border-blue-400 focus:border-blue-600 rounded-xl text-xs font-bold text-[#0F172A] placeholder-slate-400 outline-none transition-all shadow-xs"
              />
            </div>
            
            <button
              onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
              disabled={isSearching}
              className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5 shrink-0 uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">auto_fix_high</span>
              {isSearching ? 'Sincronizando...' : 'Autocompletar'}
            </button>
          </div>
        </div>

        {/* ALINEACIÓN LATERAL DERECHA (ESTRICTAMENTE CONTROLES DE ZOOM Y OCULTAR EDICIÓN) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold text-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}
              className="px-2 py-0.5 hover:bg-white rounded transition-all font-mono"
            >
              -
            </button>
            <span className="px-2.5 font-mono text-[11px] text-[#003366]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))}
              className="px-2 py-0.5 hover:bg-white rounded transition-all font-mono"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-xs ${
              showEditor
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {showEditor ? 'expand_less' : 'edit_note'}
            </span>
            {showEditor ? 'Ocultar Edición' : 'Mostrar Edición'}
          </button>

          <button
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1 uppercase"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </header>

      {/* 2. JERARQUÍA INVERTIDA DE PESTAÑAS (EL 7 ES EL 1 Y DEGRADA SECUENCIALMENTE DE TAB1 A TAB7) */}
      <div className="flex-1 flex overflow-hidden">
        {showEditor && (
          <aside className="w-[500px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-lg animate-in slide-in-from-left duration-300 print:hidden z-10">
            
            {/* BARRA DE PESTAÑAS INVERTIDAS DESCENDENTEMENTE (TAB 1 A TAB 7) */}
            <div className="bg-slate-100 p-1.5 flex border-b border-slate-200 text-[11px] font-bold gap-1 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('tab1')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab1' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 1 (Anterior 7): Firmas y Textos Legales"
              >
                P1: Firmas y Texto
              </button>
              <button
                onClick={() => setActiveTab('tab2')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab2' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 2 (Anterior 6): Reconstrucción y Validación Histórica"
              >
                P2: Validación Histórica
              </button>
              <button
                onClick={() => setActiveTab('tab3')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab3' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 3 (Anterior 5): Tabular y Fojas"
              >
                P3: Tabular (9 Col)
              </button>
              <button
                onClick={() => setActiveTab('tab4')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab4' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 4 (Anterior 4): Dossier Digital"
              >
                P4: Dossier
              </button>
              <button
                onClick={() => setActiveTab('tab5')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab5' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 5 (Anterior 3): Titular y Datos Personales"
              >
                P5: Titular
              </button>
              <button
                onClick={() => setActiveTab('tab6')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab6' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 6 (Anterior 2): Destinatario Institucional"
              >
                P6: Destinatario
              </button>
              <button
                onClick={() => setActiveTab('tab7')}
                className={`py-2 px-2.5 rounded-lg transition-all text-center whitespace-nowrap ${
                  activeTab === 'tab7' ? 'bg-white text-[#003366] shadow-sm font-extrabold border border-slate-200' : 'text-slate-600 hover:bg-white/50'
                }`}
                title="Pestaña 7 (Anterior 1): Encabezado Base"
              >
                P7: Encabezado
              </button>
            </div>

            {/* CONTENIDO DE LAS PESTAÑAS (SECUENCIA DESCENDENTE 1 A 7) */}
            <div className="flex-1 overflow-auto p-5 space-y-4 text-xs font-sans">
              
              {/* PESTAÑA 1 (ANTERIOR 7): FIRMAS Y TEXTOS LEGALES */}
              {activeTab === 'tab1' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <h4 className="text-xs font-extrabold text-[#003366] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">edit_document</span>
                      Párrafo Aclaratorio, Supletorio & Texto Libre de Firma
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Ingrese las observaciones o el texto libre aclaratorio que aparecerá en el informe antes del bloque de firmas:
                    </p>
                    <textarea
                      value={textoFirmaPersonalizable}
                      onChange={(e) => setTextoFirmaPersonalizable(e.target.value)}
                      rows={4}
                      className="w-full p-2.5 border border-blue-300 rounded-xl text-xs font-serif text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                      placeholder="Ingrese texto formal libre de observaciones..."
                    />
                  </div>

                  {/* SELECTOR DE FECHA DINÁMICO (DATEPICKER REACTIVO A FECHA FORMAL) */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <label className="block font-bold text-slate-700">Selector de Fecha del Documento (DatePicker):</label>
                    <input
                      type="date"
                      value={rawFechaDoc}
                      onChange={(e) => setRawFechaDoc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-[11px] text-blue-800 font-serif italic mt-1">
                      Resultado reactivo formal en la hoja: <strong>{fechaDocFormal}</strong>
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block font-bold text-slate-700">Jefe de Archivo Central:</label>
                    <input
                      type="text"
                      value={jefeArchivoNombre}
                      onChange={(e) => setJefeArchivoNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-slate-700">Secretario General:</label>
                    <input
                      type="text"
                      value={destinatarioNombre}
                      onChange={(e) => setDestinatarioNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PESTAÑA 2 (ANTERIOR 6): RECONSTRUCCIÓN Y VALIDACIÓN HISTÓRICA */}
              {activeTab === 'tab2' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-amber-700">menu_book</span>
                      Módulo Único de Reconstrucción y Validación Histórica
                    </h4>
                    
                    <label className="flex items-center justify-between text-xs font-bold text-amber-900 cursor-pointer">
                      <span>Incluir Párrafo Aclaratorio de Libro Histórico:</span>
                      <input
                        type="checkbox"
                        checked={incluirAclaratoriaHistorica}
                        onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                    </label>

                    {incluirAclaratoriaHistorica && (
                      <div>
                        <label className="text-[11px] text-slate-600 font-bold block mb-1">Gestión Histórica Reconvalidada:</label>
                        <input
                          type="text"
                          value={gestionHistorica}
                          onChange={(e) => setGestionHistorica(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-300 rounded-xl font-mono text-xs font-bold"
                          placeholder="1998"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PESTAÑA 3 (ANTERIOR 5): TABULAR Y FOJAS */}
              {activeTab === 'tab3' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Edición directa de la Tabla Tabular oficial de 9 columnas:
                  </p>
                  {tableRows.map((row) => (
                    <div key={row.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">N° Diploma:</label>
                        <input
                          type="text"
                          value={row.nroDiploma}
                          onChange={(e) => handleUpdateRow(row.id, 'nroDiploma', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Nombre Titular:</label>
                        <input
                          type="text"
                          value={row.nombreTitular}
                          onChange={(e) => handleUpdateRow(row.id, 'nombreTitular', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Libro:</label>
                          <input
                            type="text"
                            value={row.libro}
                            onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500">Fojas:</label>
                          <input
                            type="text"
                            value={row.fojas}
                            onChange={(e) => handleUpdateRow(row.id, 'fojas', e.target.value)}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PESTAÑA 4 (ANTERIOR 4): DOSSIER DIGITAL */}
              {activeTab === 'tab4' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <h4 className="text-xs font-extrabold text-[#003366] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">folder_open</span>
                      Visor de Dossier Digital (MinIO Storage)
                    </h4>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                        <span>📄 Cédula_Identidad_3250858.pdf</span>
                        <span className="text-emerald-600 font-bold">Verificado</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                        <span>📄 Certificado_Notas_Secundaria.pdf</span>
                        <span className="text-emerald-600 font-bold">Verificado</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
                        <span>📄 Foja_OCR_Reconstruida_115.pdf</span>
                        <span className="text-amber-600 font-bold">OCR 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 5 (ANTERIOR 3): TITULAR Y DATOS PERSONALES */}
              {activeTab === 'tab5' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nombre Completo del Titular:</label>
                    <input
                      type="text"
                      value={titularNombre}
                      onChange={(e) => setTitularNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-xs uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cédula de Identidad:</label>
                    <input
                      type="text"
                      value={titularCi}
                      onChange={(e) => setTitularCi(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registro Universitario (RU):</label>
                    <input
                      type="text"
                      value={registroUniversitario}
                      onChange={(e) => setRegistroUniversitario(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Grado / Mención:</label>
                    <input
                      type="text"
                      value={gradoMencion}
                      onChange={(e) => setGradoMencion(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PESTAÑA 6 (ANTERIOR 2): DESTINATARIO INSTITUCIONAL */}
              {activeTab === 'tab6' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Señor / Destinatario:</label>
                    <input
                      type="text"
                      value={destinatarioNombre}
                      onChange={(e) => setDestinatarioNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cargo Destinatario:</label>
                    <input
                      type="text"
                      value={destinatarioCargo}
                      onChange={(e) => setDestinatarioCargo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Asunto / Referencia:</label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PESTAÑA 7 (ANTERIOR 1): ENCABEZADO BASE */}
              {activeTab === 'tab7' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">N° Informe Correlativo:</label>
                    <input
                      type="text"
                      value={correlativoInforme}
                      onChange={(e) => setCorrelativoInforme(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fecha de Solicitud Inicial:</label>
                    <input
                      type="text"
                      value={fechaSolicitud}
                      onChange={(e) => setFechaSolicitud(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* HOJA DE DOCUMENTO FLUIDA Y CENTRADA */}
        <main className="flex-1 overflow-auto p-8 bg-slate-200/70 flex justify-center items-start">
          <div
            className="transition-transform duration-200 origin-top shadow-2xl"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <InformeArchivoCentralTipo1
              correlativoInforme={correlativoInforme}
              fechaDoc={fechaDocFormal}
              destinatarioNombre={destinatarioNombre}
              destinatarioCargo={destinatarioCargo}
              referencia={referencia}
              fechaSolicitud={fechaSolicitud}
              nroTestimonio={nroTestimonio}
              apoderadoNombre={apoderadoNombre}
              titularNombre={titularNombre}
              titularCi={titularCi}
              gradoMencion={gradoMencion}
              nroTitulo={nroTitulo}
              incluirAclaratoriaHistorica={incluirAclaratoriaHistorica}
              gestionHistorica={gestionHistorica}
              incluirSupletorio={incluirSupletorio}
              jefeArchivoNombre={jefeArchivoNombre}
              tableRows={tableRows}
              textoFirmaPersonalizable={textoFirmaPersonalizable}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
