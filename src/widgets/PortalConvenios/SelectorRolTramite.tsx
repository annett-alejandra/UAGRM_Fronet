import * as React from "react";
import { GraduationCap, Building2 } from "lucide-react";
import { Button } from "@shared/ui";
import { type RolTramite } from "./portal.types";

export interface SelectorRolTramiteProps {
  rol: RolTramite;
  onRolChange: (rol: RolTramite) => void;
}

/**
 * Selector de Rol y Modalidad de Trámite
 * Permite alternar de forma limpia y accesible entre Trámite Personal e Institucional.
 * Cero etiquetas crudas (consume <Button> de @shared/ui) y cero estilos en línea.
 */
export const SelectorRolTramite: React.FC<SelectorRolTramiteProps> = ({
  rol,
  onRolChange,
}) => {
  return (
    <div className="portal-role-container">
      <div className="portal-role-header">
        <h2 className="portal-role-title">Modalidad de Solicitud</h2>
        <p className="portal-role-hint">
          Seleccione el tipo de trámite para desplegar los requisitos y el formulario correspondiente:
        </p>
      </div>

      <div className="portal-role-grid">
        {/* Opción 1: Trámite Personal */}
        <Button
          type="button"
          variant="ghost"
          className={`portal-role-card ${rol === "personal" ? "portal-role-card--active" : ""}`}
          onClick={() => onRolChange("personal")}
          aria-pressed={rol === "personal"}
        >
          <div className="portal-role-icon">
            <GraduationCap size={24} />
          </div>
          <div className="portal-role-content">
            <span className="portal-role-name">Trámite Personal (Graduado)</span>
            <span className="portal-role-desc">
              Para egresados y profesionales universitarios que solicitan Título Supletorio,
              Apostilla o Certificaciones de notas individuales.
            </span>
          </div>
        </Button>

        {/* Opción 2: Solicitud Institucional */}
        <Button
          type="button"
          variant="ghost"
          className={`portal-role-card ${rol === "institucional" ? "portal-role-card--active" : ""}`}
          onClick={() => onRolChange("institucional")}
          aria-pressed={rol === "institucional"}
        >
          <div className="portal-role-icon">
            <Building2 size={24} />
          </div>
          <div className="portal-role-content">
            <span className="portal-role-name">Solicitud Institucional (Convenio)</span>
            <span className="portal-role-desc">
              Para empresas públicas, ministerios y entidades financieras con convenio activo
              para trámites y verificaciones masivas exentas de arancel.
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SelectorRolTramite;
