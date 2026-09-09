import { useState } from 'react';

export interface IniciarTramiteResponse {
  iniciarTramite: {
    exito: boolean;
    mensaje: string;
    rutaSugerida: string;
  };
}

export function useIniciarTramite() {
  const [isLoading, setIsLoading] = useState(false);

  const iniciar = async (ci: string, nroRecibo: string) => {
    setIsLoading(true);
    return new Promise<IniciarTramiteResponse['iniciarTramite']>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        const esAntiguo = ['1', '2', '3'].includes(ci.charAt(0));
        resolve({
          exito: true,
          mensaje: esAntiguo ? "Requiere Reconstrucción Pre-2023." : "Título Post-2023 encontrado.",
          rutaSugerida: esAntiguo ? "archivo_central" : "tramite_directo"
        });
      }, 600);
    });
  };

  return { iniciar, isLoading, data: null, error: null };
}
