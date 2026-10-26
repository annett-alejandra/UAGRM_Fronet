// src/pages/verificacion/VerificacionPage.tsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  VerificacionBuscador,
  VerificacionResultado,
  useVerificarCertificado,
} from "@features/verificar-certificado";
import { ShieldCheck } from "lucide-react";

export function VerificacionPage() {
  const { token } = useParams<{ token?: string }>();
  const { verificar, resultado, loading } = useVerificarCertificado();

  useEffect(() => {
    if (token) {
      verificar(token);
    }
  }, [token, verificar]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portal de Verificación Documental
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Universidad Autónoma Gabriel René Moreno — Secretaría General
          </p>
        </header>

        <VerificacionBuscador
          initialToken={token || ""}
          onVerificar={verificar}
          loading={loading}
        />

        <VerificacionResultado resultado={resultado} />
      </div>
    </div>
  );
}
