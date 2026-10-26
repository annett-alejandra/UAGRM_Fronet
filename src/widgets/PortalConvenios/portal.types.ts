/**
 * Tipos y Modelos de Datos para el Portal de Entrada Institucional y Registro
 * Universidad Autónoma Gabriel René Moreno (UAGRM)
 */

export type RolTramite = "personal" | "institucional";

export type DepartamentoBolivia =
  | "SCZ"
  | "LPZ"
  | "CBA"
  | "ORU"
  | "POT"
  | "TJA"
  | "CHQ"
  | "BEN"
  | "PND"
  | "EXT";

export interface OpcionDepartamento {
  value: DepartamentoBolivia;
  label: string;
}

export const DEPARTAMENTOS_BOLIVIA: OpcionDepartamento[] = [
  { value: "SCZ", label: "SCZ — Santa Cruz" },
  { value: "LPZ", label: "LPZ — La Paz" },
  { value: "CBA", label: "CBA — Cochabamba" },
  { value: "ORU", label: "ORU — Oruro" },
  { value: "POT", label: "POT — Potosí" },
  { value: "TJA", label: "TJA — Tarija" },
  { value: "CHQ", label: "CHQ — Chuquisaca" },
  { value: "BEN", label: "BEN — Beni" },
  { value: "PND", label: "PND — Pando" },
  { value: "EXT", label: "EXT — Extranjero" },
];

export type TipoTramitePersonal =
  | "TITULO_SUPLETORIO"
  | "APOSTILLA"
  | "CERTIFICACION_NOTAS"
  | "CONVALIDACION_DOCUMENTAL";

export interface OpcionTramitePersonal {
  value: TipoTramitePersonal;
  label: string;
  descripcion: string;
}

export const TIPOS_TRAMITE_PERSONAL: OpcionTramitePersonal[] = [
  {
    value: "TITULO_SUPLETORIO",
    label: "Título Supletorio (Extravío o Deterioro)",
    descripcion: "Emisión de cartón oficial supletorio por pérdida del título original.",
  },
  {
    value: "APOSTILLA",
    label: "Apostillamiento Internacional (Cancillería)",
    descripcion: "Legalización bajo Convenio de La Haya o vía consular tradicional.",
  },
  {
    value: "CERTIFICACION_NOTAS",
    label: "Certificación de Calificaciones y Plan de Estudios",
    descripcion: "Autenticación de historial académico y carga horaria universitaria.",
  },
  {
    value: "CONVALIDACION_DOCUMENTAL",
    label: "Convalidación y Acreditación de Título Académico",
    descripcion: "Verificación de autenticidad para ejercicio profesional.",
  },
];

export interface SolicitudPersonalData {
  nombreCompleto: string;
  ci: string;
  ciExtension: DepartamentoBolivia;
  correo: string;
  telefono: string;
  tipoTramite: TipoTramitePersonal;
  carrera: string;
  gestionEgreso: string;
  cartaPdf: File | null;
}

export interface SolicitudInstitucionalData {
  razonSocial: string;
  nit: string;
  numeroOficio: string;
  codigoConvenio: string;
  funcionarioNombre: string;
  funcionarioCargo: string;
  funcionarioCorreo: string;
  funcionarioTelefono: string;
  oficioPdf: File | null;
}

export interface PostulanteNomina {
  ci: string;
  nombre: string;
  carrera: string;
  titulo: string;
  gestion: string;
}

export interface PortalFormData {
  rol: RolTramite;
  personal: SolicitudPersonalData;
  institucional: SolicitudInstitucionalData;
  postulantes: PostulanteNomina[];
}
