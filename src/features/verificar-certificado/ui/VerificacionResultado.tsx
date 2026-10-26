// src/features/verificar-certificado/ui/VerificacionResultado.tsx
import { ShieldCheck, ShieldAlert, Award, Calendar, Hash, UserCheck } from "lucide-react";
import { CertificadoBadge, type Certificado } from "@entities/certificado";

type Props = {
  resultado:
    | { status: "idle" }
    | { status: "loading" }
    | { status: "valid"; certificado: Certificado }
    | { status: "invalid"; motivo: string };
};

export function VerificacionResultado({ resultado }: Props) {
  if (resultado.status === "idle") return null;

  if (resultado.status === "loading") {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Verificando autenticidad en registros UAGRM...</p>
      </div>
    );
  }

  if (resultado.status === "invalid") {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-50/80 border border-red-200 rounded-2xl text-center space-y-3 shadow-sm">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-950">Documento NO Válido o Inexistente</h3>
        <p className="text-xs text-red-800 max-w-md mx-auto leading-relaxed">
          {resultado.motivo}
        </p>
      </div>
    );
  }

  const { certificado } = resultado;

  return (
    <div className="max-w-xl mx-auto bg-white border border-emerald-200 rounded-2xl p-6 shadow-md space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-600" />
      
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Documento Auténtico y Válido</h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              VERIFICADO
            </span>
          </div>
          <p className="text-xs text-slate-500">Registrado en la Secretaría General de la UAGRM</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            <span>Tipo de Documento:</span>
          </span>
          <CertificadoBadge tipo={certificado.tipo} />
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-slate-400" />
            <span>Número de Certificado:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">{certificado.nroCertificado}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Fecha de Emisión:</span>
          </span>
          <span className="font-semibold text-slate-800">
            {new Date(certificado.fechaEmision).toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Autoridad Firmante:</span>
          </span>
          <span className="font-semibold text-slate-800">{certificado.rectorNombre}</span>
        </div>
      </div>
    </div>
  );
}
