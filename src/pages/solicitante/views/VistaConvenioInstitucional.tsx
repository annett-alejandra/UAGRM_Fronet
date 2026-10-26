import { useState } from "react";
import { CheckCircle } from "lucide-react";
import {
  HeroInstitucional,
  SelectorRolTramite,
  BannerConvenioUAGRM,
  FormularioRegistro,
  ModuloCargaNomina,
  ModalConfirmacionJurada,
} from "@/widgets/PortalConvenios";
import type {
  RolTramite,
  SolicitudPersonalData,
  SolicitudInstitucionalData,
  PostulanteNomina,
} from "@/widgets/PortalConvenios/portal.types";
import "@/widgets/PortalConvenios/portal.css";

/**
 * Vista de Radicación Institucional bajo Convenio (Módulo Dev 2 - Fabian Cuellar)
 * Integrado plenamente en el Portal del Solicitante Central.
 */
export function VistaConvenioInstitucional() {
  const [rol, setRol] = useState<RolTramite>("institucional");

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

  const [postulantes, setPostulantes] = useState<PostulanteNomina[]>([]);
  const [tramiteRadicado, setTramiteRadicado] = useState(false);

  const handlePersonalChange = <K extends keyof SolicitudPersonalData>(
    field: K,
    value: SolicitudPersonalData[K]
  ) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstitucionalChange = <K extends keyof SolicitudInstitucionalData>(
    field: K,
    value: SolicitudInstitucionalData[K]
  ) => {
    setInstitucionalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRadicarSolicitud = () => {
    setTramiteRadicado(true);
    alert(
      rol === "personal"
        ? "¡Solicitud personal radicada exitosamente! Se ha remitido el código de seguimiento a su correo."
        : "¡Solicitud masiva institucional radicada exitosamente bajo convenio UAGRM!"
    );
  };

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
    <div className="portal-container w-full max-w-5xl mx-auto">
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

      {/* Banner de Convenio Institucional (Exento de Pago) conectado a la Caja de Herramientas */}
      {rol === "institucional" && <BannerConvenioUAGRM />}

      {/* Formulario Modular de Registro */}
      <FormularioRegistro
        rol={rol}
        personalData={personalData}
        institucionalData={institucionalData}
        onPersonalChange={handlePersonalChange}
        onInstitucionalChange={handleInstitucionalChange}
      />

      {/* Módulo de Carga Masiva de Nómina */}
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
    </div>
  );
}

export default VistaConvenioInstitucional;
