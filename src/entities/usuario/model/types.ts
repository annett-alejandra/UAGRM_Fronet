export const enum RolUsuario {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
  CONSULTOR = 'CONSULTOR',
  VERIFICADOR = 'VERIFICADOR',
}

export interface UsuarioEntity {
  readonly id: string;
  readonly email: string;
  readonly nombreCompleto: string;
  readonly ci: string;
  readonly rol: RolUsuario;
  readonly unidadId: string | null;
  readonly unidadNombre: string | null;
  readonly isActive: boolean;
  readonly lastLogin: string | null;
  readonly createdAt: string;
}
