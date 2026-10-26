import { formatDateTime } from "@shared/lib/format";
import { Button, Badge } from "@shared/ui";
import { Eye, FileCheck, Building2, User, Clock } from "lucide-react";
import type { SolicitudAdmision } from "../../types/secretaria.types";

interface TablaAdmisionProps {
  solicitudes: SolicitudAdmision[];
  onInspeccionar: (solicitud: SolicitudAdmision) => void;
}

export function TablaAdmision({ solicitudes, onInspeccionar }: TablaAdmisionProps) {
  return (
    <div className="sec-table-container">
      <table className="sec-table">
        <thead>
          <tr>
            {/* Columna 1 Obligatoria */}
            <th className="sec-table-th">
              <div className="sec-toolbar-group">
                <Clock size={16} color="#191A7D" />
                <span>Fecha / Hora</span>
              </div>
            </th>

            {/* Columna 2 Obligatoria */}
            <th className="sec-table-th">
              Tipo
            </th>

            {/* Columna 3 Obligatoria */}
            <th className="sec-table-th">
              Solicitante / Entidad
            </th>

            {/* Columna 4 Obligatoria */}
            <th className="sec-table-th">
              <div className="sec-toolbar-group">
                <FileCheck size={16} color="#191A7D" />
                <span>Carta Digitalizada</span>
              </div>
            </th>

            {/* Columna 5 Obligatoria */}
            <th className="sec-table-th">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan={5} className="sec-table-empty">
                No se encontraron solicitudes registradas en la bandeja.
              </td>
            </tr>
          ) : (
            solicitudes.map((sol) => {
              const esInstitucion = sol.tipo === "Institución";

              return (
                <tr key={sol.id} className="sec-table-tr">
                  {/* 1. Fecha / Hora con hora local de Bolivia */}
                  <td className="sec-table-td">
                    <div className="sec-cell-main">
                      {formatDateTime(sol.fechaHora)}
                    </div>
                    <span className="sec-cell-sub">{sol.id}</span>
                  </td>

                  {/* 2. Tipo */}
                  <td className="sec-table-td">
                    <Badge status={esInstitucion ? "neutral" : "success"}>
                      {esInstitucion ? <Building2 size={13} /> : <User size={13} />}
                      <span>{sol.tipo}</span>
                    </Badge>
                  </td>

                  {/* 3. Solicitante / Entidad */}
                  <td className="sec-table-td">
                    <div className="sec-cell-main">
                      {sol.solicitanteEntidad}
                    </div>
                    <span className="sec-cell-sub">
                      Documento / NIT: {sol.ci}
                    </span>
                    {sol.estado === "RECHAZADO" && sol.observacion && (
                      <div className="sec-obs-alert">
                        <strong>Observación formal:</strong> {sol.observacion}
                      </div>
                    )}
                  </td>

                  {/* 4. Carta Digitalizada */}
                  <td className="sec-table-td">
                    <div className="sec-tag-doc">
                      <FileCheck size={14} color="#15803d" />
                      <span title={sol.documentoAdjunto?.nombre}>
                        {sol.documentoAdjunto?.nombre || "Carta_Adjunta.pdf"}
                      </span>
                    </div>
                  </td>

                  {/* 5. Acciones */}
                  <td className="sec-table-td-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onInspeccionar(sol)}
                    >
                      <Eye size={15} />
                      <span>Inspeccionar</span>
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
