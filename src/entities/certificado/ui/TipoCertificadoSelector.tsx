// src/entities/certificado/ui/TipoCertificadoSelector.tsx
import { CONFIGURACION_CERTIFICADOS, getLabelFamilia } from "../model";
import type { TipoCertificadoValue } from "../model";
import { cn } from "@shared/lib/cn";
import { GraduationCap, History, ScanText, FileText, Award } from "lucide-react";

type Props = {
  value: TipoCertificadoValue | null;
  onChange: (tipo: TipoCertificadoValue) => void;
  className?: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GraduationCap,
  History,
  ScanText,
  FileText,
  Award,
};

export function TipoCertificadoSelector({
  value,
  onChange,
  className,
}: Props) {
  const tipos = Object.values(CONFIGURACION_CERTIFICADOS);

  const porFamilia = tipos.reduce<
    Record<string, typeof tipos>
  >((acc, t) => {
    acc[t.familia] = acc[t.familia] ?? [];
    acc[t.familia].push(t);
    return acc;
  }, {});

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(porFamilia).map(([familia, items]) => (
        <div key={familia}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            {getLabelFamilia(familia as any)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((config) => {
              const selected = value === config.value;
              const IconComp = iconMap[config.icono] || FileText;

              return (
                <button
                  key={config.value}
                  type="button"
                  onClick={() => onChange(config.value)}
                  className={cn(
                    "text-left p-4 rounded-lg border-2 transition-all cursor-pointer",
                    "hover:shadow-md",
                    selected
                      ? "border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  )}
                  style={
                    selected
                      ? { borderColor: config.color, backgroundColor: `${config.color}0D` }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${config.color}18` }}
                    >
                      <IconComp className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-slate-900">
                          {config.label}
                        </p>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                          {config.value.split("_")[1]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
