/**
 * Capa de Servicios Unificada - UAGRM API Client
 * Centraliza clientes HTTP, APIs por dominio y subida a MinIO
 */

export { restClient, RestClientError } from './rest-client';
export type { RestResponse, RestRequestOptions } from './rest-client';

export {
  authApi,
  ocrApi,
  expedientesApi,
  solicitudesApi,
  pagosApi,
  storageApi,
} from './uagrm-api-service';
