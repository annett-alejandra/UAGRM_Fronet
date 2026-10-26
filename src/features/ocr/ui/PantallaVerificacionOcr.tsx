import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Spinner, Badge } from '@/shared/ui';
import { ocrApi } from '../api/ocrApi';
import type { DocumentResponse } from '../model/types';

export function PantallaVerificacionOcr() {
  const { docId } = useParams<{ docId: string }>();
  const [doc, setDoc] = useState<DocumentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docId) return;

    let isMounted = true;
    const checkStatus = async () => {
      try {
        const data = await ocrApi.consultarEstadoDocumento(docId);
        if (!isMounted) return;

        setDoc(data);
        if (data.status === 'PROCESSING' || data.status === 'PENDING') {
          setTimeout(checkStatus, 3000); // Polling determinista cada 3 segs
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Error al consultar estado';
          setError(msg);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [docId]);

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
        {/* Lado Izquierdo: Visor de Documento */}
        <Card className="h-full">
          <CardBody className="h-full flex flex-col p-4">
            <h3 className="font-bold text-sm text-slate-800 mb-3">Documento Original</h3>
            <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              {doc ? (
                <div className="text-center p-4">
                  <p className="text-xs text-slate-600 font-medium">Documento Vinculado</p>
                  <p className="font-mono text-[11px] text-slate-400 mt-1">{doc.object_key}</p>
                </div>
              ) : (
                <Spinner />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Lado Derecho: Extracción OCR */}
        <Card className="h-full">
          <CardBody className="h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-slate-800">Texto Extraído (Pipeline OCR)</h3>
              {doc?.status === 'PROCESSING' && (
                <Badge variant="warning" showDot>
                  Analizando...
                </Badge>
              )}
              {doc?.status === 'DONE' && (
                <Badge variant="success">Análisis Completo</Badge>
              )}
              {doc?.status === 'ERROR' && (
                <Badge variant="danger">Error de Inferencia</Badge>
              )}
            </div>

            {error && (
              <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}

            <div className="flex-1 bg-slate-50 p-4 rounded-lg overflow-y-auto border border-slate-200 font-mono text-xs whitespace-pre-wrap text-slate-700">
              {doc?.status === 'DONE'
                ? doc.extracted_text || 'Documento procesado. No se detectó texto manuscrito o impreso.'
                : 'La Inteligencia Artificial está procesando el documento y extrayendo las matrices...'}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default PantallaVerificacionOcr;
