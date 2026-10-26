import type {
  DocumentoConvalidacion,
} from "../types/titulos-gestion.types";

export const documentosConvalidacionMock: DocumentoConvalidacion[] = [
  {
    id: "DOC-001",
    expedienteId: "EXP-001",
    rut: "UAGRM-2026-00152",

    tipoDocumento:
      "TITULO_PROVISION_NACIONAL",

    archivoUrl: "documento-demo-1",

    campos: [
      {
        campo: "nombre",
        etiqueta: "Nombres y Apellidos del Titular",
        valorOCR: "Juan Pablo Montoya Salinas",
        valorBaseDatos: "Juan Pablo Montoya Salinas",
        valorFinal: "Juan Pablo Montoya Salinas",
        coincide: true,
      },
      {
        campo: "ci",
        etiqueta: "Cédula de Identidad (CI)",
        valorOCR: "8192613",
        valorBaseDatos: "8192613",
        valorFinal: "8192613",
        coincide: true,
      },
      {
        campo: "fecha_emision",
        etiqueta: "Fecha de Emisión del Documento",
        valorOCR: "15/08/2026",
        valorBaseDatos: "15/08/2026",
        valorFinal: "15/08/2026",
        coincide: true,
      },
      {
        campo: "numero_titulo",
        etiqueta: "Número de Título / Acta",
        valorOCR: "TPN-2026-01458",
        valorBaseDatos: "TPN-2026-014S8",
        valorFinal: "TPN-2026-01458",
        coincide: false,
      },
      {
        campo: "autoridad",
        etiqueta: "Autoridad Firmante",
        valorOCR: "Dr. Carlos Alberto Ruiz",
        valorBaseDatos: "Dr. Carlos Alberto Ruiz",
        valorFinal: "Dr. Carlos Alberto Ruiz",
        coincide: true,
      },
    ],
  },

  {
    id: "DOC-002",
    expedienteId: "EXP-002",
    rut: "UAGRM-1998-00045",

    tipoDocumento:
      "TITULO_ACADEMICO",

    archivoUrl: "documento-demo-2",

    campos: [
      {
        campo: "nombre",
        etiqueta: "Nombres y Apellidos del Titular",
        valorOCR: "Maria Fernanda Rojas Lopez",
        valorBaseDatos: "María Fernanda Rojas López",
        valorFinal: "Maria Fernanda Rojas Lopez",
        coincide: false,
      },
      {
        campo: "ci",
        etiqueta: "Cédula de Identidad (CI)",
        valorOCR: "7845123",
        valorBaseDatos: "7845123",
        valorFinal: "7845123",
        coincide: true,
      },
      {
        campo: "fecha_emision",
        etiqueta: "Fecha de Emisión del Documento",
        valorOCR: "12/09/1998",
        valorBaseDatos: "12/09/1998",
        valorFinal: "12/09/1998",
        coincide: true,
      },
      {
        campo: "numero_titulo",
        etiqueta: "Número de Título / Acta",
        valorOCR: "TA-1998-0045",
        valorBaseDatos: "TA-1998-0045",
        valorFinal: "TA-1998-0045",
        coincide: true,
      },
      {
        campo: "autoridad",
        etiqueta: "Autoridad Firmante",
        valorOCR: "Lic. Roberto Salvatierra",
        valorBaseDatos: "Lic. Roberto Salvatierra",
        valorFinal: "Lic. Roberto Salvatierra",
        coincide: true,
      },
    ],
  },

  {
    id: "DOC-003",
    expedienteId: "EXP-003",
    rut: "INST-2026-00018-01",

    tipoDocumento:
      "TITULO_PROVISION_NACIONAL",

    archivoUrl: "documento-demo-3",

    campos: [
      {
        campo: "nombre",
        etiqueta: "Nombres y Apellidos del Titular",
        valorOCR: "Carlos Mendoza Pérez",
        valorBaseDatos: "Carlos Mendoza Pérez",
        valorFinal: "Carlos Mendoza Pérez",
        coincide: true,
      },
      {
        campo: "ci",
        etiqueta: "Cédula de Identidad (CI)",
        valorOCR: "6321458",
        valorBaseDatos: "6321458",
        valorFinal: "6321458",
        coincide: true,
      },
      {
        campo: "fecha_emision",
        etiqueta: "Fecha de Emisión del Documento",
        valorOCR: "20/11/2024",
        valorBaseDatos: "20/11/2024",
        valorFinal: "20/11/2024",
        coincide: true,
      },
      {
        campo: "numero_titulo",
        etiqueta: "Número de Título / Acta",
        valorOCR: "TPN-2024-0877",
        valorBaseDatos: "TPN-2024-0877",
        valorFinal: "TPN-2024-0877",
        coincide: true,
      },
      {
        campo: "autoridad",
        etiqueta: "Autoridad Firmante",
        valorOCR: "Dr. Carlos Alberto Ruiz",
        valorBaseDatos: "Dr. Carlos Alberto Ruiz",
        valorFinal: "Dr. Carlos Alberto Ruiz",
        coincide: true,
      },
    ],
  },

  {
    id: "DOC-004",
    expedienteId: "EXP-004",
    rut: "INST-2026-00018-02",

    tipoDocumento:
      "TITULO_ACADEMICO",

    archivoUrl: "documento-demo-4",

    campos: [
      {
        campo: "nombre",
        etiqueta: "Nombres y Apellidos del Titular",
        valorOCR: "Pedro Salvatierra Rojas",
        valorBaseDatos: "Pedro Salvatierra Rojas",
        valorFinal: "Pedro Salvatierra Rojas",
        coincide: true,
      },
      {
        campo: "ci",
        etiqueta: "Cédula de Identidad (CI)",
        valorOCR: "7145896",
        valorBaseDatos: "7145896",
        valorFinal: "7145896",
        coincide: true,
      },
      {
        campo: "fecha_emision",
        etiqueta: "Fecha de Emisión del Documento",
        valorOCR: "07/06/2023",
        valorBaseDatos: "07/06/2023",
        valorFinal: "07/06/2023",
        coincide: true,
      },
      {
        campo: "numero_titulo",
        etiqueta: "Número de Título / Acta",
        valorOCR: "TA-2023-0451",
        valorBaseDatos: "TA-2023-0457",
        valorFinal: "TA-2023-0451",
        coincide: false,
      },
      {
        campo: "autoridad",
        etiqueta: "Autoridad Firmante",
        valorOCR: "Dr. Carlos Alberto Ruiz",
        valorBaseDatos: "Dr. Carlos Alberto Ruiz",
        valorFinal: "Dr. Carlos Alberto Ruiz",
        coincide: true,
      },
    ],
  },

  {
    id: "DOC-005",
    expedienteId: "EXP-005",
    rut: "UAGRM-2026-00201",

    tipoDocumento:
      "DIPLOMA_BACHILLER",

    archivoUrl: "documento-demo-5",

    campos: [
      {
        campo: "nombre",
        etiqueta: "Nombres y Apellidos del Titular",
        valorOCR: "Andrea Vargas Suárez",
        valorBaseDatos: "Andrea Vargas Suárez",
        valorFinal: "Andrea Vargas Suárez",
        coincide: true,
      },
      {
        campo: "ci",
        etiqueta: "Cédula de Identidad (CI)",
        valorOCR: "9345612",
        valorBaseDatos: "9345612",
        valorFinal: "9345612",
        coincide: true,
      },
      {
        campo: "fecha_emision",
        etiqueta: "Fecha de Emisión del Documento",
        valorOCR: "18/02/2026",
        valorBaseDatos: "18/02/2026",
        valorFinal: "18/02/2026",
        coincide: true,
      },
      {
        campo: "numero_titulo",
        etiqueta: "Número de Título / Acta",
        valorOCR: "DB-2026-0201",
        valorBaseDatos: "DB-2026-0201",
        valorFinal: "DB-2026-0201",
        coincide: true,
      },
      {
        campo: "autoridad",
        etiqueta: "Autoridad Firmante",
        valorOCR: "Dr. Carlos Alberto Ruiz",
        valorBaseDatos: "Dr. Carlos Alberto Ruiz",
        valorFinal: "Dr. Carlos Alberto Ruiz",
        coincide: true,
      },
    ],
  },
];