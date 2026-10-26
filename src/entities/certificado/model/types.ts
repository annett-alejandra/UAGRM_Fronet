// src/entities/certificado/model/types.ts
import type {
  EstadoCertificadoValue,
  EstadoInformeValue,
  FamiliaDocumentoValue,
  TipoCertificadoValue,
} from "./constants";

export type InformeAutenticidad = {
  id: string;
  tramiteId: string;
  nroInforme: string;
  fechaDocumento: string;
  jefeArchivoId: string;
  jefeArchivoNombre: string;
  secretarioDestinoId: string;
  secretarioDestinoNombre: string;
  cuerpoInforme: string;
  tablaDatos: Record<string, string>;
  aclaratoria: string | null;
  vistoBuenoJefatura: boolean;
  estado: EstadoInformeValue;
  documentoMinioKey: string;
};

export type Certificado = {
  id: string;
  informeId: string;
  nroCertificado: string;
  tipo: TipoCertificadoValue;
  familia: FamiliaDocumentoValue;
  fechaEmision: string;
  hashQrUnico: string;
  pdfMinioKey: string;
  estado: EstadoCertificadoValue;
  rectorNombre: string;
  secretarioNombre: string;
};

export type DatosCertificadoBase = {
  nroInforme: string;
  fechaInforme: string;
};

export type DatosCertificadoTipo1 = DatosCertificadoBase & {
  tituloProfesional: string;
  nombreTitular: string;
  ciTitular: string;
  libro: string;
  fojas: string;
  fechaEmisionTitulo: string;
};

export type DatosCertificadoTipo2 = DatosCertificadoBase & {
  tituloDiploma: string;
  nombreTitular: string;
  ciTitular: string;
  libro: string;
  fojas: string;
  fechaEmisionTitulo: string;
  gestionEpoca: string;
};

export type DatosCertificadoTipo3 = DatosCertificadoTipo2 & {
  rectorEpocaNombre: string;
  gestionActual: string;
  periodoGestion: string;
  nroResolucionCEU: string;
  fechaResolucion: string;
};

export type DatosCertificadoTipo4 = {
  nroCertificado: string;
  ciTitular: string;
  lugarNacimiento: string;
  nroDiploma: string;
  libro: string;
  ley: string;
  fechaEmisionTitulo: string;
};

export type DatosCertificadoTipo5 = {
  nroCertificado: string;
  nombreTitular: string;
  ciTitular: string;
  lugarNacimiento: string;
  tituloProfesional: string;
  nroTitulo: string;
  libro: string;
  fojas: string;
  fechaEmisionTitulo: string;
};

export type DatosCertificado =
  | DatosCertificadoTipo1
  | DatosCertificadoTipo2
  | DatosCertificadoTipo3
  | DatosCertificadoTipo4
  | DatosCertificadoTipo5;

export type EmitirCertificadoResponse = {
  emitirCertificado: {
    certificado: Certificado;
    pdfUrl: string;
  };
};

export type EmitirCertificadoInput = {
  informeId: string;
  tipo: TipoCertificadoValue;
  datos: DatosCertificado;
};

export type AnularCertificadoInput = {
  certificadoId: string;
  motivoAnulacion: string;
  nroResolucion: string;
};

export type VerificarCertificadoResponse = {
  verificarCertificadoQR: {
    valido: boolean;
    certificado: Certificado | null;
    motivoInvalidez: string | null;
  };
};
