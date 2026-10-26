// src/features/emitir-certificado/ui/EmitirCertificadoForm.tsx
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@shared/ui/Button";
import {
  TipoCertificadoSelector,
  CertificadoPreview,
  getConfiguracionTipo,
  type DatosCertificado,
  type TipoCertificadoValue,
} from "@entities/certificado";
import { useEmitirCertificado } from "../model";
import { AlertTriangle, CheckCircle2, RotateCcw, Send, FileCheck, ArrowDown } from "lucide-react";

type Props = {
  informeId?: string;
  datosIniciales?: Partial<DatosCertificado>;
  onSuccess?: (certificadoId: string, pdfUrl: string) => void;
};

export function EmitirCertificadoForm({
  informeId = "INF-472",
  datosIniciales = {},
  onSuccess,
}: Props) {
  const [tipo, setTipo] = useState<TipoCertificadoValue | null>(null);
  const [datos, setDatos] = useState<Partial<DatosCertificado>>(datosIniciales);
  const { emitir, loading, estado, validarCampos, reset } = useEmitirCertificado();

  const paso2Ref = useRef<HTMLDivElement>(null);

  const config = useMemo(() => (tipo ? getConfiguracionTipo(tipo) : null), [tipo]);

  const camposFaltantes = useMemo(() => {
    if (!tipo) return [];
    return validarCampos(tipo, datos);
  }, [tipo, datos, validarCampos]);

  const puedeEmitir =
    !!tipo && camposFaltantes.length === 0 && estado.status !== "loading";

  // Auto-scroll smooth to Paso 2 when a certificate type is selected
  useEffect(() => {
    if (tipo && paso2Ref.current) {
      setTimeout(() => {
        paso2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [tipo]);

  const handleSelectTipo = (nuevoTipo: TipoCertificadoValue) => {
    setTipo(nuevoTipo);
  };

  const handleEmitir = async () => {
    if (!tipo) return;
    const certificado = await emitir(informeId, tipo, datos as DatosCertificado);
    if (certificado) {
      const pdfUrl = (estado as any).pdfUrl || `http://localhost:8000/api/storage/pdf/${certificado.id}.pdf`;
      onSuccess?.(certificado.id, pdfUrl);
    }
  };

  const updateCampo = (campo: string, valor: string) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleReiniciar = () => {
    setTipo(null);
    setDatos(datosIniciales);
    reset();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Paso 1: Elegir tipo */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Seleccione el Tipo de Certificado
            </h2>
          </div>
          {tipo && config && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Seleccionado: {config.label}</span>
            </div>
          )}
        </div>

        <TipoCertificadoSelector value={tipo} onChange={handleSelectTipo} />

        {tipo && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => paso2Ref.current?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all border border-blue-200"
            >
              <span>Continuar al Paso 2 (Completar Datos)</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        )}
      </section>

      {/* Paso 2: Completar datos dinámicos */}
      {tipo && config && (
        <section ref={paso2Ref} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 scroll-mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Datos Requeridos ({config.label})
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {config.camposRequeridos.length} campos solicitados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {config.camposRequeridos.map((campo) => {
              const isMissing = camposFaltantes.includes(campo);
              return (
                <div key={campo} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {campo}
                    {isMissing && (
                      <span className="text-red-500 ml-1 font-bold">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={(datos as Record<string, string>)[campo] ?? ""}
                    onChange={(e) => updateCampo(campo, e.target.value)}
                    placeholder={`Ingrese ${campo}...`}
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                      isMissing
                        ? "border-red-300 bg-red-50/40 focus:ring-red-400"
                        : "border-slate-300 bg-white focus:ring-blue-500"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Paso 3: Vista previa en vivo */}
      {tipo && config && (
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-7 w-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Vista previa oficial (A4)
            </h2>
          </div>
          <CertificadoPreview tipo={tipo} datos={datos} />
        </section>
      )}

      {/* Mensajes de estado */}
      {estado.status === "error" && (
        <div role="alert" className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-bold">No se puede procesar la solicitud</p>
            <p className="text-xs text-red-700">{estado.message}</p>
          </div>
        </div>
      )}

      {estado.status === "success" && (
        <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Certificado emitido correctamente</p>
              <p className="text-xs text-emerald-700 font-mono">
                ID Certificado: {estado.certificadoId}
              </p>
            </div>
          </div>
          <a
            href={estado.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg shadow-sm"
          >
            <FileCheck className="w-4 h-4" />
            <span>Descargar PDF</span>
          </a>
        </div>
      )}

      {/* Botones de acción */}
      {tipo && (
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={handleReiniciar} disabled={loading} className="gap-2 text-slate-700 border-slate-300">
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </Button>
          <Button onClick={handleEmitir} disabled={!puedeEmitir} className="gap-2 bg-blue-900 text-white px-6 font-semibold">
            {loading ? <span>Emitiendo...</span> : <><Send className="w-4 h-4" /><span>Emitir Certificado</span></>}
          </Button>
        </div>
      )}
    </div>
  );
}
