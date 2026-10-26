import { BookOpen, FileCheck2, ScrollText, Calendar, Award } from "lucide-react";
import type { CertificacionApostilla } from "../../types/secretaria.types";

interface ResumenExpedienteProps {
  expediente: CertificacionApostilla | null;
}

export function ResumenExpediente({ expediente }: ResumenExpedienteProps) {
  if (!expediente) return null;
  const { informeTecnico } = expediente;

  return (
    <div className="sec-expediente-summary">
      <div className="sec-toolbar-group sec-mb-2">
        <FileCheck2 size={18} color="#15803d" />
        <span className="sec-summary-title">
          Resumen Consolidado de Informes Técnicos (Títulos y Archivo Central)
        </span>
      </div>

      <div className="sec-summary-grid">
        <div className="sec-summary-item">
          <div className="sec-toolbar-group sec-cell-sub">
            <BookOpen size={13} color="#191A7D" />
            <span>LIBRO MATRIZ</span>
          </div>
          <div className="sec-cell-main sec-mt-2">
            {informeTecnico.libroMatriz}
          </div>
        </div>

        <div className="sec-summary-item">
          <div className="sec-toolbar-group sec-cell-sub">
            <ScrollText size={13} color="#191A7D" />
            <span>FOJA / PARTIDA</span>
          </div>
          <div className="sec-cell-main sec-mt-2">
            {informeTecnico.foja}
          </div>
        </div>

        <div className="sec-summary-item">
          <div className="sec-toolbar-group sec-cell-sub">
            <Award size={13} color="#191A7D" />
            <span>RESOLUCIÓN RECTORAL</span>
          </div>
          <div className="sec-cell-main sec-mt-2">
            {informeTecnico.resolucionRectoral}
          </div>
        </div>

        <div className="sec-summary-item">
          <div className="sec-toolbar-group sec-cell-sub">
            <Calendar size={13} color="#191A7D" />
            <span>CONVALIDACIÓN</span>
          </div>
          <div className="sec-cell-main sec-mt-2">
            {informeTecnico.fechaConvalidacion}
          </div>
        </div>
      </div>

      <div className="sec-dictamen-text">
        <strong>Dictamen de Archivo:</strong> "{informeTecnico.dictamen}"
      </div>
    </div>
  );
}
