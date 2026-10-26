import React, { useState } from "react";
import { Button, Input, Checkbox } from "@shared/ui";
import { ShieldAlert, KeyRound, Printer, X, Lock } from "lucide-react";
import type { CartonDespacho } from "../../types/secretaria.types";

interface ModalSeguridadImpresionProps {
  carton: CartonDespacho | null;
  onClose: () => void;
  onAutorizar: (carton: CartonDespacho) => void;
}

export function ModalSeguridadImpresion({ carton, onClose, onAutorizar }: ModalSeguridadImpresionProps) {
  const [pinOtp, setPinOtp] = useState("");
  const [vistoBuenoJuridico, setVistoBuenoJuridico] = useState(false);
  const [errorPin, setErrorPin] = useState("");

  if (!carton) return null;

  // Validación: PIN numérico de al menos 4 a 6 dígitos
  const esPinValido = /^\d{4,6}$/.test(pinOtp.trim());
  const formularioListo = esPinValido && vistoBuenoJuridico;

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPinOtp(val);
    if (val.length >= 4) {
      setErrorPin("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esPinValido) {
      setErrorPin("El PIN de Autoridad / Token OTP debe tener entre 4 y 6 dígitos numéricos.");
      return;
    }
    if (!vistoBuenoJuridico) {
      return;
    }

    // Dispara el desbloqueo y auditoría invisible
    onAutorizar(carton);
    onClose();
  };

  return (
    <div className="sec-modal-overlay" onClick={onClose}>
      <div
        className="sec-modal-card-security"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado formal estricto */}
        <div className="sec-modal-header-security">
          <div className="sec-toolbar-group">
            <ShieldAlert size={22} color="#fbbf24" />
            <h2 className="sec-header-title sec-title-16">
              Protocolo de Seguridad: Autorización de Sellado Seco e Impresión
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

        <form onSubmit={handleSubmit} className="sec-modal-body">
          <div className="sec-security-banner">
            <Lock size={16} />
            <span>
              Acción crítica interceptada. Esta operación requiere credenciales de Secretaría General y genera una auditoría invisible no repudiable.
            </span>
          </div>

          {/* Resumen del documento a autorizar */}
          <div className="sec-doc-summary-box">
            <div className="sec-label">
              Resumen del Cartón Oficial a Desbloquear:
            </div>

            <div className="sec-grid-2">
              <div>
                <span className="sec-cell-sub">Nombre Graduado:</span>
                <div className="sec-cell-main">{carton.graduado}</div>
              </div>

              <div>
                <span className="sec-cell-sub">Carrera Académica:</span>
                <div className="sec-cell-main">{carton.carrera}</div>
              </div>

              <div>
                <span className="sec-cell-sub">Tipo de Cartón:</span>
                <div className="sec-cell-accent">{carton.tipoCarton}</div>
              </div>

              <div>
                <span className="sec-cell-sub">Serie Papel Valorado:</span>
                <div className="sec-cell-mono">
                  {carton.seriePapel}
                </div>
              </div>
            </div>
          </div>

          {/* Input de Seguridad: PIN / OTP */}
          <div className="sec-mb-4">
            <label className="sec-label">
              <span className="sec-toolbar-group">
                <KeyRound size={16} color="#191A7D" />
                <span>PIN de Autorización de Autoridad / Token OTP</span>
              </span>
            </label>
            <Input
              type="password"
              inputMode="numeric"
              placeholder="Ingrese PIN numérico (4-6 dígitos)"
              value={pinOtp}
              onChange={handlePinChange}
              maxLength={6}
              hasError={Boolean(errorPin)}
            />
            {errorPin && (
              <span className="sec-form-error">
                {errorPin}
              </span>
            )}
            <span className="sec-form-hint">
              * Factor de autenticación de custodia asignado al despacho de Secretaría General (ej. 123456).
            </span>
          </div>

          {/* Checkbox Obligatorio */}
          <div
            className={`sec-checkbox-row ${
              vistoBuenoJuridico ? "sec-checkbox-row--checked" : "sec-checkbox-row--unchecked"
            }`}
            onClick={() => setVistoBuenoJuridico(!vistoBuenoJuridico)}
          >
            <Checkbox
              id="vistoBueno"
              checked={vistoBuenoJuridico}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVistoBuenoJuridico(e.target.checked)}
              className="mt-0.5 cursor-pointer"
            />
            <label
              htmlFor="vistoBueno"
              className="sec-cell-main cursor-pointer"
            >
              Certifico que el título cuenta con el visto bueno jurídico y físico de la matriz original.
            </label>
          </div>

          {/* Botones de acción */}
          <div className="sec-modal-actions">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>

            {/* Botón Principal: Desbloquear e Imprimir Cartón */}
            <Button
              type="submit"
              variant="primary"
              disabled={!formularioListo}
            >
              <Printer size={18} />
              <span>Desbloquear e Imprimir Cartón</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
