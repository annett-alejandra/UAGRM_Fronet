import React from 'react';
import type { CampoOcrExtraido } from '../model/types';
import { getLabelCampoOcr, UMBRAL_CONFIANZA_ALTA } from '../model/constants';

interface FormularioCamposOcrProps {
  campos: Record<string, CampoOcrExtraido>;
  valores: Record<string, string>;
  onChange: (campoKey: string, nuevoValor: string) => void;
  readOnly?: boolean;
}

export const FormularioCamposOcr: React.FC<FormularioCamposOcrProps> = ({
  campos,
  valores,
  onChange,
  readOnly = false,
}) => {
  const entradas = Object.entries(campos);

  if (entradas.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No hay campos extraídos para mostrar.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {entradas.map(([key, campo]) => {
        const porcentaje = Math.round((campo.confianza ?? 1) * 100);
        const esBajaConfianza = (campo.confianza ?? 1) < UMBRAL_CONFIANZA_ALTA;
        const valorActual = valores[key] ?? campo.valor ?? '';

        return (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label htmlFor={`ocr-field-${key}`} className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                {getLabelCampoOcr(key)}
              </label>

              {campo.confianza !== undefined && campo.confianza > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold transition-colors ${
                    esBajaConfianza
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                  title={esBajaConfianza ? 'Baja confianza: requiere revisión humana' : 'Extracción de alta confianza'}
                >
                  {porcentaje}%
                </span>
              )}
            </div>

            <input
              id={`ocr-field-${key}`}
              type="text"
              value={valorActual}
              disabled={readOnly || campo.editable === false}
              placeholder={campo.observacion ?? `Ingrese ${getLabelCampoOcr(key)}...`}
              onChange={(e) => onChange(key, e.target.value)}
              className={`w-full text-xs p-2.5 rounded-lg border transition-all outline-none ${
                esBajaConfianza
                  ? 'border-amber-400 bg-amber-50/40 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                  : 'border-slate-300 bg-white focus:border-[#191A7D] focus:ring-1 focus:ring-[#191A7D]/30'
              } disabled:bg-slate-100 disabled:text-slate-500`}
            />

            {esBajaConfianza && (
              <span className="text-[10px] text-amber-700 flex items-center gap-1">
                ⚠️ Caracteres dudosos detectados por el modelo. Por favor verifique contra el original.
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
