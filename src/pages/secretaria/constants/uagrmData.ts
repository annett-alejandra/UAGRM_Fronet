import type { UsuarioSecretaria } from "../types/secretaria.types";

export interface DepartamentoBolivia {
  value: string;
  label: string;
}

export const DEPARTAMENTOS_BOLIVIA: readonly DepartamentoBolivia[] = [
  { value: "SCZ", label: "Santa Cruz (SCZ)" },
  { value: "LPZ", label: "La Paz (LPZ)" },
  { value: "CBA", label: "Cochabamba (CBA)" },
  { value: "ORU", label: "Oruro (ORU)" },
  { value: "POT", label: "Potosí (POT)" },
  { value: "TJA", label: "Tarija (TJA)" },
  { value: "CHQ", label: "Chuquisaca (CHQ)" },
  { value: "BEN", label: "Beni (BEN)" },
  { value: "PND", label: "Pando (PND)" },
  { value: "EXT", label: "Extranjero (EXT)" },
] as const;

export interface FacultadUAGRM {
  id: string;
  nombre: string;
  carreras: readonly string[];
}

export const FACULTADES_UAGRM: readonly FacultadUAGRM[] = [
  {
    id: "EXACTAS",
    nombre: "Facultad de Ciencias Exactas y Tecnología",
    carreras: [
      "Ingeniería en Sistemas",
      "Ingeniería Informática",
      "Ingeniería en Redes y Telecomunicaciones",
      "Ingeniería Civil",
      "Ingeniería Industrial",
      "Ingeniería Química",
      "Ingeniería Petrolera",
      "Ingeniería Electromecánica",
    ],
  },
  {
    id: "ECONOMICAS",
    nombre: "Facultad de Ciencias Económicas y Financieras",
    carreras: [
      "Ingeniería Comercial",
      "Contaduría Pública",
      "Administración de Empresas",
      "Economía",
      "Comercio Internacional",
      "Finanzas",
    ],
  },
  {
    id: "SALUD",
    nombre: "Facultad de Ciencias de la Salud Humana",
    carreras: [
      "Medicina",
      "Enfermería",
      "Odontología",
      "Farmacia y Bioquímica",
      "Nutrición y Dietética",
    ],
  },
  {
    id: "JURIDICAS",
    nombre: "Facultad de Ciencias Jurídicas, Políticas y Sociales",
    carreras: [
      "Derecho",
      "Relaciones Internacionales",
      "Ciencias Políticas",
      "Trabajo Social",
    ],
  },
  {
    id: "HUMANIDADES",
    nombre: "Facultad de Humanidades",
    carreras: [
      "Ciencias de la Comunicación",
      "Psicología",
      "Sociología",
      "Pedagogía",
      "Filología y Lingüística",
    ],
  },
  {
    id: "VETERINARIA",
    nombre: "Facultad de Ciencias Veterinarias",
    carreras: [
      "Medicina Veterinaria y Zootecnia",
    ],
  },
] as const;

export interface PaisDestino {
  nombre: string;
  convenioLaHaya: boolean;
}

export const PAISES_DESTINO: readonly PaisDestino[] = [
  { nombre: "España", convenioLaHaya: true },
  { nombre: "Estados Unidos", convenioLaHaya: true },
  { nombre: "Argentina", convenioLaHaya: true },
  { nombre: "Chile", convenioLaHaya: true },
  { nombre: "Brasil", convenioLaHaya: true },
  { nombre: "Perú", convenioLaHaya: true },
  { nombre: "Colombia", convenioLaHaya: true },
  { nombre: "México", convenioLaHaya: true },
  { nombre: "Alemania", convenioLaHaya: true },
  { nombre: "Francia", convenioLaHaya: true },
  { nombre: "Italia", convenioLaHaya: true },
  { nombre: "Cuba", convenioLaHaya: false },
  { nombre: "Canadá", convenioLaHaya: true },
  { nombre: "China", convenioLaHaya: true },
  { nombre: "Egipto", convenioLaHaya: false },
  { nombre: "Emiratos Árabes Unidos", convenioLaHaya: false },
  { nombre: "Catar", convenioLaHaya: false },
  { nombre: "Reino Unido", convenioLaHaya: true },
] as const;

export const USUARIO_SECRETARIA_GENERAL: UsuarioSecretaria = {
  id: "SEC-GEN-001",
  nombre_completo: "Dr. Mario Valverde Justiniano",
  cargo: "Secretario General UAGRM",
  email: "secretaria.general@uagrm.edu.bo",
  rol: "SECRETARIA_GENERAL",
};
