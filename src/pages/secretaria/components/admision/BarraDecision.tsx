import React, { useState } from "react";
import { Button, Textarea, Badge } from "@shared/ui";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { SolicitudAdmision } from "../../types/secretaria.types";

interface BarraDecisionProps {
  solicitud: SolicitudAdmision;
  onAprobar: (id: string) => void;
  onRechazar: (id: string, motivo: string) => boolean;
}

export function BarraDecision({ solicitud, onAprobar, onRechazar }: BarraDecisionProps) {
  const [showModalRechazo, setShowModalRechazo] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [errorValidacion, setErrorValidacion] = useState("");

  const handleConfirmarRechazo = () => {
    if (!motivoRechazo.trim()) {
      setErrorValidacion("El motivo formal de observación/rechazo es estrictamente obligatorio.");
      return;
    }
    const exitoso = onRechazar(solicitud.id, motivoRechazo);
    if (exitoso) {
      setShowModalRechazo(false);
      setMotivoRechazo("");
      setErrorValidacion("");
    }
  };

  const handleCancelar = () => {
    setShowModalRechazo(false);
    setMotivoRechazo("");
    setErrorValidacion("");
  };

  const yaProcesada = solicitud.estado !== "PENDIENTE";

  const getStatusBadge = () => {
    switch (solicitud.estado) {
      case "APROBADO":
        return <Badge status="success">APROBADO</Badge>;
      case "RECHAZADO":
        return <Badge status="danger">RECHAZADO</Badge>;
      default:
        return <Badge status="warning">PENDIENTE</Badge>;
    }
  };

  return (
    <div className="sec-decision-bar">
      <div className="sec-toolbar-group">
        <span className="sec-cell-sub">
          ESTADO ACTUAL:
        </span>
        {getStatusBadge()}
      </div>

      <div className="sec-toolbar-group">
        {/* Botón Rojo: Rechazar Solicitud */}
        <Button
          variant="destructive"
          onClick={() => setShowModalRechazo(true)}
          disabled={yaProcesada}
        >
          <XCircle size={18} />
          <span>Rechazar Solicitud</span>
        </Button>

        {/* Botón Verde: Aprobar y Habilitar Trámite */}
        <Button
          variant="primary"
          onClick={() => onAprobar(solicitud.id)}
          disabled={yaProcesada}
        >
          <CheckCircle2 size={18} />
          <span>Aprobar y Habilitar Trámite</span>
        </Button>
      </div>

      {/* Modal Obligatorio de Rechazo */}
      {showModalRechazo && (
        <div className="sec-modal-overlay">
          <div className="sec-modal-card sec-modal-card-danger">
            <div className="sec-modal-title-row">
              <AlertCircle size={24} color="#dc2626" />
              <h3 className="sec-cell-main">
                Motivo Formal de Observación / Rechazo
              </h3>
            </div>

            <p className="sec-view-description sec-mb-4">
              De conformidad con las normas de Secretaría General, es <strong>estrictamente obligatorio</strong> detallar la causa formal de rechazo para que el solicitante sea debidamente notificado.
            </p>

            <Textarea
              rows={4}
              value={motivoRechazo}
              hasError={Boolean(errorValidacion)}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMotivoRechazo(e.target.value);
                if (e.target.value.trim()) setErrorValidacion("");
              }}
              placeholder="Ej.: Carta de solicitud ilegible, omisión de firma digital o falta de sello notarial requerido..."
            />

            {errorValidacion && (
              <span className="sec-form-error">{errorValidacion}</span>
            )}

            <div className="sec-modal-actions">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={handleConfirmarRechazo}
                disabled={!motivoRechazo.trim()}
              >
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
