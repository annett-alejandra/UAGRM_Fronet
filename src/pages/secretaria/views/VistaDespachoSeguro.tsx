import { useState } from "react";
import { Button, Badge } from "@shared/ui";
import { useSecretaria } from "../context/useSecretaria";
import { ModalSeguridadImpresion } from "../components/despacho-seguro/ModalSeguridadImpresion";
import { formatDateTime } from "@shared/lib/format";
import { ShieldCheck, Printer, FileBadge, History } from "lucide-react";
import type { CartonDespacho } from "../types/secretaria.types";

export function VistaDespachoSeguro() {
  const { cartones, auditorias, registrarDesbloqueoImpresion } = useSecretaria();
  const [cartonAImprimir, setCartonAImprimir] = useState<CartonDespacho | null>(null);

  return (
    <div>
      {/* Cabecera Vista 2.3 */}
      <div className="sec-mb-6">
        <div className="sec-view-title-group">
          <ShieldCheck size={26} color="#78350f" />
          <h1 className="sec-view-title">
            Despacho Seguro: Custodia, Impresión y Sellado Seco
          </h1>
        </div>
        <p className="sec-view-description">
          Control de acceso criptográfico e interceptor de seguridad para cartones oficiales y papel valorado institucional.
        </p>
      </div>

      {/* Sección 1: Cartones Oficiales Listos para Impresión */}
      <div className="sec-table-container sec-mb-6">
        <div className="sec-custody-header">
          <div className="sec-toolbar-group">
            <FileBadge size={18} color="#b45309" />
            <span className="sec-custody-title">
              Cartones Oficiales en Custodia de Secretaría General ({cartones.length})
            </span>
          </div>
          <span className="sec-custody-subtitle">
            Requiere PIN/OTP + Visto Bueno Jurídico
          </span>
        </div>

        <table className="sec-table">
          <thead>
            <tr>
              <th className="sec-table-th">Graduado / Titular</th>
              <th className="sec-table-th">Carrera / Facultad</th>
              <th className="sec-table-th">Tipo de Cartón</th>
              <th className="sec-table-th">Serie Papel Valorado</th>
              <th className="sec-table-th">Estado Custodia</th>
              <th className="sec-table-th sec-table-td-center">Acción de Impresión</th>
            </tr>
          </thead>
          <tbody>
            {cartones.map((carton) => {
              const impreso = carton.estado === "IMPRESO_SELLADO";

              return (
                <tr key={carton.id} className="sec-table-tr">
                  <td className="sec-table-td">
                    <div className="sec-cell-main">{carton.graduado}</div>
                    <div className="sec-cell-sub">
                      Res. {carton.resolucionEmision}
                    </div>
                  </td>
                  <td className="sec-table-td">
                    <div className="sec-cell-main">{carton.carrera}</div>
                    <div className="sec-cell-sub">{carton.facultad}</div>
                  </td>
                  <td className="sec-table-td">
                    <div className="sec-cell-accent">{carton.tipoCarton}</div>
                  </td>
                  <td className="sec-table-td">
                    <div className="sec-cell-mono">{carton.seriePapel}</div>
                  </td>
                  <td className="sec-table-td">
                    <Badge status={impreso ? "success" : "warning"}>
                      {impreso ? "IMPRESO Y SELLADO" : "EN CUSTODIA (BLOQUEADO)"}
                    </Badge>
                  </td>
                  <td className="sec-table-td-center">
                    <Button
                      variant={impreso ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => setCartonAImprimir(carton)}
                      disabled={impreso}
                    >
                      <Printer size={14} />
                      <span>{impreso ? "Impreso" : "Imprimir Cartón"}</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sección 2: Registro Invisible de Auditoría (Trazabilidad Forense) */}
      <div className="sec-table-container">
        <div className="sec-audit-header">
          <div className="sec-toolbar-group">
            <History size={18} color="#38bdf8" />
            <span className="sec-audit-title">
              Registro Forense de Auditoría de Impresión (Invisible Log)
            </span>
          </div>
          <span className="sec-audit-subtitle">
            Rol Autorizado: SECRETARIA_GENERAL
          </span>
        </div>

        <div className="sec-audit-desc">
          Cada vez que se presiona "Desbloquear e Imprimir Cartón", el sistema genera y almacena automáticamente este registro con marca de tiempo ISO, IP de terminal y credenciales del funcionario.
        </div>

        <table className="sec-table">
          <thead>
            <tr>
              <th className="sec-table-th">Fecha / Hora (ISO)</th>
              <th className="sec-table-th">IP Terminal</th>
              <th className="sec-table-th">Usuario Logueado</th>
              <th className="sec-table-th">Serie Papel Valorado</th>
              <th className="sec-table-th">Titular / Documento</th>
            </tr>
          </thead>
          <tbody>
            {auditorias.map((aud) => (
              <tr key={aud.id} className="sec-table-tr">
                <td className="sec-table-td sec-cell-main">
                  {formatDateTime(aud.fechaHora)}
                </td>
                <td className="sec-table-td sec-cell-accent">
                  {aud.ipTerminal}
                </td>
                <td className="sec-table-td">
                  <strong>{aud.usuarioLogueado.nombre_completo || aud.usuarioLogueado.nombre}</strong> (
                  {aud.usuarioLogueado.rol})
                </td>
                <td className="sec-table-td">
                  <span className="sec-cell-mono">{aud.seriePapel}</span>
                </td>
                <td className="sec-table-td">
                  {aud.graduado} ({aud.documentoId})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Interceptor de Seguridad */}
      {cartonAImprimir && (
        <ModalSeguridadImpresion
          carton={cartonAImprimir}
          onClose={() => setCartonAImprimir(null)}
          onAutorizar={registrarDesbloqueoImpresion}
        />
      )}
    </div>
  );
}
