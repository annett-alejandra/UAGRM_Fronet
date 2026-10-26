import type {
  EntradaArchivo,
} from "../types/titulos-gestion.types";

export const bandejaArchivoMock: EntradaArchivo[] = [
  {
    id: "EXP-001",
    rut: "UAGRM-2026-00152",
    ci: "8192613",
    nombreCompleto:
      "Juan Pablo Montoya Salinas",
    tipoDocumento:
      "Título en Provisión Nacional",
    gestionEmision: 2026,
    fechaIngreso: "2026-10-05",
    origen: "INDIVIDUAL",
    estado: "PENDIENTE",
  },

  {
    id: "EXP-002",
    rut: "UAGRM-1998-00045",
    ci: "7845123",
    nombreCompleto:
      "María Fernanda Rojas López",
    tipoDocumento:
      "Título Académico",
    gestionEmision: 1998,
    fechaIngreso: "2026-10-04",
    origen: "INDIVIDUAL",
    estado: "PRIORITARIO",
  },

  {
    id: "EXP-003",
    rut: "INST-2026-00018-01",
    ci: "6321458",
    nombreCompleto:
      "Carlos Mendoza Pérez",
    tipoDocumento:
      "Título en Provisión Nacional",
    gestionEmision: 2024,
    fechaIngreso: "2026-10-03",
    origen: "INSTITUCIONAL",
    institucion: "Gobernación",
    estado: "EN_REVISION",
  },

  {
    id: "EXP-004",
    rut: "INST-2026-00018-02",
    ci: "7145896",
    nombreCompleto:
      "Pedro Salvatierra Rojas",
    tipoDocumento:
      "Título Académico",
    gestionEmision: 2023,
    fechaIngreso: "2026-10-03",
    origen: "INSTITUCIONAL",
    institucion:
      "Órgano Judicial",
    estado: "PENDIENTE",
  },

  {
    id: "EXP-005",
    rut: "UAGRM-2026-00201",
    ci: "9345612",
    nombreCompleto:
      "Andrea Vargas Suárez",
    tipoDocumento:
      "Diploma de Bachiller",
    gestionEmision: 2026,
    fechaIngreso: "2026-10-02",
    origen: "INDIVIDUAL",
    estado: "EN_REVISION",
  },
];