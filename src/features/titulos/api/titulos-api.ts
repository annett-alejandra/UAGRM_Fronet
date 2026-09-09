import { restClient } from '../../../shared/api/rest-client';

export interface ExpedienteItemResponse {
  id: string;
  ci: string;
  nombre_estudiante: string;
  numero_titulo: string;
  tipo_titulo: string;
  estado: string;
  fecha_creacion: string;
}

export interface BuscarExpedientesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExpedienteItemResponse[];
}

export interface DossierDocumento {
  documento_id: string;
  tipo_documento: string;
  nombre_archivo: string;
  minio_object_key: string;
  ocr_completado: boolean;
  fecha_subida: string;
}

export interface DossierResponse {
  expediente_id: string;
  estudiante: {
    ci: string;
    nombre_completo: string;
  };
  documentos: DossierDocumento[];
}

export interface PresignedViewUrlResponse {
  url: string;
  expires_in_seconds: number;
}

export interface PlantillaTituloResponse {
  codigo: string;
  nombre: string;
}

export interface GuardarBorradorPayload {
  expediente_id: string;
  tipo_plantilla: string;
  numero_libro: string;
  tomo: string;
  folio: string;
  observaciones: string;
}

export interface GuardarBorradorResponse {
  titulo_id: string;
  estado: string;
  mensaje: string;
}

export interface PresignedUploadUrlPayload {
  filename: string;
  content_type: string;
}

export interface PresignedUploadUrlResponse {
  upload_url: string;
  object_key: string;
}

export interface LibroMatrizPayload {
  numero_libro: number;
  tomo: string;
  gestion: number;
  storage_key: string;
}

export interface LibroMatrizResponse {
  libro_id: string;
  estado: string;
  mensaje: string;
}

export interface EstadoLibroResponse {
  libro_id: string;
  estado: string;
  progreso_porcentaje: number;
  paginas_procesadas: number;
  mensaje: string;
}

export const titulosApi = {
  // 1. Panel de Busqueda Global
  async buscarExpedientes(params: { ci?: string; numero_titulo?: string; nombre?: string; page?: number; page_size?: number }): Promise<BuscarExpedientesResponse> {
    try {
      const query = new URLSearchParams();
      if (params.ci) query.append('ci', params.ci);
      if (params.numero_titulo) query.append('numero_titulo', params.numero_titulo);
      if (params.nombre) query.append('nombre', params.nombre);
      if (params.page) query.append('page', params.page.toString());
      if (params.page_size) query.append('page_size', params.page_size.toString());

      const res = await restClient.get<BuscarExpedientesResponse>(`/api/v1/expedientes/buscar/?${query.toString()}`);
      return res.data;
    } catch {
      // Mock Fallback
      return {
        count: 3,
        next: null,
        previous: null,
        results: [
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e041', ci: '1234567', nombre_estudiante: 'JUAN CARLOS PÉREZ GÓMEZ', numero_titulo: 'TS-2026-0042', tipo_titulo: 'SUPLETORIO', estado: 'VERIFICADO', fecha_creacion: '2026-09-08T14:30:00Z' },
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e042', ci: '7654321', nombre_estudiante: 'MARÍA LÓPEZ MERCADO', numero_titulo: 'TP-2026-0089', tipo_titulo: 'PROPIEDAD', estado: 'EN_TRAMITE', fecha_creacion: '2026-09-07T11:15:00Z' },
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e043', ci: '4567890', nombre_estudiante: 'CARLOS GUTIÉRREZ PAZ', numero_titulo: 'TB-2026-0112', tipo_titulo: 'BIENHECHURIA', estado: 'VERIFICADO', fecha_creacion: '2026-09-05T09:00:00Z' },
        ]
      };
    }
  },

  // 2A. Dossier del Expediente
  async getDossier(expedienteId: string): Promise<DossierResponse> {
    try {
      const res = await restClient.get<DossierResponse>(`/api/v1/expedientes/${expedienteId}/dossier/`);
      return res.data;
    } catch {
      return {
        expediente_id: expedienteId,
        estudiante: { ci: '1234567', nombre_completo: 'JUAN CARLOS PÉREZ GÓMEZ' },
        documentos: [
          { documento_id: 'd102830a-1111', tipo_documento: 'CERTIFICADO_NACIMIENTO', nombre_archivo: 'cert_nacimiento_1234567.pdf', minio_object_key: 'expedientes/1234567/cert_nacimiento.pdf', ocr_completado: true, fecha_subida: '2026-09-08T15:00:00Z' },
          { documento_id: 'd202830a-2222', tipo_documento: 'NOTAS_COLEGIO', nombre_archivo: 'notas_secundaria.pdf', minio_object_key: 'expedientes/1234567/notas_secundaria.pdf', ocr_completado: true, fecha_subida: '2026-09-08T15:05:00Z' },
          { documento_id: 'd302830a-3333', tipo_documento: 'TITULO_BACHILLER', nombre_archivo: 'titulo_bachiller_original.pdf', minio_object_key: 'expedientes/1234567/titulo_bachiller.pdf', ocr_completado: true, fecha_subida: '2026-09-08T15:10:00Z' }
        ]
      };
    }
  },

  // 2B. Presigned View URL
  async getPresignedViewUrl(key: string): Promise<PresignedViewUrlResponse> {
    try {
      const res = await restClient.get<PresignedViewUrlResponse>(`/api/v1/storage/presigned-view-url/?key=${encodeURIComponent(key)}`);
      return res.data;
    } catch {
      return {
        url: `http://localhost:9000/expedientes/${key}?mockToken=123`,
        expires_in_seconds: 900
      };
    }
  },

  // 3A. Listar Plantillas
  async getPlantillas(): Promise<PlantillaTituloResponse[]> {
    try {
      const res = await restClient.get<PlantillaTituloResponse[]>('/api/v1/titulos/plantillas/');
      return res.data;
    } catch {
      return [
        { codigo: 'BIENHECHURIA', nombre: 'Título de Bienhechuría' },
        { codigo: 'PROPIEDAD', nombre: 'Título de Propiedad' },
        { codigo: 'EJIDO', nombre: 'Título de Ejido' },
        { codigo: 'POSESION', nombre: 'Título de Posesión' },
        { codigo: 'SUPLETORIO', nombre: 'Título Supletorio' }
      ];
    }
  },

  // 3B. Guardar Borrador
  async guardarBorrador(payload: GuardarBorradorPayload): Promise<GuardarBorradorResponse> {
    try {
      const res = await restClient.post<GuardarBorradorResponse>('/api/v1/titulos/guardar-borrador/', payload as any);
      return res.data;
    } catch {
      return {
        titulo_id: 't8888888-9999-0000-1111-222233334444',
        estado: 'BORRADOR',
        mensaje: 'Borrador guardado correctamente.'
      };
    }
  },

  // 3C. Generar PDF WeasyPrint (Retorna Blob y abre impresin)
  async generarPdf(tituloId: string): Promise<Blob> {
    try {
      const token = localStorage.getItem('auth-storage');
      const response = await fetch(`http://localhost:8000/api/v1/titulos/${tituloId}/generar-pdf/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/pdf',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (!response.ok) throw new Error('Error al generar PDF');
      return await response.blob();
    } catch {
      // Dummy blob simulation for standalone maquetacion
      const dummyPdfContent = `%PDF-1.4 1 0 obj << /Title (Titulo Supletorio UAGRM) >> endobj`;
      return new Blob([dummyPdfContent], { type: 'application/pdf' });
    }
  },

  // 4A. Presigned Upload URL
  async getPresignedUploadUrl(payload: PresignedUploadUrlPayload): Promise<PresignedUploadUrlResponse> {
    try {
      const res = await restClient.post<PresignedUploadUrlResponse>('/api/v1/storage/presigned-upload-url/', payload as any);
      return res.data;
    } catch {
      return {
        upload_url: `http://localhost:9000/expedientes/libros_matrices/20260909_${payload.filename}`,
        object_key: `libros_matrices/20260909_${payload.filename}`
      };
    }
  },

  // 4B. Registrar Libro Matriz
  async registrarLibroMatriz(payload: LibroMatrizPayload): Promise<LibroMatrizResponse> {
    try {
      const res = await restClient.post<LibroMatrizResponse>('/api/v1/libros-matrices/', payload as any);
      return res.data;
    } catch {
      return {
        libro_id: 'b1112223-3344-5566-7788-9900aabbccdd',
        estado: 'PROCESANDO_OCR',
        mensaje: 'Libro cargado e indexado en cola de Celery.'
      };
    }
  },

  // 4C. Consultar Estado de Libro Matriz
  async getEstadoLibro(libroId: string): Promise<EstadoLibroResponse> {
    try {
      const res = await restClient.get<EstadoLibroResponse>(`/api/v1/libros-matrices/${libroId}/estado/`);
      return res.data;
    } catch {
      return {
        libro_id: libroId,
        estado: 'INDEXADO',
        progreso_porcentaje: 100,
        paginas_procesadas: 85,
        mensaje: 'Libro cargado e indexado correctamente en el Gemelo Digital.'
      };
    }
  }
};
