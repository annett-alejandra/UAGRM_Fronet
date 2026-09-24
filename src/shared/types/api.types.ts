// ╠╠ Usuario & Auth ╠╠
export interface UsuarioPerfil {
  id: number;
  nombre: string;
  ci: string;
  email: string;
  rol: 'OPERADOR_ARCHIVO_CENTRAL' | 'JEFE_ARCHIVO' | 'SECRETARIO_GENERAL' | 'RECTOR';
}

/ ╠╠ Expedientes & Libros Matrices ╠╠
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

/ ╠╠ OCR ╠╠
export interface OCRProcesarResponse {
  documentoId: string;
  confianzaPromedio: number;
  datosExtraidos: {
    titular?: string;
    ci?: string;
    carrera?: string;
    gestion?: number;
    libro?: string;
    folio?: string;
  };
}


// ╠╠ Trámites ╠╠
export interface TramiteBandejaItem {
  codigoTramite: string;
  solicitanteNombre: string;
  tramiteTipo: string;
  estadoTriaje: string;
  fechaSolicitud: string;
}

/ ╠╠ Storage ╠╠export interface StoragePresignedUrlResponse {
  url: string;
}
