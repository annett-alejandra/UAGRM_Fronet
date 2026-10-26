// src/entities/certificado/model/constants.ts

export const TipoCertificado = {
  TIPO_1_PROV_NACIONAL: "TIPO_1_PROV_NACIONAL",
  TIPO_2_HISTORICO: "TIPO_2_HISTORICO",
  TIPO_3_COPIA_OCR: "TIPO_3_COPIA_OCR",
  TIPO_4_SUPLETORIO_DIPLOMA: "TIPO_4_SUPLETORIO_DIPLOMA",
  TIPO_5_SUPLETORIO_TITULO: "TIPO_5_SUPLETORIO_TITULO",
} as const;

export type TipoCertificadoValue =
  (typeof TipoCertificado)[keyof typeof TipoCertificado];

export const FamiliaDocumento = {
  A_CERTIFICADO: "A_CERTIFICADO",
  B_SUPLETORIO_TITULO: "B_SUPLETORIO_TITULO",
  C_SUPLETORIO_DIPLOMA: "C_SUPLETORIO_DIPLOMA",
} as const;

export type FamiliaDocumentoValue =
  (typeof FamiliaDocumento)[keyof typeof FamiliaDocumento];

export type ConfiguracionTipo = {
  value: TipoCertificadoValue;
  familia: FamiliaDocumentoValue;
  label: string;
  description: string;
  encabezado: string;
  autoridades: string;
  cuerpo: string;
  aclaratoria: string | null;
  cierre: string;
  firmas: string;
  mostrarCertifican: boolean;
  requiereResolucion: boolean;
  camposRequeridos: readonly string[];
  icono: string;
  color: string;
};

export const CONFIGURACION_CERTIFICADOS: Record<
  TipoCertificadoValue,
  ConfiguracionTipo
> = {
  TIPO_1_PROV_NACIONAL: {
    value: "TIPO_1_PROV_NACIONAL",
    familia: "A_CERTIFICADO",
    label: "Título en Provisión Nacional",
    description: "Certifica títulos profesionales emitidos post-2000.",
    encabezado: "certificado",
    autoridades: "estandar",                    // "LA UNIVERSIDAD..."
    cuerpo: "tipo_1",
    aclaratoria: null,
    cierre: "certificado_estandar",             // "Es cuanto certificamos sobre..."
    firmas: "secretario_rector",                // 2 firmas + sello
    mostrarCertifican: true,
    requiereResolucion: false,
    camposRequeridos: [
      "nroInforme",
      "fechaInforme",
      "tituloProfesional",
      "nombreTitular",
      "ciTitular",
      "libro",
      "fojas",
      "fechaEmisionTitulo",
    ],
    icono: "GraduationCap",
    color: "#0B2C5F",
  },

  TIPO_2_HISTORICO: {
    value: "TIPO_2_HISTORICO",
    familia: "A_CERTIFICADO",
    label: "Certificación Histórica",
    description: "Certifica diplomas antiguos con cláusula de época.",
    encabezado: "certificado",
    autoridades: "estandar",
    cuerpo: "tipo_2",
    aclaratoria: "no_pie_firma",                // "Aclarando que en la gestión..."
    cierre: "certificado_estandar",
    firmas: "secretario_rector",
    mostrarCertifican: true,
    requiereResolucion: false,
    camposRequeridos: [
      "nroInforme",
      "fechaInforme",
      "tituloDiploma",
      "nombreTitular",
      "ciTitular",
      "libro",
      "fojas",
      "fechaEmisionTitulo",
      "gestionEpoca",
    ],
    icono: "History",
    color: "#8B5A2B",
  },

  TIPO_3_COPIA_OCR: {
    value: "TIPO_3_COPIA_OCR",
    familia: "A_CERTIFICADO",
    label: "Certificación Histórica Legal",
    description: "Certifica autenticidad con contexto legal y resoluciones.",
    encabezado: "certificado",
    autoridades: "suscritos",                   // ⚠️ AJUSTE REAL DE PDF
    cuerpo: "tipo_3",
    aclaratoria: "resolucion_ceu",              // ⚠️ AJUSTE REAL DE PDF
    cierre: "certificado_solicitud",            // ⚠️ AJUSTE REAL DE PDF
    firmas: "secretario_rector_profesional",    // ⚠️ AJUSTE REAL DE PDF (3 firmas)
    mostrarCertifican: true,
    requiereResolucion: false,
    camposRequeridos: [
      "nroInforme",
      "fechaInforme",
      "tituloDiploma",
      "nombreTitular",
      "ciTitular",
      "libro",
      "fojas",
      "fechaEmisionTitulo",
      "gestionEpoca",
      "rectorEpocaNombre",
      "gestionActual",
      "periodoGestion",
      "nroResolucionCEU",
      "fechaResolucion",
    ],
    icono: "ScanText",
    color: "#2563EB",
  },

  TIPO_4_SUPLETORIO_DIPLOMA: {
    value: "TIPO_4_SUPLETORIO_DIPLOMA",
    familia: "C_SUPLETORIO_DIPLOMA",
    label: "Supletorio de Diploma de Bachiller",
    description: "Emite supletorio del diploma de bachiller por deterioro o pérdida.",
    encabezado: "supletorio_diploma",
    autoridades: "supletorio_rector",           // sin autoridades
    cuerpo: "tipo_4_diploma",
    aclaratoria: null,
    cierre: "supletorio_diploma",               // "queda habilitado para continuar estudios"
    firmas: "solo_rector",                      // 1 firma
    mostrarCertifican: false,
    requiereResolucion: false,
    camposRequeridos: [
      "nroCertificado",
      "ciTitular",
      "lugarNacimiento",
      "nroDiploma",
      "libro",
      "ley",
      "fechaEmisionTitulo",
    ],
    icono: "FileText",
    color: "#059669",
  },

  TIPO_5_SUPLETORIO_TITULO: {
    value: "TIPO_5_SUPLETORIO_TITULO",
    familia: "B_SUPLETORIO_TITULO",
    label: "Supletorio de Título Profesional",
    description: "Emite supletorio del título profesional con foto del titular.",
    encabezado: "supletorio_titulo",
    autoridades: "supletorio_rector",
    cuerpo: "tipo_5_titulo",
    aclaratoria: null,
    cierre: "supletorio_titulo",                // "queda habilitado para el ejercicio"
    firmas: "solo_rector",
    mostrarCertifican: false,
    requiereResolucion: false,
    camposRequeridos: [
      "nroCertificado",
      "nombreTitular",
      "ciTitular",
      "lugarNacimiento",
      "tituloProfesional",
      "nroTitulo",
      "libro",
      "fojas",
      "fechaEmisionTitulo",
    ],
    icono: "Award",
    color: "#DC2626",
  },
};

export const getConfiguracionTipo = (
  tipo: TipoCertificadoValue,
): ConfiguracionTipo => CONFIGURACION_CERTIFICADOS[tipo];

export const getTiposPorFamilia = (
  familia: FamiliaDocumentoValue,
): ConfiguracionTipo[] =>
  Object.values(CONFIGURACION_CERTIFICADOS).filter(
    (c) => c.familia === familia,
  );

export const getLabelFamilia = (familia: FamiliaDocumentoValue): string => {
  const labels: Record<FamiliaDocumentoValue, string> = {
    A_CERTIFICADO: "Certificados de Autenticidad",
    B_SUPLETORIO_TITULO: "Supletorios de Título",
    C_SUPLETORIO_DIPLOMA: "Supletorios de Diploma",
  };
  return labels[familia];
};
