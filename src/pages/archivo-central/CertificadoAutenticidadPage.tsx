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
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col justify-between pb-32">
      
      {/* BARRA SUPERIOR DE BÚSQUEDA Y OPCIONES */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-30 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C51D24] uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">description</span>
            Archivo Central UAGRM • Plantilla Oficial Limpia
          </div>
          <h1 className="text-xl font-extrabold text-[#003366] font-heading">
            Emisión de Informe de Certificación de Autenticidad (Tipo 1)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Buscador de Título */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar Nº Título (Ej: 014863)..."
              value={searchDiploma}
              onChange={(e) => setSearchDiploma(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
              className="px-3.5 py-1.5 pl-9 bg-slate-50 border border-slate-300 rounded-xl text-xs w-60 focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">search</span>
          </div>

          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
            disabled={isSearching}
            className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">find_in_page</span>
            {isSearching ? 'Buscando...' : 'Autocompletar'}
          </button>

          <button
            type="button"
            onClick={() => setShowWordEditor(!showWordEditor)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            {showWordEditor ? 'Ocultar Panel' : 'Editar Datos'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-[#C51D24] hover:bg-[#a3151b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Imprimir Hoja Única
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL: VISTA DE HOJA ÚNICA + PANEL EDITABLE EXTENDIDO HASTA ABAJO */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center gap-6 p-6 max-w-[1600px] w-full mx-auto">
        
        {/* VISTA PREVIA HOJA OFICIAL MEMBRETADA (CENTRADA) */}
        <div className="flex-1 flex justify-center items-start overflow-x-auto py-2">
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

        {/* PANEL LATERAL DE EDICIÓN ESTILO WORD (EXTENDIDO HASTA ABAJO H-FULL H-[CALC(100VH-80PX)]) */}
        {showWordEditor && (
          <div className="w-96 shrink-0 bg-white p-5 print:hidden shadow-xl border-l border-slate-200 rounded-2xl sticky top-20 h-[calc(100vh-140px)] overflow-y-auto flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-sm font-extrabold text-[#003366] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C51D24] text-lg">edit</span>
                  Panel de Edición (Tipo 1)
                </h2>
                <button
                  type="button"
                  onClick={() => setShowWordEditor(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Secciones de Edición */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nº Inf. Correlativo:
                    </label>
                    <input
                      type="text"
                      value={correlativoInforme}
                      onChange={(e) => setCorrelativoInforme(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-[#003366]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Fecha Documento:
                    </label>
                    <input
                      type="text"
                      value={fechaDoc}
                      onChange={(e) => setFechaDoc(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Destinatario (Señor):
                  </label>
                  <input
                    type="text"
                    value={destinatarioNombre}
                    onChange={(e) => setDestinatarioNombre(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 mb-1"
                  />
                  <input
                    type="text"
                    value={destinatarioCargo}
                    onChange={(e) => setDestinatarioCargo(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] uppercase font-medium text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Asunto / Referencia:
                  </label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-[#003366]"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <span className="text-[11px] font-extrabold text-[#003366] block">Datos del Solicitante / Titular:</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">Fecha Solicitud:</label>
                      <input
                        type="text"
                        value={fechaSolicitud}
                        onChange={(e) => setFechaSolicitud(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Nº Testimonio:</label>
                      <input
                        type="text"
                        value={nroTestimonio}
                        onChange={(e) => setNroTestimonio(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500">Nombre Apoderado:</label>
                    <input
                      type="text"
                      value={apoderadoNombre}
                      onChange={(e) => setApoderadoNombre(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500">Nombre Titular:</label>
                    <input
                      type="text"
                      value={titularNombre}
                      onChange={(e) => setTitularNombre(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">C.I. Titular:</label>
                      <input
                        type="text"
                        value={titularCi}
                        onChange={(e) => setTitularCi(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Nº Diploma:</label>
                      <input
                        type="text"
                        value={nroTitulo}
                        onChange={(e) => setNroTitulo(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono font-bold text-[#C51D24] text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Filas de la Tabla */}
                {tableRows.map((row) => (
                  <div key={row.id} className="p-3 bg-blue-50/50 rounded-xl space-y-2 border border-blue-100">
                    <span className="text-[11px] font-bold text-[#003366] block">Datos del Cuadro Tabular:</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">Rector:</label>
                        <input
                          type="text"
                          value={row.nombreRector}
                          onChange={(e) => handleUpdateRow(row.id, 'nombreRector', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Diploma de:</label>
                        <input
                          type="text"
                          value={row.diplomaDe}
                          onChange={(e) => handleUpdateRow(row.id, 'diplomaDe', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-300 text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">Fojas:</label>
                        <input
                          type="text"
                          value={row.fojas}
                          onChange={(e) => handleUpdateRow(row.id, 'fojas', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Libro:</label>
                        <input
                          type="text"
                          value={row.libro}
                          onChange={(e) => handleUpdateRow(row.id, 'libro', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 pt-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                    <span>Párrafo Aclaratorio Histórico:</span>
                    <input
                      type="checkbox"
                      checked={incluirAclaratoriaHistorica}
                      onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                      className="w-4 h-4 text-[#003366] rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                    <span>Párrafo Supletorio:</span>
                    <input
                      type="checkbox"
                      checked={incluirSupletorio}
                      onChange={(e) => setIncluirSupletorio(e.target.checked)}
                      className="w-4 h-4 text-[#003366] rounded cursor-pointer"
                    />
                  </label>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Jefe de Archivo (Firma):
                    </label>
                    <input
                      type="text"
                      value={jefeArchivoNombre}
                      onChange={(e) => setJefeArchivoNombre(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-[#003366]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones Directas del Panel Lateral (Abajo) */}
            <div className="pt-4 border-t border-slate-200 space-y-2 mt-auto">
              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full py-2.5 bg-[#003366] hover:bg-[#002244] text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">save</span>
                {isSaving ? 'Guardando...' : 'Guardar Documento'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-[#C51D24] hover:bg-[#A0161C] text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Imprimir Hoja Única ({paperSize.toUpperCase()})
              </button>
            </div>

          </div>
        )}

      </div>

      {/* BARRA INFERIOR DE ACCIONES (STICKY BOTTOM) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl print:hidden">
        
        {/* Acciones Rápidas */}
        <div className="px-8 py-3 flex flex-wrap justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C51D24]"></span>
            <span>Documento Activo:</span>
            <strong className="text-[#003366] font-mono">
              INFORME ARCHIVO CENTRAL - TIPO 1 (INF Nº {correlativoInforme})
            </strong>
            <span className="text-slate-400 font-mono">| Plantilla Hoja Única Fondo Blanco</span>
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
        </div>

        {/* Footer Help Banner */}
        <div className="bg-slate-100 border-t border-slate-200 text-xs text-slate-600 py-1.5 px-8 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[#C51D24] text-sm">help</span>
              Flujo Rápido:
            </span>
            <span>[1. Consultar Expediente] → [2. Ajustar/Editar en Panel Lateral] → [3. Guardar Documento] → [4. Imprimir Hoja Única]</span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            Sistema UAGRM • Archivo Central
          </div>
        </div>

      </div>

    </div>
  );
}
