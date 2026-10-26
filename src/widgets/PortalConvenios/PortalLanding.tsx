import * as React from "react";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  Stamp,
  Clock,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Button, Badge, LogoUAGRM } from "@shared/ui";
import { type RolTramite } from "./portal.types";

export interface PortalLandingProps {
  onIniciarTramite: (modalidad?: RolTramite) => void;
  onIrASecretaria: () => void;
}

/**
 * Portada de Entrada Institucional y Landing Page — UAGRM
 * Diseño moderno, solemne y plano (0 degradados), con colores institucionales
 * y el Escudo Oficial de la UAGRM como protagonista visual.
 */
export const PortalLanding: React.FC<PortalLandingProps> = ({
  onIniciarTramite,
  onIrASecretaria,
}) => {
  return (
    <div className="portal-landing-wrapper">
      {/* ===================================================================
          1. BARRA SUPERIOR DE NAVEGACIÓN INSTITUCIONAL
          =================================================================== */}
      <nav className="portal-nav-bar" aria-label="Navegación principal UAGRM">
        <div className="portal-nav-inner">
          <div className="portal-nav-brand">
            <LogoUAGRM size="sm" />
            <div className="portal-nav-brand-texts">
              <span className="portal-nav-sub">UNIVERSIDAD AUTÓNOMA</span>
              <strong className="portal-nav-title">GABRIEL RENÉ MORENO</strong>
            </div>
          </div>

          <div className="portal-nav-actions">
            {/* Acceso Directo Funcionarial a Secretaría General */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onIrASecretaria}
              className="portal-nav-admin-btn"
            >
              <Lock size={15} />
              <span>Secretaría General</span>
            </Button>

            {/* Botón Principal de Radicación (Rojo Carmesí UAGRM con alto contraste) */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onIniciarTramite("personal")}
              className="portal-nav-cta-btn"
            >
              <span>Realizar Solicitud</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </nav>

      {/* ===================================================================
          2. HERO SECTION INSTITUCIONAL (PLANO, ELEGANTE Y SOLEMNE)
          =================================================================== */}
      <header className="portal-hero-section">
        <div className="portal-hero-container">
          <div className="portal-hero-content">
            <div className="portal-hero">
              <LogoUAGRM size="xl" className="portal-hero-emblem" />
            </div>

            <div className="portal-hero-headings">
              <div className="portal-hero-badge-row">
                <span className="portal-hero-tag">Santa Cruz &bull; Bolivia</span>
              </div>

              <h1 className="portal-hero-h1">
                Portal Oficial de Trámites y Certificaciones Universitarias
              </h1>

              <p className="portal-hero-lead">
                Plataforma digital universitaria para la tramitación de Títulos
                Supletorios por extravío o deterioro, Legalizaciones, Apostillamiento
                Internacional bajo Convenio de La Haya y Verificación Masiva
                Interinstitucional con custodia jurídica.
              </p>

              {/* Botones de Acción Directa (CTAs) */}
              <div className="portal-hero-cta-group">
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={() => onIniciarTramite("personal")}
                  className="portal-cta-primary"
                >
                  <GraduationCap size={20} />
                  <span>Trámite Personal (Graduados)</span>
                  <ArrowRight size={18} />
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => onIniciarTramite("institucional")}
                  className="portal-cta-secondary"
                >
                  <Building2 size={20} />
                  <span>Acceso Institucional (Convenio)</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onIrASecretaria}
                  className="portal-cta-outline-white"
                >
                  <Lock size={18} />
                  <span>Despacho Legal</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Cuadrícula de Pilares de Seguridad y Validez */}
          <div className="portal-pillars-grid">
            <div className="portal-pillar-card">
              <div>
                <h4 className="portal-pillar-title">Custodia y Fe Pública</h4>
                <p className="portal-pillar-desc">
                  Revisión y acreditación previa en Secretaría General con cotejo de libros matrices originales.
                </p>
              </div>
            </div>

            <div className="portal-pillar-card">
              <div>
                <h4 className="portal-pillar-title">Apostilla Internacional</h4>
                <p className="portal-pillar-desc">
                  Certificaciones académicas bajo el Convenio de La Haya o vía consular tradicional para el exterior.
                </p>
              </div>
            </div>

            <div className="portal-pillar-card">
              <div>
                <h4 className="portal-pillar-title">Despacho Seguro OTP</h4>
                <p className="portal-pillar-desc">
                  Protocolo de seguridad que intercepta la impresión y sellado seco mediante token de autoridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================================================================
          3. SECCIÓN DE MODALIDADES DE TRÁMITE Y ACCESOS DEL SISTEMA
          =================================================================== */}
      <section className="portal-services-section">
        <div className="portal-services-container">
          <div className="portal-section-center-head">
            <span className="portal-subheading">ÁREAS Y SERVICIOS DEL SISTEMA</span>
            <h2 className="portal-heading-title">
              Seleccione la Modalidad de Ingreso al Trámite
            </h2>
            <p className="portal-heading-desc">
              Elija la opción correspondiente para radicar su solicitud o acceder
              a la plataforma de gestión y despacho de Secretaría General.
            </p>
          </div>

          <div className="portal-cards-grid portal-cards-grid--3">
            {/* Tarjeta 1: Modalidad Personal (Graduados) */}
            <article className="portal-service-card portal-service-card--personal">
              <div className="portal-card-top">
                <div className="portal-card-icon-badge portal-card-icon-badge--blue">
                  <GraduationCap size={28} />
                </div>
                <Badge status="neutral">Graduados y Titulados</Badge>
              </div>

              <h3 className="portal-card-title">Trámite Personal Universitario</h3>
              <p className="portal-card-desc">
                Dirigido a profesionales titulados en la UAGRM que requieren reposición
                o certificación oficial de sus documentos académicos.
              </p>

              <div className="portal-card-feature-list">
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Emisión de Título Supletorio por pérdida o deterioro</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Apostillamiento para Cancillería y trámite en el exterior</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Legalización de certificados de notas y carga horaria</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Requiere Carta de Solicitud firmada en formato PDF</span>
                </div>
              </div>

              <div className="portal-card-action">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => onIniciarTramite("personal")}
                  className="portal-btn-full"
                >
                  <span>Iniciar Trámite Personal</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </article>

            {/* Tarjeta 2: Modalidad Institucional (Convenios) */}
            <article className="portal-service-card portal-service-card--personal">
              <div className="portal-card-top">
                <div className="portal-card-icon-badge portal-card-icon-badge--gold">
                  <Building2 size={28} />
                </div>
                <Badge status="neutral">Convenio Interinstitucional</Badge>
              </div>

              <h3 className="portal-card-title">Solicitud Masiva Institucional</h3>
              <p className="portal-card-desc">
                Canal exclusivo para ministerios, colegios profesionales, gobernaciones y entidades
                financieras con convenio de acreditación vigente.
              </p>

              <div className="portal-card-feature-list">
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Trámites 100% exentos de aranceles universitarios</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Validación mediante Código Secreto emitido por Secretaría</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Carga masiva de nómina de postulantes vía planilla Excel</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Adjunto obligatorio de Oficio Institucional digitalizado</span>
                </div>
              </div>

              <div className="portal-card-action">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => onIniciarTramite("institucional")}
                  className="portal-btn-full"
                >
                  <span>Acceso por Convenio Institucional</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </article>

            {/* Tarjeta 3: Acceso a Secretaría General y Despacho Legal */}
            <article className="portal-service-card portal-service-card--personal">
              <div className="portal-card-top">
                <div className="portal-card-icon-badge portal-card-icon-badge--red">
                  <ShieldCheck size={28} />
                </div>
                <Badge status="neutral">Personal Autorizado</Badge>
              </div>

              <h3 className="portal-card-title">Secretaría General y Despacho Legal</h3>
              <p className="portal-card-desc">
                Módulo interno de control y fe pública universitaria para revisión documental,
                admisión, apostillamiento y despacho seguro con custodia.
              </p>

              <div className="portal-card-feature-list">
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Bandeja de Admisión con visor documental lateral al 60%</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Acreditación de Apostilla La Haya / Vía Consular</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Despacho Seguro interceptado con factor PIN / OTP</span>
                </div>
                <div className="portal-feature-item">
                  <CheckCircle2 size={16} className="portal-feature-check" />
                  <span>Administración y catálogo de convenios afiliados</span>
                </div>
              </div>

              <div className="portal-card-action">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onIrASecretaria}
                  className="portal-btn-full"
                >
                  <Lock size={18} />
                  <span>Ingresar a Secretaría General</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. FLUJO DEL TRÁMITE EN 4 PASOS FORMALES
          =================================================================== */}
      <section className="portal-process-section">
        <div className="portal-process-container">
          <div className="portal-section-center-head">
            <span className="portal-subheading">PASOS DEL PROCESO INSTITUCIONAL</span>
            <h2 className="portal-heading-title">
              Protocolo Oficial de Titulación y Certificación
            </h2>
            <p className="portal-heading-desc">
              Conozca las etapas que atraviesa su trámite desde la radicación digital
              hasta el despacho seguro del documento físico.
            </p>
          </div>

          <div className="portal-steps-grid">
            <div className="portal-step-card">
              <div className="portal-step-number">1</div>
              <h4 className="portal-step-title">Radicación Digital</h4>
              <p className="portal-step-desc">
                Registro formal de datos, selección de modalidad y carga de la carta u oficio digitalizado en PDF.
              </p>
            </div>

            <div className="portal-step-card">
              <div className="portal-step-number">2</div>
              <h4 className="portal-step-title">Admisión Secretaría</h4>
              <p className="portal-step-desc">
                Inspección preliminar de firmas y sellos en el visor de documentos de Secretaría General para admitir o rechazar.
              </p>
            </div>

            <div className="portal-step-card">
              <div className="portal-step-number">3</div>
              <h4 className="portal-step-title">Convalidación Matriz</h4>
              <p className="portal-step-desc">
                Cotejo riguroso con los libros matrices originales y dictamen legal en el Departamento de Títulos y Archivo.
              </p>
            </div>

            <div className="portal-step-card">
              <div className="portal-step-number">4</div>
              <h4 className="portal-step-title">Despacho Seguro</h4>
              <p className="portal-step-desc">
                Desbloqueo mediante PIN/OTP de autoridad, sellado seco institucional en papel valorado y entrega legal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          5. PIE DE PÁGINA INSTITUCIONAL UAGRM (FOOTER)
          =================================================================== */}
      <footer className="portal-footer-section">
        <div className="portal-footer-container">
          <div className="portal-footer-grid">
            <div className="portal-footer-brand">
              <div className="portal-footer-logo-row">
                <LogoUAGRM size="md" />
                <div>
                  <h4 className="portal-footer-title">UNIVERSIDAD AUTÓNOMA</h4>
                  <span className="portal-footer-subtitle">GABRIEL RENÉ MORENO</span>
                </div>
              </div>
              <p className="portal-footer-desc">
                Secretaría General y Despacho Legal &bull; Sistema Oficial de Tramitación
                de Títulos Supletorios, Legalizaciones y Fe Pública Universitaria.
              </p>
            </div>

            <div className="portal-footer-info">
              <h5 className="portal-footer-info-title">Ubicación y Contacto</h5>
              <div className="portal-footer-contact-row">
                <MapPin size={16} className="portal-footer-icon" />
                <span>Campus Universitario, Av. Busch y 2do Anillo &bull; Santa Cruz, Bolivia</span>
              </div>
              <div className="portal-footer-contact-row">
                <Mail size={16} className="portal-footer-icon" />
                <span>secretaria.general@uagrm.edu.bo</span>
              </div>
              <div className="portal-footer-contact-row">
                <Clock size={16} className="portal-footer-icon" />
                <span>Horario de Atención: Lunes a Viernes 08:00 – 16:00 (Continuo)</span>
              </div>
            </div>
          </div>

          <div className="portal-footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} Universidad Autónoma Gabriel René Moreno. Todos los derechos reservados.
            </span>
            <span className="portal-footer-norma">
              Normativa amparada bajo el Estatuto Orgánico de la UAGRM y la Constitución Política del Estado.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLanding;
