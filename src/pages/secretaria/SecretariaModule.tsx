import { useState } from "react";
import { SecretariaProvider } from "./context/SecretariaContext";
import { VistaAdmisionPrevia } from "./views/VistaAdmisionPrevia";
import { VistaApostillamiento } from "./views/VistaApostillamiento";
import { VistaDespachoSeguro } from "./views/VistaDespachoSeguro";
import { VistaCatalogoConvenios } from "./views/VistaCatalogoConvenios";
import { USUARIO_SECRETARIA_GENERAL } from "./constants/uagrmData";
import { Button } from "@shared/ui";
import {
  Inbox,
  Globe,
  ShieldCheck,
  Handshake,
  Landmark,
  UserCheck,
} from "lucide-react";
import "./secretaria.css";

type TabId = "admision" | "apostilla" | "despacho" | "convenios";

interface Pestana {
  id: TabId;
  titulo: string;
  icono: typeof Inbox;
  descripcion: string;
}

export function SecretariaModule() {
  const [vistaActiva, setVistaActiva] = useState<TabId>("admision");

  const pestanas: Pestana[] = [
    {
      id: "admision",
      titulo: "Bandeja de Admisión",
      icono: Inbox,
      descripcion: "Filtro previo y visor de cartas",
    },
    {
      id: "apostilla",
      titulo: "Gestión de Apostillamiento",
      icono: Globe,
      descripcion: "Certificaciones internacionales La Haya / Consular",
    },
    {
      id: "despacho",
      titulo: "Despacho Seguro",
      icono: ShieldCheck,
      descripcion: "PIN/OTP e interceptor de impresión con custodia",
    },
    {
      id: "convenios",
      titulo: "Catálogo de Convenios",
      icono: Handshake,
      descripcion: "Afiliaciones y emisión de código secreto",
    },
  ];

  return (
    <SecretariaProvider>
      <div className="sec-module-container">
        {/* Header Institucional UAGRM para Secretaría General */}
        <header className="sec-header">
          <div className="sec-header-inner">
            <div className="sec-header-brand">
              <div className="sec-header-logo">
                <Landmark size={28} className="sec-text-uagrm" />
              </div>
              <div>
                <div className="sec-header-subtitle">
                  UNIVERSIDAD AUTÓNOMA GABRIEL RENÉ MORENO
                </div>
                <h1 className="sec-header-title">
                  Secretaría General y Despacho Legal
                </h1>
                <span className="sec-header-meta">
                  Sistema Integrado — Tramitación de Títulos Supletorios y Certificaciones
                </span>
              </div>
            </div>

            {/* Datos del Funcionario Logueado */}
            <div className="sec-user-badge">
              <UserCheck size={20} className="sec-header-subtitle" />
              <div className="sec-user-info">
                <div className="sec-user-name">
                  {USUARIO_SECRETARIA_GENERAL.nombre_completo}
                </div>
                <div className="sec-user-role">
                  Rol: <strong className="sec-header-subtitle">{USUARIO_SECRETARIA_GENERAL.rol}</strong> &bull; {USUARIO_SECRETARIA_GENERAL.cargo}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Barra de Navegación de las 4 Vistas del Dev 2 */}
        <nav className="sec-nav">
          <div className="sec-nav-inner">
            {pestanas.map((p) => {
              const activa = vistaActiva === p.id;
              const Icono = p.icono;
              return (
                <Button
                  key={p.id}
                  variant="ghost"
                  className={`sec-nav-tab ${activa ? "sec-nav-tab--active" : ""}`}
                  onClick={() => setVistaActiva(p.id)}
                >
                  <Icono size={18} />
                  <span>{p.titulo}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Contenedor Principal de la Vista Activa */}
        <main className="sec-main">
          {vistaActiva === "admision" && <VistaAdmisionPrevia />}
          {vistaActiva === "apostilla" && <VistaApostillamiento />}
          {vistaActiva === "despacho" && <VistaDespachoSeguro />}
          {vistaActiva === "convenios" && <VistaCatalogoConvenios />}
        </main>
      </div>
    </SecretariaProvider>
  );
}

export default SecretariaModule;
