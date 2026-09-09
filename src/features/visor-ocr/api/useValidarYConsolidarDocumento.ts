import { useState } from 'react';

export interface ValidarYConsolidarResponse {
  validarDocumentoOcr: {
    success: boolean;
    message: string;
    documento: {
      id: string;
      estado: string;
      fechaValidacion: string;
    };
  };
}

export function useValidarYConsolidarDocumento() {
  const [isSaving, setIsSaving] = useState(false);

  const consolidarDocumento = async (documentoId: string, payload: Record<string, any>, ciEstudiante: string) => {
    setIsSaving(true);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        console.warn("Apollo Server is disconnected. Mocking success for UI flow.", { documentoId, payload, ciEstudiante });
        setIsSaving(false);
        resolve(true);
      }, 800);
    });
  };

  return {
    consolidarDocumento,
    isSaving,
    data: null,
    error: null,
  };
}
