import { restClient } from './rest-client';
import type {
  UsuarioPerfil,
  SSOLoginResponse,
  OCRProcesarResponse,
  OCRValidarConsolidarResponse,
  ExpedientesSearchResponse,
  InformixSearchResponse,
  DossierDigitalResponse,
  SolicitudesListResponse,
  DerivarSolicitudRequest,
  DerivarSolicitudResponse,
  CrearLoteRequest,
  CrearLoteResponse,
  GenerarQRPagoResponse,
  VerificarEstadoPagoResponse,
  PresignedUrlResponse,
} from '../../types/api';

// 1. Autenticación & SSO (/api/v1/auth/)
export const authApi = {
  getPerfil: () => restClient.get<UsuarioPerfil>('/v1/auth/me/'),
  getSSOLoginUrl: () => restClient.get<SSOLoginResponse>('/v1/auth/sso/login/'),
};

// 2. Motor OCR Asistido (/api/ocr/)
export const ocrApi = {
  procesarDocumento: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return restClient.post<OCRProcesarResponse>('/ocr/procesar', formData as any);
  },
  validarYConsolidar: (documentoId: string, datosValidados: Record<string, unknown>) =>
    restClient.post<OCRValidarConsolidarResponse>('/v1/ocr/validar-consolidar/', { documentoId, datosValidados }),
};

// 3. Archivo Central & Búsqueda de Expedientes
export const expedientesApi = {
  buscarExpedientes: (q: string, carrera = '', gestion = '', page = 1) =>
    restClient.get<ExpedientesSearchResponse>(
      `/v1/expedientes/buscar/?q=${encodeURIComponent(q)}&carrera=${encodeURIComponent(carrera)}&gestion=${encodeURIComponent(gestion)}&page=${page}`
    ),

  buscarInformix: (criterio: string, query: string) =>
    restClient.get<InformixSearchResponse>(
      `/informix/buscar?criterio=${encodeURIComponent(criterio)}&query=${encodeURIComponent(query)}`
    ),

  getDossier: (expedienteId: string) =>
    restClient.get<DossierDigitalResponse>(`/v1/expedientes/${expedienteId}/dossier/`),
};

// 4. Gestión de Trámites & Derivaciones (/api/solicitudes/)
export const solicitudesApi = {
  getBandeja: (origen = '', estado = '') =>
    restClient.get<SolicitudesListResponse>(
      `/solicitudes/?origen=${encodeURIComponent(origen)}&estado=${encodeURIComponent(estado)}`
    ),

  derivarSolicitud: (data: DerivarSolicitudRequest) =>
    restClient.post<DerivarSolicitudResponse>('/solicitudes/derivar', data as any),

  crearLote: (data: CrearLoteRequest) =>
    restClient.post<CrearLoteResponse>('/lotes/', data as any),
};

// 5. Pagos QR Gaby (/api/pagos/)
export const pagosApi = {
  generarQR: (monto: number, concepto: string) =>
    restClient.post<GenerarQRPagoResponse>('/pagos/generar-qr', { monto, concepto }),

  verificarEstado: (pagoId: string) =>
    restClient.get<VerificarEstadoPagoResponse>(`/pagos/verificar-estado/${encodeURIComponent(pagoId)}`),
};

// 6. Almacenamiento & MinIO (/api/v1/storage/)
export const storageApi = {
  getPresignedUrl: (key: string) =>
    restClient.get<PresignedUrlResponse>(`/v1/storage/presigned-url/?key=${encodeURIComponent(key)}`),
};
