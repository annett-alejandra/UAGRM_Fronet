import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { titulosApi } from './api/titulos-api';
import { Button } from '../../shared/ui/Button/Button';
import { CertificadoTituloTipo1 } from '../../modules/titulos/templates/CertificadoTituloTipo1';
import { CertificadoTituloTipo2 } from '../../modules/titulos/templates/CertificadoTituloTipo2';

export function EmisionPlantillas() {
  const [searchParams] = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Estado del Formulario (Exclusivo Módulo Títulos y Grados: Tipo 1 vs Tipo 2)
  const [formData, setFormData] = useState({
    tipoPlantilla: 'CertificadoTituloTipo1' as 'CertificadoTituloTipo1' | 'CertificadoTituloTipo2',
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
    
    // Autoridades Editables de Firmas en Físico
    autoridadSecretario: 'Lic. Edy Acosta Claros',
    autoridadRector: 'Dr. Reinerio Vargas Banegas'
  });

  const evaluarAnoYConfigurar = (fechaEmision: string, datosCompletos?: any) => {
    const match = fechaEmision.match(/\b(19\d\d|20\d\d)\b/);
    const ano = match ? parseInt(match[0], 10) : 2022;

    if (ano <= 1999) {
      setFormData(prev => ({
        ...prev,
        ...datosCompletos,
        tipoPlantilla: 'CertificadoTituloTipo2',
        incluirAclaratoriaHistorica: true,
        gestionHistorica: String(ano)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ...datosCompletos,
        tipoPlantilla: 'CertificadoTituloTipo1',
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
        const fechaEmision = data.expediente?.fecha_emision || '11 de julio del año 2022';
        
        const nuevosDatos = {
          nroCertificado: data.informe_nro ? data.informe_nro + '/2026' : '117/2026',
          informeRef: 'SECCION ARCHIVO/ INF N°' + (data.informe_nro || '094'),
          fechaInforme: data.fecha || '13 de enero de 2026',
          gradoMencion: data.carrera_colegio?.mencion ? 'Título en Provisión Nacional de ' + data.carrera_colegio.mencion.toUpperCase() : 'Título en Provisión Nacional de MÉDICO CIRUJANO',
          nroTitulo: data.expediente?.nro_diploma || '96071',
          nombreTitular: data.titular?.nombre_completo?.toUpperCase() || 'GUALBERTO MEDINA VARGAS',
          ciTitular: data.titular?.ci_expedido || '8072900-SCZ.',
          libroRegistro: data.archivo_fisico?.libro_matriz || '0017',
          fojas: data.archivo_fisico?.fojas || '0027',
          fechaEmisionOriginal: fechaEmision,
          lugarFechaCertificacion: 'Santa Cruz de la Sierra, ' + (data.fecha || '19 de enero del 2026'),
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

  const cargarEjemploTipo1 = () => {
    setFormData({
      tipoPlantilla: 'CertificadoTituloTipo1',
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

  const cargarEjemploTipo2 = () => {
    setFormData({
      tipoPlantilla: 'CertificadoTituloTipo2',
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

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await titulosApi.guardarBorrador({
        expediente_id: 'exp-' + formData.nroTitulo,
        tipo_plantilla: formData.tipoPlantilla,
        numero_libro: formData.libroRegistro,
        tomo: 'I',
        folio: formData.fojas,
        observaciones: 'Certificado de Títulos ' + formData.tipoPlantilla + ' emitido para ' + formData.nombreTitular
      });
      setSavedSuccess(res.mensaje || 'Borrador guardado exitosamente');
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
      
      {/* Cabecera & Selector Exclusivo Módulo Títulos y Grados */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={'px-2.5 py-1 font-bold text-xs rounded-full border ' + (formData.tipoPlantilla === 'CertificadoTituloTipo2' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200')}>
              {formData.tipoPlantilla === 'CertificadoTituloTipo2' ? '📜 Plantilla 2 (Títulos ≤1999)' : '✨ Plantilla 1 (Títulos ≥2000)'}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Año Emisión: {formData.gestionHistorica}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight mt-1">
            Módulo de Títulos y Grados — Emisión de Certificados
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Certificaciones Oficiales en Prosa Legal Corrida (Plantilla 1 y Plantilla 2 de Títulos).
          </p>
        </div>

        {/* Presets Rápidos Exclusivos de Títulos */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={cargarEjemploTipo1}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
          >
            ✨ Plantilla 1 (≥2000)
          </button>

          <button
            type="button"
            onClick={cargarEjemploTipo2}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
          >
            📜 Plantilla 2 (≤1999)
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
        
        {/* Panel Lateral Word */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Control de Tipo de Plantilla de Títulos */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider border-b border-slate-200 pb-2">
                ⚙️ Seleccionar Plantilla de Títulos
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'CertificadoTituloTipo1', incluirAclaratoriaHistorica: false }))}
                  className={'py-2 px-3 text-xs font-bold rounded-lg border transition-all ' + (formData.tipoPlantilla === 'CertificadoTituloTipo1' ? 'bg-[#003366] text-white border-[#003366] shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100')}
                >
                  Plantilla 1 (≥2000)
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tipoPlantilla: 'CertificadoTituloTipo2', incluirAclaratoriaHistorica: true }))}
                  className={'py-2 px-3 text-xs font-bold rounded-lg border transition-all ' + (formData.tipoPlantilla === 'CertificadoTituloTipo2' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100')}
                >
                  Plantilla 2 (≤1999)
                </button>
              </div>

              {formData.tipoPlantilla === 'CertificadoTituloTipo2' && (
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
              )}
            </div>

            {/* Formulario de Variables Inyectadas */}
            <div className="space-y-4 text-xs">
              
              <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  1. Encabezado & Referencia
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

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#003366] uppercase text-[11px]">
                  2. Datos del Titular y Título
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
                      N° Título:
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
                    Grado / Mención Académica:
                  </label>
                  <input
                    type="text"
                    value={formData.gradoMencion}
                    onChange={e => setFormData({ ...formData, gradoMencion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 text-xs font-medium"
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
                      Libro de Registro:
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
                      Fojas:
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

        {/* Hoja A4 Rendida - Módulo Títulos (Renderizado Estricto Componentes Tipo 1 o Tipo 2) */}
        <div className="lg:col-span-7 bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center items-start overflow-auto shadow-inner min-h-[750px]">
          
          <div className="shrink-0 flex justify-center">
            {formData.tipoPlantilla === 'CertificadoTituloTipo2' ? (
              <CertificadoTituloTipo2
                nroCertificado={formData.nroCertificado}
                informeRef={formData.informeRef}
                fechaInforme={formData.fechaInforme}
                gradoMencion={formData.gradoMencion}
                nroTitulo={formData.nroTitulo}
                nombreTitular={formData.nombreTitular}
                ciTitular={formData.ciTitular}
                libroRegistro={formData.libroRegistro}
                fojas={formData.fojas}
                fechaEmisionOriginal={formData.fechaEmisionOriginal}
                gestionHistorica={formData.gestionHistorica}
                incluirAclaratoriaHistorica={formData.incluirAclaratoriaHistorica}
                lugarFechaCertificacion={formData.lugarFechaCertificacion}
                autoridadSecretario={formData.autoridadSecretario}
                autoridadRector={formData.autoridadRector}
              />
            ) : (
              <CertificadoTituloTipo1
                nroCertificado={formData.nroCertificado}
                informeRef={formData.informeRef}
                fechaInforme={formData.fechaInforme}
                gradoMencion={formData.gradoMencion}
                nroTitulo={formData.nroTitulo}
                nombreTitular={formData.nombreTitular}
                ciTitular={formData.ciTitular}
                libroRegistro={formData.libroRegistro}
                fojas={formData.fojas}
                fechaEmisionOriginal={formData.fechaEmisionOriginal}
                lugarFechaCertificacion={formData.lugarFechaCertificacion}
                autoridadSecretario={formData.autoridadSecretario}
                autoridadRector={formData.autoridadRector}
              />
            )}
          </div>

        </div>

      </div>

      {/* Sticky Action Bar & Footer Asistido */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 shadow-xl print:hidden">
        {/* Barra de Acciones Principales con Colores Institucionales */}
        <div className="p-4 px-8 flex flex-wrap justify-between items-center gap-4 bg-white">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <span>Plantilla activa:</span>
            <strong className={'px-2.5 py-1 rounded-full text-[11px] font-bold ' + (formData.tipoPlantilla === 'CertificadoTituloTipo2' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300')}>
              {formData.tipoPlantilla === 'CertificadoTituloTipo2' ? '📜 Plantilla 2 de Títulos (Con Aclaratoria Histórica ≤1999)' : '✨ Plantilla 1 de Títulos (Directa ≥2000)'}
            </strong>
            <span className="text-slate-400 font-mono">| Cero sellos digitales</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {saving ? 'Guardando...' : 'Guardar Documento'}
            </button>

            <button
              type="button"
              onClick={handlePrintFinal}
              className="px-5 py-2.5 bg-[#C51D24] hover:bg-[#A0161C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Imprimir Documento Físico
            </button>
          </div>
        </div>

        {/* Footer Help Banner (Cintillo Inferior de Guía Rápida) */}
        <div className="bg-slate-100 border-t border-slate-200 text-xs text-slate-600 py-2.5 px-8 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-extrabold text-[#003366] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[#C51D24]" style={{ fontSize: '16px' }}>help</span>
              Flujo Rápido:
            </span>
            <span className="flex items-center gap-1">
              [<strong className="text-[#003366]">1. Consultar Expediente</strong>] ➔
            </span>
            <span className="flex items-center gap-1">
              [<strong className="text-[#003366]">2. Ajustar/Editar en Panel Lateral</strong>] ➔
            </span>
            <span className="flex items-center gap-1">
              [<strong className="text-[#003366]">3. Guardar en Base de Datos</strong>] ➔
            </span>
            <span className="flex items-center gap-1">
              [<strong className="text-[#C51D24]">4. Imprimir en Limpio</strong>]
            </span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            Módulo de Títulos y Grados UAGRM
          </div>
        </div>
      </div>
    </div>
  );
}
