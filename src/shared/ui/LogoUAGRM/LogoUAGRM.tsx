import * as React from "react";
import "./LogoUAGRM.css";

export interface LogoUAGRMProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/**
 * Escudo Oficial de la Universidad Autónoma Gabriel René Moreno (UAGRM)
 * Consume el activo oficial institucional en formato WebP (/UAGRM-Bolivia.webp)
 * garantizando la heráldica fidedigna (Gorro Frigio, Sol de Mayo, Globo Terráqueo y Cinta Tricolor).
 */
export const LogoUAGRM: React.FC<LogoUAGRMProps> = ({
  size = "md",
  className = "",
}) => {
  return (
    <img
      src="/UAGRM-Bolivia.webp"
      alt="Escudo Oficial de la Universidad Autónoma Gabriel René Moreno"
      className={`logo-uagrm-img logo-uagrm--${size} ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};

export default LogoUAGRM;
