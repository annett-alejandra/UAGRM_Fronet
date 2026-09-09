export interface InstitutionEntity {
  readonly id: string;
  readonly nombre: string;
  readonly sigla: string;
  readonly descripcion: string | null;
  readonly isActive: boolean;
  readonly createdAt: string;
}

export interface DepartamentoEntity {
  readonly id: string;
  readonly nombre: string;
  readonly sigla: string;
  readonly institutionId: string;
  readonly parentId: string | null;
  readonly nivel: number;
  readonly isActive: boolean;
  readonly createdAt: string;
}

export interface CuotaEntity {
  readonly id: string;
  readonly unidadId: string;
  readonly unidadNombre: string;
  readonly cuotaMaxGb: number;
  readonly usadoGb: number;
  readonly porcentajeUso: number;
  readonly archivosCount: number;
}

export interface RepositorioLogicoEntity {
  readonly id: string;
  readonly nombre: string;
  readonly bucket: string;
  readonly prefix: string;
  readonly unidadId: string;
  readonly createdAt: string;
}
