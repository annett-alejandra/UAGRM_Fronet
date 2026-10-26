import React, { useState } from "react";
import { Button, Input, Select } from "@shared/ui";
import { PAISES_DESTINO } from "../../constants/uagrmData";
import { Globe, Lock, ShieldCheck, FileCheck, X } from "lucide-react";
import type { CertificacionApostilla } from "../../types/secretaria.types";

interface FormularioApostillaProps {
  expediente: CertificacionApostilla | null;
  onClose: () => void;
  onGenerar: (id: string, paisDestino: string, regimen: string) => void;
}

export function FormularioApostilla({ expediente, onClose, onGenerar }: FormularioApostillaProps) {
  const [paisSeleccionado, setPaisSeleccionado] = useState(PAISES_DESTINO[0].nombre);

  if (!expediente) return null;

  const paisObj = PAISES_DESTINO.find((p) => p.nombre === paisSeleccionado) || {
    nombre: paisSeleccionado,
    convenioLaHaya: true,
  };

  const regimenNormativo = paisObj.convenioLaHaya
    ? "Convenio de La Haya (Apostilla estándar)"
    : "Vía Consular / Tradicional (País no firmante)";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerar(expediente.id, paisSeleccionado, regimenNormativo);
    onClose();
  };

  return (
    <div className="sec-modal-overlay" onClick={onClose}>
      <div
        className="sec-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Formulario */}
        <div className="sec-modal-header-blue sec-modal-header--flush">
          <div className="sec-toolbar-group">
            <Globe size={22} color="#f2a900" />
            <h2 className="sec-header-title sec-title-17">
              Generación de Certificación para Cancillería / Apostilla
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Datos del Graduado */}
          <div className="sec-card-box sec-mb-4">
            <div className="sec-cell-main">
              {expediente.graduado}
            </div>
            <div className="sec-cell-sub">
              {expediente.carrera} — {expediente.facultad} (Egreso {expediente.gestionEgreso})
            </div>
          </div>

          {/* Campo 1 OBLIGATORIO: Número de Título en Provisión Nacional (SOLO LECTURA) */}
          <div className="sec-mb-4">
            <label className="sec-label">
              <span className="sec-toolbar-group">
                <Lock size={14} color="#64748b" />
                <span>Número de Título en Provisión Nacional (Solo Lectura)</span>
              </span>
            </label>
            <Input
              type="text"
              value={expediente.numeroTituloProvisionNacional}
              readOnly
              disabled
            />
            <span className="sec-form-hint">
              * Este registro proviene de la convalidación del libro matriz de Títulos y Archivo Central y no puede ser alterado.
            </span>
          </div>

          {/* Campo 2 OBLIGATORIO: Selector de País de Destino */}
          <div className="sec-mb-4">
            <label className="sec-label">
              País de Destino Internacional
            </label>
            <Select
              value={paisSeleccionado}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaisSeleccionado(e.target.value)}
            >
              {PAISES_DESTINO.map((p) => (
                <option key={p.nombre} value={p.nombre}>
                  {p.nombre} ({p.convenioLaHaya ? "Convenio de La Haya" : "Vía Consular"})
                </option>
              ))}
            </Select>
          </div>

          {/* Discriminación de Régimen Normativo Aplicado */}
          <div
            className={`sec-regime-box ${
              paisObj.convenioLaHaya ? "sec-regime-box--lahaya" : "sec-regime-box--consular"
            }`}
          >
            <div className="sec-toolbar-group">
              <ShieldCheck
                size={18}
                color={paisObj.convenioLaHaya ? "#0284c7" : "#ea580c"}
              />
              <span
                className={
                  paisObj.convenioLaHaya ? "sec-regime-title--lahaya" : "sec-regime-title--consular"
                }
              >
                Régimen Normativo Aplicado Automáticamente:
              </span>
            </div>
            <div
              className={
                paisObj.convenioLaHaya ? "sec-regime-value--lahaya" : "sec-regime-value--consular"
              }
            >
              {regimenNormativo}
            </div>
            <p
              className={
                paisObj.convenioLaHaya ? "sec-regime-desc--lahaya" : "sec-regime-desc--consular"
              }
            >
              {paisObj.convenioLaHaya
                ? "El país es firmante del Convenio de La Haya del 5 de octubre de 1961. Se emitirá el apostillamiento unificado UAGRM - Cancillería."
                : "El país requiere legalización diplomática por Vía Consular tradicional previa remisión a Cancillería del Estado."}
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="sec-modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            {/* Botón Principal Obligatorio */}
            <Button
              type="submit"
              variant="primary"
            >
              <FileCheck size={18} />
              <span>Generar Certificación para Cancillería / Apostilla</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
