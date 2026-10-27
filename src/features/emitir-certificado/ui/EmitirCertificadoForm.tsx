// src/features/emitir-certificado/ui/EmitirCertificadoForm.tsx
import { useMemo, useState } from "react";
import { Button } from "@shared/ui/Button";
import {
  CertificadoPreview,
  getConfiguracionTipo,
  CONFIGURACION_CERTIFICADOS,
  type DatosCertificado,
  type TipoCertificadoValue,
  type FamiliaDocumentoValue,
} from "@entities/certificado";
import { useEmitirCertificado } from "../model";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Send,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  GraduationCap,
  History,
  Award,
  Check,
  ExternalLink,
  CreditCard,
  UserCheck,
  BookOpen,
} from "lucide-react";

type Props = {
  informeId?: string;
  datosIniciales?: Partial<DatosCertificado>;
  onSuccess?: (certificadoId: string, pdfUrl: string) => void;
};

// Pasos del Asistente Guiado
type WizardStep = 1 | 2 | 3 | 4;

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GraduationCap,
  History,
  FileText,
  Award,
};

// Requisitos Documentales para el Paso 3
interface RequisitoDocumental {
  id: string;
  titulo: string;
  descripcion: string;
  obligatorio: boolean;
}

const REQUISITOS_DOCUMENTALES: RequisitoDocumental[] = [
  {
    id: "req_ci",
    titulo: "Cédula de Identidad Verificada",
    descripcion: "Cotejo de datos biográficos contra el padrón de identidad con extensión válida.",
    obligatorio: true,
  },
  {
    id: "req_libro",
    titulo: "Inspección de Libro Matriz y Fojas",
    descripcion: "Confirmación física o por OCR del registro original en el tomo correspondiente.",
    obligatorio: true,
  },
  {
    id: "req_matricula",
    titulo: "Registro Universitario (R.U.) sin Observaciones",
    descripcion: "Kárdex académico libre de sanciones disciplinarias o deudas pendientes.",
    obligatorio: true,
  },
  {
    id: "req_arancel",
    titulo: "Comprobante de Arancel Validado por Caja Central",
    descripcion: "Depósito o recibo oficial de valores universitarios verificado en sistema.",
    obligatorio: true,
  },
  {
    id: "req_no_duplicidad",
    titulo: "Inexistencia de Duplicidad o Revocatoria",
    descripcion: "Comprobación de que no existe resolución de nulidad previa sobre el título.",
    obligatorio: true,
  },
];

export function EmitirCertificadoForm({
  informeId = "INF-472",
  datosIniciales = {},
  onSuccess,
}: Props) {
  // Estado del Wizard
  const [pasoActual, setPasoActual] = useState<WizardStep>(1);

  // Filtro de familia en Paso 1
  const [familiaFiltro, setFamiliaFiltro] = useState<"TODAS" | FamiliaDocumentoValue>("TODAS");

  // Estado del Tipo seleccionado
  const [tipo, setTipo] = useState<TipoCertificadoValue | null>("TIPO_2_HISTORICO");

  // Datos del Formulario con valores por defecto institucional
  const [datos, setDatos] = useState<Partial<DatosCertificado>>({
    ciTitular: "4716343-SCZ",
    matriculaUniversitaria: "219084721",
    gestionGraduacion: "1999",
    codigoArancel: "ARAN-2024-0491",
    nombreTitular: "Lynne Denise Pérez Revilla",
    tituloDiploma: "Bachiller en Humanidades",
    libro: "026/99",
    fojas: "181",
    fechaEmisionTitulo: "5 de marzo de 1999",
    nroInforme: "SECCION ARCHIVO/INF. N° 472",
    fechaInforme: "2026-04-20",
    gestionEpoca: "1999",
    ...datosIniciales,
  });

  // Estado del Checklist de Validación Documental (Paso 3)
  const [requisitosValidados, setRequisitosValidados] = useState<Record<string, boolean>>({
    req_ci: true,
    req_libro: true,
    req_matricula: true,
    req_arancel: true,
    req_no_duplicidad: true,
  });

  // Errores de validación de campos del solicitante (Paso 2)
  const [erroresSolicitante, setErroresSolicitante] = useState<Record<string, string>>({});

  const { emitir, loading, estado, validarCampos, reset } = useEmitirCertificado();

  const config = useMemo(() => (tipo ? getConfiguracionTipo(tipo) : null), [tipo]);

  // Tipos agrupados y filtrados para Paso 1
  const tiposDisponibles = useMemo(() => {
    const todos = Object.values(CONFIGURACION_CERTIFICADOS);
    if (familiaFiltro === "TODAS") return todos;
    return todos.filter((t) => t.familia === familiaFiltro);
  }, [familiaFiltro]);

  // Validación de campos dinámicos del certificado
  const camposFaltantes = useMemo(() => {
    if (!tipo) return [];
    return validarCampos(tipo, datos);
  }, [tipo, datos, validarCampos]);

  // Validación rigurosa de datos del solicitante (Paso 2)
  const validarDatosSolicitante = (): boolean => {
    const errs: Record<string, string> = {};
    const ci = (datos.ciTitular as string) || "";
    const matricula = ((datos as any).matriculaUniversitaria as string) || "";
    const gestion = ((datos as any).gestionGraduacion as string) || "";
    const arancel = ((datos as any).codigoArancel as string) || "";

    // C.I.: Debe contener número y preferiblemente extensión (ej. 4716343-SCZ o 4716343)
    if (!ci.trim()) {
      errs.ciTitular = "El Carnet de Identidad es obligatorio.";
    } else if (ci.length < 5) {
      errs.ciTitular = "C.I. inválido (mínimo 5 caracteres).";
    }

    // Matrícula / R.U.: Entre 6 y 10 dígitos
    if (!matricula.trim()) {
      errs.matriculaUniversitaria = "El Registro Universitario (R.U.) es obligatorio.";
    } else if (!/^\d{6,10}$/.test(matricula.replace(/\s+/g, ""))) {
      errs.matriculaUniversitaria = "La matrícula debe constar de 6 a 10 dígitos numéricos.";
    }

    // Gestión: Año de 4 dígitos
    if (!gestion.trim()) {
      errs.gestionGraduacion = "La gestión de graduación es obligatoria.";
    } else if (!/^\d{4}$/.test(gestion.trim())) {
      errs.gestionGraduacion = "La gestión debe ser un año válido (ej. 2001).";
    }

    // Código de Arancel / Pago
    if (!arancel.trim()) {
      errs.codigoArancel = "El código de comprobante de arancel es obligatorio.";
    }

    setErroresSolicitante(errs);
    return Object.keys(errs).length === 0;
  };

  // Requisitos documentales cumplidos (Paso 3)
  const todosRequisitosCumplidos = useMemo(() => {
    return REQUISITOS_DOCUMENTALES.every((req) => !req.obligatorio || requisitosValidados[req.id]);
  }, [requisitosValidados]);

  const updateCampo = (campo: string, valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    // Limpiar error al tipear
    if (erroresSolicitante[campo]) {
      setErroresSolicitante((prev) => {
        const next = { ...prev };
        delete next[campo];
        return next;
      });
    }
  };

  const toggleRequisito = (id: string) => {
    setRequisitosValidados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const marcarTodosRequisitos = () => {
    const todos: Record<string, boolean> = {};
    REQUISITOS_DOCUMENTALES.forEach((r) => {
      todos[r.id] = true;
    });
    setRequisitosValidados(todos);
  };

  const handleSiguientePaso2 = () => {
    if (!validarDatosSolicitante()) return;
    if (camposFaltantes.length > 0) return;
    setPasoActual(3);
  };

  const handleEmitir = async () => {
    if (!tipo) return;
    const certificado = await emitir(informeId, tipo, datos as DatosCertificado);
    if (certificado) {
      const pdfUrl = (estado as any).pdfUrl || `http://localhost:8000/api/storage/pdf/${certificado.id}.pdf`;
      onSuccess?.(certificado.id, pdfUrl);
    }
  };

  const handleReiniciar = () => {
    setPasoActual(1);
    setTipo("TIPO_2_HISTORICO");
    setDatos(datosIniciales);
    setErroresSolicitante({});
    reset();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* STEPPER DE NAVEGACIÓN GUIADA (4 PASOS SUCESIVOS) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Paso 1 */}
          <button
            type="button"
            onClick={() => setPasoActual(1)}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                pasoActual === 1
                  ? "bg-[#191A7D] text-white ring-4 ring-blue-100"
                  : pasoActual > 1
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {pasoActual > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 1</p>
              <p className={`text-xs font-bold ${pasoActual === 1 ? "text-[#191A7D]" : "text-slate-700"}`}>
                Tipo de Certificado
              </p>
            </div>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${pasoActual >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />

          {/* Paso 2 */}
          <button
            type="button"
            onClick={() => tipo && setPasoActual(2)}
            disabled={!tipo}
            className="flex items-center gap-2.5 text-left cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                pasoActual === 2
                  ? "bg-[#191A7D] text-white ring-4 ring-blue-100"
                  : pasoActual > 2
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {pasoActual > 2 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 2</p>
              <p className={`text-xs font-bold ${pasoActual === 2 ? "text-[#191A7D]" : "text-slate-700"}`}>
                Datos del Solicitante
              </p>
            </div>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${pasoActual >= 3 ? "bg-emerald-500" : "bg-slate-200"}`} />

          {/* Paso 3 */}
          <button
            type="button"
            onClick={() => tipo && pasoActual >= 2 && setPasoActual(3)}
            disabled={!tipo || pasoActual < 2}
            className="flex items-center gap-2.5 text-left cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                pasoActual === 3
                  ? "bg-[#191A7D] text-white ring-4 ring-blue-100"
                  : pasoActual > 3
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {pasoActual > 3 ? <Check className="w-4 h-4" /> : "3"}
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 3</p>
              <p className={`text-xs font-bold ${pasoActual === 3 ? "text-[#191A7D]" : "text-slate-700"}`}>
                Validación Documental
              </p>
            </div>
          </button>

          <div className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${pasoActual >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />

          {/* Paso 4 */}
          <button
            type="button"
            onClick={() => tipo && pasoActual >= 3 && setPasoActual(4)}
            disabled={!tipo || pasoActual < 3}
            className="flex items-center gap-2.5 text-left cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                pasoActual === 4
                  ? "bg-[#191A7D] text-white ring-4 ring-blue-100"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              4
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paso 4</p>
              <p className={`text-xs font-bold ${pasoActual === 4 ? "text-[#191A7D]" : "text-slate-700"}`}>
                Previsualización & Emisión
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* PASO 1: SELECCIÓN Y CLASIFICACIÓN DE TIPO DE CERTIFICADO         */}
      {/* ================================================================ */}
      {pasoActual === 1 && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31338] mb-1">
                <BookOpen className="w-4 h-4 text-[#D31338]" />
                Paso 1 de 4 • Selección de Formato Legal
              </div>
              <h2 className="text-xl font-extrabold text-[#191A7D]">
                Tipo de Certificado o Supletorio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Seleccione el instrumento jurídico correspondiente a la solicitud del interesado.
              </p>
            </div>

            {/* Filtro por Familia */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFamiliaFiltro("TODAS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  familiaFiltro === "TODAS"
                    ? "bg-white text-[#191A7D] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos (5)
              </button>
              <button
                type="button"
                onClick={() => setFamiliaFiltro("A_CERTIFICADO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  familiaFiltro === "A_CERTIFICADO"
                    ? "bg-white text-[#191A7D] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Autenticidad & Históricos
              </button>
              <button
                type="button"
                onClick={() => setFamiliaFiltro("B_SUPLETORIO_TITULO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  familiaFiltro === "B_SUPLETORIO_TITULO"
                    ? "bg-white text-[#191A7D] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Supletorios Título
              </button>
              <button
                type="button"
                onClick={() => setFamiliaFiltro("C_SUPLETORIO_DIPLOMA")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  familiaFiltro === "C_SUPLETORIO_DIPLOMA"
                    ? "bg-white text-[#191A7D] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Supletorios Bachiller
              </button>
            </div>
          </div>

          {/* Grilla de Opciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiposDisponibles.map((item) => {
              const selected = tipo === item.value;
              const IconComp = iconMap[item.icono] || FileText;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTipo(item.value)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    selected
                      ? "border-[#191A7D] bg-blue-50/60 shadow-md ring-2 ring-[#191A7D]/20"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {selected && (
                    <div className="absolute top-0 right-0 bg-[#191A7D] text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Seleccionado
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <IconComp className="w-6 h-6" style={{ color: item.color }} />
                    </div>

                    <div className="flex-1 pr-12">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                          {item.value.replace("TIPO_", "TIPO ")}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {item.familia === "A_CERTIFICADO" ? "Certificación" : "Supletorio Legal"}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                        {item.label}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          Arancel: 50 Bs.
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">
                          {item.camposRequeridos.length} campos normativos
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              Formato seleccionado: <strong className="text-[#191A7D]">{config?.label}</strong>
            </span>
            <Button
              onClick={() => setPasoActual(2)}
              disabled={!tipo}
              className="bg-[#191A7D] hover:bg-[#12135D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Continuar a Datos del Solicitante</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* PASO 2: DATOS DE ENTRADA CON VALIDACIÓN RIGUROSA                */}
      {/* ================================================================ */}
      {pasoActual === 2 && config && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31338] mb-1">
                <UserCheck className="w-4 h-4 text-[#D31338]" />
                Paso 2 de 4 • Datos de Entrada y Solicitante
              </div>
              <h2 className="text-xl font-extrabold text-[#191A7D]">
                Formulario de Validación Rigurosa ({config.label})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete los identificadores obligatorios del solicitante y los campos documentales del libro matriz.
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#191A7D] text-xs font-mono font-bold rounded-full border border-blue-200 self-start sm:self-auto">
              Informe: {informeId}
            </span>
          </div>

          {/* Subsección A: Identificadores Obligatorios del Solicitante */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#191A7D] uppercase tracking-wider">
              <span className="material-symbols-outlined text-[#D31338] text-base">badge</span>
              A. Identificadores Institucionales del Solicitante
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* C.I. */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Cédula de Identidad (C.I.): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(datos.ciTitular as string) || ""}
                  onChange={(e) => updateCampo("ciTitular", e.target.value)}
                  placeholder="Ej: 4716343-SCZ"
                  className={`w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border transition-colors outline-none ${
                    erroresSolicitante.ciTitular
                      ? "border-red-400 bg-red-50 text-red-900"
                      : "border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]"
                  }`}
                />
                {erroresSolicitante.ciTitular && (
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">{erroresSolicitante.ciTitular}</p>
                )}
              </div>

              {/* Matrícula Universitaria (R.U.) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Registro Universitario (R.U.): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={((datos as any).matriculaUniversitaria as string) || ""}
                  onChange={(e) => updateCampo("matriculaUniversitaria", e.target.value)}
                  placeholder="Ej: 219084721"
                  className={`w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border transition-colors outline-none ${
                    erroresSolicitante.matriculaUniversitaria
                      ? "border-red-400 bg-red-50 text-red-900"
                      : "border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]"
                  }`}
                />
                {erroresSolicitante.matriculaUniversitaria && (
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">{erroresSolicitante.matriculaUniversitaria}</p>
                )}
              </div>

              {/* Gestión de Graduación */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Gestión de Titulación: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={((datos as any).gestionGraduacion as string) || ""}
                  onChange={(e) => updateCampo("gestionGraduacion", e.target.value)}
                  placeholder="Ej: 1999 o 2001"
                  className={`w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border transition-colors outline-none ${
                    erroresSolicitante.gestionGraduacion
                      ? "border-red-400 bg-red-50 text-red-900"
                      : "border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]"
                  }`}
                />
                {erroresSolicitante.gestionGraduacion && (
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">{erroresSolicitante.gestionGraduacion}</p>
                )}
              </div>

              {/* Código de Arancel / Pago */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Comprobante de Arancel: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={((datos as any).codigoArancel as string) || ""}
                  onChange={(e) => updateCampo("codigoArancel", e.target.value)}
                  placeholder="Ej: ARAN-2024-0491"
                  className={`w-full px-3.5 py-2 text-xs font-mono font-bold rounded-xl border transition-colors outline-none ${
                    erroresSolicitante.codigoArancel
                      ? "border-red-400 bg-red-50 text-red-900"
                      : "border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]"
                  }`}
                />
                {erroresSolicitante.codigoArancel && (
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">{erroresSolicitante.codigoArancel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Subsección B: Campos Documentales Dinámicos del Formato */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#191A7D] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[#D31338] text-base">menu_book</span>
                B. Campos del Certificado y Registro Matriz
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {config.camposRequeridos.length} campos normativos requeridos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.camposRequeridos.map((campo) => {
                const valorActual = (datos as Record<string, string>)[campo] ?? "";
                const isMissing = camposFaltantes.includes(campo);

                return (
                  <div key={campo} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 capitalize">
                      {campo.replace(/([A-Z])/g, " $1")}:
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={valorActual}
                      onChange={(e) => updateCampo(campo, e.target.value)}
                      placeholder={`Ingrese ${campo}...`}
                      className={`w-full px-3.5 py-2 text-xs rounded-xl border transition-colors outline-none ${
                        isMissing
                          ? "border-red-300 bg-red-50/50 text-red-900 focus:ring-red-400"
                          : "border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]"
                      }`}
                    />
                    {isMissing && (
                      <p className="text-[10px] text-red-500 font-bold">Campo obligatorio requerido</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navegación Paso 2 */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setPasoActual(1)}
              className="text-slate-700 border-slate-300 px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Tipo</span>
            </Button>

            <Button
              onClick={handleSiguientePaso2}
              className="bg-[#191A7D] hover:bg-[#12135D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Validar y Continuar a Verificación</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* PASO 3: VALIDACIÓN DOCUMENTAL (CHECKLIST INSTITUCIONAL)          */}
      {/* ================================================================ */}
      {pasoActual === 3 && config && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31338] mb-1">
                <ShieldCheck className="w-4 h-4 text-[#D31338]" />
                Paso 3 de 4 • Control de Calidad Documental
              </div>
              <h2 className="text-xl font-extrabold text-[#191A7D]">
                Validación Documental y Requisitos Previos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cotejo institucional para garantizar la certeza jurídica del certificado previo a la firma rectoral.
              </p>
            </div>

            <button
              type="button"
              onClick={marcarTodosRequisitos}
              className="px-3.5 py-1.5 bg-blue-50 text-[#191A7D] hover:bg-blue-100 text-xs font-extrabold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Marcar Todos como Validados</span>
            </button>
          </div>

          {/* Resumen Rápido del Trámite */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Titular:</span>
              <strong className="text-slate-900 uppercase font-bold">{datos.nombreTitular || "No definido"}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">C.I. con Extensión:</span>
              <strong className="font-mono text-[#191A7D]">{datos.ciTitular}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Matrícula (R.U.):</span>
              <strong className="font-mono text-slate-800">{(datos as any).matriculaUniversitaria}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Arancel Cancelado:</span>
              <strong className="font-mono text-emerald-700">{(datos as any).codigoArancel} (50 Bs.)</strong>
            </div>
          </div>

          {/* Lista de Requisitos */}
          <div className="space-y-3">
            {REQUISITOS_DOCUMENTALES.map((req) => {
              const checked = !!requisitosValidados[req.id];

              return (
                <div
                  key={req.id}
                  onClick={() => toggleRequisito(req.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    checked
                      ? "border-emerald-300 bg-emerald-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      checked ? "bg-emerald-600 text-white" : "border-2 border-slate-300 bg-white"
                    }`}
                  >
                    {checked && <Check className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">
                        {req.titulo}
                      </h4>
                      {req.obligatorio && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          Obligatorio
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {req.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estado de Requisitos */}
          {!todosRequisitosCumplidos && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Debe marcar todos los requisitos obligatorios para proceder a la previsualización oficial.</span>
            </div>
          )}

          {/* Navegación Paso 3 */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setPasoActual(2)}
              className="text-slate-700 border-slate-300 px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Datos</span>
            </Button>

            <Button
              onClick={() => setPasoActual(4)}
              disabled={!todosRequisitosCumplidos}
              className="bg-[#191A7D] hover:bg-[#12135D] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continuar a Previsualización y Emisión</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/* PASO 4: PREVISUALIZACIÓN OFICIAL Y TIMBRADO FINAL               */}
      {/* ================================================================ */}
      {pasoActual === 4 && tipo && config && (
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D31338] mb-1">
                <FileCheck className="w-4 h-4 text-[#D31338]" />
                Paso 4 de 4 • Confirmación y Timbrado Oficial
              </div>
              <h2 className="text-xl font-extrabold text-[#191A7D]">
                Previsualización Oficial del Certificado (A4)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Revise el documento exactamente como se imprimirá y timbrará con el hash criptográfico institucional.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Requisitos 100% Verificados
              </span>
            </div>
          </div>

          {/* Ficha Resumen de Emisión */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block font-medium">Titular del Grado:</span>
              <strong className="text-slate-900 uppercase font-extrabold">{datos.nombreTitular}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-medium">Identificación:</span>
              <span className="font-mono text-slate-800 font-bold">{datos.ciTitular} • R.U. {(datos as any).matriculaUniversitaria}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-medium">Libro / Fojas:</span>
              <span className="font-mono text-[#D31338] font-bold">Libro {datos.libro} • Foja {datos.fojas}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block font-medium">Comprobante de Caja:</span>
              <span className="font-mono text-emerald-800 font-bold">{(datos as any).codigoArancel}</span>
            </div>
          </div>

          {/* Previsualización Oficial en Vivo */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto">
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-2">
              <CertificadoPreview tipo={tipo} datos={datos} />
            </div>
          </div>

          {/* Mensajes de Resultado de Emisión */}
          {estado.status === "error" && (
            <div role="alert" className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Error durante la emisión</p>
                <p className="text-xs text-red-700">{estado.message}</p>
              </div>
            </div>
          )}

          {estado.status === "success" && (
            <div className="p-5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-black text-emerald-950 text-base">¡Certificado Oficial Emitido Exitosamente!</p>
                  <p className="text-xs text-emerald-800 font-mono mt-0.5">
                    ID Certificado: <strong>{estado.certificadoId}</strong> • Timbre QR Criptográfico generado
                  </p>
                </div>
              </div>
              <a
                href={estado.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <FileCheck className="w-4 h-4" />
                <span>Descargar PDF Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Acciones Finales */}
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPasoActual(3)}
                className="text-slate-700 border-slate-300 px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a Validación</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleReiniciar}
                disabled={loading}
                className="text-slate-600 border-slate-300 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar</span>
              </Button>
            </div>

            <Button
              onClick={handleEmitir}
              disabled={loading || estado.status === "success"}
              className="bg-[#D31338] hover:bg-[#B70F2F] text-white px-7 py-3 rounded-xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span>Timbrando y Generando Certificado...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Emitir Certificado Oficial UAGRM</span>
                </>
              )}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
