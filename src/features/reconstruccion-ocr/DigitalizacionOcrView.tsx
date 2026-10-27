import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { restClient } from '@/shared/api';

export interface CampoExtraido {
  valor: string | null;
  confianza: number;
  editable: boolean;
  observacion?: string;
}

export interface RespuestaOcrDinamico {
  tipo_documento_detectado: string;
  denominacion_modelo: string;
  confianza_general: number;
  campos_extraidos: Record<string, CampoExtraido>;
}

export const DigitalizacionOcrView = () => {
  const [cargando, setCargando] = useState(false);
  const [dataOcr, setDataOcr] = useState<RespuestaOcrDinamico | null>(null);
  const [valoresForm, setValoresForm] = useState<Record<string, string>>({});

  const procesarDocumento = async (archivo: File) => {
    setCargando(true);
    // Limpieza total antes de procesar el nuevo documento
    setDataOcr(null);
    setValoresForm({});

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('es_pdf', archivo.name.endsWith('.pdf') ? 'true' : 'false');

    try {
      const { data } = await restClient.post<RespuestaOcrDinamico>('/ocr/procesar/', formData as unknown as Record<string, unknown>);
      setDataOcr(data);

      // Mapea los valores iniciales para que sean editables en los inputs
      const formInicial: Record<string, string> = {};
      Object.entries(data.campos_extraidos).forEach(([key, campo]) => {
        formInicial[key] = campo.valor ?? '';
      });
      setValoresForm(formInicial);
    } catch (error) {
      console.error('Error procesando OCR:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (campoKey: string, nuevoValor: string) => {
    setValoresForm(prev => ({
      ...prev,
      [campoKey]: nuevoValor
    }));
  };

  // Diccionario legible de etiquetas para la UI
  const labelsCampos: Record<string, string> = {
    nombre_completo: 'Nombre Completo del Titular',
    nro_documento: 'Nº Diploma / Título',
    grado_otorgado: 'Título / Grado Otorgado',
    rector_autoridad: 'Autoridad / Rector',
    ci_titular: 'C.I. Titular',
    libro_matriz: 'Libro Matriz',
    folio: 'Folio'
  };

  return (
    <div className="flex h-screen w-full bg-slate-100">
      {/* PANEL DERECHO: RENDER DINÁMICO */}
      <aside className="w-96 bg-white border-l border-slate-200 p-4 overflow-y-auto">
        
        {/* Banner de Clasificación Dinámica */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase block">
            Tipo OCR Detectado
          </span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">
            {dataOcr ? dataOcr.denominacion_modelo : 'Esperando documento...'}
          </p>
          {dataOcr && (
            <span className="text-[11px] text-blue-600 font-medium">
              Confianza general: {Math.round(dataOcr.confianza_general * 100)}%
            </span>
          )}
        </div>

        {/* Inputs Generados Dinámicamente */}
        <div className="space-y-3">
          {dataOcr && Object.entries(dataOcr.campos_extraidos).map(([key, campo]) => {
            const porcentaje = Math.round(campo.confianza * 100);
            const esBajaConfianza = campo.confianza > 0 && campo.confianza < 0.85;

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    {labelsCampos[key] || key}
                  </label>
                  {campo.confianza > 0 && (
                    <span className={`text-[10px] font-mono px-1 rounded ${
                      esBajaConfianza ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {porcentaje}%
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  value={valoresForm[key] ?? ''}
                  placeholder={campo.observacion ?? 'Ingrese valor...'}
                  disabled={!campo.editable}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className={`w-full text-xs p-2 rounded border transition-colors ${
                    campo.valor === null 
                      ? 'border-dashed border-slate-300 bg-slate-50' 
                      : esBajaConfianza 
                        ? 'border-amber-400 bg-amber-50/30' 
                        : 'border-slate-300 bg-white'
                  } focus:outline-none focus:border-blue-600 font-medium`}
                />

                {campo.observacion && campo.valor === null && (
                  <p className="text-[10px] text-slate-400 mt-0.5 italic">
                    {campo.observacion}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {dataOcr && (
          <Button variant="primary" className="w-full mt-6" onClick={() => console.log("Guardar en carpeta legajo:", valoresForm)}>Cargar y Registrar en Carpeta Legajo</Button>
        )}
      </aside>
    </div>
  );
};

