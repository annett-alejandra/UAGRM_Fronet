import { useState, useEffect } from 'react';

export interface RegistroUnificado {
  origen: string;
  estadoTramite: string;
  numeroTitulo: string | null;
  fechaEmision: string | null;
  nombreGraduado: string;
}

export interface BuscarHistorialResponse {
  buscarEstudianteUnificado: RegistroUnificado[];
}

export function useBuscarHistorial(ci: string, skip: boolean = false) {
  const [data, setData] = useState<RegistroUnificado[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData([
        { origen: 'ANZIO', estadoTramite: 'EMITIDO', numeroTitulo: '001', fechaEmision: '2024-01-01', nombreGraduado: 'Mock Usuario' },
        { origen: 'POSTGRES', estadoTramite: 'PENDIENTE_CONTROL_CALIDAD', numeroTitulo: null, fechaEmision: null, nombreGraduado: 'Mock Usuario' }
      ]);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    if (skip || !ci) return;
    refetch();
  }, [ci, skip]);

  return { data, isLoading, error: null, refetch };
}
