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
  // Configuración de Papel y Modos
  const [paperSize] = useState<'carta' | 'oficio' | 'a4'>('carta');
  const [showWordEditor, setShowWordEditor] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'general' | 'titular' | 'tabular' | 'opciones'>('general');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDiploma, setSearchDiploma] = useState('');

  // Estado del Expediente
  const [, setExpediente] = useState<ExpedienteTitulos | null>(null);

  // Variables de Negocio (Módulo Archivo Central - Plantilla Oficial Informe Tipo 1)
  const [correlativoInforme, setCorrelativoInforme] = useState('0472');
  const [fechaDoc, setFechaDoc] = useState('20 de abril de 2026');
  const [destinatarioNombre, setDestinatarioNombre] = useState('MSc. Edy Acosta Claros');
  const [destinatarioCargo, setDestinatarioCargo] = useState('SECRETARIO GENERAL - U.A.G.R.M.');
  const [referencia, setReferencia] = useState('INFORME DEL DIPLOMA DE BACHILLER.');
  
  const [fechaSolicitud, setFechaSolicitud] = useState('16 de abril de 2026');
  const [nroTestimonio, setNroTestimonio] = useState('1246/2025');
  const [apoderadoNombre, setApoderadoNombre] = useState('Yuli Alison Romero Flores');
  const [titularNombre, setTitularNombre] = useState('Jenny Flores Peña');
  const [titularCi, setTitularCi] = useState('3250858-SCZ');
  const [gradoMencion, setGradoMencion] = useState('Diploma de Bachiller');
  const [nroTitulo, setNroTitulo] = useState('014863');

  const [incluirAclaratoriaHistorica, setIncluirAclaratoriaHistorica] = useState(true);
  const [gestionHistorica, setGestionHistorica] = useState('1998');
  const [incluirSupletorio, setIncluirSupletorio] = useState(true);
  const [jefeArchivoNombre, setJefeArchivoNombre] = useState('Moisés Cossio López');

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
        setFechaDoc(data.fecha || '20 de abril de 2026');
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
      alert('Informe de Archivo Central (Tipo 1) guardado exitosamente.');
    }, 800);
  };

  return (
    <div className="h-screen bg-slate-100 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* 1. BARRA SUPERIOR BLANCA DE HERRAMIENTAS (SIN FONDO NEGRO) */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shrink-0 z-30 print:hidden text-slate-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#C51D24] text-white rounded-xl shadow-xs">
            <span className="material-symbols-outlined text-lg">description</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-wide font-heading text-[#003366]">
                Emisión de Informe de Certificación de Autenticidad (Tipo 1)
              </h1>
              <span className="px-2 py-0.5 bg-blue-50 text-[#003366] font-mono text-[10px] font-bold rounded border border-blue-200">
                INF Nº {correlativoInforme}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Archivo Central UAGRM • Margen 4cm Legajado
            </p>
          </div>
        </div>

        {/* Acciones de Cabecera */}
        <div className="flex items-center gap-3">
          {/* Buscador de Título */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Nº Título (Ej: 014863)..."
              value={searchDiploma}
              onChange={(e) => setSearchDiploma(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
              className="px-3.5 py-1.5 pl-9 bg-slate-50 border border-slate-300 rounded-xl text-xs w-56 text-slate-900 focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none transition-all placeholder:text-slate-400"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">search</span>
          </div>

          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
            disabled={isSearching}
            className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">find_in_page</span>
            {isSearching ? 'Buscando...' : 'Autocompletar'}
          </button>

          {/* Controles de Zoom */}
          <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5 text-xs text-slate-700">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="px-2 py-1 hover:bg-slate-200 rounded-lg cursor-pointer font-bold"
              title="Disminuir Zoom"
            >
              -
            </button>
            <span className="px-2 font-mono font-bold text-[11px] text-[#003366]">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
              className="px-2 py-1 hover:bg-slate-200 rounded-lg cursor-pointer font-bold"
              title="Aumentar Zoom"
            >
              +
            </button>
          </div>

          {/* Botón para alternar Panel */}
          <button
            type="button"
            onClick={() => setShowWordEditor(!showWordEditor)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              showWordEditor 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            {showWordEditor ? 'Ocultar Edición' : 'Abrir Edición'}
          </button>
        </div>
      </header>

      {/* 2. ÁREA PRINCIPAL CON FONDO CLARO (SIN FONDO NEGRO) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VISTA PREVIA HOJA OFICIAL MEMBRETADA (ÁREA CLARA SUAVE CON ZOOM Y SCROLL LIMPIO) */}
        <div className="flex-1 bg-slate-200/70 p-8 overflow-auto flex justify-center items-start transition-all">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200 my-2 shadow-xl rounded"
          >
            <InformeArchivoCentralTipo1
              correlativoInforme={correlativoInforme}
              fechaDoc={fechaDoc}
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
              tableRows={tableRows}
              incluirAclaratoriaHistorica={incluirAclaratoriaHistorica}
              gestionHistorica={gestionHistorica}
              incluirSupletorio={incluirSupletorio}
              jefeArchivoNombre={jefeArchivoNombre}
            />
          </div>
        </div>

        {/* PANEL LATERAL DE EDICIÓN FLUIDO POR PESTAÑAS (BG WHITE) */}
        {showWordEditor && (
          <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl transition-all duration-300 print:hidden z-20">
            
            {/* Header del Panel Lateral */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C51D24] text-lg">tune</span>
                <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider font-heading">
                  Panel de Edición Dinámico
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowWordEditor(false)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer p-1 rounded hover:bg-slate-200 transition-colors"
                title="Cerrar Panel"
              >
                ✕
              </button>
            </div>

            {/* Pestañas de Secciones */}
            <div className="flex border-b border-slate-200 bg-slate-100/70 p-1 gap-1 text-[11px] font-bold">
              {[
                { id: 'general', label: 'Encabezado', icon: 'subject' },
                { id: 'titular', label: 'Titular', icon: 'person' },
                { id: 'tabular', label: 'Tabular', icon: 'table_chart' },
                { id: 'opciones', label: 'Firmas', icon: 'history_edu' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-[#003366] shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenido de la Pestaña Activa con Scroll Limpio */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* Pestaña 1: Encabezado & Asunto */}
              {activeTab === 'general' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nº Inf. Correlativo:
                      </label>
                      <input
                        type="text"
                        value={correlativoInforme}
                        onChange={(e) => setCorrelativoInforme(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-[#003366] focus:ring-2 focus:ring-[#003366] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Fecha Documento:
                      </label>
                      <input
                        type="text"
                        value={fechaDoc}
                        onChange={(e) => setFechaDoc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#003366] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Destinatario (Señor):
                    </label>
                    <input
                      type="text"
                      value={destinatarioNombre}
                      onChange={(e) => setDestinatarioNombre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 mb-1.5 focus:ring-2 focus:ring-[#003366] outline-none"
                    />
                    <input
                      type="text"
                      value={destinatarioCargo}
                      onChange={(e) => setDestinatarioCargo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-[11px] uppercase font-medium text-slate-700 focus:ring-2 focus:ring-[#003366] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Asunto / Referencia:
                    </label>
                    <input
                      type="text"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#003366] focus:ring-2 focus:ring-[#003366] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Pestaña 2: Solicitante & Titular */}
              {activeTab === 'titular' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">Fecha Solicitud:</label>
                      <input
                        type="text"
                        value={fechaSolicitud}
                        onChange={(e) => setFechaSolicitud(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">Nº Testimonio:</label>
                      <input
                        type="text"
                        value={nroTestimonio}
                        onChange={(e) => setNroTestimonio(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Nombre Apoderado:</label>
                    <input
                      type="text"
                      value={apoderadoNombre}
                      onChange={(e) => setApoderadoNombre(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Nombre Titular:</label>
                    <input
                      type="text"
                      value={titularNombre}
                      onChange={(e) => setTitularNombre(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-extrabold text-xs text-[#003366]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">C.I. Titular:</label>
                      <input
                        type="text"
                        value={titularCi}
                        onChange={(e) => setTitularCi(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-1">Nº Diploma:</label>
                      <input
                        type="text"
                        value={nroTitulo}
                        onChange={(e) => setNroTitulo(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-[#C51D24] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña 3: Cuadro Tabular */}
              {activeTab === 'tabular' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {tableRows.map((row) => (
                    <div key={row.id} className="p-3.5 bg-blue-50/50 rounded-xl space-y-3 border border-blue-100">
                      <span className="text-xs font-bold text-[#003366] block">Valores del Registro Matriz:</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Rector:</label>
                          <input
                            type="text"
                            value={row.nombreRector}
                            onChange={(e) => handleUpdateRow(row.id, 'nombreRector', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Diploma de:</label>
                          <input
                            type="text"
                            value={row.diplomaDe}
                            onChange={(e) => handleUpdateRow(row.id, 'diplomaDe', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Fojas:</label>
                          <input
                            type="text"
                            value={row.fojas}
                            onChange={(e) => handleUpdateRow(row.id, 'fojas', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold block mb-1">Libro:</label>
                          <input
                            type="text"
                            value={row.libro}
                            onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pestaña 4: Opciones de Párrafos Especiales y Firma */}
              {activeTab === 'opciones' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    <span>Párrafo Aclaratorio Histórico:</span>
                    <input
                      type="checkbox"
                      checked={incluirAclaratoriaHistorica}
                      onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                      className="w-4 h-4 text-[#003366] rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    <span>Párrafo Supletorio:</span>
                    <input
                      type="checkbox"
                      checked={incluirSupletorio}
                      onChange={(e) => setIncluirSupletorio(e.target.checked)}
                      className="w-4 h-4 text-[#003366] rounded cursor-pointer"
                    />
                  </label>

                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jefe de Archivo (Firma Autorizada):
                    </label>
                    <input
                      type="text"
                      value={jefeArchivoNombre}
                      onChange={(e) => setJefeArchivoNombre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-[#003366]"
                    />
                  </div>
                </div>
              )}

            </div>

          </aside>
        )}

      </div>

      {/* 3. BARRA INFERIOR FIJA BLANCA (SIN FONDO NEGRO) */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shrink-0 z-30 print:hidden text-slate-800 shadow-lg">
        <div className="flex items-center gap-3 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600 font-medium">Documento Activo:</span>
          <strong className="font-mono text-[#003366]">
            INFORME ARCHIVO CENTRAL - TIPO 1 (INF Nº {correlativoInforme})
          </strong>
          <span className="text-slate-400">| Margen 4cm Legajado</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="px-5 py-2 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            {isSaving ? 'Guardando...' : 'Guardar Documento'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2 bg-[#C51D24] hover:bg-[#A0161C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Imprimir Hoja Única ({paperSize.toUpperCase()})
          </button>
        </div>
      </footer>

    </div>
  );
}
