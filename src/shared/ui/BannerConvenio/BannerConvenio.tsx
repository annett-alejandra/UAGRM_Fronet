import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface BannerConvenioProps {
  className?: string;
  titulo?: string;
  descripcion?: string;
}

/**
 * Banner Informativo Institucional: Exención de Arancel bajo Convenio UAGRM
 * Componente oficial de la Caja de Herramientas UI UAGRM.
 */
export const BannerConvenio: React.FC<BannerConvenioProps> = ({
  className,
  titulo = "Trámite Exento de Pago bajo Convenio Interinstitucional UAGRM",
  descripcion = "Las solicitudes institucionales radicadas por organismos del Estado, entidades financieras o empresas con convenio vigente se encuentran exentas de aranceles y comprobantes bancarios. El legajo y la nómina serán validados directamente por Secretaría General y Despacho Legal.",
}) => {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-xl border border-blue-200 bg-blue-50/90 text-blue-950 shadow-sm transition-all",
        className
      )}
    >
      <div className="p-1.5 rounded-lg bg-blue-100 text-[#191A7D] shrink-0 mt-0.5">
        <Info size={20} aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#191A7D] leading-tight">
          {titulo}
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          {descripcion}
        </p>
      </div>
    </div>
  );
};

export default BannerConvenio;
