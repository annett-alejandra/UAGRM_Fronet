// src/shared/types/plantillas.types.ts
/**
 * Modelos de datos y tipos para el Motor de Plantillas Documentales
 * Módulo de Títulos y Archivo Central — UAGRM (DEV 1)
 * Basado en la especificación de Docs/ExtraPdfs.md (13 folios oficiales)
 */

export type CategoriaDocumento = 'CERTIFICADOS' | 'SUPLETORIOS' | 'INFORMES';

export type SubtipoCertificado = 
  | 'TIPO_1'     // Simple: Certificación directa (Pág. 4)
  | 'TIPO_2'     // Con aclaratoria histórica <= 1999 de pie de firma (Pág. 5)
  | 'TIPO_3'     // Con supletorio previo (Pág. 2)
  | 'TIPO_4_A'   // Con legitimación Rector y Resolución C.E.U. (Pág. 6)
  | 'TIPO_4_5_B';// Con supletorio y rectificación/enmienda en reverso (Pág. 8)

export type SubtipoSupletorio = 
  | 'BACHILLER'           // Anverso: Bachiller en Humanidades (Art. 186 CPE - Pág. 10)
  | 'PROVISION_NACIONAL'; // Anverso: Título en Provisión Nacional (Art. 92 CPE - Pág. 12)

export type SubtipoProvidencia = 
  | 'RECTIFICACION_NOMBRE'  // Reverso: Supresión o corrección de nombre SERECI (Pág. 11)
  | 'COMPLEMENTACION_SEGIP';// Reverso: Complementación alfanumérica SEGIP ej. "1G" (Pág. 13)

/**
 * SECCIÓN A: Datos dinámicos para Certificados de Autenticidad (Tipos 1 al 5)
 */
export interface DatosCertificadoAutenticidad {
  id: string;
  subtipo: SubtipoCertificado;
  nroCertificado: string;           // ej. "117/2026", "749/2026"
  nroInformeArchivo: string;        // ej. "N°094", "N°472", "N°. 508"
  fechaInformeArchivo: string;      // ej. "13 de enero de 2026"
  tipoYNombreTitulo: string;        // ej. "Título en Provisión Nacional de MÉDICO CIRUJANO", "Diploma de Bachiller en Humanidades"
  nroTitulo: string;                // ej. "N°96071", "N°019741"
  condicionCiudadanoYNombre: string;// ej. "al ciudadano GUALBERTO MEDINA VARGAS", "a la ciudadana LYNNE DENISSE PEREZ REVILLA"
  ciTitular: string;                // ej. "N°8072900-SCZ.", "N°4716343-SCZ."
  nroLibro: string;                 // ej. "N°0017", "N°026/99", "N° 19/98"
  nroFojas: string;                 // ej. "N°0027", "N°181", "N°115/98"
  fechaEmisionTitulo: string;       // ej. "11 de julio del año 2022", "5 de marzo del año 1999"
  fechaEmisionCertificado: string;  // ej. "19 de enero del 2026."

  // Párrafo 2 Condicional: Aclaratoria de pie de firma (Tipo 2, 3, 4_5_B)
  anioGestion?: string;             // ej. "1999", "1979"
  incluirAclaratoriaFirma?: boolean;

  // Párrafo 3 Condicional: Supletorio previo (Tipo 3, 4_5_B)
  generoInteresado?: string;        // ej. "la interesada", "del interesado"
  tipoYNroSupletorio?: string;      // ej. "Supletorio del Diploma de Bachiller en Humanidades N° 014863"
  fechaLiteralSupletorio?: string;  // ej. "a los 24 días del mes de agosto del dos mil veintidos"
  secretarioGeneralFirmante?: string;// ej. "Lic. Edy Acosta Claros, Secretario General"
  rectorFirmante?: string;          // ej. "MSc. Vicente R. Cuellar Téllez, Rector - UAGRM"

  // Párrafo 2 Variante A: Legitimación y Res. C.E.U. (Tipo 4_A)
  anioGestionOriginal?: string;     // ej. "2007"
  rectorGestionOriginal?: string;   // ej. "Lic. Alfredo Jaldín Farel"
  rectorActual?: string;            // ej. "Dr. Reinerio Vargas Banegas"
  periodoGestionActual?: string;    // ej. "2025-2029"
  nroResolucionCeu?: string;        // ej. "N°. 121/2025"
  fechaResolucionCeu?: string;      // ej. "4 de agosto del 2025"

  // Párrafo 4 Condicional: Rectificación en Reverso (Tipo 4_5_B)
  fechaAclarativaReverso?: string;  // ej. "31 de marzo del 2026"
  nombreRectificado?: string;       // ej. "Tito Bell Cabrera"
  ciRectificado?: string;           // ej. "N° 1571223"
}

/**
 * SECCIÓN B: Datos dinámicos para Títulos Supletorios (Anverso)
 */
export interface DatosSupletorioAnverso {
  id: string;
  subtipo: SubtipoSupletorio;
  subtituloSupletorio: string;      // ej. "Supletorio de Diploma de Bachiller" o "SUPLETORIO DEL TÍTULO EN PROVISIÓN NACIONAL"
  nroDocumento: string;             // ej. "00156", "N°0021047"
  nombreTitular: string;            // ej. "ROQUE TITO BELL CABRERA", "LIZBETH MIRIAN GUARACHI FERNANDEZ."
  ciTitular: string;                // ej. "1571223.", "3904970-SCZ"
  lugarNacimiento: string;          // ej. "Tarija - Bolivia", "Santa Cruz-Bolivia"
  gradoDiplomaOProfesion: string;   // ej. "BACHILLER EN HUMANIDADES", "CONTADOR PUBLICO AUTORIZADO"
  nroLibro: string;                 // ej. "1-79", "N°0061"
  nroFojas: string;                 // ej. "00039", "N° 0051"
  fechaAutorizacionOriginal: string;// ej. "05 de enero del año 1979", "01 de octubre del año 2010"
  diaLiteral: string;               // ej. "treinta y uno", "13"
  mesLiteral: string;               // ej. "marzo", "abril"
  anioLiteral: string;              // ej. "veintiséis", "dos mil veintiséis."
  rectorNombre: string;             // ej. "Dr. Reinerio Vargas Banegas"
  secretarioNombre: string;         // ej. "Lic. Edy Acosta Claros"
}

/**
 * SECCIÓN B: Datos dinámicos para Providencias de Rectificación (Reverso)
 */
export interface DatosProvidenciaReverso {
  id: string;
  subtipo: SubtipoProvidencia;
  fechaProvidencia: string;         // ej. "31 de marzo del 2026.", "13 de abril del 2026"
  nroCertNacimiento: string;        // ej. "N°342929", "N° 007572"
  nroOficialiaSereci: string;       // ej. "N°70101091", "N° 70101202"
  nroInfArchivo: string;            // ej. "458", "No. 537"
  fechaInfArchivo: string;          // ej. "19 de marzo de 2026", "30 de marzo de 2026"
  
  // Condicional Rectificación de Nombre
  nroPartidaSereci?: string;        // ej. "N°1198/2026"

  // Condicional Complementación SEGIP
  fechaCertSegip?: string;          // ej. "26 de marzo de 2026"
  nroResSegip?: string;             // ej. "7321/2013"
  fechaResSegip?: string;           // ej. "28 de octubre del 2013"

  nroInformeLegal: string;          // ej. "No. 195/2026", "No. 219/2026"
  fechaInformeLegal: string;        // ej. "27 de marzo de 2026", "07 de abril 2026"
  motivoRectificacion: string;      // ej. "la supresión del primer nombre", "la complementación del número de Cédula de Identidad"
  tipoYNroSupletorioReferencia: string; // ej. "Supletorio del Diploma de Bachiller en Humanidades N°00156..."
  nombreFinalRectificado: string;   // ej. "TITO BELL CABRERA", "LIZBETH MIRIAN GUARACHI FERNANDEZ"
  ciFinalRectificado: string;       // ej. "N°1571223", "N°3904970-1G"
  fechaNacimiento: string;          // ej. "16 de agosto de 1956", "19 de diciembre de 1978"
  lugarNacimiento: string;          // ej. "Tarija - Bolivia", "Santa Cruz - Bolivia"
}

/**
 * SECCIÓN C: Datos dinámicos para Informes de Archivo Central (Págs. 1, 3, 7, 9)
 */
export interface FilaCustodiaArchivo {
  nroDiploma: string;               // ej. "019741", "96071"
  nombreApellidos: string;          // ej. "Lynne Denise Pérez Revilla"
  ciTitular: string;                // ej. "4716343 SCZ"
  diplomaDe: string;                // ej. "Bachiller en Humanidades", "Médico Cirujano"
  fojas: string;                    // ej. "181", "0027"
  libro: string;                    // ej. "026/99", "0017"
  fechaExtension: string;           // ej. "5 de marzo de 1999"
  nombreRector: string;             // ej. "Jorge Orellana Moreno"
  pieFirmaRector: string;           // ej. "No tiene", "Firmado"
}

export interface DatosInformeArchivo {
  id: string;
  fechaInforme: string;             // ej. "20 de abril de 2026"
  nroInforme: string;               // ej. "SECCIÓN ARCHIVO/INF. N° 472"
  tipoDiplomaReferencia: string;    // ej. "DIPLOMA DE BACHILLER EN HUMANIDADES"
  fechaSolicitud: string;           // ej. "16 de abril del 2026"
  
  // Apoderado condicional
  tieneApoderado: boolean;
  nroTestimonio?: string;
  nombrePoderdante?: string;
  nombreApoderado?: string;
  ciApoderado?: string;

  tablaCustodia: FilaCustodiaArchivo;

  // Cláusulas adicionales aplicables
  aclaratoriaFirmaEpoca?: string;
  antecedenteSupletorio?: string;
  antecedenteRectificacion?: string;
  
  jefeArchivoNombre: string;        // ej. "Moisés Cossio López"
  secretarioDestinoNombre: string;  // ej. "MSc. Edy Acosta Claros"
}
