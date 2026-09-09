export const enum TramiteEstado {
  BORRADOR = 'BORRADOR',
  INGRESADO = 'INGRESADO',
  EN_REVISION = 'EN_REVISION',
  OBSERVADO = 'OBSERVADO',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  FINALIZADO = 'FINALIZADO',
}

export const enum TipoTitulo {
  ACADEMICO = 'ACADEMICO',
  PROVISION_NACIONAL = 'PROVISION_NACIONAL',
  SUPLETORIO = 'SUPLETORIO',
  DUPLICADO = 'DUPLICADO',
  POSTGRADO = 'POSTGRADO',
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
