export const enum TramiteEstado {
  RECEPCION_VENTANILLA = 'RECEPCION_VENTANILLA',
  REVISION_ARCHIVO = 'REVISION_ARCHIVO',
  VERIFICADO_OCR = 'VERIFICADO_OCR',
  APROBACION_TITULOS = 'APROBACION_TITULOS',
  CERTIFICACION_EMITIDA = 'CERTIFICACION_EMITIDA',
  ENTREGADO = 'ENTREGADO',
  RECHAZADO = 'RECHAZADO',
}

export const enum TipoTitulo {
  BIENHECHURIA = 'BIENHECHURIA',
  PROPIEDAD = 'PROPIEDAD',
  EJIDO = 'EJIDO',
  POSESION = 'POSESION',
  SUPLETORIO = 'SUPLETORIO',
}

export interface TramiteEntity {
  readonly id: string;
  readonly codigo: string;
  readonly tipoTitulo: TipoTitulo;
  readonly estado: TramiteEstado;
  readonly solicitanteNombre: string;
  readonly solicitanteCi: string;
  readonly carrera: string;
  readonly facultad: string;
  readonly unidadActual: string;
  readonly observaciones: string | null;
  readonly documentoIds: readonly string[];
  readonly creadoPor: string;
  readonly derivadoA: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface TramiteResumen {
  readonly total: number;
  readonly porEstado: Record<TramiteEstado, number>;
}
