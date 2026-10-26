import React, { useState } from 'react';
import { User, Building2, UploadCloud, FileText, CheckCircle, Shield, AlertTriangle, Key, Info } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Select, Checkbox, Badge, Modal } from '@/shared/ui';
import { EXTENSIONES_CI, FACULTADES, TIPOS_CERTIFICACION } from '@/entities/institucion';
import mockData from '@/shared/mock/mock_data.json';

interface FormPersonalState {
  esApoderado: boolean;
  apoderadoNombre: string;
  apoderadoCi: string;
  apoderadoCiExt: string;
  apoderadoTelefono: string;
  poderNotariadoFile: File | null;
  nombres: string;
  apellidos: string;
  ci: string;
  complemento: string;
  ciExt: string;
  correo: string;
  celular: string;
  facultadId: string;
  carrera: string;
  tipoCertificacion: string;
  gestionEmision: number;
  cartaSolicitudFile: File | null;
}

interface FormInstitucionalState {
  institucionId: string;
  codigoValidacion: string;
  funcionarioNombre: string;
  funcionarioCargo: string;
  funcionarioCi: string;
  funcionarioCiExt: string;
  funcionarioCorreo: string;
  funcionarioCelular: string;
  oficioFormalFile: File | null;
}

export function VistaAdmision() {
  const [tipoTramite, setTipoTramite] = useState<'personal' | 'institucional'>('personal');
  const [enviando, setEnviando] = useState(false);
  const [modalRutData, setModalRutData] = useState<{
    codigoRut: string;
    titular: string;
    tipo: string;
    unidadDestino: string;
    mensaje: string;
  } | null>(null);

  // Estado Formulario Personal
  const [personal, setPersonal] = useState<FormPersonalState>({
    esApoderado: false,
    apoderadoNombre: '',
    apoderadoCi: '',
    apoderadoCiExt: 'SCZ',
    apoderadoTelefono: '',
    poderNotariadoFile: null,
    nombres: '',
    apellidos: '',
    ci: '',
    complemento: '',
    ciExt: 'SCZ',
    correo: '',
    celular: '',
    facultadId: 'ficct',
    carrera: 'Ingeniería Informática',
    tipoCertificacion: 'tpn',
    gestionEmision: 2024,
    cartaSolicitudFile: null,
  });

  // Estado Formulario Institucional
  const [institucional, setInstitucional] = useState<FormInstitucionalState>({
    institucionId: 'inst-001',
    codigoValidacion: '',
    funcionarioNombre: '',
    funcionarioCargo: '',
    funcionarioCi: '',
    funcionarioCiExt: 'SCZ',
    funcionarioCorreo: '',
    funcionarioCelular: '',
    oficioFormalFile: null,
  });

  const [errores, setErrores] = useState<Record<string, string>>({});

  const llenarDemoPersonal = () => {
    setPersonal({
      esApoderado: false,
      apoderadoNombre: '',
      apoderadoCi: '',
      apoderadoCiExt: 'SCZ',
      apoderadoTelefono: '',
      poderNotariadoFile: null,
      nombres: 'Carlos Andrés',
      apellidos: 'Mamani Aguilera',
      ci: '8941254',
      complemento: '',
      ciExt: 'SCZ',
      correo: 'carlos.mamani@uagrm.edu.bo',
      celular: '77348912',
      facultadId: 'ficct',
      carrera: 'Ingeniería Informática',
      tipoCertificacion: 'tpn',
      gestionEmision: 2024,
      cartaSolicitudFile: new File(['contenido de prueba'], 'Carta_Solicitud_Firmada.pdf', { type: 'application/pdf' }),
    });
    setErrores({});
  };

  const llenarDemoInstitucional = () => {
    setInstitucional({
      institucionId: 'inst-001',
      codigoValidacion: 'FISC-SCZ-2026',
      funcionarioNombre: 'Dr. Fernando Aguilera Justiniano',
      funcionarioCargo: 'Director de Recursos Humanos y Auditoría',
      funcionarioCi: '4892104',
      funcionarioCiExt: 'SCZ',
      funcionarioCorreo: 'f.aguilera@fiscalia.gob.bo',
      funcionarioCelular: '77098412',
      oficioFormalFile: new File(['oficio de prueba'], 'Oficio_Fiscalia_UAGRM.pdf', { type: 'application/pdf' }),
    });
    setErrores({});
  };

  // Cargar carreras dependientes de la facultad
  const facultadActual = FACULTADES.find(f => f.id === personal.facultadId) || FACULTADES[0];

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: Record<string, string> = {};

    if (!personal.nombres.trim()) nuevosErrores.nombres = 'Nombres requeridos';
    if (!personal.apellidos.trim()) nuevosErrores.apellidos = 'Apellidos requeridos';
    if (!personal.ci.trim()) nuevosErrores.ci = 'Cédula de Identidad requerida';
    if (!personal.correo.trim()) nuevosErrores.correo = 'Correo electrónico requerido';
    if (!personal.celular.trim()) nuevosErrores.celular = 'Número de WhatsApp requerido';
    if (!personal.cartaSolicitudFile) nuevosErrores.cartaSolicitud = 'Debe adjuntar la Carta de Solicitud Firmada (PDF/DOCX)';

    if (personal.esApoderado) {
      if (!personal.apoderadoNombre.trim()) nuevosErrores.apoderadoNombre = 'Nombre del apoderado requerido';
      if (!personal.apoderadoCi.trim()) nuevosErrores.apoderadoCi = 'C.I. del apoderado requerido';
      if (!personal.poderNotariadoFile) nuevosErrores.poderNotariado = 'Debe adjuntar el Poder Notariado Vigente en PDF';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setEnviando(true);

    setTimeout(() => {
      setEnviando(false);
      const anio = personal.gestionEmision;
      const destino = anio <= 2022 ? 'Archivo Central (Libros Matrices)' : 'Departamento de Títulos y Grados';
      const correlativo = Math.floor(10000 + Math.random() * 90000);
      setModalRutData({
        codigoRut: `RUT-2026-TEMP-${correlativo}`,
        titular: `${personal.nombres} ${personal.apellidos}`,
        tipo: personal.esApoderado ? 'Personal (Vía Apoderado Legal)' : 'Personal (Titular Directo)',
        unidadDestino: destino,
        mensaje: 'Su carta de solicitud firmada fue radicada exitosamente y se encuentra en evaluación preliminar por Secretaría General.',
      });
    }, 1200);
  };

  const handleInstitucionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: Record<string, string> = {};

    if (!institucional.codigoValidacion.trim()) {
      nuevosErrores.codigoValidacion = 'Ingrese el código de validación de convenio';
    } else {
      const inst = mockData.institucionesConvenio.find(i => i.id === institucional.institucionId);
      if (inst && inst.codigoSecreto !== institucional.codigoValidacion.trim()) {
        nuevosErrores.codigoValidacion = `Código de validación inválido para ${inst.razonSocial}.`;
      }
    }

    if (!institucional.funcionarioNombre.trim()) nuevosErrores.funcionarioNombre = 'Nombre del funcionario requerido';
    if (!institucional.funcionarioCargo.trim()) nuevosErrores.funcionarioCargo = 'Cargo institucional requerido';
    if (!institucional.funcionarioCorreo.trim()) nuevosErrores.funcionarioCorreo = 'Correo corporativo requerido';
    if (!institucional.oficioFormalFile) nuevosErrores.oficioFormal = 'Debe adjuntar el Oficio Formal Membretado y Sellado (PDF)';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setEnviando(true);

    setTimeout(() => {
      setEnviando(false);
      const inst = mockData.institucionesConvenio.find(i => i.id === institucional.institucionId);
      const correlativo = Math.floor(10000 + Math.random() * 90000);
      setModalRutData({
        codigoRut: `RUT-INST-2026-${correlativo}`,
        titular: inst?.razonSocial || 'Institución en Convenio',
        tipo: 'Institucional con Convenio UAGRM (Trámite Gratuito)',
        unidadDestino: 'Secretaría General / Rectorado',
        mensaje: 'El oficio formal ha sido recibido y validado con código secreto. Se ha habilitado el expediente institucional para evaluación.',
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista 1.1 */}
      <div className="flex justify-between items-start mb-5 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#191A7D]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#191A7D]">
              Módulo de Admisión y Registro de Solicitud
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Seleccione la modalidad de trámite para registrar formalmente su solicitud de Certificación de Autenticidad.
          </p>
        </div>
      </div>

      {/* Tarjetas de Pestañas Bimodales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Tarjeta Pestaña 1: Trámite Personal */}
        <div
          onClick={() => { setTipoTramite('personal'); setErrores({}); }}
          className={`cursor-pointer p-5 sm:p-6 rounded-lg transition-all ${
            tipoTramite === 'personal'
              ? 'border-2 border-[#191A7D] bg-blue-50/40 shadow-md ring-1 ring-[#191A7D]/20'
              : 'border border-slate-200 bg-white hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`p-2.5 rounded-lg transition-colors ${
                tipoTramite === 'personal' ? 'bg-[#191A7D] text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <User className="w-6 h-6" />
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                tipoTramite === 'personal'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {tipoTramite === 'personal' ? '● Seleccionado' : 'Disponible'}
            </span>
          </div>
          <h2 className={`text-base font-bold mb-1 ${tipoTramite === 'personal' ? 'text-[#191A7D]' : 'text-slate-800'}`}>
            Trámite Personal / Titular Directo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Formulario individual para egresados y profesionales. Carga de carta firmada, apoderado opcional y arancel CPT (Bs. 30).
          </p>
        </div>

        {/* Tarjeta Pestaña 2: Solicitud Institucional */}
        <div
          onClick={() => { setTipoTramite('institucional'); setErrores({}); }}
          className={`cursor-pointer p-5 sm:p-6 rounded-lg transition-all ${
            tipoTramite === 'institucional'
              ? 'border-2 border-[#191A7D] bg-blue-50/40 shadow-md ring-1 ring-[#191A7D]/20'
              : 'border border-slate-200 bg-white hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`p-2.5 rounded-lg transition-colors ${
                tipoTramite === 'institucional' ? 'bg-[#191A7D] text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                tipoTramite === 'institucional'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {tipoTramite === 'institucional' ? '● Seleccionado' : 'Convenio Marco'}
            </span>
          </div>
          <h2 className={`text-base font-bold mb-1 ${tipoTramite === 'institucional' ? 'text-[#191A7D]' : 'text-slate-800'}`}>
            Solicitud Institucional / Empresas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Entidades públicas o privadas con convenio marco vigente. Validación por código secreto, oficio formal y exento de pago (Bs. 0).
          </p>
        </div>
      </div>

      {/* FORMULARIO PERSONAL */}
      {tipoTramite === 'personal' && (
        <form onSubmit={handlePersonalSubmit} className="space-y-6">
          <Card className="p-6 bg-white border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#191A7D] rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191A7D]">Formulario de Solicitud Personal</h3>
                  <p className="text-xs text-slate-500">Ventanillas 4 y 5 del Departamento de Títulos y Grados</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={llenarDemoPersonal}>
                ⚡ Demo Personal
              </Button>
            </div>

            {/* Toggle Titular vs Apoderado */}
            <div className="p-3 mb-5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={personal.esApoderado}
                  onChange={(e) => setPersonal(prev => ({ ...prev, esApoderado: e.target.checked }))}
                />
                <span className="text-sm font-semibold text-slate-800">
                  ¿El trámite es realizado mediante Apoderado Legal?
                </span>
              </label>
              {personal.esApoderado && (
                <Badge status="warning">Poder Notarial Requerido</Badge>
              )}
            </div>

            {/* Campos condicionales de Apoderado */}
            {personal.esApoderado && (
              <div className="p-4 mb-5 border border-amber-200 bg-amber-50/50 rounded-lg space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <Shield size={16} />
                  <span>Datos del Apoderado Legal Acreditado</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo del Apoderado *</label>
                    <Input
                      placeholder="Ej. Roberto Méndez Cuéllar"
                      value={personal.apoderadoNombre}
                      onChange={e => setPersonal({ ...personal, apoderadoNombre: e.target.value })}
                      hasError={!!errores.apoderadoNombre}
                    />
                    {errores.apoderadoNombre && <p className="text-xs text-rose-600 mt-1">{errores.apoderadoNombre}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">C.I. del Apoderado *</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ej. 6512940"
                        value={personal.apoderadoCi}
                        onChange={e => setPersonal({ ...personal, apoderadoCi: e.target.value })}
                        hasError={!!errores.apoderadoCi}
                      />
                      <Select
                        className="w-24 text-xs h-9 bg-white"
                        value={personal.apoderadoCiExt}
                        onChange={e => setPersonal({ ...personal, apoderadoCiExt: e.target.value })}
                      >
                        {EXTENSIONES_CI.map(ext => (
                          <option key={ext.valor} value={ext.valor}>{ext.valor}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Celular / Teléfono</label>
                    <Input
                      placeholder="Ej. 77012345"
                      value={personal.apoderadoTelefono}
                      onChange={e => setPersonal({ ...personal, apoderadoTelefono: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subida de Poder Notarial */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Testimonio de Poder Notariado Vigente (PDF) *</label>
                  <div className="border-2 border-dashed border-amber-300 rounded-lg p-3 text-center bg-white cursor-pointer hover:bg-amber-50 transition">
                    <input
                      type="file"
                      accept=".pdf"
                      id="filePoder"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          setPersonal({ ...personal, poderNotariadoFile: e.target.files[0] });
                        }
                      }}
                    />
                    <label htmlFor="filePoder" className="cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-600">
                      <UploadCloud size={18} className="text-amber-600" />
                      <span>{personal.poderNotariadoFile ? `Cargado: ${personal.poderNotariadoFile.name}` : 'Arrastra o haz clic para subir el Poder Notarial (PDF máx. 10MB)'}</span>
                    </label>
                  </div>
                  {errores.poderNotariado && <p className="text-xs text-rose-600 mt-1">{errores.poderNotariado}</p>}
                </div>
              </div>
            )}

            {/* Datos del Titular / Graduado */}
            <h4 className="text-sm font-bold text-slate-800 mb-3">Datos del Titular / Graduado Solicitante</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombres *</label>
                <Input
                  placeholder="Ej. Carlos Alejandro"
                  value={personal.nombres}
                  onChange={e => setPersonal({ ...personal, nombres: e.target.value })}
                  hasError={!!errores.nombres}
                />
                {errores.nombres && <p className="text-xs text-rose-600 mt-1">{errores.nombres}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Apellidos *</label>
                <Input
                  placeholder="Ej. Rivera Morales"
                  value={personal.apellidos}
                  onChange={e => setPersonal({ ...personal, apellidos: e.target.value })}
                  hasError={!!errores.apellidos}
                />
                {errores.apellidos && <p className="text-xs text-rose-600 mt-1">{errores.apellidos}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cédula de Identidad *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ej. 8934521"
                    value={personal.ci}
                    onChange={e => setPersonal({ ...personal, ci: e.target.value })}
                    hasError={!!errores.ci}
                  />
                  <Select
                    className="w-24 text-xs h-9 bg-white"
                    value={personal.ciExt}
                    onChange={e => setPersonal({ ...personal, ciExt: e.target.value })}
                  >
                    {EXTENSIONES_CI.map(ext => (
                      <option key={ext.valor} value={ext.valor}>{ext.valor}</option>
                    ))}
                  </Select>
                </div>
                {errores.ci && <p className="text-xs text-rose-600 mt-1">{errores.ci}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <Input
                  type="email"
                  placeholder="usuario@uagrm.edu.bo"
                  value={personal.correo}
                  onChange={e => setPersonal({ ...personal, correo: e.target.value })}
                  hasError={!!errores.correo}
                />
                {errores.correo && <p className="text-xs text-rose-600 mt-1">{errores.correo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Celular / WhatsApp *</label>
                <Input
                  placeholder="Ej. 78012345"
                  value={personal.celular}
                  onChange={e => setPersonal({ ...personal, celular: e.target.value })}
                  hasError={!!errores.celular}
                />
                {errores.celular && <p className="text-xs text-rose-600 mt-1">{errores.celular}</p>}
              </div>
            </div>

            {/* Datos Académicos y Año de Emisión */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Facultad Académica *</label>
                <Select
                  className="w-full text-sm bg-white"
                  value={personal.facultadId}
                  onChange={e => {
                    const f = FACULTADES.find(fac => fac.id === e.target.value);
                    setPersonal({
                      ...personal,
                      facultadId: e.target.value,
                      carrera: f?.carreras[0] || '',
                    });
                  }}
                >
                  {FACULTADES.map(f => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Carrera *</label>
                <Select
                  className="w-full text-sm bg-white"
                  value={personal.carrera}
                  onChange={e => setPersonal({ ...personal, carrera: e.target.value })}
                >
                  {facultadActual.carreras.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Año / Gestión de Emisión *</label>
                <Input
                  type="number"
                  min={1970}
                  max={2026}
                  value={personal.gestionEmision}
                  onChange={e => setPersonal({ ...personal, gestionEmision: parseInt(e.target.value, 10) || 2024 })}
                />
              </div>
            </div>

            {/* Regla Crítica de Año de Emisión */}
            <div className={`p-3 rounded-lg flex items-start gap-3 mb-5 ${personal.gestionEmision <= 2022 ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'}`}>
              {personal.gestionEmision <= 2022 ? (
                <>
                  <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong>Derivación a Archivo Central (Título ≤ 2022):</strong>
                    <p>Su expediente se encuentra custodiado físicamente en los Libros Matrices de Archivo Central. Tiempo estimado: 5 a 7 días hábiles.</p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong>Recepción en Departamento de Títulos (Título ≥ 2023):</strong>
                    <p>Su expediente cuenta con registro en el sistema digital ANZIO. Tiempo estimado: 24 a 48 horas hábiles.</p>
                  </div>
                </>
              )}
            </div>

            {/* Carga de Carta de Solicitud Firmada */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-bold text-slate-800">
                Carta de Solicitud Firmada (PDF / DOCX) *
                <span className="font-normal text-slate-500 ml-2">(Dirigida a Jefatura de Títulos o Archivo Central con firma manuscrita/digital)</span>
              </label>
              <div className="border-2 border-dashed border-[#191A7D]/40 rounded-xl p-5 text-center bg-slate-50 hover:bg-blue-50/50 transition cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  id="cartaSolicitudFile"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setPersonal({ ...personal, cartaSolicitudFile: e.target.files[0] });
                    }
                  }}
                />
                <label htmlFor="cartaSolicitudFile" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud size={32} className="text-[#191A7D]" />
                  <strong className="text-sm text-slate-800">
                    {personal.cartaSolicitudFile ? personal.cartaSolicitudFile.name : 'Haz clic o arrastra la carta de solicitud firmada aquí'}
                  </strong>
                  <span className="text-xs text-slate-500">Formatos permitidos: PDF o DOCX (Máximo 10MB)</span>
                </label>
              </div>
              {errores.cartaSolicitud && <p className="text-xs text-rose-600">{errores.cartaSolicitud}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={enviando} className="bg-[#191A7D] hover:bg-[#2B6CB0]">
                Radicar Solicitud y Obtener RUT Temporal
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* FORMULARIO INSTITUCIONAL */}
      {tipoTramite === 'institucional' && (
        <form onSubmit={handleInstitucionalSubmit} className="space-y-6">
          {/* Banner Oficial Exento de Pago */}
          <div className="bg-sky-50 border-l-4 border-[#191A7D] px-5 py-4 rounded-md mb-6 flex items-start gap-4 shadow-sm">
            <Info className="w-6 h-6 text-[#191A7D] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#191A7D] text-base mb-1">
                Trámite exento de pago bajo Convenio Interinstitucional con la UAGRM
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed">
                Este portal está habilitado exclusivamente para instituciones públicas y empresas privadas con convenio marco vigente. No se requiere comprobante de arancel ni pagos adicionales (Bs. 0).
              </p>
            </div>
          </div>

          <Card className="p-6 bg-white border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191A7D]">Formulario de Solicitud Institucional (Convenios)</h3>
                  <p className="text-xs text-slate-500">Verificación oficial interinstitucional exenta de arancel</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={llenarDemoInstitucional}>
                ⚡ Demo Institución
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Razón Social */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Razón Social de la Institución *</label>
                <Select
                  className="w-full text-sm bg-white"
                  value={institucional.institucionId}
                  onChange={e => setInstitucional({ ...institucional, institucionId: e.target.value })}
                >
                  {mockData.institucionesConvenio.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.razonSocial}</option>
                  ))}
                </Select>
              </div>

              {/* Código de Validación Secreto */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Key size={14} className="text-[#191A7D]" />
                  <span>Código Secreto de Convenio Institucional *</span>
                </label>
                <Input
                  type="password"
                  placeholder="Token o código secreto asignado"
                  value={institucional.codigoValidacion}
                  onChange={e => setInstitucional({ ...institucional, codigoValidacion: e.target.value })}
                  hasError={!!errores.codigoValidacion}
                />
                {errores.codigoValidacion ? (
                  <p className="text-xs text-rose-600 mt-1">{errores.codigoValidacion}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Verifica la vigencia del convenio de gratuidad con la UAGRM.</p>
                )}
              </div>
            </div>

            {/* Datos del Funcionario Encargado */}
            <h4 className="text-sm font-bold text-slate-800 mb-3">Datos del Funcionario Responsable de la Solicitud</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <Input
                  placeholder="Ej. Dra. Patricia Vaca Díez"
                  value={institucional.funcionarioNombre}
                  onChange={e => setInstitucional({ ...institucional, funcionarioNombre: e.target.value })}
                  hasError={!!errores.funcionarioNombre}
                />
                {errores.funcionarioNombre && <p className="text-xs text-rose-600 mt-1">{errores.funcionarioNombre}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Formal *</label>
                <Input
                  placeholder="Ej. Directora General de RRHH"
                  value={institucional.funcionarioCargo}
                  onChange={e => setInstitucional({ ...institucional, funcionarioCargo: e.target.value })}
                  hasError={!!errores.funcionarioCargo}
                />
                {errores.funcionarioCargo && <p className="text-xs text-rose-600 mt-1">{errores.funcionarioCargo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Institucional Corporativo *</label>
                <Input
                  type="email"
                  placeholder="contacto@fiscalia.gob.bo"
                  value={institucional.funcionarioCorreo}
                  onChange={e => setInstitucional({ ...institucional, funcionarioCorreo: e.target.value })}
                  hasError={!!errores.funcionarioCorreo}
                />
                {errores.funcionarioCorreo && <p className="text-xs text-rose-600 mt-1">{errores.funcionarioCorreo}</p>}
              </div>
            </div>

            {/* Carga de Oficio Formal Membretado */}
            <div className="space-y-2 mb-6 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Oficio Formal Membretado y Sellado (PDF) *
                <span className="font-normal text-slate-500 ml-2">(Dirigido a Rectorado / Secretaría General de la UAGRM)</span>
              </label>
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-5 text-center bg-indigo-50/30 hover:bg-indigo-50/60 transition cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  id="oficioFormalFile"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setInstitucional({ ...institucional, oficioFormalFile: e.target.files[0] });
                    }
                  }}
                />
                <label htmlFor="oficioFormalFile" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud size={32} className="text-indigo-700" />
                  <strong className="text-sm text-slate-800">
                    {institucional.oficioFormalFile ? institucional.oficioFormalFile.name : 'Haz clic o arrastra el Oficio Membretado aquí'}
                  </strong>
                  <span className="text-xs text-slate-500">Debe contener membrete oficial, sello de recepción y firma de autoridad competente</span>
                </label>
              </div>
              {errores.oficioFormal && <p className="text-xs text-rose-600">{errores.oficioFormal}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={enviando} className="bg-[#191A7D] hover:bg-[#2B6CB0]">
                Radicar Solicitud Institucional
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Modal de RUT Temporal y Evaluación */}
      {modalRutData && (
        <Modal
          isOpen={true}
          onClose={() => setModalRutData(null)}
          title="Solicitud Radicada Exitosamente"
          size="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="primary" onClick={() => setModalRutData(null)}>
                Entendido y Continuar
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle size={32} />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Código Único de Trámite Temporal (RUT)</p>
              <div className="text-2xl font-black text-[#191A7D] my-1 bg-slate-100 py-2 px-4 rounded-lg border border-slate-200 inline-block font-mono">
                {modalRutData.codigoRut}
              </div>
            </div>

            <div className="text-left text-xs bg-slate-50 p-3 rounded-lg space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Solicitante:</span>
                <strong className="text-slate-800">{modalRutData.titular}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modalidad:</span>
                <strong className="text-slate-800">{modalRutData.tipo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Derivación Inicial:</span>
                <strong className="text-[#191A7D]">{modalRutData.unidadDestino}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado de Admisión:</span>
                <Badge status="warning">En Evaluación por Secretaría General</Badge>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {modalRutData.mensaje}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
