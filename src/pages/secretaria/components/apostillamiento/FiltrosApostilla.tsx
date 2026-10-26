import React from "react";
import { Button, Select, Badge } from "@shared/ui";
import { FACULTADES_UAGRM } from "../../constants/uagrmData";
import { Filter, RotateCcw } from "lucide-react";

interface FiltrosApostillaProps {
  facultadSeleccionada: string;
  onFacultadChange: (facultad: string) => void;
  carreraSeleccionada: string;
  onCarreraChange: (carrera: string) => void;
  gestionSeleccionada: string;
  onGestionChange: (gestion: string) => void;
  onLimpiarFiltros: () => void;
}

export function FiltrosApostilla({
  facultadSeleccionada,
  onFacultadChange,
  carreraSeleccionada,
  onCarreraChange,
  gestionSeleccionada,
  onGestionChange,
  onLimpiarFiltros,
}: FiltrosApostillaProps) {
  // Obtener lista de carreras si hay facultad seleccionada
  const facultadObj = FACULTADES_UAGRM.find((f) => f.nombre === facultadSeleccionada);
  const carrerasDisponibles = facultadObj ? facultadObj.carreras : [];
  const gestionesDisponibles = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  const handleCarreraChange = (nuevaCarrera: string) => {
    onCarreraChange(nuevaCarrera);
    // Si el usuario eligió una carrera directamente sin haber elegido facultad, auto-asociar su facultad
    if (nuevaCarrera && !facultadSeleccionada) {
      const facultadMatch = FACULTADES_UAGRM.find((f) =>
        f.carreras.includes(nuevaCarrera)
      );
      if (facultadMatch) {
        onFacultadChange(facultadMatch.nombre);
      }
    }
  };

  const filtrosActivos = [facultadSeleccionada, carreraSeleccionada, gestionSeleccionada].filter(Boolean).length;

  return (
    <div className="sec-card-box sec-mb-6">
      <div className="sec-flex-between sec-mb-4">
        <div className="sec-toolbar-group">
          <Filter size={18} color="#191A7D" />
          <h3 className="sec-cell-accent">
            Filtros de Búsqueda de Expedientes Convalidados
          </h3>
        </div>
        {filtrosActivos > 0 ? (
          <Badge status="warning">
            {filtrosActivos} filtro{filtrosActivos > 1 ? "s" : ""} aplicado{filtrosActivos > 1 ? "s" : ""}
          </Badge>
        ) : (
          <span className="sec-cell-sub">Todos los expedientes</span>
        )}
      </div>

      <div className="sec-filter-grid">
        {/* Filtro 1: Facultad */}
        <div>
          <label className="sec-label">
            Facultad UAGRM
          </label>
          <Select
            value={facultadSeleccionada}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onFacultadChange(e.target.value)}
          >
            <option value="">Todas las Facultades</option>
            {FACULTADES_UAGRM.map((fac) => (
              <option key={fac.id} value={fac.nombre}>
                {fac.nombre}
              </option>
            ))}
          </Select>
        </div>

        {/* Filtro 2: Carrera (Accesible siempre, agrupada o filtrada) */}
        <div>
          <label className="sec-label">
            Carrera Académica {facultadSeleccionada ? "(de la facultad seleccionada)" : ""}
          </label>
          <Select
            value={carreraSeleccionada}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCarreraChange(e.target.value)}
          >
            <option value="">
              {facultadSeleccionada ? "Todas las Carreras de esta Facultad" : "Todas las Carreras Académicas"}
            </option>
            {facultadSeleccionada ? (
              carrerasDisponibles.map((carr) => (
                <option key={carr} value={carr}>
                  {carr}
                </option>
              ))
            ) : (
              FACULTADES_UAGRM.map((fac) => (
                <optgroup key={fac.id} label={fac.nombre}>
                  {fac.carreras.map((carr) => (
                    <option key={carr} value={carr}>
                      {carr}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </Select>
        </div>

        {/* Filtro 3: Gestión de Egreso */}
        <div>
          <label className="sec-label">
            Gestión de Egreso
          </label>
          <Select
            value={gestionSeleccionada}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onGestionChange(e.target.value)}
          >
            <option value="">Todas las Gestiones de Egreso</option>
            {gestionesDisponibles.map((g) => (
              <option key={g} value={String(g)}>
                Gestión {g}
              </option>
            ))}
          </Select>
        </div>

        {/* Botón Reset */}
        <div>
          <Button
            type="button"
            variant="outline"
            size="md"
            className="sec-w-full"
            onClick={onLimpiarFiltros}
            disabled={filtrosActivos === 0}
            title={filtrosActivos === 0 ? "No hay filtros activos para limpiar" : "Restablecer todos los filtros"}
          >
            <RotateCcw size={14} />
            <span>Limpiar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
