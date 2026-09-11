import { PuntoRedireccion } from "../../nucleo/service/organizaciones.service";

export interface SharedNavbarMenuItem {
  nombre: string;
  ruta: string;
  descripcion?: string | null;
  icono?: string | null;
  submenu: SharedNavbarMenuItem[];
}

export interface SharedNavbarTexts {
  primera: string;
  resto: string;
}

export interface SharedRedSocial {
  tipo: string;
  url: string;
  svgPath?: string;
}

export type EstadoCargaNavbar = 'cached' | 'loading' | 'slow' | 'error' | 'success';

export interface SharedNavbarData {
  menuItems: SharedNavbarMenuItem[];
  escudoOrg: string | null;
  nombreOrg: SharedNavbarTexts;
  abreviatura: string | null;
  escudoSistema: string | null;
  nombreSistema: SharedNavbarTexts;
  redesSociales: SharedRedSocial[];
  puntosRedireccion: PuntoRedireccion[];
  mostrarNombreVisual: boolean;
  isScrolled: boolean;
  isScrollingDown: boolean;
  isInSubsection: boolean;
  prefijoRutaOrg: string;
  
  // Nuevos estados SWR
  cargandoMenu: boolean;
  estadoCarga: EstadoCargaNavbar;
  esModoOffline: boolean;
  fechaCache?: number | null;
  reintentarCarga: () => void;

  onDropdownChange?: (abierto: boolean) => void;
}
