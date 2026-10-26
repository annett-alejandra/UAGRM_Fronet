/**
 * Constantes y Mapeos Oficiales para Campos OCR — UAGRM
 */

export const UMBRAL_CONFIANZA_ALTA = 0.85; // 85% para considerar extracción confiable
export const UMBRAL_CONFIANZA_MEDIA = 0.60;

/**
 * Diccionario canónico de etiquetas para campos extraídos por IA
 * Soporta variantes detectadas en Libros Matrices, Títulos y Diplomas
 */
export const LABELS_CAMPOS_OCR: Record<string, string> = {
  // Datos del Titular
  nombre_completo: 'Nombre Completo del Titular',
  nombre: 'Nombre(s) del Titular',
  apellidos: 'Apellidos del Titular',
  ci_titular: 'Cédula de Identidad (C.I.)',
  ci: 'C.I. Titular',
  ru: 'Registro Universitario (R.U.)',
  nacionalidad: 'Nacionalidad',

  // Datos Académicos
  grado_otorgado: 'Título / Grado Académico Otorgado',
  carrera: 'Carrera Profesional',
  facultad: 'Facultad Académica',
  modalidad_graduacion: 'Modalidad de Graduación',
  fecha_graduacion: 'Fecha de Graduación / Emisión',

  // Ubicación Registral en Libros Históricos
  nro_documento: 'Nº Diploma / Registro Matriz',
  libro_matriz: 'Libro Matriz',
  libro: 'Libro',
  tomo: 'Tomo Histórico',
  folio: 'Folio Registral',
  pagina: 'Página del Libro',
  gestion: 'Gestión / Año de Registro',

  // Autoridades
  rector_autoridad: 'Rector de la Universidad',
  secretario_general: 'Secretario General',
  decano_facultad: 'Decano de la Facultad',
};

/**
 * Obtiene el label amigable para cualquier campo (incluyendo camelCase o snake_case)
 */
export function getLabelCampoOcr(key: string): string {
  if (LABELS_CAMPOS_OCR[key]) {
    return LABELS_CAMPOS_OCR[key];
  }
  // Normalizar snake_case a Title Case
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
