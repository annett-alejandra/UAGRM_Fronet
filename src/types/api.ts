// Especificación de Contrato API REST v2.0.0 — UAGRM Certificaciones

// 1. Auth & SSO
export interface UsuarioPerfil {
  id: number;
  nombre: string;
  ci: string;
  email: string;
  rol: 'OPERADOR_ARCHIVO_CENTRAL' | 'JEFE_ARCHIVO' | 'SECRETARIO_GENERAL' | 'RECTOR' | 'TITULOS_OPERADOR';
}

export interface SSOLoginResponse {
  status: string;
  ssoUrl: string;
}

// 2. Motor OCR
export interface CoordenadaTexto {
  texto: string;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  tamLetraEstimado: number;
  color: string;
  esNegrita: boolean;
  confianza: number;
}

export interface DatosExtraidosOCR {
  titular?: string;
  nombreCompleto?: string;
  estudiante?: string;
  ci?: string;
  ru?: string;
  carrera?: string;
  grado?: string;
  gestion?: number;
  libro?: string;
  folio?: string;
  rector?: string;
  nroDiploma?: string;
  fechaEmision?: string;
  textoRaw?: string;
}

export interface OCRProcesarResponse {
  documentoId: string;
  confianzaPromedio: number;
  tipoClave: string;
  tipoNombre: string;
  datosExtraidos: DatosExtraidosOCR;
  coordenadasTexto?: CoordenadaTexto[];
}

export interface OCRValidarConsolidarRequest {
  documentoId: string;
  datosValidados: Record<string, unknown>;
}

export interface OCRValidarConsolidarResponse {
  status: string;
  message: string;
}

// 3. Expedientes & Informix
export interface ExpedienteSearchResult {
  id: string;
  titularNombre: string;
  ci: string;
  carrera: string;
  gestionEmision: number;
  libroMatriz: string;
  folio: string;
  estado: string;
  minioObjectKey: string;
}

export interface ExpedientesSearchResponse {
  total: number;
  page: number;
  results: ExpedienteSearchResult[];
}

export interface InformixSearchResult {
  cui: string;
  nombre: string;
  num_titulo: string;
  carrera: string;
  gestion: number;
  libro: string;
  folio: string;
  estado: string;
  minioObjectKey: string;
}

export interface InformixSearchResponse {
  status: string;
  criterio: string;
  total: number;
  data: InformixSearchResult[];
}

export interface DocumentoDossier {
  id: string;
  nombre: string;
  tipo: string;
  minioKey: string;
  fechaSubida: string;
}

export interface DossierDigitalResponse {
  expedienteId: string;
  titular: string;
  documentos: DocumentoDossier[];
}

// 4. Gestión de Trámites & Derivaciones
export interface SolicitudItem {
  id: number;
  codigoSolicitud: string;
  origen: string;
  estudianteCi: string;
  estudianteNombre: string;
  tipoTramite: string;
  estado: 'PENDIENTE' | 'EN_REVISION' | 'COMPLETADO';
  fechaSolicitud: string;
}

export interface SolicitudesListResponse {
  total: number;
  data: SolicitudItem[];
}

export interface DerivarSolicitudRequest {
  solicitudId: string;
  origen: string;
  destino: string;
  observacion: string;
}

export interface DerivarSolicitudResponse {
  status: string;
  message: string;
  fechaDerivacion: string;
  observacion: string;
}

export interface PersonaLote {
  ci: string;
  nombre: string;
}

export interface CrearLoteRequest {
  entidad: string;
  personas: PersonaLote[];
}

export interface CrearLoteResponse {
  status: string;
  codigoLote: string;
  entidad: string;
  totalRegistrados: number;
  mensaje: string;
}

// 5. Pagos QR Gaby
export interface GenerarQRPagoRequest {
  monto: number;
  concepto: string;
}

export interface GenerarQRPagoResponse {
  status: string;
  pagoId: string;
  monto: number;
  moneda: string;
  concepto: string;
  qrBase64: string;
  expiracionSegundos: number;
}

export interface VerificarEstadoPagoResponse {
  pagoId: string;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'EXPIRADO';
  monto: number;
  moneda: string;
  confirmado: boolean;
  fechaTransaccion: string;
}

// 6. Storage & MinIO
export interface PresignedUrlResponse {
  url: string;
}
