import { type TipoTitulo } from '../../tramite/model/types';

export interface TituloEntity {
  readonly id: string;
  readonly tipo: TipoTitulo;
  readonly numero: string;
  readonly nombreCompleto: string;
  readonly ci: string;
  readonly carrera: string;
  readonly facultad: string;
  readonly fechaEmision: string;
  readonly fechaRegistro: string;
  readonly esDigitalizado: boolean;
  readonly documentoId: string | null;
  readonly tramiteId: string | null;
  readonly observaciones: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
