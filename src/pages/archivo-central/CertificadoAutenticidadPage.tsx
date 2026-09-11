import { useState } from 'react';
import { titulosApi, type ExpedienteTitulos } from '../../features/titulos/api/titulos-api';
import { InformeArchivoCentralTipo3 } from '../../modules/archivo-central/templates/InformeArchivoCentralTipo3';

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
  const [paperSize, setPaperSize] = useState<'carta' | 'oficio' | 'a4'>('carta');
  const [showWordEditor, setShowWordEditor] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDiploma, setSearchDiploma] = useState('');

  // Estado del Expediente
  const [, setExpediente] = useState<ExpedienteTitulos | null>(null);

  // Variables de Negocio (Módulo Archivo Central - Tipo 3 Única Plantilla)
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
      }
    } catch {
      /* fallback */
    } finally {
      setIsSearching(false);
    }
  };

  const cargarEjemploOriginalFisico = () => {
    setCorrelativoInforme('0472');
    setFechaDoc('20 de abril de 2026');
    setDestinatarioNombre('MSc. Edy Acosta Claros');
    setDestinatarioCargo('SECRETARIO GENERAL - U.A.G.R.M.');
    setReferencia('INFORME DEL DIPLOMA DE BACHILLER.');
    setFechaSolicitud('16 de abril de 2026');
    setNroTestimonio('1246/2025');
    setApoderadoNombre('Yuli Alison Romero Flores');
    setTitularNombre('Jenny Flores Peña');
    setTitularCi('3250858-SCZ');
    setGradoMencion('Diploma de Bachiller');
    setNroTitulo('014863');
    setIncluirAclaratoriaHistorica(true);
    setGestionHistorica('1998');
    setIncluirSupletorio(true);
    setJefeArchivoNombre('Moisés Cossio López');

    setTableRows([{
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
    }]);
  };

  const handleAddRow = () => {
    const newRow: TablaFila = {
      id: Date.now().toString(),
      nroDiploma: nroTitulo,
      nombreTitular: titularNombre.toUpperCase(),
      ci: titularCi,
      diplomaDe: gradoMencion.toUpperCase(),
      fojas: '115/98',
      libro: '19/98',
      fechaExtension: '24 de julio de 1998',
      nombreRector: 'JORGE ORELLANA MORENO',
      pieFirmaRector: 'No tiene'
    };
    setTableRows((prev) => [...prev, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (tableRows.length <= 1) return;
    setTableRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRow = (id: string, field: keyof TablaFila, value: string) => {
    setTableRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSaveDocument = async () => {
    setIsSaving(true);
    try {
      await titulosApi.guardarCertificado({
        correlativo: correlativoInforme,
        titular: titularNombre,
        ci: titularCi,
        diploma: tableRows[0]?.nroDiploma || searchDiploma,
        tipoPlantilla: 'InformeArchivoCentralTipo3',
        filas: tableRows
      });
      alert('Informe de Archivo Central (Tipo 3) guardado exitosamente.');
    } catch {
      alert('Error al guardar el documento.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPaperClass = () => {
    switch (paperSize) {
      case 'oficio':
        return 'w-[216mm] min-h-[356mm] p-[18mm]';
      case 'a4':
        return 'w-[210mm] min-h-[297mm] p-[16mm]';
      case 'carta':
      default:
        return 'w-[216mm] min-h-[279mm] p-[18mm]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Barra Superior con Acciones y Búsqueda */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#003366] text-white rounded-xl shadow-sm">
            <span className="font-bold text-xs">📄 Tipo 3</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Módulo Archivo Central — Informe de Archivo Central (Tipo 3)
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Estructura de Carta Formal con Destinatario y Cuadro Tabulado de 9 Columnas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cargarEjemploOriginalFisico}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-xs rounded-xl border border-blue-200 transition-colors"
          >
            📋 Cargar Ejemplo Físico Original (0472)
          </button>

          <input
            type="text"
            placeholder="N° Diploma / C.I..."
            value={searchDiploma}
            onChange={(e) => setSearchDiploma(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsultarExpediente(searchDiploma)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleConsultarExpediente(searchDiploma || '014863')}
            disabled={isSearching}
            className="px-3.5 py-2 bg-[#003366] text-white font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors"
          >
            {isSearching ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setPaperSize('carta')}
              className={'px-2.5 py-1 rounded-lg transition-all ' + (paperSize === 'carta' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              Carta
            </button>
            <button
              onClick={() => setPaperSize('oficio')}
              className={'px-2.5 py-1 rounded-lg transition-all ' + (paperSize === 'oficio' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              Oficio
            </button>
            <button
              onClick={() => setPaperSize('a4')}
              className={'px-2.5 py-1 rounded-lg transition-all ' + (paperSize === 'a4' ? 'bg-white text-[#003366] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              A4
            </button>
          </div>

          <button
            onClick={() => setShowWordEditor(!showWordEditor)}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            {showWordEditor ? 'Ocultar Panel' : 'Panel Word'}
          </button>
        </div>
      </div>

      {/* Contenedor Hoja Impresa Clean + Panel Word */}
      <div className="flex-1 overflow-auto p-6 flex justify-center gap-6">
        
        {/* Renderizado Estricto del Componente Tipo 3 de Archivo Central */}
        <div className="bg-slate-200/80 p-8 rounded-2xl border border-slate-300 overflow-auto flex justify-center items-start shadow-inner flex-1">
          <InformeArchivoCentralTipo3
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

        {/* Panel Lateral de Edición Estilo Word (Derecha) */}
        {showWordEditor && (
          <div className="w-96 bg-white p-5 space-y-5 print:hidden shadow-sm border border-slate-200 rounded-2xl shrink-0 overflow-y-auto max-h-[85vh]">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                Panel Word (Archivo Central - Tipo 3)
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                1 Única Plantilla
              </span>
            </div>

            {/* Sección 1: Encabezado & Destinatario */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                1. Encabezado & Carta
              </h4>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Correlativo (INF N°):
                </label>
                <input
                  type="text"
                  value={correlativoInforme}
                  onChange={(e) => setCorrelativoInforme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Fecha del Documento:
                </label>
                <input
                  type="text"
                  value={fechaDoc}
                  onChange={(e) => setFechaDoc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Destinatario (Nombre):
                </label>
                <input
                  type="text"
                  value={destinatarioNombre}
                  onChange={(e) => setDestinatarioNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-[#003366]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Línea de Referencia:
                </label>
                <input
                  type="text"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Sección 2: Solicitud Legal & Titular */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                2. Solicitud Legal & Interesada
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Titular / Interesada:
                </label>
                <input
                  type="text"
                  value={titularNombre}
                  onChange={(e) => setTitularNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-[#003366]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cédula de Identidad (C.I.):
                </label>
                <input
                  type="text"
                  value={titularCi}
                  onChange={(e) => setTitularCi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Apoderado / Poder Especial:
                </label>
                <input
                  type="text"
                  value={apoderadoNombre}
                  onChange={(e) => setApoderadoNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha Solicitud:
                  </label>
                  <input
                    type="text"
                    value={fechaSolicitud}
                    onChange={(e) => setFechaSolicitud(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    N° Testimonio:
                  </label>
                  <input
                    type="text"
                    value={nroTestimonio}
                    onChange={(e) => setNroTestimonio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Tabla & Cláusulas Condicionales */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#003366] uppercase tracking-wider border-l-2 border-[#C51D24] pl-2">
                  3. Tabla Matriz & Opciones
                </h4>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-2 py-1 bg-blue-50 text-[#003366] text-[10px] font-bold rounded border border-blue-200"
                >
                  + Fila
                </button>
              </div>

              {tableRows.map((row, idx) => (
                <div key={row.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-bold text-[#C51D24] text-[10px]">
                      Fila #{idx + 1} - Diploma N° {row.nroDiploma}
                    </span>
                    {tableRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="text-red-600 text-[10px] font-bold"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500">N° Diploma:</label>
                      <input
                        type="text"
                        value={row.nroDiploma}
                        onChange={(e) => handleUpdateRow(row.id, 'nroDiploma', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Diploma De:</label>
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
                <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Párrafo Aclaratorio Histórico:</span>
                  <input
                    type="checkbox"
                    checked={incluirAclaratoriaHistorica}
                    onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Párrafo Supletorio:</span>
                  <input
                    type="checkbox"
                    checked={incluirSupletorio}
                    onChange={(e) => setIncluirSupletorio(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
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

            {/* Acciones al Final del Panel Lateral */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={isSaving}
                className="w-full py-2.5 bg-[#003366] hover:bg-blue-900 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                {isSaving ? 'Guardando Cambios...' : 'Guardar Documento'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                🖨️ IMPRIMIR INFORME FÍSICO ({paperSize.toUpperCase()})
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
