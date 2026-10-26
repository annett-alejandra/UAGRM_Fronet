export type OrigenSolicitud =
  | "INDIVIDUAL"
  | "INSTITUCIONAL";

export type EstadoSolicitud =
  | "PENDIENTE"
  | "EN_PROCESO"
  | "CONVALIDADO"
  | "OBSERVADO";

export interface SolicitudTitulo {
  id: string;

  ci: string;

  nombreCompleto: string;

  carrera: string;

  gestionEmision: number;

  origen: OrigenSolicitud;

  institucion?: string;

  estado: EstadoSolicitud;
}

export interface IntegranteLote {
  id: string;
  ci: string;
  nombreCompleto: string;
  carrera: string;
  estado:
    | "PENDIENTE"
    | "EN_PROCESO"
    | "CONVALIDADO"
    | "OBSERVADO";
}

export interface LoteInstitucional {
  id: string;

  nombre: string;

  institucion: string;

  fecha: string;

  total: number;

  procesados: number;

  estado:
    | "PENDIENTE"
    | "EN_PROCESO"
    | "COMPLETADO";

  integrantes: IntegranteLote[];
}
export interface CampoConvalidacion {
  campo: string;

  etiqueta: string;

  valorOCR: string;

  valorBaseDatos: string;

  valorFinal: string;

  coincide: boolean;
}

export interface DocumentoConvalidacion {
  id: string;

  expedienteId: string;

  rut: string;

  tipoDocumento:
    | "DIPLOMA_BACHILLER"
    | "TITULO_ACADEMICO"
    | "TITULO_PROVISION_NACIONAL";

  archivoUrl: string;

  campos: CampoConvalidacion[];
}
export type EstadoEntradaArchivo =
  | "PENDIENTE"
  | "EN_REVISION"
  | "PRIORITARIO";

export interface EntradaArchivo {
  id: string;

  rut: string;

  ci: string;

  nombreCompleto: string;

  tipoDocumento: string;

  gestionEmision: number;

  fechaIngreso: string;

  origen: OrigenSolicitud;

  institucion?: string;

  estado: EstadoEntradaArchivo;
}
export interface RegistroBoveda {
  id: string;
  expedienteId: string;
  rut: string;
  ci: string;
  titular: string;
  tipoDocumento: string;
  ubicacion: string;
  fechaDerivacion: string;
}
export type EstadoSecretariaGeneral =
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO";

export interface RegistroSecretariaGeneral {
  id: string;

  rut: string;

  ci: string;

  nombreCompleto: string;

  carrera: string;

  tipoTramite: string;

  fechaIngreso: string;

  estado: EstadoSecretariaGeneral;
}