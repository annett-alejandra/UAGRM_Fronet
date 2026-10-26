import * as React from "react";
import { ShieldCheck, FileCheck2, Award } from "lucide-react";
import { LogoUAGRM } from "./LogoUAGRM";

/**
 * Portada o Portal de Entrada Institucional (Hero)
 * Integra el Escudo Oficial de la UAGRM de manera sobria y solemne.
 * Estilo 100% plano institucional, sin degradados y con tipografía formal.
 */
export const HeroInstitucional: React.FC = () => {
  return (
    <header className="portal-hero">
      <div className="portal-hero-inner">
        {/* Identidad Institucional: Escudo UAGRM y Títulos */}
        <div className="portal-hero-brand">
          <div className="portal-hero-logo">
            <LogoUAGRM size="lg" />
          </div>
          <div className="portal-hero-texts">
            <div className="portal-hero-pretitle">
              Universidad Autónoma Gabriel René Moreno &bull; Santa Cruz - Bolivia
            </div>
            <h1 className="portal-hero-title">
              Sistema Integrado de Trámites y Certificaciones Universitarias
            </h1>
            <p className="portal-hero-description">
              Plataforma oficial para la radicación de solicitudes de Títulos Supletorios,
              Legalizaciones, Apostillamiento Internacional y Verificación Masiva
              Interinstitucional bajo Convenio.
            </p>
          </div>
        </div>
      </div>

      {/* Tira Horizontal de 3 Columnas: Insignias de Acreditación y Seguridad (Sin Fondo, Solo Icono y Texto) */}
      <div className="portal-hero-features-bar">
        <div className="portal-hero-feature-col">
          <ShieldCheck size={18} className="portal-hero-feature-icon portal-hero-feature-icon--green" />
          <span className="portal-hero-feature-text">Trámite Oficial con Custodia Jurídica</span>
        </div>
        <div className="portal-hero-feature-col">
          <FileCheck2 size={18} className="portal-hero-feature-icon portal-hero-feature-icon--blue" />
          <span className="portal-hero-feature-text">Acreditación de Secretaría General</span>
        </div>
        <div className="portal-hero-feature-col">
          <Award size={18} className="portal-hero-feature-icon portal-hero-feature-icon--gold" />
          <span className="portal-hero-feature-text">Validez Legal Nacional e Internacional</span>
        </div>
      </div>
    </header>
  );
};

export default HeroInstitucional;
