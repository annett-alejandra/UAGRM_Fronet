import React, { useState } from 'react';
import { Button } from '@/shared/ui';
import { FormularioCamposOcr } from './FormularioCamposOcr';
import type { CampoOcrExtraido } from '../model/types';

interface VisorOcrSplitViewProps {
  documentName?: string;
  documentUrl?: string;
  camposExtraidos: Record<string, CampoOcrExtraido>;
  denominacionModelo?: string;
  confianzaGeneral?: number;
  onConfirmar: (valores: Record<string, string>) => Promise<void> | void;
  onRechazar?: () => Promise<void> | void;
}

export const VisorOcrSplitView: React.FC<VisorOcrSplitViewProps> = ({
  documentName = 'Documento_Academico_Matriz.pdf',
  documentUrl,
  camposExtraidos,
  denominacionModelo = 'Modelo OCR UAGRM v2.4 (Bi-Encoder ResNet + TrOCR)',
  confianzaGeneral = 0.94,
  onConfirmar,
  onRechazar,
}) => {
  const [valoresForm, setValoresForm] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    Object.entries(camposExtraidos).forEach(([k, c]) => {
      inicial[k] = c.valor ?? '';
    });
    return inicial;
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const handleCampoChange = (campoKey: string, nuevoValor: string) => {
    setValoresForm((prev) => ({
      ...prev,
      [campoKey]: nuevoValor,
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await onConfirmar(valoresForm);
      setGuardadoExitoso(true);
    } finally {
      setGuardando(false);
    }
  };

  const porcentajeGeneral = Math.round(confianzaGeneral * 100);

  return (
    <div className="h-full flex flex-col gap-4 pb-6">
      {/* Top Banner de Acción y Estado */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Validación y Reconstrucción OCR
            </h2>
            <span className="text-xs px-2.5 py-0.5 bg-blue-100 text-[#191A7D] font-bold rounded-full border border-blue-200">
              {porcentajeGeneral}% Confianza General
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {denominacionModelo} &bull; Archivo: <span className="font-mono">{documentName}</span>
          </p>
        </div>

        <div className="flex gap-2.5">
          {onRechazar && (
            <Button variant="outline" size="sm" onClick={onRechazar}>
              Observar / Rechazar
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleGuardar} disabled={guardando}>
            {guardando ? 'Consolidando...' : 'Consolidar y Guardar Expediente'}
          </Button>
        </div>
      </div>

      {guardadoExitoso && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold">
          ✓ Datos del expediente verificados y consolidados exitosamente en la base de datos de Títulos.
        </div>
      )}

      {/* Split View Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[620px]">
        {/* Lado Izquierdo: Visor de Documento Original */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col shadow-inner overflow-hidden">
          <div className="bg-slate-800 px-4 py-2.5 text-slate-300 text-xs font-semibold flex justify-between items-center border-b border-slate-700">
            <span>Visor Documental Original</span>
            <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-[11px]">{documentName}</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/60">
            {documentUrl ? (
              <iframe
                src={documentUrl}
                title="Vista previa del documento"
                className="w-full h-full border-0 rounded-lg"
              />
            ) : (
              <div className="text-center text-slate-400">
                <div className="w-16 h-20 border-2 border-slate-600 rounded p-2 mx-auto mb-3 flex flex-col justify-between">
                  <div className="w-full h-2 bg-slate-700 rounded"></div>
                  <div className="w-3/4 h-1.5 bg-slate-700 rounded"></div>
                  <div className="w-full h-2 bg-slate-700 rounded"></div>
                </div>
                <p className="text-xs font-medium">Documento Digitalizado Cargado</p>
                <p className="text-[11px] text-slate-500 mt-1">Cotejo interactivo de matriz de grado</p>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Formulario de Campos Extraídos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Campos Estructurados Extraídos por OCR
            </span>
            <span className="text-[11px] text-slate-500">
              {Object.keys(camposExtraidos).length} campos detectados
            </span>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            <FormularioCamposOcr
              campos={camposExtraidos}
              valores={valoresForm}
              onChange={handleCampoChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
