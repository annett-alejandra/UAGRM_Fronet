import * as React from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  GraduationCap,
  Calendar,
  Building2,
  Hash,
  FileText,
  Briefcase,
  KeyRound,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { Input, Select, Button } from "@shared/ui";
import {
  type RolTramite,
  type SolicitudPersonalData,
  type SolicitudInstitucionalData,
  DEPARTAMENTOS_BOLIVIA,
  TIPOS_TRAMITE_PERSONAL,
} from "./portal.types";

export interface FormularioRegistroProps {
  rol: RolTramite;
  personalData: SolicitudPersonalData;
  institucionalData: SolicitudInstitucionalData;
  onPersonalChange: <K extends keyof SolicitudPersonalData>(
    field: K,
    value: SolicitudPersonalData[K]
  ) => void;
  onInstitucionalChange: <K extends keyof SolicitudInstitucionalData>(
    field: K,
    value: SolicitudInstitucionalData[K]
  ) => void;
}

/**
 * Formulario Modular de Registro de Solicitud
 * Separación limpia y moderna de secciones para trámites Personales e Institucionales.
 * 100% gobernado por componentes oficiales de @shared/ui y estilos en portal.css.
 */
export const FormularioRegistro: React.FC<FormularioRegistroProps> = ({
  rol,
  personalData,
  institucionalData,
  onPersonalChange,
  onInstitucionalChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Manejo de archivo PDF
  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      if (rol === "personal") {
        onPersonalChange("cartaPdf", file);
      } else {
        onInstitucionalChange("oficioPdf", file);
      }
    } else {
      alert("Por favor, suba únicamente archivos en formato PDF oficial.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const archivoPdfActual =
    rol === "personal" ? personalData.cartaPdf : institucionalData.oficioPdf;

  const handleQuitarArchivo = () => {
    if (rol === "personal") {
      onPersonalChange("cartaPdf", null);
    } else {
      onInstitucionalChange("oficioPdf", null);
    }
  };

  return (
    <div>
      {/* ===================================================================
          SECCIÓN 1: Identificación y Contacto del Solicitante / Funcionario
          =================================================================== */}
      <section className="portal-section-card">
        <header className="portal-section-header">
          <div className="portal-section-title-wrap">
            <span className="portal-section-step">1</span>
            <div>
              <h3 className="portal-section-title">
                {rol === "personal"
                  ? "Datos de Identificación del Graduado"
                  : "Datos del Funcionario Responsable"}
              </h3>
              <span className="portal-section-caption">
                Información formal para registro en el sistema y emisión de notificaciones.
              </span>
            </div>
          </div>
        </header>

        {/* Fila: Nombre Completo y Cédula de Identidad con Extensión (Personal) o Cargo (Institucional) */}
        <div className="portal-grid-2">
          <div className="portal-field-group">
            <label className="portal-field-label" htmlFor="solicitante-nombre">
              {rol === "personal"
                ? "Nombre Completo"
                : "Nombre del Funcionario Responsable"}{" "}
              <span className="portal-field-required">*</span>
            </label>
            <Input
              id="solicitante-nombre"
              name="nombre"
              startIcon={<User size={18} />}
              placeholder={
                rol === "personal"
                  ? "Ej. Juan Pérez Rodríguez"
                  : "Ej. Lic. Carlos Mendoza Vargas"
              }
              value={
                rol === "personal"
                  ? personalData.nombreCompleto
                  : institucionalData.funcionarioNombre
              }
              onChange={(e) => {
                if (rol === "personal") {
                  onPersonalChange("nombreCompleto", e.target.value);
                } else {
                  onInstitucionalChange("funcionarioNombre", e.target.value);
                }
              }}
            />
            <span className="portal-field-hint">
              {rol === "personal"
                ? "Ingrese nombres y apellidos tal como constan en su Cédula de Identidad."
                : "Funcionario público o apoderado legal acreditado de la entidad."}
            </span>
          </div>

          {rol === "personal" ? (
            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="solicitante-ci">
                Cédula de Identidad (C.I.) <span className="portal-field-required">*</span>
              </label>
              <div className="portal-grid-ci">
                <Input
                  id="solicitante-ci"
                  name="ci"
                  startIcon={<CreditCard size={18} />}
                  placeholder="Ej. 8492019"
                  value={personalData.ci}
                  onChange={(e) => onPersonalChange("ci", e.target.value)}
                />
                <Select
                  id="solicitante-ci-ext"
                  value={personalData.ciExtension}
                  onChange={(e) =>
                    onPersonalChange(
                      "ciExtension",
                      e.target.value as SolicitudPersonalData["ciExtension"]
                    )
                  }
                >
                  {DEPARTAMENTOS_BOLIVIA.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.value}
                    </option>
                  ))}
                </Select>
              </div>
              <span className="portal-field-hint">
                Número de documento y departamento emisor.
              </span>
            </div>
          ) : (
            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="solicitante-cargo">
                Cargo o Función Institucional <span className="portal-field-required">*</span>
              </label>
              <Input
                id="solicitante-cargo"
                startIcon={<Briefcase size={18} />}
                placeholder="Ej. Director de Recursos Humanos / Asesor Legal"
                value={institucionalData.funcionarioCargo}
                onChange={(e) =>
                  onInstitucionalChange("funcionarioCargo", e.target.value)
                }
              />
              <span className="portal-field-hint">
                Puesto formal del funcionario en la estructura organizacional.
              </span>
            </div>
          )}
        </div>

        {/* Fila: Correo Electrónico y Teléfono */}
        <div className="portal-grid-2">
          <div className="portal-field-group">
            <label className="portal-field-label" htmlFor="solicitante-correo">
              Correo Electrónico Institucional / Personal{" "}
              <span className="portal-field-required">*</span>
            </label>
            <Input
              id="solicitante-correo"
              type="email"
              name="correo"
              startIcon={<Mail size={18} />}
              placeholder="ejemplo@uagrm.edu.bo o correo@entidad.gob.bo"
              value={
                rol === "personal"
                  ? personalData.correo
                  : institucionalData.funcionarioCorreo
              }
              onChange={(e) => {
                if (rol === "personal") {
                  onPersonalChange("correo", e.target.value);
                } else {
                  onInstitucionalChange("funcionarioCorreo", e.target.value);
                }
              }}
            />
            <span className="portal-field-hint">
              A esta dirección se remitirán los códigos de seguimiento y resoluciones.
            </span>
          </div>

          <div className="portal-field-group">
            <label className="portal-field-label" htmlFor="solicitante-telefono">
              Teléfono / Celular de Contacto <span className="portal-field-required">*</span>
            </label>
            <Input
              id="solicitante-telefono"
              type="tel"
              name="telefono"
              startIcon={<Phone size={18} />}
              placeholder="Ej. 71020304"
              value={
                rol === "personal"
                  ? personalData.telefono
                  : institucionalData.funcionarioTelefono
              }
              onChange={(e) => {
                if (rol === "personal") {
                  onPersonalChange("telefono", e.target.value);
                } else {
                  onInstitucionalChange("funcionarioTelefono", e.target.value);
                }
              }}
            />
            <span className="portal-field-hint">
              Para notificaciones y alertas prioritarias por WhatsApp.
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          SECCIÓN 2 (CONDICIONAL): Trámite Personal vs Datos Institucionales
          =================================================================== */}
      {rol === "personal" ? (
        <section className="portal-section-card">
          <header className="portal-section-header">
            <div className="portal-section-title-wrap">
              <span className="portal-section-step">2</span>
              <div>
                <h3 className="portal-section-title">
                  Detalles del Documento Académico Solicitado
                </h3>
                <span className="portal-section-caption">
                  Especifique el tipo de certificación y antecedentes de graduación en la UAGRM.
                </span>
              </div>
            </div>
          </header>

          <div className="portal-grid-3">
            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="personal-tramite">
                Tipo de Trámite Universitario <span className="portal-field-required">*</span>
              </label>
              <Select
                id="personal-tramite"
                value={personalData.tipoTramite}
                onChange={(e) =>
                  onPersonalChange(
                    "tipoTramite",
                    e.target.value as SolicitudPersonalData["tipoTramite"]
                  )
                }
              >
                {TIPOS_TRAMITE_PERSONAL.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="personal-carrera">
                Carrera Universitaria <span className="portal-field-required">*</span>
              </label>
              <Input
                id="personal-carrera"
                startIcon={<GraduationCap size={18} />}
                placeholder="Ej. Licenciatura en Derecho"
                value={personalData.carrera}
                onChange={(e) => onPersonalChange("carrera", e.target.value)}
              />
            </div>

            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="personal-gestion">
                Gestión de Egreso / Titulación <span className="portal-field-required">*</span>
              </label>
              <Input
                id="personal-gestion"
                startIcon={<Calendar size={18} />}
                placeholder="Ej. 2023"
                value={personalData.gestionEgreso}
                onChange={(e) => onPersonalChange("gestionEgreso", e.target.value)}
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="portal-section-card">
          <header className="portal-section-header">
            <div className="portal-section-title-wrap">
              <span className="portal-section-step">2</span>
              <div>
                <h3 className="portal-section-title">
                  Datos de la Entidad Solicitante y Convenio
                </h3>
                <span className="portal-section-caption">
                  Información legal de la entidad pública o institución bajo convenio vigente.
                </span>
              </div>
            </div>
          </header>

          <div className="portal-grid-2">
            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="inst-razonSocial">
                Nombre o Razón Social Oficial <span className="portal-field-required">*</span>
              </label>
              <Input
                id="inst-razonSocial"
                startIcon={<Building2 size={18} />}
                placeholder="Ej. Ministerio de Educación, SEDES, YPFB..."
                value={institucionalData.razonSocial}
                onChange={(e) => onInstitucionalChange("razonSocial", e.target.value)}
              />
              <span className="portal-field-hint">
                Entidad firmante del convenio de acreditación con la UAGRM.
              </span>
            </div>

            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="inst-nit">
                Número de Identificación Tributaria (NIT){" "}
                <span className="portal-field-required">*</span>
              </label>
              <Input
                id="inst-nit"
                startIcon={<Hash size={18} />}
                placeholder="Ej. 1020304050"
                value={institucionalData.nit}
                onChange={(e) => onInstitucionalChange("nit", e.target.value)}
              />
            </div>
          </div>

          <div className="portal-grid-3">
            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="inst-numeroOficio">
                N° de Oficio o Nota Externa <span className="portal-field-required">*</span>
              </label>
              <Input
                id="inst-numeroOficio"
                startIcon={<FileText size={18} />}
                placeholder="Ej. OF/DIR/104/2026"
                value={institucionalData.numeroOficio}
                onChange={(e) => onInstitucionalChange("numeroOficio", e.target.value)}
              />
            </div>

            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="inst-funcionarioCargo">
                Cargo del Funcionario <span className="portal-field-required">*</span>
              </label>
              <Input
                id="inst-funcionarioCargo"
                startIcon={<Briefcase size={18} />}
                placeholder="Ej. Director de Recursos Humanos"
                value={institucionalData.funcionarioCargo}
                onChange={(e) =>
                  onInstitucionalChange("funcionarioCargo", e.target.value)
                }
              />
            </div>

            <div className="portal-field-group">
              <label className="portal-field-label" htmlFor="inst-codigoConvenio">
                Código Secreto de Convenio <span className="portal-field-required">*</span>
              </label>
              <Input
                id="inst-codigoConvenio"
                startIcon={<KeyRound size={18} />}
                placeholder="Ej. UAGRM-INST-XXXXXX"
                value={institucionalData.codigoConvenio}
                onChange={(e) =>
                  onInstitucionalChange("codigoConvenio", e.target.value)
                }
              />
              <span className="portal-field-hint">
                Clave emitida por Secretaría General.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================
          SECCIÓN 3: Carta u Oficio Digitalizado (PDF Obligatorio)
          =================================================================== */}
      <section className="portal-section-card">
        <header className="portal-section-header">
          <div className="portal-section-title-wrap">
            <span className="portal-section-step">3</span>
            <div>
              <h3 className="portal-section-title">
                {rol === "personal"
                  ? "Carta de Solicitud Formal Digitalizada (PDF)"
                  : "Oficio Institucional Digitalizado (Justificativo Legal - PDF)"}
              </h3>
              <span className="portal-section-caption">
                Adjunte el documento formal firmado y sellado que fundamenta la solicitud.
              </span>
            </div>
          </div>
        </header>

        {/* Input file nativo oculto para interactuar mediante la zona drag & drop */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          aria-hidden="true"
          className="hidden"
          onChange={handleFileChange}
        />

        {!archivoPdfActual ? (
          <div
            className={`portal-upload-zone ${isDragging ? "portal-upload-zone--active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click();
              }
            }}
          >
            <UploadCloud size={44} className="portal-upload-icon" />
            <div className="portal-upload-text">
              Haga clic o arrastre aquí el archivo PDF
            </div>
            <div className="portal-upload-hint">
              Formato obligatorio: PDF. Tamaño máximo admitido: 10 MB. Debe contar con firma legible.
            </div>
          </div>
        ) : (
          <div className="portal-file-preview">
            <div className="portal-file-info">
              <FileText size={28} className="text-uagrm-blue" />
              <div>
                <div className="portal-file-name">{archivoPdfActual.name}</div>
                <div className="portal-file-meta">
                  {(archivoPdfActual.size / 1024 / 1024).toFixed(2)} MB &bull; Archivo PDF
                  verificado
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuitarArchivo}
            >
              <Trash2 size={16} />
              <span>Cambiar archivo</span>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default FormularioRegistro;
