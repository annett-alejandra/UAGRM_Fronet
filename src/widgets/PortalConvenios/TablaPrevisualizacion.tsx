import * as React from "react";
import { Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { Button, Badge } from "@shared/ui";
import { type PostulanteNomina } from "./portal.types";

export interface TablaPrevisualizacionProps {
  postulantes: PostulanteNomina[];
  onEliminar: (index: number) => void;
}

/**
 * Tabla de Previsualización Reactiva de Nómina
 * Detecta duplicados y campos vacíos en tiempo real sin recarga.
 * 0 estilos en línea y consumo de componentes de @shared/ui.
 */
export const TablaPrevisualizacion: React.FC<TablaPrevisualizacionProps> = ({
  postulantes,
  onEliminar,
}) => {
  if (!postulantes || postulantes.length === 0) return null;

  // Validación reactiva de duplicados de C.I.
  const cisArray = postulantes.map((p) => p.ci?.trim() || "");
  const duplicates = cisArray.filter(
    (item, index) => item !== "" && cisArray.indexOf(item) !== index
  );

  const checkRowHasError = (p: PostulanteNomina) => {
    if (!p.ci || !p.nombre || !p.carrera || !p.titulo || !p.gestion) return true;
    if (duplicates.includes(p.ci.trim())) return true;
    return false;
  };

  const totalErrores = postulantes.filter(checkRowHasError).length;

  return (
    <div>
      {/* Barra de Metadatos y Resumen */}
      <div className="portal-table-meta-bar">
        <span className="portal-table-count">
          {postulantes.length} postulante(s) detectado(s) para acreditación oficial
        </span>

        <div>
          {totalErrores > 0 ? (
            <Badge status="danger">
              <AlertCircle size={14} />
              <span>{totalErrores} registro(s) con inconsistencias</span>
            </Badge>
          ) : (
            <Badge status="success">
              <CheckCircle size={14} />
              <span>Nómina íntegra y validada</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Contenedor Responsivo de la Tabla */}
      <div className="portal-table-container">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Cédula de Identidad</th>
              <th>Nombre Completo</th>
              <th>Carrera Académica</th>
              <th>N° de Título</th>
              <th>Gestión</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {postulantes.map((p, index) => {
              const esError = checkRowHasError(p);
              const esDuplicado = duplicates.includes(p.ci?.trim() || "");

              return (
                <tr
                  key={`${p.ci || "row"}-${index}`}
                  className={esError ? "portal-table-row--error" : ""}
                >
                  <td>
                    {p.ci ? (
                      <span>{p.ci}</span>
                    ) : (
                      <span className="portal-table-missing">Falta C.I.</span>
                    )}
                    {esDuplicado && (
                      <span className="portal-table-missing"> (Duplicado)</span>
                    )}
                  </td>
                  <td>
                    {p.nombre ? (
                      <span>{p.nombre}</span>
                    ) : (
                      <span className="portal-table-missing">Falta Nombre</span>
                    )}
                  </td>
                  <td>
                    {p.carrera ? (
                      <span>{p.carrera}</span>
                    ) : (
                      <span className="portal-table-missing">Falta Carrera</span>
                    )}
                  </td>
                  <td>
                    {p.titulo ? (
                      <span>{p.titulo}</span>
                    ) : (
                      <span className="portal-table-missing">Falta Título</span>
                    )}
                  </td>
                  <td>
                    {p.gestion ? (
                      <span>{p.gestion}</span>
                    ) : (
                      <span className="portal-table-missing">Falta Gestión</span>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="portal-btn-delete"
                      onClick={() => onEliminar(index)}
                      title="Eliminar registro de la nómina"
                      aria-label={`Eliminar postulante ${p.nombre || index + 1}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaPrevisualizacion;
