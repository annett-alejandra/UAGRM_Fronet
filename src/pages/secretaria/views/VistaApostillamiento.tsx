import { useState } from "react";
import { Button, Badge } from "@shared/ui";
import { useSecretaria } from "../context/useSecretaria";
import { FiltrosApostilla } from "../components/apostillamiento/FiltrosApostilla";
import { ResumenExpediente } from "../components/apostillamiento/ResumenExpediente";
import { FormularioApostilla } from "../components/apostillamiento/FormularioApostilla";
import { Globe, Send, FileText, ChevronDown, ChevronUp } from "lucide-react";
import type { CertificacionApostilla } from "../types/secretaria.types";

export function VistaApostillamiento() {
  const { apostillas, generarCertificacionApostilla } = useSecretaria();
  const [facultad, setFacultad] = useState("");
  const [carrera, setCarrera] = useState("");
  const [gestion, setGestion] = useState("");
  const [expedienteParaApostillar, setExpedienteParaApostillar] = useState<CertificacionApostilla | null>(null);
  const [expedienteDetalleExpandido, setExpedienteDetalleExpandido] = useState<Record<string, boolean>>({});

  const toggleDetalle = (id: string) => {
    setExpedienteDetalleExpandido((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFacultadChange = (nuevaFacultad: string) => {
    setFacultad(nuevaFacultad);
    setCarrera(""); // Reinicia carrera al cambiar facultad
  };

  const apostillasFiltradas = apostillas.filter((item) => {
    if (facultad && item.facultad !== facultad) return false;
    if (carrera && item.carrera !== carrera) return false;
    if (gestion && item.gestionEgreso !== Number(gestion)) return false;
    return true;
  });

  return (
    <div>
      {/* Cabecera Vista 2.2 */}
      <div className="sec-mb-6">
        <div className="sec-view-title-group">
          <Globe size={26} color="#191A7D" />
          <h1 className="sec-view-title">
            Módulo de Gestión de Apostillamiento
          </h1>
        </div>
        <p className="sec-view-description">
          Expedición de certificaciones de validez internacional para expedientes convalidados por Títulos y Archivo Central.
        </p>
      </div>

      {/* Filtros reactivos en cascada */}
      <FiltrosApostilla
        facultadSeleccionada={facultad}
        onFacultadChange={handleFacultadChange}
        carreraSeleccionada={carrera}
        onCarreraChange={setCarrera}
        gestionSeleccionada={gestion}
        onGestionChange={setGestion}
        onLimpiarFiltros={() => {
          setFacultad("");
          setCarrera("");
          setGestion("");
        }}
      />

      {/* Listado de Certificaciones Listas para Apostilla */}
      <div className="sec-table-container">
        <div className="sec-card-header-row">
          <span className="sec-cell-main">
            Expedientes Convalidados ({apostillasFiltradas.length} encontrados)
          </span>
          <span className="sec-cell-sub">
            Convalidación de Títulos y Archivo Central
          </span>
        </div>

        {apostillasFiltradas.length === 0 ? (
          <div className="sec-table-empty">
            No se encontraron expedientes convalidados que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div>
            {apostillasFiltradas.map((item) => {
              const expandido = Boolean(expedienteDetalleExpandido[item.id]);
              const yaGenerado = item.estadoApostilla === "CERTIFICADO_GENERADO";

              return (
                <div
                  key={item.id}
                  className={`sec-expediente-row ${yaGenerado ? "sec-expediente-row--generado" : ""}`}
                >
                  <div className="sec-expediente-body">
                    <div>
                      <div className="sec-toolbar-group sec-mb-1">
                        <span className="sec-cell-main sec-title-16">
                          {item.graduado}
                        </span>
                        <Badge status={yaGenerado ? "success" : "neutral"}>
                          {yaGenerado ? "✓ Certificación Emitida" : "Listo para Apostilla"}
                        </Badge>
                      </div>

                      <div className="sec-cell-sub">
                        <strong>Carrera:</strong> {item.carrera} &nbsp;|&nbsp; <strong>Facultad:</strong>{" "}
                        {item.facultad} &nbsp;|&nbsp; <strong>Gestión:</strong> {item.gestionEgreso}
                      </div>

                      <div className="sec-cell-accent sec-mt-2">
                        N° Título en Provisión Nacional: {item.numeroTituloProvisionNacional}
                      </div>

                      {yaGenerado && (
                        <div className="sec-badge-verified">
                          Destino: <strong>{item.paisDestino}</strong> ({item.regimen}) — Emitido el{" "}
                          {item.fechaCertificacion}
                        </div>
                      )}
                    </div>

                    <div className="sec-toolbar-group">
                      {/* Botón para alternar resumen de informes técnicos */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetalle(item.id)}
                      >
                        <FileText size={15} />
                        <span>{expandido ? "Ocultar Informe Técnico" : "Ver Informe Técnico"}</span>
                        {expandido ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </Button>

                      {/* Botón Generar Certificación para Cancillería / Apostilla */}
                      <Button
                        variant={yaGenerado ? "secondary" : "primary"}
                        size="sm"
                        onClick={() => setExpedienteParaApostillar(item)}
                        disabled={yaGenerado}
                      >
                        <Send size={15} />
                        <span>{yaGenerado ? "Certificado Emitido" : "Generar Apostilla"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Resumen Consolidado de Informes Técnicos */}
                  {expandido && <ResumenExpediente expediente={item} />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Generación de Informe Internacional */}
      {expedienteParaApostillar && (
        <FormularioApostilla
          expediente={expedienteParaApostillar}
          onClose={() => setExpedienteParaApostillar(null)}
          onGenerar={generarCertificacionApostilla}
        />
      )}
    </div>
  );
}
