import { useState, useEffect } from 'react';

export interface ValidarReciboResponse {
  validarReciboCaja: {
    valido: boolean;
    monto: number;
    motivo: string;
  };
}

export function useValidarRecibo(nroRecibo: string, skip: boolean = false) {
  const [data, setData] = useState<ValidarReciboResponse['validarReciboCaja'] | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (skip || !nroRecibo || nroRecibo.length < 5) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        valido: !nroRecibo.endsWith('0'),
        monto: 30.0,
        motivo: nroRecibo.endsWith('0') ? 'Recibo ya utilizado' : ''
      });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [nroRecibo, skip]);

  return { data, isLoading, error: null };
}
