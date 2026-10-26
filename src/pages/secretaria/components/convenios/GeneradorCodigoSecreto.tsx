import { useState } from "react";
import { Button } from "@shared/ui";
import { Key, Eye, EyeOff, Copy, Check, RefreshCw } from "lucide-react";

interface GeneradorCodigoSecretoProps {
  codigo: string;
  onGenerarNuevo?: () => void;
}

export function GeneradorCodigoSecreto({ codigo, onGenerarNuevo }: GeneradorCodigoSecretoProps) {
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = () => {
    if (!codigo) return;
    navigator.clipboard.writeText(codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  return (
    <div className="sec-code-box">
      <div className="sec-code-header-clean">
        <div className="sec-toolbar-group">
          <Key size={16} />
          <span className="sec-cell-accent">
            Código Secreto Institucional
          </span>
        </div>
        {onGenerarNuevo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGenerarNuevo}
            title="Generar nueva clave criptográfica aleatoria"
          >
            <RefreshCw size={12} />
            <span>Regenerar Clave</span>
          </Button>
        )}
      </div>

      <div className="sec-code-display">
        <span className="sec-code-text">
          {mostrarCodigo ? codigo : "••••••••••••••••"}
        </span>

        {/* Botón Ver/Ocultar */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setMostrarCodigo(!mostrarCodigo)}
          title={mostrarCodigo ? "Ocultar código" : "Ver código"}
        >
          {mostrarCodigo ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>

        {/* Botón Copiar con Confirmación */}
        <Button
          type="button"
          variant={copiado ? "secondary" : "primary"}
          size="sm"
          onClick={handleCopiar}
          title="Copiar clave secreta al portapapeles"
        >
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          <span>{copiado ? "¡Copiado!" : "Copiar"}</span>
        </Button>
      </div>

      <p className="sec-form-hint">
        * Esta clave secreta es provista a la entidad afiliada y es validada en el portal público institucional para eximir del cobro de aranceles.
      </p>
    </div>
  );
}
