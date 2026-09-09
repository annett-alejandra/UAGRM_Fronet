import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ROLES = {
  ARCHIVO_CENTRAL: 'ARCHIVO_CENTRAL',
  TITULOS: 'TITULOS',
  SECRETARIA_GENERAL: 'SECRETARIA_GENERAL',
} as const;

export type RolInstitucional = typeof ROLES[keyof typeof ROLES];

export interface Usuario {
  readonly id: string;
  readonly nombre_completo: string;
  readonly email: string;
  readonly roles: RolInstitucional[];
  readonly permisos: string[];
}

interface AuthState {
  readonly usuario: Usuario | null;
  readonly isAuthenticated: boolean;
}

interface AuthActions {
  readonly login: (usuario: Usuario) => void;
  readonly logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      usuario: null,
      isAuthenticated: false,

      login: (usuario: Usuario) => {
        set({
          usuario,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          usuario: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export type { Usuario, AuthState };
