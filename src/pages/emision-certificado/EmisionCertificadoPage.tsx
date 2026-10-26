// src/pages/emision-certificado/EmisionCertificadoPage.tsx
import { EmitirCertificadoForm } from "@features/emitir-certificado";
import {
  MOCK_INFORME,
  getDatosInicialesDesdeInforme,
} from "@entities/certificado/model/certificados.mock";

export function EmisionCertificadoPage() {
  const datosIniciales = getDatosInicialesDesdeInforme(MOCK_INFORME);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
      <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Emisión de Certificados
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Informe fuente: <span className="font-mono text-blue-900 font-semibold">{MOCK_INFORME.nroInforme}</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-100 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Módulo Oficial UAGRM</span>
        </div>
      </header>

      <EmitirCertificadoForm
        informeId={MOCK_INFORME.id}
        datosIniciales={datosIniciales}
        onSuccess={(certId, pdfUrl) => {
          console.log("Certificado emitido exitosamente:", certId);
        }}
      />
    </div>
  );
}
