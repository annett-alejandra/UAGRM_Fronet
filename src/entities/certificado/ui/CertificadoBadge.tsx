// src/entities/certificado/ui/CertificadoBadge.tsx
import { Badge } from "@shared/ui/Badge";
import {
  getConfiguracionTipo,
  type TipoCertificadoValue,
} from "../model";

type Props = {
  tipo: TipoCertificadoValue;
  size?: "sm" | "md";
};

export function CertificadoBadge({ tipo, size = "md" }: Props) {
  const config = getConfiguracionTipo(tipo);

  return (
    <Badge
      variant="outline"
      className="gap-1.5"
      style={{ borderColor: config.color, color: config.color }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {size === "md" && <span>{config.label}</span>}
      {size === "sm" && <span>{config.value.split("_")[1]}</span>}
    </Badge>
  );
}
