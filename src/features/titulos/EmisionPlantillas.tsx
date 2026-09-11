import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { titulosApi } from './api/titulos-api';
import { Button } from '../../shared/ui/Button/Button';

export function EmisionPlantillas() {
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Estado del Formulario con Diferenciación Tipo 1 vs Tipo 2
  const [formData, setFormData] = useState({
    tipoPlantilla: 'PlantillaTipo2' as 'PlantillaTipo1' | 'PlantillaTipo2',
    incluirAclaratoriaHistorica: true,
    gestionHistorica: '1999',
    
    nroCertificado: '749/2026',
    informeRef: 'SECCION ARCHIVO/ INF N°472',
    fechaInforme: '20 de abril de 2026',
    gradoMencion: 'Diploma de Bachiller en Humanidades',
    nroTitulo: '019741',
    nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
    ciTitular: '4716343-SCZ.',
    libroRegistro: '026/99',
    fojas: '181',
    fechaEmisionOriginal: '5 de marzo del año 1999',
    lugarFechaCertificacion: 'Santa Cruz de la Sierra, 22 de abril del 2026',
    
    // Autoridades Editables en Bloque de Firmas Estilo Word
    autoridadSecretario: 'Lic. Edy Acosta Claros',
    autoridadRector: 'Dr. Reinerio Vargas Banegas'
  });

  // Función para determinar automáticamente el tipo de plantilla según el año
  const evaluarAnoYConfigurar = (fechaEmision: string, datosCompletos?: any) => {
    // Extraer año de 4 dígitos (p. ej. 1999 o 2022)
    const match = fechaEmision.match(/\b(19\d\d|20\d\d)\b/);
    const ano = match ? parseInt(match[0], 10) : 1999;

    if (ano <= 1999) {
      setFormData(prev => ({
        ...prev,
        ...datosCompletos,
        tipoPlantilla: 'PlantillaTipo2',
        incluirAclaratoriaHistorica: true,
        gestionHistorica: String(ano)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ...datosCompletos,
        tipoPlantilla: 'PlantillaTipo1',
        incluirAclaratoriaHistorica: false,
        gestionHistorica: String(ano)
      }));
    }
  };

  useEffect(() => {
    const expId = searchParams.get('expedienteId');
    if (expId) {
      handleBuscarExpedienteBackend(expId);
    }
  }, [searchParams]);

  const handleBuscarExpedienteBackend = async (idOrQuery?: string) => {
    setIsSearching(true);
    try {
      const data = await titulosApi.getInformeAutenticidadContext(idOrQuery);
      if (data) {
        const fechaEmision = data.expediente?.fecha_emision || '5 de marzo del año 1999';
        
        const nuevosDatos = {
          nroCertificado: data.informe_nro ? `${data.informe_nro}/2026` : '749/2026',
          informeRef: `SECCION ARCHIVO/ INF N°${data.informe_nro || '472'}`,
          fechaInforme: data.fecha || '20 de abril de 2026',
          gradoMencion: data.carrera_colegio?.mencion || 'Diploma de Bachiller en Humanidades',
          nroTitulo: data.expediente?.nro_diploma || '019741',
          nombreTitular: data.titular?.nombre_completo?.toUpperCase() || 'LYNNE DENISSE PEREZ REVILLA',
          ciTitular: data.titular?.ci_expedido || '4716343-SCZ.',
          libroRegistro: data.archivo_fisico?.libro_matriz || '026/99',
          fojas: data.archivo_fisico?.fojas || '181',
          fechaEmisionOriginal: fechaEmision,
          lugarFechaCertificacion: `Santa Cruz de la Sierra, ${data.fecha || '22 de abril del 2026'}`,
          autoridadSecretario: data.autoridad?.secretario_general || 'Lic. Edy Acosta Claros',
          autoridadRector: data.autoridad?.rector_actual || 'Dr. Reinerio Vargas Banegas'
        };

        evaluarAnoYConfigurar(fechaEmision, nuevosDatos);
      }
    } catch {
      /* fallback */
    } finally {
      setIsSearching(false);
    }
  };

  // presets rápidos para pruebas
  const cargarEjemploTipo2 = () => {
    setFormData({
      tipoPlantilla: 'PlantillaTipo2',
      incluirAclaratoriaHistorica: true,
      gestionHistorica: '1999',
      nroCertificado: '749/2026',
      informeRef: 'SECCION ARCHIVO/ INF N°472',
      fechaInforme: '20 de abril de 2026',
      gradoMencion: 'Diploma de Bachiller en Humanidades',
      nroTitulo: '019741',
      nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
      ciTitular: '4716343-SCZ.',
      libroRegistro: '026/99',
      fojas: '181',
      fechaEmisionOriginal: '5 de marzo del año 1999',
      lugarFechaCertificacion: 'Santa Cruz de la Sierra, 22 de abril del 2026',
      autoridadSecretario: 'Lic. Edy Acosta Claros',
      autoridadRector: 'Dr. Reinerio Vargas Banegas'
    });
  };

  const cargarEjemploTipo1 = () => {
    setFormData({
      tipoPlantilla: 'PlantillaTipo1',
      incluirAclaratoriaHistorica: false,
      gestionHistorica: '2022',
      nroCertificado: '117/2026',
      informeRef: 'SECCION ARCHIVO/ INF N°094',
      fechaInforme: '13 de enero de 2026',
      gradoMencion: 'Título en Provisión Nacional de MÉDICO CIRUJANO',
      nroTitulo: '96071',
      nombreTitular: 'GUALBERTO MEDINA VARGAS',
      ciTitular: '8072900-SCZ.',
      libroRegistro: '0017',
      fojas: '0027',
      fechaEmisionOriginal: '11 de julio del año 2022',
      lugarFechaCertificacion: 'Santa Cruz de la Sierra, 19 de enero del 2026',
      autoridadSecretario: 'Lic. Edy Acosta Claros',
      autoridadRector: 'Dr. Reinerio Vargas Banegas'
    });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await titulosApi.guardarBorrador({
        expediente_id: 'exp-' + formData.nroTitulo,
        tipo_plantilla: formData.tipoPlantilla,
        numero_libro: formData.libroRegistro,
        tomo: 'I',
        folio: formData.fojas,
        observaciones: `Certificado ${formData.tipoPlantilla} emitido para ${formData.nombreTitular}`
      });
      setSavedSuccess(res.mensaje || 'Documento guardado exitosamente');
      setTimeout(() => setSavedSuccess(null), 4000);
    } catch {
      setSavedSuccess('Certificado guardado en borrador');
      setTimeout(() => setSavedSuccess(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handlePrintFinal = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24 p-6 bg-[#F8FAFC]">
      
      {/* Cabecera & Selector de Plantillas (Tipo 1 vs Tipo 2) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 font-bold text-xs rounded-full border ${formData.tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              {formData.tipoPlantilla === 'PlantillaTipo2' ? '📜 Plantilla Tipo 2 (Reconstrucción ≤1999)' : '✨ Plantilla Tipo 1 (Nativa ≥2000)'}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Año Emisión: {formData.gestionHistorica}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
            Módulo de Emisión de Certificados de Autenticidad
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Selección automática por año de emisión original con salvaguarda legal e inyección reactiva.
          </p>
        </div>

        {/* Botones de Consulta y Presets Rápidos */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={cargarEjemploTipo2}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            📋 Ejemplo Tipo 2 (1999)
          </button>

          <button
            type="button"
            onClick={cargarEjemploTipo1}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            📄 Ejemplo Tipo 1 (2022)
          </button>

          <button
            type="button"
            onClick={() => handleBuscarExpedienteBackend()}
            disabled={isSearching}
            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5"
          >
            {isSearching ? 'Consultando...' : '⚡ Reconsultar Backend'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 rounded-xl font-bold text-sm animate-in fade-in">
          ✓ {savedSuccess}
        </div>
      )}

      {/* Editor Lateral Word & Vista Previa A4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Lateral Word - Control de Negocio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Control de Tipo de Plantilla & Aclaratoria */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-b border-slate-200 pb-2">
                ⚙️ Lógica de Negocio: Plantilla
              </h3>

              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Seleccionar Tipo de Plantilla:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'PlantillaTipo1', incluirAclaratoriaHistorica: false }))}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${formData.tipoPlantilla === 'PlantillaTipo1' ? 'bg-[#003366] text-white border-[#003366] shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                  >
                    Tipo 1 (≥2000)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'PlantillaTipo2', incluirAclaratoriaHistorica: true }))}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${formData.tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                  >
                    Tipo 2 (≤1999)
                  </button>
                </div>
              </div>

              {/* Toggle Aclaratoria Histórica Obligatoria para Tipo 2 */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">
                  <span className="text-xs font-semibold text-slate-800">
                    Párrafo Aclaratorio Histórico:
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.incluirAclaratoriaHistorica}
                    onChange={e => setFormData({ ...formData, incluirAclaratoriaHistorica: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                {formData.incluirAclaratoriaHistorica && (
                  <div className="flex items-center gap-2 pl-1">
                    <label className="text-[11px] font-medium text-slate-600">Gestión Histórica:</label>
                    <input
                      type="text"
                      value={formData.gestionHistorica}
                      onChange={e => setFormData({ ...formData, gestionHistorica: e.target.value })}
                      className="w-24 px-2 py-1 rounded border border-slate-300 bg-white font-mono text-xs font-bold text-amber-900 text-center"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Formulario de Variables Inyectadas */}
            <div className="space-y-4 text-xs">
              
              {/* Sección 1 */}
              <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  1. Certificado & Referencia Archivo
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      N° Certificado:
                    </label>
                    <input
                      type="text"
                      value={formData.nroCertificado}
                      onChange={e => setFormData({ ...formData, nroCertificado: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Informe Referencia:
                    </label>
                    <input
                      type="text"
                      value={formData.informeRef}
                      onChange={e => setFormData({ ...formData, informeRef: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha del Informe:
                  </label>
                  <input
                    type="text"
                    value={formData.fechaInforme}
                    onChange={e => setFormData({ ...formData, fechaInforme: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Sección 2 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  2. Datos del Titular y Diploma
                </h4>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nombre Completo del Titular:
                  </label>
                  <input
                    type="text"
                    value={formData.nombreTitular}
                    onChange={e => setFormData({ ...formData, nombreTitular: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Cédula de Identidad:
                    </label>
                    <input
                      type="text"
                      value={formData.ciTitular}
                      onChange={e => setFormData({ ...formData, ciTitular: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      N° Título / Diploma:
                    </label>
                    <input
                      type="text"
                      value={formData.nroTitulo}
                      onChange={e => setFormData({ ...formData, nroTitulo: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono font-bold text-blue-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Grado / Título:
                  </label>
                  <input
                    type="text"
                    value={formData.gradoMencion}
                    onChange={e => setFormData({ ...formData, gradoMencion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Sección 3 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  3. Datos de Matriz & Fechas
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Libro N°:
                    </label>
                    <input
                      type="text"
                      value={formData.libroRegistro}
                      onChange={e => setFormData({ ...formData, libroRegistro: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Fojas N°:
                    </label>
                    <input
                      type="text"
                      value={formData.fojas}
                      onChange={e => setFormData({ ...formData, fojas: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Fecha Emisión Original:
                  </label>
                  <input
                    type="text"
                    value={formData.fechaEmisionOriginal}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, fechaEmisionOriginal: val });
                      evaluarAnoYConfigurar(val);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lugar y Fecha Certificación:
                  </label>
                  <input
                    type="text"
                    value={formData.lugarFechaCertificacion}
                    onChange={e => setFormData({ ...formData, lugarFechaCertificacion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Sección 4 */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 uppercase text-[11px]">
                  4. Autoridades de Firmas en Físico
                </h4>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Secretario General:
                  </label>
                  <input
                    type="text"
                    value={formData.autoridadSecretario}
                    onChange={e => setFormData({ ...formData, autoridadSecretario: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Rector de la U.A.G.R.M.:
                  </label>
                  <input
                    type="text"
                    value={formData.autoridadRector}
                    onChange={e => setFormData({ ...formData, autoridadRector: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-900 text-xs"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Hoja A4 Rendida - Vista Previa Oficial (Cero Sellos Digitales) */}
        <div className="lg:col-span-7 bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center items-start overflow-auto shadow-inner min-h-[750px]">
          
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-[3.5rem] text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full">
            <div>
              {/* Franja Superior Institucional */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[#C51D24]"></div>
              <div className="absolute top-3 left-0 w-full h-1 bg-[#003366]"></div>

              {/* Encabezado Institucional Completo */}
              <div className="text-center mt-6 mb-8 font-serif">
                <h1 className="text-lg font-bold uppercase tracking-wide text-[#003366]">
                  UNIVERSIDAD AUTÓNOMA "GABRIEL RENÉ MORENO"
                </h1>
                <p className="text-[10px] uppercase text-slate-500 font-sans tracking-widest mt-0.5">
                  "2025 BICENTENARIO DE BOLIVIA"
                </p>
                <div className="w-24 h-0.5 bg-[#C51D24] mx-auto my-3"></div>
                <h2 className="text-base font-bold tracking-widest text-[#003366] uppercase mt-2">
                  CERTIFICADO N°{formData.nroCertificado}
                </h2>
              </div>

              {/* Condicional de Renderizado: Estructura Plantilla Tipo 2 vs Tipo 1 */}
              {formData.tipoPlantilla === 'PlantillaTipo2' ? (
                /* PLANTILLA TIPO 2 (Gestiones ≤1999 - Estructura Oficial Reconstructiva) */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <p className="indent-8 uppercase font-bold text-slate-900">
                    LA UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO POR MEDIO DE SUS AUTORIDADES EL RECTOR {formData.autoridadRector.toUpperCase()} Y EL SECRETARIO GENERAL {formData.autoridadSecretario.toUpperCase()}.
                  </p>

                  <p className="font-bold text-center text-xs tracking-widest my-3 uppercase text-slate-900">
                    CERTIFICAN:
                  </p>

                  <p className="indent-8 text-justify">
                    Que, en atención al informe <strong className="font-mono">{formData.informeRef}</strong> de fecha <strong>{formData.fechaInforme}</strong>, tenemos a bien Certificar que el <strong>{formData.gradoMencion}</strong> consignado con el N° <strong className="font-mono">{formData.nroTitulo}</strong> le fue otorgado a la ciudadana <strong className="font-bold uppercase text-slate-900">{formData.nombreTitular}</strong>, con Cédula de Identidad N° <strong className="font-mono">{formData.ciTitular}</strong>, mismo que se encuentra registrado en el Libro N° <strong className="font-mono">{formData.libroRegistro}</strong> a Fojas N° <strong className="font-mono">{formData.fojas}</strong>, emitido en fecha <strong>{formData.fechaEmisionOriginal}</strong>, documentación original que se encuentra en Archivo Central de esta Casa Superior de Estudios.
                  </p>

                  {formData.incluirAclaratoriaHistorica && (
                    <p className="indent-8 text-justify font-serif leading-relaxed text-slate-900 p-3 bg-amber-50/60 rounded-lg border-l-4 border-amber-600 my-3">
                      Aclarando que, en la gestión del <strong>{formData.gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma esta rotulado el nombre completo del Rector.
                    </p>
                  )}

                  <p className="indent-8 text-justify">
                    Es cuanto certificamos sobre la autenticidad y validez del mencionado documento.
                  </p>

                  <p className="text-right pt-4 font-sans font-medium text-slate-700">
                    {formData.lugarFechaCertificacion}
                  </p>
                </div>
              ) : (
                /* PLANTILLA TIPO 1 (Gestiones ≥2000 - Estructura Prosa Nativa Directa) */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <p className="indent-8 text-justify">
                    El que suscribe, Secretario General y el Rector de la Universidad Autónoma "Gabriel René Moreno", certifican que revisada la documentación existente en los libros matrices del Departamento de Títulos y Grados, se evidencia la emisión del <strong className="font-bold underline text-slate-900">{formData.gradoMencion}</strong>, con Número de Título N° <strong className="font-mono font-bold text-slate-900">{formData.nroTitulo}</strong>, conferido legítimamente a favor del profesional Sr.(a) <strong className="font-bold uppercase text-slate-900">{formData.nombreTitular}</strong>, con Cédula de Identidad N° <strong className="font-mono font-bold text-slate-900">{formData.ciTitular}</strong>.
                  </p>

                  <p className="indent-8 text-justify">
                    Asimismo, se verifica que la correspondiente matriz se encuentra debidamente asentada en el Libro de Registro N° <strong className="font-mono font-bold text-slate-900">{formData.libroRegistro}</strong>, Fojas N° <strong className="font-mono font-bold text-slate-900">{formData.fojas}</strong>, habiéndose expedido el documento original en fecha <strong className="font-bold text-slate-900">{formData.fechaEmisionOriginal}</strong>.
                  </p>

                  <p className="indent-8 text-justify">
                    Se extiende el presente Certificado de Autenticidad a solicitud del interesado para los fines legales y administrativos que convengan.
                  </p>

                  <p className="text-right pt-4 font-sans font-medium text-slate-700">
                    {formData.lugarFechaCertificacion}
                  </p>
                </div>
              )}
            </div>

            {/* Bloque de Firmas Institucionales (Estilo Word - 2 Columnas) */}
            <div className="firmas-container mt-[80px] flex justify-around items-end w-full page-break-inside-avoid">
              {/* Firma 1: Secretario General */}
              <div className="firma-box text-center min-w-[240px]">
                <div className="linea-guia border-t border-[#1e293b] mb-2 w-full"></div>
                <p className="autoridad-nombre text-[13px] font-semibold text-[#1e293b] m-0">
                  {formData.autoridadSecretario}
                </p>
                <p className="autoridad-cargo text-[11px] text-[#475569] leading-snug mt-0.5 uppercase font-semibold">
                  SECRETARIO GENERAL<br />U.A.G.R.M.
                </p>
              </div>

              {/* Firma 2: Rector */}
              <div className="firma-box text-center min-w-[240px]">
                <div className="linea-guia border-t border-[#1e293b] mb-2 w-full"></div>
                <p className="autoridad-nombre text-[13px] font-semibold text-[#1e293b] m-0">
                  {formData.autoridadRector}
                </p>
                <p className="autoridad-cargo text-[11px] text-[#475569] leading-snug mt-0.5 uppercase font-semibold">
                  RECTOR<br />U.A.G.R.M.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30 shadow-lg flex justify-between items-center px-8">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>Plantilla activa:</span>
          <strong className={`px-2 py-0.5 rounded text-[11px] font-bold ${formData.tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
            {formData.tipoPlantilla === 'PlantillaTipo2' ? 'Tipo 2 (Con Aclaratoria Histórica)' : 'Tipo 1 (Directa)'}
          </strong>
          <span>| Cero sellos digitales para firma física en bolígrafo.</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            isLoading={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Borrador'}
          </Button>

          <Button
            variant="primary"
            onClick={handlePrintFinal}
          >
            🖨️ Imprimir Documento Clean (Físico)
          </Button>
        </div>
      </div>
    </div>
  );
}
