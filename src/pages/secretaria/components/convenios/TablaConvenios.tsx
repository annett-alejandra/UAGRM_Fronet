import { useState } from "react";
import { Button, Badge } from "@shared/ui";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@shared/lib/format";
import type { ConvenioInstitucional } from "../../types/secretaria.types";

interface TablaConveniosProps {
  convenios: ConvenioInstitucional[];
}

export function TablaConvenios({ convenios }: TablaConveniosProps) {
  const [clavesVisibles, setClavesVisibles] = useState<Record<string, boolean>>({});
  const [claveCopiada, setClaveCopiada] = useState<string | null>(null);

  const toggleClave = (id: string) => {
    setClavesVisibles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopiarClave = (codigo: string, id: string) => {
    navigator.clipboard.writeText(codigo);
    setClaveCopiada(id);
    setTimeout(() => setClaveCopiada(null), 2500);
  };

  return (
    <div className="sec-table-container">
      <table className="sec-table">
        <thead>
          <tr>
            <th>Entidad / Razón Social</th>
            <th>N° Convenio</th>
            <th>Vigencia</th>
            <th>Funcionario Autorizado</th>
            <th>Código Secreto Institucional</th>
            <th className="sec-cell-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {convenios.map((c) => {
            const esVigente = c.estado === "VIGENTE";
            const visible = !!clavesVisibles[c.id];
            const copiado = claveCopiada === c.id;

            return (
              <tr key={c.id}>
                {/* Entidad */}
                <td>
                  <div className="sec-cell-title">
                    {c.razonSocial}
                  </div>
                  <span className="sec-cell-subtitle">ID: {c.id}</span>
                </td>

                {/* N° Convenio */}
                <td className="sec-cell-accent">
                  {c.numeroConvenio}
                </td>

                {/* Vigencia */}
                <td className="sec-cell-muted">
                  <div>Inicio: {formatDate(c.fechaInicio)}</div>
                  <div className={esVigente ? "sec-text-vigente" : "sec-text-expirado"}>
                    Fin: {formatDate(c.fechaFin)}
                  </div>
                </td>

                {/* Funcionario Autorizado */}
                <td>
                  <div className="sec-heading-meta">
                    {c.funcionario.nombreCompleto}
                  </div>
                  <div className="sec-cell-subtitle">
                    CI: {c.funcionario.ci} {c.funcionario.expedido} &bull; {c.funcionario.cargo}
                  </div>
                  <div className="sec-meta-label">
                    {c.funcionario.correo}
                  </div>
                </td>

                {/* Código Secreto Institucional */}
                <td>
                  <div className="sec-table-code-chip">
                    <span className="sec-code-chip-text">
                      {visible ? c.codigoSecreto : "••••••••••••"}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="sec-btn-compact-icon"
                      onClick={() => toggleClave(c.id)}
                      title={visible ? "Ocultar" : "Mostrar"}
                    >
                      {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="sec-btn-compact-icon"
                      onClick={() => handleCopiarClave(c.codigoSecreto, c.id)}
                      title="Copiar código"
                    >
                      {copiado ? <Check size={14} className="sec-text-vigente" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </td>

                {/* Estado */}
                <td className="sec-cell-center">
                  <Badge status={esVigente ? "success" : "danger"}>
                    {c.estado}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
