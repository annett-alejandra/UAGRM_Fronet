// Especificación Oficial de Contratos API REST v2.0.0 — UAGRM Certificaciones
// Conforme a Arquitectura Empresarial FSD en Obsidian

// 1. Auth & SSO
export interface UsuarioPerfil {
  id: number;
  username?: string;
  full_name?: string;
  nombre?: string;
  ci?: string;
  email?: string;
  roles?: string[];
  rol?: 'OPERADOR_ARCHIVO_CENTRAL' | 'JEFE_ARCHIVO' | 'SECRETARIO_GENERAL' | 'RECTOR' | 'TITULOS_OPERADOR' | string;
  unidad?: string;
  is_authenticated?: boolean;
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
  documentoId?: string;
  datosValidados?: Record<string, unknown>;
  texto_extraido?: string;
}

export interface OCRValidarConsolidarResponse {
  status?: string;
  message?: string;
  cumple_4_requisitos?: boolean;
  tiene_ci?: boolean;
  tiene_titulo_anverso?: boolean;
  tiene_titulo_reverso?: boolean;
  tiene_comprobante_pago?: boolean;
  elementos_faltantes?: string[];
}

// 3. Expedientes, Libros Matrices & Búsqueda Secuencial (Archivo Central)
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

export interface TramiteBandejaItem {
  codigoTramite: string;
  solicitanteNombre: string;
  tramiteTipo: string;
  estadoTriaje: string;
  fechaSolicitud: string;
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
  entidad?: string;
  personas?: PersonaLote[];
  institucion_nombre?: string;
  oficio_referencia?: string;
}

export interface CrearLoteResponse {
  status?: string;
  codigoLote?: string;
  entidad?: string;
  totalRegistrados?: number;
  mensaje?: string;
}

// 5. Pagos QR Gaby
export interface GenerarQRPagoRequest {
  ci?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  monto?: number;
  concepto?: string;
}

export interface GenerarQRPagoResponse {
  ticket?: string;
  monto: number;
  concepto: string;
  qr_simulado?: string;
  qrBase64?: string;
  estado: string;
  status?: string;
  pagoId?: string;
  moneda?: string;
  expiracionSegundos?: number;
}

export interface VerificarEstadoPagoResponse {
  pagoId: string;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'EXPIRADO' | string;
  monto: number;
  moneda: string;
  confirmado: boolean;
  fechaTransaccion: string;
}

// 6. Storage & MinIO S3
export interface PresignedUrlResponse {
  url: string;
  object_key?: string;
}

export interface StoragePresignedUrlResponse {
  url: string;
  object_key?: string;
}
