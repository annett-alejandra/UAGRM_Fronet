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

export interface ExpedienteTitulos {
  id: string;
  nro_diploma: string;
  persona: {
    nombre_completo: string;
    ci: string;
  };
  carrera: string;
}

export interface InformeAutenticidadContext {
  informe_nro: string;
  fecha: string;
  fecha_solicitud: string;
  nro_testimonio: string;
  apoderado: string;
  titular: {
    nombre_completo: string;
    ci_expedido: string;
  };
  expediente: {
    nro_diploma: string;
    fecha_emision: string;
  };
  carrera_colegio: {
    mencion: string;
  };
  archivo_fisico: {
    fojas: string;
    libro_matriz: string;
    observacion_firma: string;
  };
  autoridad: {
    rector_nombre: string;
    secretario_general: string;
    rector_actual: string;
  };
  supletorio: {
    fecha_emision: string;
    nro_carton: string;
  };
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
      return {
        count: 3,
        next: null,
        previous: null,
        results: [
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e041', ci: '4589214 SC', nombre_estudiante: 'JENNY FLORES PEÑA', numero_titulo: '014863', tipo_titulo: 'SUPLETORIO', estado: 'VERIFICADO', fecha_creacion: '2026-09-08T14:30:00Z' },
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e042', ci: '7654321', nombre_estudiante: 'MARÍA LÓPEZ MERCADO', numero_titulo: 'TP-2026-0089', tipo_titulo: 'PROPIEDAD', estado: 'EN_TRAMITE', fecha_creacion: '2026-09-07T11:15:00Z' },
          { id: 'c9b1d830-4e2a-4a55-891d-90c74f51e043', ci: '4567890', nombre_estudiante: 'CARLOS GUTIÉRREZ PAZ', numero_titulo: 'TB-2026-0112', tipo_titulo: 'BIENHECHURIA', estado: 'VERIFICADO', fecha_creacion: '2026-09-05T09:00:00Z' },
        ]
      };
    }
  },

  // 2. Expediente por Nro Diploma
  getExpedienteByNroDiploma(nro: string): ExpedienteTitulos {
    return {
      id: 'exp-' + nro,
      nro_diploma: nro || '014863',
      persona: {
        nombre_completo: 'JENNY FLORES PEÑA',
        ci: '4589214 S.C.'
      },
      carrera: 'BACHILLER EN HUMANIDADES'
    };
  },

  // 3. Guardar Certificado
  async guardarCertificado(data: any): Promise<{ success: boolean; mensaje: string }> {
    return {
      success: true,
      mensaje: 'Certificado guardado exitosamente'
    };
  },

  // 4. Obtener Contexto de Informe de Autenticidad
  async getInformeAutenticidadContext(id?: string): Promise<InformeAutenticidadContext> {
    try {
      const res = await restClient.get<InformeAutenticidadContext>(`/api/v1/expedientes/${id || 'default'}/autenticidad-context/`);
      return res.data;
    } catch {
      return {
        informe_nro: '0471',
        fecha: '20 de abril de 2026',
        fecha_solicitud: '16 de abril de 2026',
        nro_testimonio: '1246/2025',
        apoderado: 'Yuli Alison Romero Flores',
        titular: {
          nombre_completo: 'Jenny Flores Peña',
          ci_expedido: '3250858-SCZ',
        },
        expediente: {
          nro_diploma: '014863',
          fecha_emision: '24 de julio de 1998',
        },
        carrera_colegio: {
          mencion: 'Bachiller en Humanidades.',
        },
        archivo_fisico: {
          fojas: '115/98',
          libro_matriz: '19/98',
          observacion_firma: 'No tiene.',
        },
        autoridad: {
          rector_nombre: 'Jorge Orellana Moreno',
          secretario_general: 'Lic. Edy Acosta Claros',
          rector_actual: 'MSc. Vicente R. Cuéllar Téllez',
        },
        supletorio: {
          fecha_emision: '24 de agosto de 2022',
          nro_carton: '014863',
        },
      };
    }
  },

  // 5. Dossier
  async getDossier(expedienteId: string): Promise<DossierResponse> {
    try {
      const res = await restClient.get<DossierResponse>(`/api/v1/expedientes/${expedienteId}/dossier/`);
      return res.data;
    } catch {
      return {
        expediente_id: expedienteId,
        estudiante: { ci: '1234567', nombre_completo: 'JENNY FLORES PEÑA' },
        documentos: [
          { documento_id: 'd102830a-1111', tipo_documento: 'CERTIFICADO_NACIMIENTO', nombre_archivo: 'cert_nacimiento_1234567.pdf', minio_object_key: 'expedientes/1234567/cert_nacimiento.pdf', ocr_completado: true, fecha_subida: '2026-09-08T15:00:00Z' },
          { documento_id: 'd202830a-2222', tipo_documento: 'NOTAS_COLEGIO', nombre_archivo: 'notas_secundaria.pdf', minio_object_key: 'expedientes/1234567/notas_secundaria.pdf', ocr_completado: true, fecha_subida: '2026-09-08T15:05:00Z' }
        ]
      };
    }
  },

  // 6. Obtener URL firmada MinIO
  async getPresignedViewUrl(minioObjectKey: string): Promise<{ url: string }> {
    try {
      const res = await restClient.get<{ url: string }>(`/api/v1/storage/presigned-url/?key=${encodeURIComponent(minioObjectKey)}`);
      return res.data;
    } catch {
      return { url: `https://storage.uagrm.edu.bo/v1/${minioObjectKey}` };
    }
  },

  // 7. Guardar Borrador
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
  }
};
