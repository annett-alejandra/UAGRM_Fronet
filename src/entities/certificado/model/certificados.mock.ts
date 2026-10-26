// src/shared/mock/certificados.mock.ts
import type { Certificado, InformeAutenticidad } from "@entities/certificado";

export const MOCK_INFORME: InformeAutenticidad = {
  id: "info-001",
  tramiteId: "tram-001",
  nroInforme: "SECCION ARCHIVO/INF. N° 472",
  fechaDocumento: "2026-04-20T10:00:00Z",
  jefeArchivoId: "aut-001",
  jefeArchivoNombre: "Moises Cossío López",
  secretarioDestinoId: "aut-002",
  secretarioDestinoNombre: "MSc. Edy Acosta Claros",
  cuerpoInforme:
    "En respuesta a solicitud del interesado presentada el 16 de abril del 2026...",
  tablaDatos: {
    nro_documento: "019741",
    nombre: "Lynne Denise Pérez Revilla",
    ci: "4716343 SCZ",
    tipo: "Bachiller en Humanidades",
    fojas: "181",
    libro: "026/99",
    fecha_extension: "5 de marzo de 1999",
    rector_epoca: "Jorge Orellana Moreno",
    pie_firma: "No tiene",
  },
  aclaratoria:
    "Aclarando que, en la gestión del 1999 no se estilaba colocar pie de firma de las autoridades.",
  vistoBuenoJefatura: true,
  estado: "APROBADO",
  documentoMinioKey: "informes/472.pdf",
};

export const MOCK_CERTIFICADO: Certificado = {
  id: "cert-001",
  informeId: "info-001",
  nroCertificado: "749/2026",
  tipo: "TIPO_2_HISTORICO",
  familia: "A_CERTIFICADO",
  fechaEmision: "2026-04-22T10:00:00Z",
  hashQrUnico: "a7f8c9b2e1d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
  pdfMinioKey: "certificados/749-2026.pdf",
  estado: "EMITIDO",
  rectorNombre: "Dr. Reinerio Vargas Banegas",
  secretarioNombre: "Lic. Edy Acosta Claros",
};

export const getDatosInicialesDesdeInforme = (
  informe: InformeAutenticidad,
): Record<string, string> => {
  const t = informe.tablaDatos;
  return {
    nroInforme: informe.nroInforme,
    fechaInforme: informe.fechaDocumento.split("T")[0] || informe.fechaDocumento,
    nombreTitular: t.nombre ?? "",
    ciTitular: t.ci ?? "",
    libro: t.libro ?? "",
    fojas: t.fojas ?? "",
    fechaEmisionTitulo: t.fecha_extension ?? "",
    tituloDiploma: t.tipo ?? "",
    gestionEpoca: t.fecha_extension?.match(/\d{4}/)?.[0] ?? "",
  };
};
