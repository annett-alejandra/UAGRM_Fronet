import type {
  LoteInstitucional,
  SolicitudTitulo,
} from "../types/titulos-gestion.types";

export const solicitudesTitulosMock: SolicitudTitulo[] = [
  {
    id: "SOL-001",
    ci: "8192613",
    nombreCompleto: "Juan Pablo Montoya Salinas",
    carrera: "Ingeniería Informática",
    gestionEmision: 2026,
    origen: "INDIVIDUAL",
    estado: "PENDIENTE",
  },
  {
    id: "SOL-002",
    ci: "7845123",
    nombreCompleto: "María Fernanda Rojas López",
    carrera: "Derecho",
    gestionEmision: 2025,
    origen: "INSTITUCIONAL",
    institucion: "Fiscalía Departamental",
    estado: "EN_PROCESO",
  },
  {
    id: "SOL-003",
    ci: "6321458",
    nombreCompleto: "Carlos Mendoza Pérez",
    carrera: "Ingeniería Comercial",
    gestionEmision: 2024,
    origen: "INSTITUCIONAL",
    institucion: "Gobernación",
    estado: "CONVALIDADO",
  },
  {
    id: "SOL-004",
    ci: "9345612",
    nombreCompleto: "Andrea Vargas Suárez",
    carrera: "Contaduría Pública",
    gestionEmision: 2026,
    origen: "INDIVIDUAL",
    estado: "OBSERVADO",
  },
  {
    id: "SOL-005",
    ci: "7145896",
    nombreCompleto: "Pedro Salvatierra Rojas",
    carrera: "Derecho",
    gestionEmision: 2023,
    origen: "INSTITUCIONAL",
    institucion: "Órgano Judicial",
    estado: "PENDIENTE",
  },
];

export const lotesInstitucionalesMock: LoteInstitucional[] = [
  {
    id: "LOTE-012",
    nombre: "Fiscalía Departamental - Lote 12",
    institucion: "Fiscalía Departamental",
    fecha: "2026-10-03",
    total: 200,
    procesados: 170,
    estado: "EN_PROCESO",

    integrantes: [
      {
        id: "INT-001",
        ci: "7845123",
        nombreCompleto: "María Fernanda Rojas López",
        carrera: "Derecho",
        estado: "CONVALIDADO",
      },
      {
        id: "INT-002",
        ci: "7456321",
        nombreCompleto: "José Luis Vargas Pérez",
        carrera: "Derecho",
        estado: "CONVALIDADO",
      },
      {
        id: "INT-003",
        ci: "8231456",
        nombreCompleto: "Daniela Suárez Mendoza",
        carrera: "Derecho",
        estado: "EN_PROCESO",
      },
      {
        id: "INT-004",
        ci: "9654123",
        nombreCompleto: "Carlos Flores Rojas",
        carrera: "Derecho",
        estado: "OBSERVADO",
      },
    ],
  },

  {
    id: "LOTE-008",
    nombre: "Gobernación - Lote 08",
    institucion: "Gobernación",
    fecha: "2026-10-01",
    total: 80,
    procesados: 80,
    estado: "COMPLETADO",

    integrantes: [
      {
        id: "INT-005",
        ci: "6321458",
        nombreCompleto: "Carlos Mendoza Pérez",
        carrera: "Ingeniería Comercial",
        estado: "CONVALIDADO",
      },
      {
        id: "INT-006",
        ci: "7456982",
        nombreCompleto: "Andrea Salazar Ruiz",
        carrera: "Administración de Empresas",
        estado: "CONVALIDADO",
      },
      {
        id: "INT-007",
        ci: "8123654",
        nombreCompleto: "Luis Fernando Vargas",
        carrera: "Economía",
        estado: "CONVALIDADO",
      },
    ],
  },

  {
    id: "LOTE-004",
    nombre: "Órgano Judicial - Lote 04",
    institucion: "Órgano Judicial",
    fecha: "2026-09-28",
    total: 120,
    procesados: 54,
    estado: "EN_PROCESO",

    integrantes: [
      {
        id: "INT-008",
        ci: "7145896",
        nombreCompleto: "Pedro Salvatierra Rojas",
        carrera: "Derecho",
        estado: "EN_PROCESO",
      },
      {
        id: "INT-009",
        ci: "8965412",
        nombreCompleto: "Mariana López Vargas",
        carrera: "Derecho",
        estado: "PENDIENTE",
      },
      {
        id: "INT-010",
        ci: "7123984",
        nombreCompleto: "Fernando Ruiz Chávez",
        carrera: "Derecho",
        estado: "OBSERVADO",
      },
    ],
  },
];