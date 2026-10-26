import { useState } from "react";
import { Button, Input, Select } from "@shared/ui";
import { DEPARTAMENTOS_BOLIVIA } from "../../constants/uagrmData";
import { GeneradorCodigoSecreto } from "./GeneradorCodigoSecreto";
import { Building, User, PlusCircle } from "lucide-react";
import type { ConvenioInstitucional } from "../../types/secretaria.types";

function generarCodigoAleatorio(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let hash = "";
  for (let i = 0; i < 6; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `UAGRM-INST-${hash}`;
}

interface FormularioConvenioProps {
  onGuardar: (nuevo: Omit<ConvenioInstitucional, "id" | "estado">) => void;
  onCancelar?: () => void;
}

export function FormularioConvenio({ onGuardar, onCancelar }: FormularioConvenioProps) {
  const [razonSocial, setRazonSocial] = useState("");
  const [numeroConvenio, setNumeroConvenio] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [funcionarioNombre, setFuncionarioNombre] = useState("");
  const [funcionarioCi, setFuncionarioCi] = useState("");
  const [funcionarioExpedido, setFuncionarioExpedido] = useState("SCZ");
  const [funcionarioCargo, setFuncionarioCargo] = useState("");
  const [funcionarioCorreo, setFuncionarioCorreo] = useState("");
  const [codigoSecreto, setCodigoSecreto] = useState(generarCodigoAleatorio());
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = (): boolean => {
    const errs: Record<string, string> = {};
    if (!razonSocial.trim()) errs.razonSocial = "La Razón Social es requerida.";
    if (!numeroConvenio.trim()) errs.numeroConvenio = "El N° de Convenio es requerido.";
    if (!fechaInicio) errs.fechaInicio = "La fecha de inicio es requerida.";
    if (!fechaFin) errs.fechaFin = "La fecha de fin es requerida.";
    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      errs.fechaFin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
    }
    if (!funcionarioNombre.trim()) errs.funcionarioNombre = "El nombre del funcionario es requerido.";
    if (!funcionarioCi.trim()) errs.funcionarioCi = "El CI es requerido.";
    if (!funcionarioCargo.trim()) errs.funcionarioCargo = "El cargo es requerido.";
    if (!funcionarioCorreo.trim()) {
      errs.funcionarioCorreo = "El correo es requerido.";
    } else if (!funcionarioCorreo.includes("@")) {
      errs.funcionarioCorreo = "Formato de correo no válido.";
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    onGuardar({
      razonSocial: razonSocial.trim(),
      numeroConvenio: numeroConvenio.trim(),
      fechaInicio,
      fechaFin,
      funcionario: {
        nombreCompleto: funcionarioNombre.trim(),
        ci: funcionarioCi.trim(),
        expedido: funcionarioExpedido,
        cargo: funcionarioCargo.trim(),
        correo: funcionarioCorreo.trim(),
      },
      codigoSecreto,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="sec-form-card">
      <div className="sec-toolbar-group sec-mb-5">
        <Building size={20} className="sec-text-uagrm" />
        <h3 className="sec-title-17 sec-heading-bold">
          Alta y Registro de Convenio Interinstitucional
        </h3>
      </div>

      <div className="sec-grid-2">
        {/* Razón Social */}
        <div>
          <label className="sec-label">
            Razón Social Oficial de la Entidad *
          </label>
          <Input
            placeholder="Ej.: Banco Central de Bolivia, YPFB, ASFI"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            hasError={!!errores.razonSocial}
          />
          {errores.razonSocial && (
            <span className="sec-form-error">{errores.razonSocial}</span>
          )}
        </div>

        {/* Número de Convenio Institucional */}
        <div>
          <label className="sec-label">
            Número de Convenio Institucional *
          </label>
          <Input
            placeholder="Ej.: CONV-UAGRM-2026-045"
            value={numeroConvenio}
            onChange={(e) => setNumeroConvenio(e.target.value)}
            hasError={!!errores.numeroConvenio}
          />
          {errores.numeroConvenio && (
            <span className="sec-form-error">{errores.numeroConvenio}</span>
          )}
        </div>
      </div>

      {/* Vigencia del Convenio (Rango de fechas) */}
      <div className="sec-grid-2">
        <div>
          <label className="sec-label">
            Fecha de Inicio de Vigencia *
          </label>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            hasError={!!errores.fechaInicio}
          />
          {errores.fechaInicio && (
            <span className="sec-form-error">{errores.fechaInicio}</span>
          )}
        </div>

        <div>
          <label className="sec-label">
            Fecha de Fin de Vigencia *
          </label>
          <Input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            hasError={!!errores.fechaFin}
          />
          {errores.fechaFin && (
            <span className="sec-form-error">{errores.fechaFin}</span>
          )}
        </div>
      </div>

      {/* Bloque: Funcionario Autorizado */}
      <div className="sec-form-section">
        <div className="sec-toolbar-group sec-mb-3">
          <User size={16} className="sec-text-uagrm" />
          <span className="sec-heading-meta">
            Funcionario Autorizado por la Entidad
          </span>
        </div>

        <div className="sec-grid-3">
          <div>
            <label className="sec-meta-label sec-mb-1">
              Nombre Completo *
            </label>
            <Input
              placeholder="Ej.: Lic. Mario Morales Roca"
              value={funcionarioNombre}
              onChange={(e) => setFuncionarioNombre(e.target.value)}
              hasError={!!errores.funcionarioNombre}
            />
            {errores.funcionarioNombre && (
              <span className="sec-form-error">{errores.funcionarioNombre}</span>
            )}
          </div>

          <div>
            <label className="sec-meta-label sec-mb-1">
              Cédula de Identidad (CI) *
            </label>
            <Input
              placeholder="Ej.: 4819203"
              value={funcionarioCi}
              onChange={(e) => setFuncionarioCi(e.target.value)}
              hasError={!!errores.funcionarioCi}
            />
            {errores.funcionarioCi && (
              <span className="sec-form-error">{errores.funcionarioCi}</span>
            )}
          </div>

          <div>
            <label className="sec-meta-label sec-mb-1">
              Extensión *
            </label>
            <Select
              value={funcionarioExpedido}
              onChange={(e) => setFuncionarioExpedido(e.target.value)}
            >
              {DEPARTAMENTOS_BOLIVIA.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.value}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="sec-grid-2">
          <div>
            <label className="sec-meta-label sec-mb-1">
              Cargo Institucional *
            </label>
            <Input
              placeholder="Ej.: Gerente de Talento Humano"
              value={funcionarioCargo}
              onChange={(e) => setFuncionarioCargo(e.target.value)}
              hasError={!!errores.funcionarioCargo}
            />
            {errores.funcionarioCargo && (
              <span className="sec-form-error">{errores.funcionarioCargo}</span>
            )}
          </div>

          <div>
            <label className="sec-meta-label sec-mb-1">
              Correo Institucional *
            </label>
            <Input
              type="email"
              placeholder="Ej.: funcionario@empresa.gob.bo"
              value={funcionarioCorreo}
              onChange={(e) => setFuncionarioCorreo(e.target.value)}
              hasError={!!errores.funcionarioCorreo}
            />
            {errores.funcionarioCorreo && (
              <span className="sec-form-error">{errores.funcionarioCorreo}</span>
            )}
          </div>
        </div>
      </div>

      {/* Generador de Código Secreto Institucional */}
      <div className="sec-mb-6">
        <GeneradorCodigoSecreto
          codigo={codigoSecreto}
          onGenerarNuevo={() => setCodigoSecreto(generarCodigoAleatorio())}
        />
      </div>

      {/* Botones de acción */}
      <div className="sec-flex-end">
        {onCancelar && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancelar}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
        >
          <PlusCircle size={18} />
          <span>Registrar Convenio y Emitir Clave</span>
        </Button>
      </div>
    </form>
  );
}
