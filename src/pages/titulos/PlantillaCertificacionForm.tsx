import { useState } from 'react';
import { CertificadoTituloTipo1 } from '../../modules/titulos/templates/CertificadoTituloTipo1';
import { CertificadoTituloTipo2 } from '../../modules/titulos/templates/CertificadoTituloTipo2';

interface ExpedienteCarpeta {
  id: string;
  ci: string;
  nombreTitular: string;
  carrera: string;
  nroDiploma: string;
  libro: string;
  fojas: string;
  gestion: string;
  origenDatos: 'ANZIO (2000 en adelante)' | 'PosgreTS (1999 y anteriores)';
  tipoPlantilla: 'TIPO_1' | 'TIPO_2';
  documentos: Array<{ nombre: string; tipo: string; icono: string }>;
}

const CARPETAS_MOCK: ExpedienteCarpeta[] = [
  {
    id: 'CARP-2022-01',
    ci: '8072900-SCZ',
    nombreTitular: 'GUALBERTO MEDINA VARGAS',
    carrera: 'MÉDICO CIRUJANO',
    nroDiploma: '96071',
    libro: '0017',
    fojas: '0027',
    gestion: '2022',
    origenDatos: 'ANZIO (2000 en adelante)',
    tipoPlantilla: 'TIPO_1',
    documentos: [
      { nombre: 'CI_GUALBERTO_MEDINA.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
      { nombre: 'TITULO_MEDICINA_96071.pdf', tipo: 'Título Profesional en Provisión Nacional', icono: 'workspace_premium' },
      { nombre: 'ACTA_EXAMEN_GRADO_MEDICINA.pdf', tipo: 'Acta de Examen de Grado', icono: 'description' }
    ]
  },
  {
    id: 'CARP-1999-04',
    ci: '4716343-SCZ',
    nombreTitular: 'LYNNE DENISSE PEREZ REVILLA',
    carrera: 'BACHILLER EN HUMANIDADES',
    nroDiploma: '019741',
    libro: '026/99',
    fojas: '181',
    gestion: '1999',
    origenDatos: 'PosgreTS (1999 y anteriores)',
    tipoPlantilla: 'TIPO_2',
    documentos: [
      { nombre: 'CI_LYNNE_PEREZ_REVILLA.pdf', tipo: 'Cédula de Identidad Digitalizada', icono: 'badge' },
      { nombre: 'DIPLOMA_BACHILLER_019741.pdf', tipo: 'Diploma de Bachiller Escaneado', icono: 'workspace_premium' },
      { nombre: 'HISTORICO_COLEGIO_LYNNE.pdf', tipo: 'Histórico de Estudio de Colegio', icono: 'school' }
    ]
  }
];

export function PlantillaCertificacionForm() {
  const [tipoPlantilla, setTipoPlantilla] = useState<'TIPO_1' | 'TIPO_2'>('TIPO_1');
  const [activeTab, setActiveTab] = useState<'certificacion' | 'carpetas'>('certificacion');
  const [showEditor, setShowEditor] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSaving, setIsSaving] = useState(false);

  // Filtros de Consulta de Carpetas
  const [busquedaCarpeta, setBusquedaCarpeta] = useState('');
  const [selectedCarpetaModal, setSelectedCarpetaModal] = useState<ExpedienteCarpeta | null>(null);

  // Datos del Formulario Certificado
  const [nroCertificado, setNroCertificado] = useState('117/2026');
  const [informeRef, setInformeRef] = useState('SECCION ARCHIVO/ INF N°094');
  const [fechaInforme, setFechaInforme] = useState('13 de enero de 2026');
  const [gradoMencion, setGradoMencion] = useState('Título en Provisión Nacional de MÉDICO CIRUJANO');
  const [nroTitulo, setNroTitulo] = useState('96071');
  const [nombreTitular, setNombreTitular] = useState('GUALBERTO MEDINA VARGAS');
  const [ciTitular, setCiTitular] = useState('8072900-SCZ');
  const [libroRegistro, setLibroRegistro] = useState('0017');
  const [fojas, setFojas] = useState('0027');
  const [fechaEmisionOriginal, setFechaEmisionOriginal] = useState('11 de julio del año 2022');
  const [gestionHistorica, setGestionHistorica] = useState('1999');
  const [incluirAclaratoriaHistorica, setIncluirAclaratoriaHistorica] = useState(true);
  const [lugarFechaCertificacion, setLugarFechaCertificacion] = useState('Santa Cruz de la Sierra, 19 de enero del 2026');
  const [autoridadSecretario, setAutoridadSecretario] = useState('LIC. EDY ACOSTA CLAROS');
  const [autoridadRector, setAutoridadRector] = useState('DR. REINERIO VARGAS BANEGAS');

  const handleSeleccionarTipo = (tipo: 'TIPO_1' | 'TIPO_2') => {
    setTipoPlantilla(tipo);
    if (tipo === 'TIPO_1') {
      // Configuración por defecto Tipo 1 (Del 2000 en adelante - Anzio)
      setNroCertificado('117/2026');
      setInformeRef('SECCION ARCHIVO/ INF N°094');
      setFechaInforme('13 de enero de 2026');
      setGradoMencion('Título en Provisión Nacional de MÉDICO CIRUJANO');
      setNroTitulo('96071');
      setNombreTitular('GUALBERTO MEDINA VARGAS');
      setCiTitular('8072900-SCZ');
      setLibroRegistro('0017');
      setFojas('0027');
      setFechaEmisionOriginal('11 de julio del año 2022');
      setLugarFechaCertificacion('Santa Cruz de la Sierra, 19 de enero del 2026');
    } else {
      // Configuración por defecto Tipo 2 (1999 y anteriores - PosgreTS)
      setNroCertificado('749/2026');
      setInformeRef('SECCION ARCHIVO/ INF N°472');
      setFechaInforme('20 de abril de 2026');
      setGradoMencion('Diploma de Bachiller en Humanidades');
      setNroTitulo('019741');
      setNombreTitular('LYNNE DENISSE PEREZ REVILLA');
      setCiTitular('4716343-SCZ');
      setLibroRegistro('026/99');
      setFojas('181');
      setFechaEmisionOriginal('5 de marzo del año 1999');
      setGestionHistorica('1999');
      setIncluirAclaratoriaHistorica(true);
      setLugarFechaCertificacion('Santa Cruz de la Sierra, 22 de abril del 2026');
    }
  };

  const handleCargarDesdeCarpeta = (carpeta: ExpedienteCarpeta) => {
    handleSeleccionarTipo(carpeta.tipoPlantilla);
    setNombreTitular(carpeta.nombreTitular);
    setCiTitular(carpeta.ci);
    setGradoMencion(carpeta.carrera);
    setNroTitulo(carpeta.nroDiploma);
    setLibroRegistro(carpeta.libro);
    setFojas(carpeta.fojas);
    setGestionHistorica(carpeta.gestion);
    setActiveTab('certificacion');
  };

  const handleSaveDocument = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Certificado de Autenticidad (${tipoPlantilla}) guardado exitosamente.`);
    }, 800);
  };

  const filteredCarpetas = CARPETAS_MOCK.filter(c => 
    !busquedaCarpeta ||
    c.nombreTitular.toLowerCase().includes(busquedaCarpeta.toLowerCase()) ||
    c.ci.toLowerCase().includes(busquedaCarpeta.toLowerCase()) ||
    c.nroDiploma.toLowerCase().includes(busquedaCarpeta.toLowerCase())
  );

  return (
    <div className="h-screen bg-slate-100 font-sans text-slate-900 flex flex-col overflow-hidden">
      
      {/* 1. HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap justify-between items-center gap-4 shrink-0 z-30 print:hidden text-slate-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#003366] text-white rounded-xl shadow-xs">
            <span className="material-symbols-outlined text-lg">workspace_premium</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wide font-heading text-[#003366]">
              Departamento de Títulos y Grados — Emisión de Certificados
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Consultas unificadas: Base Anzio (2000 en adelante) & Base PosgreTS (1999 y anteriores)
            </p>
          </div>
        </div>

        {/* Cambiador de Pestañas Principales (Certificación vs Carpetas) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('certificacion')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'certificacion'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">description</span>
            Emisión de Certificado
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('carpetas')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'carpetas'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">folder_shared</span>
            Consulta de Carpetas Digitales
          </button>
        </div>

        {/* Acciones Rápidas */}
        {activeTab === 'certificacion' && (
          <div className="flex items-center gap-3">
            {/* Selector de Zoom */}
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5 text-xs text-slate-700">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="px-2 py-1 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
              >
                -
              </button>
              <span className="px-2 font-mono font-bold text-[11px] text-[#003366]">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="px-2 py-1 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              {showEditor ? 'Ocultar Edición' : 'Abrir Edición'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-[#C51D24] hover:bg-[#a3151b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Imprimir Certificado
            </button>
          </div>
        )}
      </header>

      {/* 2. PESTAÑA 1: EMISIÓN Y EDICIÓN DE CERTIFICADO DE TÍTULO */}
      {activeTab === 'certificacion' && (
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* VISTA PREVIA DEL CERTIFICADO (HOJA BLANCA CON MARGEN DE 4CM) */}
          <div className="flex-1 bg-slate-200/70 p-8 overflow-auto flex justify-center items-start transition-all">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200 my-2 shadow-xl rounded"
            >
              {tipoPlantilla === 'TIPO_1' ? (
                <CertificadoTituloTipo1
                  nroCertificado={nroCertificado}
                  informeRef={informeRef}
                  fechaInforme={fechaInforme}
                  gradoMencion={gradoMencion}
                  nroTitulo={nroTitulo}
                  nombreTitular={nombreTitular}
                  ciTitular={ciTitular}
                  libroRegistro={libroRegistro}
                  fojas={fojas}
                  fechaEmisionOriginal={fechaEmisionOriginal}
                  lugarFechaCertificacion={lugarFechaCertificacion}
                  autoridadSecretario={autoridadSecretario}
                  autoridadRector={autoridadRector}
                />
              ) : (
                <CertificadoTituloTipo2
                  nroCertificado={nroCertificado}
                  informeRef={informeRef}
                  fechaInforme={fechaInforme}
                  gradoMencion={gradoMencion}
                  nroTitulo={nroTitulo}
                  nombreTitular={nombreTitular}
                  ciTitular={ciTitular}
                  libroRegistro={libroRegistro}
                  fojas={fojas}
                  fechaEmisionOriginal={fechaEmisionOriginal}
                  gestionHistorica={gestionHistorica}
                  incluirAclaratoriaHistorica={incluirAclaratoriaHistorica}
                  lugarFechaCertificacion={lugarFechaCertificacion}
                  autoridadSecretario={autoridadSecretario}
                  autoridadRector={autoridadRector}
                />
              )}
            </div>
          </div>

          {/* PANEL LATERAL DE EDICIÓN FLUIDO CON SELECTOR DE PLANTILLA */}
          {showEditor && (
            <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-xl print:hidden z-20">
              
              {/* Header Panel */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xs font-extrabold text-[#003366] uppercase tracking-wider font-heading flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C51D24] text-lg">tune</span>
                  Parámetros del Certificado
                </h2>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                
                {/* SELECTOR DINÁMICO DE TIPO DE PLANTILLA */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <label className="block text-[11px] font-extrabold text-[#003366] uppercase tracking-wider">
                    Seleccionar Tipo de Plantilla:
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSeleccionarTipo('TIPO_1')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        tipoPlantilla === 'TIPO_1'
                          ? 'bg-[#003366] text-white border-[#003366] shadow-xs'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs">Tipo 1</p>
                      <p className="text-[10px] opacity-80 mt-0.5">2000 en adelante (Anzio SQL)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSeleccionarTipo('TIPO_2')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        tipoPlantilla === 'TIPO_2'
                          ? 'bg-[#C51D24] text-white border-[#C51D24] shadow-xs'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs">Tipo 2</p>
                      <p className="text-[10px] opacity-80 mt-0.5">1999 y anteriores (PosgreTS)</p>
                    </button>
                  </div>
                </div>

                {/* Formulario de Campos */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nº Certificado:
                      </label>
                      <input
                        type="text"
                        value={nroCertificado}
                        onChange={(e) => setNroCertificado(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-[#003366] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nº Diploma / Título:
                      </label>
                      <input
                        type="text"
                        value={nroTitulo}
                        onChange={(e) => setNroTitulo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-[#C51D24] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Informe de Referencia Archivo:
                    </label>
                    <input
                      type="text"
                      value={informeRef}
                      onChange={(e) => setInformeRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nombre Completo Titular:
                    </label>
                    <input
                      type="text"
                      value={nombreTitular}
                      onChange={(e) => setNombreTitular(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        C.I. Titular:
                      </label>
                      <input
                        type="text"
                        value={ciTitular}
                        onChange={(e) => setCiTitular(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Fecha Informe:
                      </label>
                      <input
                        type="text"
                        value={fechaInforme}
                        onChange={(e) => setFechaInforme(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Grado / Mención del Título:
                    </label>
                    <input
                      type="text"
                      value={gradoMencion}
                      onChange={(e) => setGradoMencion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-xs text-[#003366]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Libro Registro:
                      </label>
                      <input
                        type="text"
                        value={libroRegistro}
                        onChange={(e) => setLibroRegistro(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Fojas Nº:
                      </label>
                      <input
                        type="text"
                        value={fojas}
                        onChange={(e) => setFojas(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Fecha Emisión Original:
                    </label>
                    <input
                      type="text"
                      value={fechaEmisionOriginal}
                      onChange={(e) => setFechaEmisionOriginal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  {/* Campos Párrafo Histórico para Tipo 2 */}
                  {tipoPlantilla === 'TIPO_2' && (
                    <div className="p-3 bg-amber-50 rounded-xl space-y-2 border border-amber-200">
                      <label className="flex items-center justify-between text-xs font-bold text-amber-900 cursor-pointer">
                        <span>Párrafo Histórico (1999 y ant.):</span>
                        <input
                          type="checkbox"
                          checked={incluirAclaratoriaHistorica}
                          onChange={(e) => setIncluirAclaratoriaHistorica(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                        />
                      </label>
                      <div>
                        <label className="text-[10px] text-slate-600 font-bold block mb-0.5">Gestión Histórica:</label>
                        <input
                          type="text"
                          value={gestionHistorica}
                          onChange={(e) => setGestionHistorica(e.target.value)}
                          className="w-full px-2 py-1 rounded border border-amber-300 font-mono text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Lugar y Fecha Certificación:
                    </label>
                    <input
                      type="text"
                      value={lugarFechaCertificacion}
                      onChange={(e) => setLugarFechaCertificacion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Secretario General:
                      </label>
                      <input
                        type="text"
                        value={autoridadSecretario}
                        onChange={(e) => setAutoridadSecretario(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Rector UAGRM:
                      </label>
                      <input
                        type="text"
                        value={autoridadRector}
                        onChange={(e) => setAutoridadRector(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </aside>
          )}

        </div>
      )}

      {/* 3. PESTAÑA 2: CONSULTA Y VISUALIZACIÓN DE CARPETAS DIGITALES DE TITULADOS */}
      {activeTab === 'carpetas' && (
        <div className="flex-1 bg-slate-50 p-8 overflow-y-auto space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#003366] font-heading flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#C51D24]">folder_shared</span>
                  Consulta de Carpetas Digitales de Archivo (Titulados UAGRM)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Búsqueda directa de expedientes de titulados almacenados en Base Anzio (2000+) y PosgreTS (1999-).
                </p>
              </div>

              {/* Buscador */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Buscar por C.I., Nombre o Nº Título..."
                  value={busquedaCarpeta}
                  onChange={(e) => setBusquedaCarpeta(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#003366] focus:bg-white outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
              </div>
            </div>

            {/* Lista de Carpetas Encontradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredCarpetas.map((carp) => (
                <div 
                  key={carp.id} 
                  className="p-5 bg-white border border-slate-200 hover:border-[#003366] rounded-2xl shadow-2xs space-y-3 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
                        <span className="material-symbols-outlined text-2xl">folder</span>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-xs text-[#003366] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          C.I. {carp.ci}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                          {carp.nombreTitular}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          {carp.carrera} <strong className="font-mono text-[#C51D24]">Nº {carp.nroDiploma}</strong>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      carp.tipoPlantilla === 'TIPO_1' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {carp.origenDatos}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-700">
                    <p>Libro: <strong>{carp.libro}</strong> | Fojas: <strong>{carp.fojas}</strong> ({carp.gestion})</p>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Documentos: {carp.documentos.length} archivos escaneados integrados
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCarpetaModal(carp)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Ver Carpeta
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCargarDesdeCarpeta(carp)}
                      className="px-3.5 py-1.5 bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">description</span>
                      Emitir Certificado ({carp.tipoPlantilla === 'TIPO_1' ? 'Tipo 1' : 'Tipo 2'})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. FOOTER BAR DE ACCIONES */}
      {activeTab === 'certificacion' && (
        <footer className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shrink-0 z-30 print:hidden text-slate-800 shadow-lg">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Plantilla Activa:</span>
            <strong className="font-mono text-[#003366]">
              {tipoPlantilla === 'TIPO_1' ? 'TIPO 1 (2000 en adelante - Anzio SQL)' : 'TIPO 2 (1999 y anteriores - PosgreTS)'}
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
              Imprimir Certificado
            </button>
          </div>
        </footer>
      )}

      {/* MODAL PARA VER CARPETA DE ARCHIVOS DEL TITULADO */}
      {selectedCarpetaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-[#003366] font-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C51D24]">folder_open</span>
                Carpeta Digital: {selectedCarpetaModal.nombreTitular} (C.I. {selectedCarpetaModal.ci})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCarpetaModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Origen de Datos:</p>
                <p className="font-mono font-bold text-[#003366]">{selectedCarpetaModal.origenDatos}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p className="text-slate-500 font-medium">Nº Título / Diploma:</p>
                <p className="font-mono font-bold text-[#C51D24]">{selectedCarpetaModal.nroDiploma}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[#003366] uppercase">Archivos Integrantes del Legajo:</p>
              <div className="space-y-2">
                {selectedCarpetaModal.documentos.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-[#003366]">{doc.icono}</span>
                      <div>
                        <p className="font-bold text-slate-900">{doc.tipo}</p>
                        <p className="text-[10px] text-slate-500 font-mono">📄 {doc.nombre}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verificado</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCarpetaModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar Visor
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCargarDesdeCarpeta(selectedCarpetaModal);
                  setSelectedCarpetaModal(null);
                }}
                className="px-4 py-2 bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Cargar en Formulario de Emisión
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
