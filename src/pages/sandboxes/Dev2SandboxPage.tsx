import { useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui";
import { useNavigate } from "react-router-dom";
import { SecretariaModule } from "@/pages/secretaria";
import {
  HeroInstitucional,
  SelectorRolTramite,
  BannerConvenioUAGRM,
  FormularioRegistro,
  ModuloCargaNomina,
  ModalConfirmacionJurada,
  PortalLanding,
} from "@/widgets/PortalConvenios";
import type {
  RolTramite,
  SolicitudPersonalData,
  SolicitudInstitucionalData,
  PostulanteNomina,
} from "@/widgets/PortalConvenios/portal.types";
import "@/widgets/PortalConvenios/portal.css";

export function Dev2SandboxPage() {
  const navigate = useNavigate();

  // Vista Centralizada del Sistema ("landing" = Portada Raíz | "formulario" = Radicación | "secretaria" = Gestión Legal)
  const [vistaActual, setVistaActual] = useState<"landing" | "formulario" | "secretaria">("landing");

  // Rol o Modalidad del Trámite en el Portal Público
  const [rol, setRol] = useState<RolTramite>("personal");

  // Estado para Trámite Personal (Graduado / Solicitante)
  const [personalData, setPersonalData] = useState<SolicitudPersonalData>({
    nombreCompleto: "",
    ci: "",
    ciExtension: "SCZ",
    correo: "",
    telefono: "",
    tipoTramite: "TITULO_SUPLETORIO",
    carrera: "",
    gestionEgreso: "",
    cartaPdf: null,
  });

  // Estado para Solicitud Institucional (Empresa / Entidad en Convenio)
  const [institucionalData, setInstitucionalData] = useState<SolicitudInstitucionalData>({
    razonSocial: "",
    nit: "",
    numeroOficio: "",
    codigoConvenio: "",
    funcionarioNombre: "",
    funcionarioCargo: "",
    funcionarioCorreo: "",
    funcionarioTelefono: "",
    oficioPdf: null,
  });

  // Nómina de Postulantes (Carga Masiva Institucional)
  const [postulantes, setPostulantes] = useState<PostulanteNomina[]>([]);

  // Notificación de éxito
  const [tramiteRadicado, setTramiteRadicado] = useState(false);

  // Manejadores de cambios tipados
  const handlePersonalChange = <K extends keyof SolicitudPersonalData>(field: K, value: SolicitudPersonalData[K]) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstitucionalChange = <K extends keyof SolicitudInstitucionalData>(field: K, value: SolicitudInstitucionalData[K]) => {
    setInstitucionalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRadicarSolicitud = () => {
    setTramiteRadicado(true);
    alert(
      rol === "personal"
        ? "¡Solicitud personal radicada exitosamente! Se ha remitido el código de seguimiento a su correo."
        : "¡Solicitud masiva institucional radicada exitosamente bajo convenio UAGRM!"
    );
    console.log("Datos de radicación:", {
      rol,
      personal: rol === "personal" ? personalData : null,
      institucional: rol === "institucional" ? institucionalData : null,
      postulantes: rol === "institucional" ? postulantes : [],
    });
  };

  // Validación de formulario reactiva
  const isFormValid = () => {
    if (rol === "personal") {
      return Boolean(
        personalData.nombreCompleto.trim() &&
          personalData.ci.trim() &&
          personalData.correo.trim() &&
          personalData.telefono.trim() &&
          personalData.carrera.trim() &&
          personalData.gestionEgreso.trim() &&
          personalData.cartaPdf
      );
    }

    // Validación Institucional
    if (
      !institucionalData.razonSocial.trim() ||
      !institucionalData.nit.trim() ||
      !institucionalData.numeroOficio.trim() ||
      !institucionalData.funcionarioNombre.trim() ||
      !institucionalData.funcionarioCorreo.trim() ||
      !institucionalData.codigoConvenio.trim() ||
      !institucionalData.oficioPdf ||
      postulantes.length === 0
    ) {
      return false;
    }

    const cisArray = postulantes.map((p) => p.ci?.trim() || "");
    const duplicates = cisArray.filter(
      (item, index) => item !== "" && cisArray.indexOf(item) !== index
    );

    const hasErrors = postulantes.some(
      (p) =>
        !p.ci ||
        !p.nombre ||
        !p.carrera ||
        !p.titulo ||
        !p.gestion ||
        duplicates.includes(p.ci.trim())
    );

    return !hasErrors;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Banner superior de entorno aislado DEV 2 */}
      <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
            Sandbox Aislado DEV 2
          </span>
          <span>
            Visualizando cambios de la rama <strong>origin/fabian-cuellar</strong> (Portal Landing, Carga Masiva y Secretaría General).
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-emerald-100 hidden sm:inline">
            Vista activa: <strong className="uppercase">{vistaActual}</strong>
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate('/login')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded text-xs flex items-center gap-1.5 transition-colors h-7 border border-emerald-500/40"
          >
            <ArrowLeft size={14} /> Volver al Sistema Principal
          </Button>
        </div>
      </div>

      {/* 1. VISTA RAÍZ: Portada Principal Institucional y Landing UAGRM */}
      {vistaActual === "landing" ? (
        <PortalLanding
          onIniciarTramite={(modalidad) => {
            if (modalidad) {
              setRol(modalidad);
            }
            setVistaActual("formulario");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onIrASecretaria={() => {
            setVistaActual("secretaria");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : vistaActual === "secretaria" ? (
        /* 2. VISTA INTERNA: Secretaría General y Despacho Legal */
        <SecretariaModule
          onVolverPortada={() => {
            setVistaActual("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : (
        /* 3. VISTA DE RADICACIÓN: Formulario de Registro Personal / Institucional */
        <main className="portal-container">
          {/* Barra Superior Institucional de Retorno a la Portada */}
          <div className="portal-breadcrumb-bar">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setVistaActual("landing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="portal-back-btn"
            >
              <ArrowLeft size={16} />
              <span>← Volver a la Portada Principal</span>
            </Button>

            <span className="portal-breadcrumb-title">
              {rol === "personal"
                ? "Radicación de Trámite Personal (Graduado Universitario)"
                : "Radicación de Solicitud Institucional por Convenio UAGRM"}
            </span>
          </div>

          {/* Alerta Institucional de Radicación Exitosa */}
          {tramiteRadicado && (
            <div className="portal-notice-banner" role="status">
              <CheckCircle size={24} className="portal-notice-icon" aria-hidden="true" />
              <div>
                <h3 className="portal-notice-title">¡Solicitud Radicada Exitosamente!</h3>
                <p className="portal-notice-text">
                  Su trámite ha sido radicado formalmente en el sistema institucional y remitido
                  a la Bandeja de Admisión de Secretaría General para su revisión y acreditación previa.
                </p>
              </div>
            </div>
          )}

          {/* Portada Institucional (Hero) con Escudo UAGRM */}
          <HeroInstitucional />

          {/* Selector de Modalidad: Personal vs Institución */}
          <SelectorRolTramite rol={rol} onRolChange={setRol} />

          {/* Banner de Convenio Institucional (Exento de Pago) */}
          {rol === "institucional" && <BannerConvenioUAGRM />}

          {/* Formulario Modular de Registro */}
          <FormularioRegistro
            rol={rol}
            personalData={personalData}
            institucionalData={institucionalData}
            onPersonalChange={handlePersonalChange}
            onInstitucionalChange={handleInstitucionalChange}
          />

          {/* Módulo de Carga Masiva de Nómina (Exclusivo Institucional) */}
          {rol === "institucional" && (
            <ModuloCargaNomina
              postulantes={postulantes}
              setPostulantes={setPostulantes}
            />
          )}

          {/* Barra de Acciones y Modal de Confirmación Jurada */}
          <ModalConfirmacionJurada
            rol={rol}
            personalData={personalData}
            institucionalData={institucionalData}
            postulantes={postulantes}
            disabled={!isFormValid()}
            onRadicar={handleRadicarSolicitud}
          />
        </main>
      )}
    </div>
  );
}

export default Dev2SandboxPage;
