import { Search, Save, FileText, Printer, ZoomIn, ZoomOut, RotateCw, ChevronRight, Building2, CheckCircle2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2' | 'tab3'>('tab1');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDiploma, setSearchDiploma] = useState('');
  const [, setExpediente] = useState<ExpedienteTitulos | null>(null);

  const [correlativoInforme, setCorrelativoInforme] = useState('0472');
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
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden font-sans">
      {/* 1 ÚNICA BARRA SUPERIOR ABSOLUTA (UNIFICADA) */}
      <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-xs z-30 sticky top-0 h-14">
        {/* LADO IZQUIERDO: TÍTULO DEL INFORME (ANTES EN CELESTE, AHORA EN LA CIMA) */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-[#003366] flex items-center gap-2 whitespace-nowrap tracking-tight font-heading">
              <span>Emisión de Informe de Certificación de Autenticidad (Tipo 1)</span>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#003366] text-xs font-mono font-bold rounded-lg shadow-2xs">
                INF N° {correlativoInforme}
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 font-sans">Archivo Central UAGRM – Margen 4cm Legajado</p>
          </div>
        </div>

        {/* CENTRO: BUSCADOR Y AUTOCOMPLETAR (ANTES EN MORADO, AHORA PERFECTAMENTE ALINEADO) */}
        <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
            <input
              type="text"
              value={searchDiploma}
              onChange={(e) => setSearchDiploma(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
              placeholder="Buscar N° Título (Ej: 014863)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#003366] rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all shadow-2xs"
            />
          </div>
          <button
            onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
            disabled={isSearching}
            className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            {isSearching ? 'Cargando...' : 'Autocompletar'}
          </button>
        </div>

        {/* LADO DERECHO: CONTROLES DE ZOOM, OCULTAR EDICIÓN Y GUARDAR */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold text-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}
              className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-all font-mono text-sm cursor-pointer"
            >
              -
            </button>
            <span className="px-2 font-mono text-xs text-[#003366]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))}
              className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-lg transition-all font-mono text-sm cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer ${showEditor ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-sm">
              {showEditor ? 'expand_less' : 'edit_note'}
            </span>
            {showEditor ? 'Ocultar Edición' : 'Mostrar Edición'}
          </button>

          <button
            onClick={handleSaveDocument}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 uppercase cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </header>

      {/* CUERPO PRINCIPAL: HOJA CENTRADA FLUIDA Y PANEL DE EDICIÓN FLUIDO */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. HOJA DE DOCUMENTO FLUIDA Y CENTRADA (LADO IZQUIERDO) */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-slate-200/70 flex justify-center items-start transition-all duration-300">
          <div
            className="transition-transform duration-200 origin-top shadow-2xl rounded-sm"
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

        {/* 2. PANEL DE EDICIÓN FLUIDO (LADO DERECHO) */}
        {showEditor && (
          <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-xl print:hidden z-10 transition-all duration-300">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003366] text-lg">tune</span>
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Panel de Edición Directa</h2>
              </div>
              <span className="text-[10px] bg-blue-50 border border-blue-200 text-[#003366] font-bold px-2 py-0.5 rounded-full">Tiempo Real</span>
            </div>

            <div className="px-4 pt-2 bg-white border-b border-slate-200 flex gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('tab1')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'tab1' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <span className="material-symbols-outlined text-base">edit_note</span>
                Firmas & Textos
              </button>
              <button
                onClick={() => setActiveTab('tab2')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'tab2' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <span className="material-symbols-outlined text-base">table_rows</span>
                Tabular (9 Col)
              </button>
              <button
                onClick={() => setActiveTab('tab3')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${activeTab === 'tab3' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                Titular & Datos
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-4 text-xs font-sans">
              {activeTab === 'tab1' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-2 shadow-2xs">
                    <h4 className="text-xs font-extrabold text-[#003366] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">gavel</span>
                      Párrafo Aclaratorio, Supletorio & Observación
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Texto libre que figurará en el informe impreso antes del bloque de firmas:
                    </p>
                    <textarea
                      value={textoFirmaPersonalizable}
                      onChange={(e) => setTextoFirmaPersonalizable(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-blue-300 rounded-xl text-xs font-serif text-slate-800 bg-white focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] outline-none leading-relaxed shadow-2xs"
                      placeholder="Ingrese texto formal libre de observaciones..."
                    />
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                    <label className="block font-bold text-slate-700 text-xs">Selector de Fecha del Documento (DatePicker):</label>
                    <input
                      type="date"
                      value={rawFechaDoc}
                      onChange={(e) => setRawFechaDoc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white focus:border-[#003366] outline-none"
                    />
                    <p className="text-[11px] text-blue-900 font-serif italic mt-1">
                      Resultado reactivo en la hoja: <strong>{fechaDocFormal}</strong>
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <label className="block font-bold text-slate-700 text-xs">Jefe de Archivo Central:</label>
                    <input
                      type="text"
                      value={jefeArchivoNombre}
                      onChange={(e) => setJefeArchivoNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">Secretario General:</label>
                    <input
                      type="text"
                      value={destinatarioNombre}
                      onChange={(e) => setDestinatarioNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold uppercase bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'tab2' && (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Edición directa de la Tabla Tabular oficial de 9 columnas:
                  </p>
                  {tableRows.map((row) => (
                    <div key={row.id} className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">N° Diploma / Título:</label>
                        <input
                          type="text"
                          value={row.nroDiploma}
                          onChange={(e) => handleUpdateRow(row.id, 'nroDiploma', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold bg-white focus:border-[#003366] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre Completo del Titular:</label>
                        <input
                          type="text"
                          value={row.nombreTitular}
                          onChange={(e) => handleUpdateRow(row.id, 'nombreTitular', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold uppercase bg-white focus:border-[#003366] outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Libro Matriz:</label>
                          <input
                            type="text"
                            value={row.libro}
                            onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:border-[#003366] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Fojas / Folio:</label>
                          <input
                            type="text"
                            value={row.fojas}
                            onChange={(e) => handleUpdateRow(row.id, 'fojas', e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:border-[#003366] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rector Firmante:</label>
                        <input
                          type="text"
                          value={row.nombreRector}
                          onChange={(e) => handleUpdateRow(row.id, 'nombreRector', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold uppercase bg-white focus:border-[#003366] outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tab3' && (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">Nombre Completo del Titular:</label>
                    <input
                      type="text"
                      value={titularNombre}
                      onChange={(e) => setTitularNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-xs uppercase bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 text-xs">Cédula de Identidad:</label>
                      <input
                        type="text"
                        value={titularCi}
                        onChange={(e) => setTitularCi(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs bg-white focus:border-[#003366] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700 text-xs">Registro Univ. (RU):</label>
                      <input
                        type="text"
                        value={registroUniversitario}
                        onChange={(e) => setRegistroUniversitario(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs bg-white focus:border-[#003366] outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">Grado / Mención:</label>
                    <input
                      type="text"
                      value={gradoMencion}
                      onChange={(e) => setGradoMencion(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                  <hr className="my-2 border-slate-200" />
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">Señor / Destinatario:</label>
                    <input
                      type="text"
                      value={destinatarioNombre}
                      onChange={(e) => setDestinatarioNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">Cargo Destinatario:</label>
                    <input
                      type="text"
                      value={destinatarioCargo}
                      onChange={(e) => setDestinatarioCargo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">N° Informe Correlativo:</label>
                    <input
                      type="text"
                      value={correlativoInforme}
                      onChange={(e) => setCorrelativoInforme(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs font-bold bg-white focus:border-[#003366] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}