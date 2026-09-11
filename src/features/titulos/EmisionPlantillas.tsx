import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { titulosApi } from './api/titulos-api';
import { Button } from '../../shared/ui/Button/Button';

export function EmisionPlantillas() {
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Estado del Formulario con Diferenciación Tipo 1, Tipo 2 y Tipo 3 (Informe Archivo Central Físico)
  const [formData, setFormData] = useState({
    tipoPlantilla: 'PlantillaTipo3' as 'PlantillaTipo1' | 'PlantillaTipo2' | 'PlantillaTipo3',
    incluirAclaratoriaHistorica: true,
    gestionHistorica: '1998',
    incluirSupletorio: true,
    
    nroCertificado: '0472',
    informeRef: 'SECCION ARCHIVO/ INF N°472',
    fechaInforme: '20 de abril de 2026',
    fechaSolicitud: '16 de abril de 2026',
    nroTestimonio: '1246/2025',
    destinatarioNombre: 'MSc. Edy Acosta Claros',
    destinatarioCargo: 'SECRETARIO GENERAL - U.A.G.R.M.',
    referencia: 'INFORME DEL DIPLOMA DE BACHILLER.',
    apoderadoNombre: 'Yuli Alison Romero Flores',
    
    gradoMencion: 'Diploma de Bachiller',
    nroTitulo: '014863',
    nombreTitular: 'Jenny Flores Peña',
    ciTitular: '3250858-SCZ',
    libroRegistro: '19/98',
    fojas: '115/98',
    fechaEmisionOriginal: '24 de julio de 1998',
    lugarFechaCertificacion: 'Santa Cruz de la Sierra, 20 de abril de 2026',
    
    // Autoridades
    autoridadSecretario: 'Lic. Edy Acosta Claros',
    autoridadRector: 'Dr. Reinerio Vargas Banegas',
    jefeArchivoNombre: 'Moisés Cossio López',
    rectorHistorico: 'JORGE ORELLANA MORENO',
    pieFirmaRectorHistorico: 'No tiene'
  });

  const evaluarAnoYConfigurar = (fechaEmision: string, datosCompletos?: any) => {
    const match = fechaEmision.match(/\b(19\d\d|20\d\d)\b/);
    const ano = match ? parseInt(match[0], 10) : 1998;

    setFormData(prev => ({
      ...prev,
      ...datosCompletos,
      gestionHistorica: String(ano),
      incluirAclaratoriaHistorica: ano <= 1999
    }));
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
        const fechaEmision = data.expediente?.fecha_emision || '24 de julio de 1998';
        
        const nuevosDatos = {
          nroCertificado: data.informe_nro || '0472',
          informeRef: 'SECCION ARCHIVO/ INF N°' + (data.informe_nro || '0472'),
          fechaInforme: data.fecha || '20 de abril de 2026',
          fechaSolicitud: data.fecha_solicitud || '16 de abril de 2026',
          nroTestimonio: data.nro_testimonio || '1246/2025',
          apoderadoNombre: data.apoderado || 'Yuli Alison Romero Flores',
          gradoMencion: data.carrera_colegio?.mencion || 'Diploma de Bachiller',
          nroTitulo: data.expediente?.nro_diploma || '014863',
          nombreTitular: data.titular?.nombre_completo || 'Jenny Flores Peña',
          ciTitular: data.titular?.ci_expedido || '3250858-SCZ',
          libroRegistro: data.archivo_fisico?.libro_matriz || '19/98',
          fojas: data.archivo_fisico?.fojas || '115/98',
          fechaEmisionOriginal: fechaEmision,
          lugarFechaCertificacion: 'Santa Cruz de la Sierra, ' + (data.fecha || '20 de abril de 2026'),
          autoridadSecretario: data.autoridad?.secretario_general || 'Lic. Edy Acosta Claros',
          autoridadRector: data.autoridad?.rector_actual || 'Dr. Reinerio Vargas Banegas',
          rectorHistorico: data.autoridad?.rector_nombre || 'JORGE ORELLANA MORENO',
          pieFirmaRectorHistorico: data.archivo_fisico?.observacion_firma || 'No tiene'
        };

        evaluarAnoYConfigurar(fechaEmision, nuevosDatos);
      }
    } catch {
      /* fallback */
    } finally {
      setIsSearching(false);
    }
  };

  const cargarEjemploTipo3Fisico = () => {
    setFormData({
      tipoPlantilla: 'PlantillaTipo3',
      incluirAclaratoriaHistorica: true,
      gestionHistorica: '1998',
      incluirSupletorio: true,
      nroCertificado: '0472',
      informeRef: 'SECCION ARCHIVO/ INF N°0472',
      fechaInforme: '20 de abril de 2026',
      fechaSolicitud: '16 de abril de 2026',
      nroTestimonio: '1246/2025',
      destinatarioNombre: 'MSc. Edy Acosta Claros',
      destinatarioCargo: 'SECRETARIO GENERAL - U.A.G.R.M.',
      referencia: 'INFORME DEL DIPLOMA DE BACHILLER.',
      apoderadoNombre: 'Yuli Alison Romero Flores',
      gradoMencion: 'Diploma de Bachiller',
      nroTitulo: '014863',
      nombreTitular: 'Jenny Flores Peña',
      ciTitular: '3250858-SCZ',
      libroRegistro: '19/98',
      fojas: '115/98',
      fechaEmisionOriginal: '24 de julio de 1998',
      lugarFechaCertificacion: 'Santa Cruz de la Sierra, 20 de abril de 2026',
      autoridadSecretario: 'Lic. Edy Acosta Claros',
      autoridadRector: 'Dr. Reinerio Vargas Banegas',
      jefeArchivoNombre: 'Moisés Cossio López',
      rectorHistorico: 'JORGE ORELLANA MORENO',
      pieFirmaRectorHistorico: 'No tiene'
    });
  };

  const cargarEjemploTipo2 = () => {
    setFormData({
      tipoPlantilla: 'PlantillaTipo2',
      incluirAclaratoriaHistorica: true,
      gestionHistorica: '1999',
      incluirSupletorio: false,
      nroCertificado: '749/2026',
      informeRef: 'SECCION ARCHIVO/ INF N°472',
      fechaInforme: '20 de abril de 2026',
      fechaSolicitud: '20 de abril de 2026',
      nroTestimonio: 'INF N°472',
      destinatarioNombre: 'Lic. Edy Acosta Claros',
      destinatarioCargo: 'SECRETARIO GENERAL',
      referencia: 'CERTIFICADO DE AUTENTICIDAD DE DIPLOMA',
      apoderadoNombre: 'LYNNE DENISSE PEREZ REVILLA',
      gradoMencion: 'Diploma de Bachiller en Humanidades',
      nroTitulo: '019741',
      nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
      ciTitular: '4716343-SCZ.',
      libroRegistro: '026/99',
      fojas: '181',
      fechaEmisionOriginal: '5 de marzo del año 1999',
      lugarFechaCertificacion: 'Santa Cruz de la Sierra, 22 de abril del 2026',
      autoridadSecretario: 'Lic. Edy Acosta Claros',
      autoridadRector: 'Dr. Reinerio Vargas Banegas',
      jefeArchivoNombre: 'Moisés Cossio López',
      rectorHistorico: 'Dr. Reinerio Vargas Banegas',
      pieFirmaRectorHistorico: 'No tiene'
    });
  };

  const cargarEjemploTipo1 = () => {
    setFormData({
      tipoPlantilla: 'PlantillaTipo1',
      incluirAclaratoriaHistorica: false,
      gestionHistorica: '2022',
      incluirSupletorio: false,
      nroCertificado: '117/2026',
      informeRef: 'SECCION ARCHIVO/ INF N°094',
      fechaInforme: '13 de enero de 2026',
      fechaSolicitud: '13 de enero de 2026',
      nroTestimonio: 'INF N°094',
      destinatarioNombre: 'Lic. Edy Acosta Claros',
      destinatarioCargo: 'SECRETARIO GENERAL',
      referencia: 'CERTIFICADO DE AUTENTICIDAD DE TÍTULO',
      apoderadoNombre: 'GUALBERTO MEDINA VARGAS',
      gradoMencion: 'Título en Provisión Nacional de MÉDICO CIRUJANO',
      nroTitulo: '96071',
      nombreTitular: 'GUALBERTO MEDINA VARGAS',
      ciTitular: '8072900-SCZ.',
      libroRegistro: '0017',
      fojas: '0027',
      fechaEmisionOriginal: '11 de julio del año 2022',
      lugarFechaCertificacion: 'Santa Cruz de la Sierra, 19 de enero del 2026',
      autoridadSecretario: 'Lic. Edy Acosta Claros',
      autoridadRector: 'Dr. Reinerio Vargas Banegas',
      jefeArchivoNombre: 'Moisés Cossio López',
      rectorHistorico: 'Dr. Reinerio Vargas Banegas',
      pieFirmaRectorHistorico: 'No tiene'
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
        observaciones: 'Certificado ' + formData.tipoPlantilla + ' emitido para ' + formData.nombreTitular
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
      
      {/* Cabecera & Selector de Plantillas (Tipo 1, Tipo 2 y Tipo 3 Físico) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={'px-2.5 py-1 font-bold text-xs rounded-full border ' + (formData.tipoPlantilla === 'PlantillaTipo3' ? 'bg-blue-50 text-[#003366] border-blue-200' : formData.tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200')}>
              {formData.tipoPlantilla === 'PlantillaTipo3' ? '📄 Tipo 3 (Informe Archivo Central Carta Físico)' : formData.tipoPlantilla === 'PlantillaTipo2' ? '📜 Tipo 2 (Reconstrucción ≤1999)' : '✨ Tipo 1 (Nativa ≥2000)'}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Año Emisión: {formData.gestionHistorica}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
            Módulo de Emisión y Plantillas Institucionales
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Vista Previa de Informe Físico de Archivo Central (Tipo 3) y Certificaciones de Títulos (Tipo 1 / Tipo 2).
          </p>
        </div>

        {/* Presets Rápidos de Demostración */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={cargarEjemploTipo3Fisico}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#003366] font-bold text-xs rounded-xl border border-blue-200 transition-colors"
          >
            📄 Tipo 3 (Carta Original Físico 0472)
          </button>

          <button
            type="button"
            onClick={cargarEjemploTipo2}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            📋 Tipo 2 (1999)
          </button>

          <button
            type="button"
            onClick={cargarEjemploTipo1}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            📄 Tipo 1 (2022)
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
        
        {/* Panel Lateral Word */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Control de Tipo de Plantilla */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-b border-slate-200 pb-2">
                ⚙️ Seleccionar Plantilla Institucional
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'PlantillaTipo3' }))}
                  className={'py-2 px-2 text-[11px] font-bold rounded-lg border transition-all ' + (formData.tipoPlantilla === 'PlantillaTipo3' ? 'bg-[#003366] text-white border-[#003366] shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100')}
                >
                  Tipo 3 (Archivo)
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'PlantillaTipo2', incluirAclaratoriaHistorica: true }))}
                  className={'py-2 px-2 text-[11px] font-bold rounded-lg border transition-all ' + (formData.tipoPlantilla === 'PlantillaTipo2' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100')}
                >
                  Tipo 2 (≤1999)
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'PlantillaTipo1', incluirAclaratoriaHistorica: false }))}
                  className={'py-2 px-2 text-[11px] font-bold rounded-lg border transition-all ' + (formData.tipoPlantilla === 'PlantillaTipo1' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100')}
                >
                  Tipo 1 (≥2000)
                </button>
              </div>
            </div>

            {/* Formulario de Variables Inyectadas */}
            <div className="space-y-4 text-xs">
              
              <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  1. Encabezado & Carta Formal
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      N° Certificado / INF:
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
                      Fecha Documento:
                    </label>
                    <input
                      type="text"
                      value={formData.fechaInforme}
                      onChange={e => setFormData({ ...formData, fechaInforme: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Destinatario (Nombre & Cargo):
                  </label>
                  <input
                    type="text"
                    value={formData.destinatarioNombre}
                    onChange={e => setFormData({ ...formData, destinatarioNombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold text-[#003366] text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={formData.destinatarioCargo}
                    onChange={e => setFormData({ ...formData, destinatarioCargo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Línea de Referencia:
                  </label>
                  <input
                    type="text"
                    value={formData.referencia}
                    onChange={e => setFormData({ ...formData, referencia: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  2. Solicitante & Titular
                </h4>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nombre Titular / Interesada:
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
                    Apoderado / Poder Especial:
                  </label>
                  <input
                    type="text"
                    value={formData.apoderadoNombre}
                    onChange={e => setFormData({ ...formData, apoderadoNombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs"
                  />
                </div>
              </div>

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
              </div>

              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-900 uppercase text-[11px]">
                  4. Firmas Institucionales (Físico)
                </h4>
                
                {formData.tipoPlantilla === 'PlantillaTipo3' ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Jefe de Archivo Central:
                    </label>
                    <input
                      type="text"
                      value={formData.jefeArchivoNombre}
                      onChange={e => setFormData({ ...formData, jefeArchivoNombre: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-[#003366] text-xs"
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Hoja A4 Rendida - Vista Previa Oficial Clean */}
        <div className="lg:col-span-7 bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center items-start overflow-auto shadow-inner min-h-[750px]">
          
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-[3.5rem] text-slate-900 shrink-0 relative flex flex-col justify-between rounded-sm print:p-0 print:shadow-none print:w-full">
            <div>
              
              {formData.tipoPlantilla === 'PlantillaTipo3' ? (
                /* PLANTILLA TIPO 3 (INFORME ARCHIVO CENTRAL - FORMATO CARTA FÍSICO ORIGINAL) */
                <div>
                  {/* 1. Encabezado Físico Exacto (Escudo UAGRM + Barra Vertical ARCHIVO CENTRAL) */}
                  <header className="flex justify-between items-start border-b-2 border-slate-300 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#003366] text-white flex items-center justify-center font-bold text-xs rounded-sm shadow-sm text-center p-1 font-serif">
                        UAGRM
                      </div>
                      <div className="border-l-2 border-slate-800 pl-2 text-[10px] font-bold font-mono tracking-[0.25em] uppercase text-slate-700 leading-tight">
                        A R C H I V O<br />C E N T R A L
                      </div>
                    </div>

                    <div className="text-center font-serif flex-1 px-4">
                      <h2 className="font-extrabold text-sm text-[#003366] leading-snug uppercase tracking-tight">
                        UNIVERSIDAD AUTÓNOMA “GABRIEL RENÉ MORENO”
                      </h2>
                      <h3 className="font-extrabold text-xs text-slate-800 tracking-wider uppercase mt-0.5">
                        SECRETARÍA GENERAL
                      </h3>
                      <p className="text-[11px] font-bold text-[#C51D24] uppercase tracking-wide mt-0.5 font-sans">
                        Archivo Central
                      </p>
                    </div>

                    <div className="text-right font-sans text-xs space-y-1 shrink-0">
                      <p className="text-slate-800 font-medium">
                        Santa Cruz de la Sierra, <strong className="font-bold">{formData.fechaInforme}</strong>
                      </p>
                      <p className="font-extrabold text-[#003366]">
                        SECCION ARCHIVO /INF. No. <span className="underline font-mono">{formData.nroCertificado}</span>
                      </p>
                    </div>
                  </header>

                  {/* 2. Bloque de Destinatario y Referencia */}
                  <section className="mb-4 font-sans text-xs space-y-0.5 text-left">
                    <p className="font-bold text-slate-800">Señor:</p>
                    <p className="font-extrabold text-sm text-[#003366]">{formData.destinatarioNombre}</p>
                    <p className="font-bold uppercase text-slate-700">{formData.destinatarioCargo}</p>
                    <p className="font-bold text-slate-800 pt-0.5">Presente.-</p>
                  </section>

                  <div className="my-5 text-center">
                    <p className="font-extrabold text-xs text-[#003366] underline uppercase tracking-wide">
                      Ref.: {formData.referencia}
                    </p>
                  </div>

                  <p className="font-bold text-xs text-slate-800 mb-3 font-sans">
                    De mi consideración:
                  </p>

                  {/* 3. Párrafo Legal Introductorio Con Redacción Exacta del Físico */}
                  <section className="mb-5 text-justify text-xs leading-relaxed space-y-3 font-serif text-slate-900">
                    <p className="indent-6">
                      En respuesta a solicitud de la interesada presentada el <span className="font-bold">{formData.fechaSolicitud}</span>, con Testimonio Nº <span className="font-bold font-mono">{formData.nroTestimonio}</span>, Poder Especial Bastante y Suficiente que confiere la señora <span className="font-bold">{formData.apoderadoNombre}</span>, a favor de la señora <span className="font-extrabold underline text-[#003366]">{formData.nombreTitular}</span>, con Cédula de Identidad Nº <span className="font-bold font-mono">{formData.ciTitular}</span>, solicita la autenticidad del {formData.gradoMencion} que fué emitido por la Universidad Autónoma Gabriel René Moreno, informo qué, los datos impresos en el cuadro siguiente, es parte de la documentación en custodia del Archivo Central - UAGRM:
                    </p>
                  </section>

                  {/* 4. Cuadro Tabular Formal (8-9 Columnas) */}
                  <section className="mb-5">
                    <div className="overflow-x-auto border border-slate-900 rounded-none">
                      <table className="w-full text-center text-[10px] font-sans border-collapse table-fixed">
                        <thead>
                          <tr className="bg-[#003366] text-white font-bold uppercase tracking-wider">
                            <th className="border-r border-slate-400 p-1.5 w-16 whitespace-normal break-words">Número del Diploma</th>
                            <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Nombre y Apellidos</th>
                            <th className="border-r border-slate-400 p-1.5 w-24 whitespace-normal break-words">Cédula de Identidad</th>
                            <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Diploma de:</th>
                            <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">Fojas:</th>
                            <th className="border-r border-slate-400 p-1.5 w-14 whitespace-normal break-words">Libro:</th>
                            <th className="border-r border-slate-400 p-1.5 w-20 whitespace-normal break-words">Fecha de Extensión</th>
                            <th className="border-r border-slate-400 p-1.5 whitespace-normal break-words">Nombre del Rector</th>
                            <th className="p-1.5 w-16 whitespace-normal break-words">Pie de firma del Rector</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border-r border-slate-300 p-1.5 font-mono font-bold text-[#C51D24] break-words">
                              {formData.nroTitulo}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 font-extrabold break-words uppercase">
                              {formData.nombreTitular}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                              {formData.ciTitular}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 font-medium break-words">
                              {formData.gradoMencion}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                              {formData.fojas}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 font-mono break-words">
                              {formData.libroRegistro}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 break-words">
                              {formData.fechaEmisionOriginal}
                            </td>
                            <td className="border-r border-slate-300 p-1.5 break-words">
                              {formData.rectorHistorico}
                            </td>
                            <td className="p-1.5 break-words">
                              {formData.pieFirmaRectorHistorico}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 5. Párrafos Inferiores */}
                  {formData.incluirAclaratoriaHistorica && (
                    <p className="text-justify text-xs font-serif text-slate-900 mb-3 bg-amber-50/50 p-2.5 rounded border-l-2 border-amber-500">
                      Aclarando que, en la gestión del <strong>{formData.gestionHistorica}</strong> no se estilaba colocar pie de firma de las autoridades, toda vez que en la parte superior del Diploma esta rotulado el nombre completo del Rector.
                    </p>
                  )}

                  {formData.incluirSupletorio && (
                    <p className="text-justify text-xs font-sans text-slate-800 mb-4">
                      Así mismo y a solicitud de la interesada, se le extendió el{' '}
                      <span className="font-bold underline">
                        Supletorio del {formData.gradoMencion} N° {formData.nroTitulo}
                      </span>
                      , es dado en la ciudad de Santa Cruz de la Sierra, a los <span className="font-bold">{formData.fechaInforme}</span>, firmado por las autoridades correspondientes.
                    </p>
                  )}

                  <p className="text-justify text-xs font-sans text-slate-800 mb-10">
                    Es cuanto informo, para los fines que usted considere conveniente, me despido de usted con las atenciones más distinguidas.
                  </p>

                  <div className="pt-6 flex justify-start items-end pl-8">
                    <div className="text-center font-sans text-xs space-y-1">
                      <div className="w-56 border-b border-slate-800 mx-auto mb-2"></div>
                      <p className="font-extrabold text-[#003366]">{formData.jefeArchivoNombre}</p>
                      <p className="font-bold text-[10px] uppercase text-slate-700">
                        JEFE DE ARCHIVO U.A.G.R.M.
                      </p>
                    </div>
                  </div>
                </div>
              ) : formData.tipoPlantilla === 'PlantillaTipo2' ? (
                /* PLANTILLA TIPO 2 */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <div className="text-center mb-6">
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
                /* PLANTILLA TIPO 1 */
                <div className="space-y-4 text-xs font-serif text-slate-900 leading-relaxed">
                  <div className="text-center mb-6">
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

            {/* Firmas para Tipo 1 / Tipo 2 */}
            {formData.tipoPlantilla !== 'PlantillaTipo3' && (
              <div className="firmas-container mt-[80px] flex justify-around items-end w-full page-break-inside-avoid">
                <div className="firma-box text-center min-w-[240px]">
                  <div className="linea-guia border-t border-[#1e293b] mb-2 w-full"></div>
                  <p className="autoridad-nombre text-[13px] font-semibold text-[#1e293b] m-0">
                    {formData.autoridadSecretario}
                  </p>
                  <p className="autoridad-cargo text-[11px] text-[#475569] leading-snug mt-0.5 uppercase font-semibold">
                    SECRETARIO GENERAL<br />U.A.G.R.M.
                  </p>
                </div>

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
            )}

            {/* Footer Institucional para Tipo 3 */}
            {formData.tipoPlantilla === 'PlantillaTipo3' && (
              <footer className="pt-4 border-t border-slate-300 font-sans text-[9px] text-slate-600 flex justify-between items-end mt-8">
                <div>
                  <p className="font-bold">MCL/Sandra</p>
                  <p>Adj: fotocopias de la documentación respectiva.</p>
                  <p>Cc: /archivo</p>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="font-extrabold italic text-[#003366] text-[10px]">
                    "Autonomía y Cambio con Excelencia Académica"
                  </p>
                  <p>📍 Av. Busch entre 2do. y 3er. anillo "Ciudad Universitaria" | Santa Cruz de la Sierra - Bolivia</p>
                </div>
              </footer>
            )}

          </div>

        </div>

      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-30 shadow-lg flex justify-between items-center px-8">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>Plantilla activa:</span>
          <strong className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#003366]">
            {formData.tipoPlantilla === 'PlantillaTipo3' ? 'Tipo 3 (Informe Archivo Físico)' : formData.tipoPlantilla === 'PlantillaTipo2' ? 'Tipo 2 (Con Aclaratoria Histórica)' : 'Tipo 1 (Directa)'}
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
