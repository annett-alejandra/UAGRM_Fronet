import { useState } from "react";
import { Button } from "@shared/ui";
import { useSecretaria } from "../context/useSecretaria";
import { TablaAdmision } from "../components/admision/TablaAdmision";
import { VisorDocumentoDrawer } from "../components/admision/VisorDocumentoDrawer";
import { Inbox } from "lucide-react";
import type { SolicitudAdmision, EstadoSolicitud } from "../types/secretaria.types";

export function VistaAdmisionPrevia() {
  const { solicitudes, aprobarSolicitud, rechazarSolicitud } = useSecretaria();
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudAdmision | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | "TODOS">("TODOS");

  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtroEstado === "TODOS") return true;
    return s.estado === filtroEstado;
  });

  const conteoPendientes = solicitudes.filter((s) => s.estado === "PENDIENTE").length;
  const conteoAprobados = solicitudes.filter((s) => s.estado === "APROBADO").length;
  const conteoRechazados = solicitudes.filter((s) => s.estado === "RECHAZADO").length;

  return (
    <div>
      {/* Cabecera de la Vista 2.1 */}
      <div className="sec-view-header">
        <div>
          <div className="sec-view-title-group">
            <Inbox size={26} color="#191A7D" />
            <h1 className="sec-view-title">
              Bandeja de Admisión y Acreditación Previa
            </h1>
          </div>
          <p className="sec-view-description">
            Primer filtro de admisión (Gatekeeper) de cartas de solicitud ingresadas vía portal web UAGRM.
          </p>
        </div>

        {/* Filtros rápidos con métricas institucionales */}
        <div className="sec-filter-pill-group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroEstado("TODOS")}
            className={`sec-metric-pill ${filtroEstado === "TODOS" ? "sec-metric-pill--active-all" : ""}`}
          >
            Todos ({solicitudes.length})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroEstado("PENDIENTE")}
            className={`sec-metric-pill ${filtroEstado === "PENDIENTE" ? "sec-metric-pill--active-pending" : ""}`}
          >
            Pendientes ({conteoPendientes})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroEstado("APROBADO")}
            className={`sec-metric-pill ${filtroEstado === "APROBADO" ? "sec-metric-pill--active-approved" : ""}`}
          >
            Aprobadas ({conteoAprobados})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltroEstado("RECHAZADO")}
            className={`sec-metric-pill ${filtroEstado === "RECHAZADO" ? "sec-metric-pill--active-rejected" : ""}`}
          >
            Rechazadas ({conteoRechazados})
          </Button>
        </div>
      </div>

      {/* Tabla Principal */}
      <TablaAdmision
        solicitudes={solicitudesFiltradas}
        onInspeccionar={(sol) => setSolicitudSeleccionada(sol)}
      />

      {/* Visor Lateral Drawer al 60% */}
      {solicitudSeleccionada && (
        <VisorDocumentoDrawer
          solicitud={solicitudSeleccionada}
          onClose={() => setSolicitudSeleccionada(null)}
          onAprobar={aprobarSolicitud}
          onRechazar={rechazarSolicitud}
        />
      )}
    </div>
  );
}
