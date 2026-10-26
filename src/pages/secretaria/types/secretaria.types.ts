/**
 * Contratos e Interfaces TypeScript Estrictas
 * Módulo: Secretaría General y Despacho Legal (Dev 2 - UAGRM)
 */

export type TipoSolicitud = "Personal" | "Institución";
export type EstadoSolicitud = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export interface DocumentoAdjunto {
  nombre: string;
  tipo: string;
  paginas: number;
  titulo: string;
  contenidoTexto: string;
  selloFisico: string;
}

export interface SolicitudAdmision {
  id: string;
  fechaHora: string;
  tipo: TipoSolicitud;
  solicitanteEntidad: string;
  ci: string;
  documentoAdjunto: DocumentoAdjunto;
  estado: EstadoSolicitud;
  observacion: string | null;
}

export interface InformeTecnico {
  libroMatriz: string;
  foja: string;
  resolucionRectoral: string;
  fechaConvalidacion: string;
  dictamen: string;
}

export type EstadoApostilla = "LISTO_PARA_APOSTILLA" | "CERTIFICADO_GENERADO";

export interface CertificacionApostilla {
  id: string;
  numeroTituloProvisionNacional: string;
  graduado: string;
  ci: string;
  facultad: string;
  carrera: string;
  gestionEgreso: number;
  informeTecnico: InformeTecnico;
  estadoApostilla: EstadoApostilla;
  paisDestino: string | null;
  regimen: string | null;
  fechaCertificacion: string | null;
}

export type EstadoCustodia = "EN_CUSTODIA" | "IMPRESO_SELLADO";

export interface CartonDespacho {
  id: string;
  graduado: string;
  carrera: string;
  facultad: string;
  tipoCarton: string;
  seriePapel: string;
  estado: EstadoCustodia;
  resolucionEmision: string;
  fechaAprobacion: string;
}

export interface FuncionarioAutorizado {
  nombreCompleto: string;
  ci: string;
  expedido: string;
  cargo: string;
  correo: string;
}

export type EstadoConvenio = "VIGENTE" | "EXPIRADO";

export interface ConvenioInstitucional {
  id: string;
  razonSocial: string;
  numeroConvenio: string;
  fechaInicio: string;
  fechaFin: string;
  funcionario: FuncionarioAutorizado;
  codigoSecreto: string;
  estado: EstadoConvenio;
}

export interface UsuarioSecretaria {
  id: string;
  nombre_completo?: string;
  nombre?: string;
  cargo: string;
  email?: string;
  rol: "SECRETARIA_GENERAL" | "SECRETARIO_GENERAL" | string;
}

export interface AuditoriaDespacho {
  id: string;
  fechaHora: string;
  ipTerminal: string;
  usuarioLogueado: UsuarioSecretaria;
  documentoId: string;
  seriePapel: string;
  tipoCarton?: string;
  graduado?: string;
}

export type TipoToast = "success" | "error" | "destructive" | "warning" | "info";

export interface ToastItem {
  id: string;
  tipo: TipoToast;
  mensaje: string;
}

export interface SecretariaContextType {
  solicitudes: SolicitudAdmision[];
  apostillas: CertificacionApostilla[];
  cartones: CartonDespacho[];
  convenios: ConvenioInstitucional[];
  auditorias: AuditoriaDespacho[];
  aprobarSolicitud: (id: string) => void;
  rechazarSolicitud: (id: string, observacion: string) => boolean;
  generarCertificacionApostilla: (id: string, paisDestino: string, regimen: string) => void;
  registrarDesbloqueoImpresion: (carton: CartonDespacho) => AuditoriaDespacho;
  crearConvenio: (nuevo: Omit<ConvenioInstitucional, "id" | "estado">) => ConvenioInstitucional;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  addToast: (tipo: TipoToast, mensaje: string) => void;
}
