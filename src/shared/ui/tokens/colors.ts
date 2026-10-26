/**
 * UAGRM Official Color Palette Tokens (Institutional Design System)
 * Definición oficial basada en especificación "2. TONOS Y VARIACIONES"
 */

export const UAGRM_COLORS = {
  // A. Variaciones de Azul
  blue: {
    base: "#191A7D",        // UAGRM Blue Oficial (C:100 M:95 K:5)
    medio: "#2B6CB0",       // Medio (C:85 M:50 K:0)
    suave: "#556DEF",       // Suave
    suaveAlt: "#85BDEF",    // Suave borde / chip
    muySuave: "#DAEFFE",    // Muy Suave (C:10 M:7 K:1)
  },

  // B. Variaciones de Rojo
  red: {
    base: "#D31338",        // Rojo UAGRM Primario Secundario
    melocoton: "#F08C6E",   // Melocotón
    salmon: "#F39E8E",      // Salmón (PaleRED)
    rosado: "#FCECEF",      // Rosado
    rosadoHielo: "#EFFAFE", // Rosado Hielo tenue
  },

  // C. Escala de Grises
  gray: {
    profundo: "#191A2D",    // Un gris profundo (Texto principal de alto contraste)
    base: "#6B7280",        // Gris (Texto secundario / descriptivo)
    suave: "#E2E8F0",       // Gris suave (Líneas divisorias y bordes)
    blancoHueso: "#F9F9F6", // Blanco hueso (Fondos de página y superficies cálidas)
    blanco: "#FFFFFF",      // Blanco puro (Tarjetas y fondos puros)
  },

  // D. Combinaciones Oficiales de Contraste y Componentes (WCAG AAA/AA)
  combinations: {
    primarySolid: {
      bg: "#191A7D",
      text: "#FFFFFF",
      border: "#191A7D",
      hover: "#2B6CB0",
      description: "Botones de acción principal, encabezados institucionales y banners",
    },
    primarySoft: {
      bg: "#DAEFFE",
      text: "#191A7D",
      border: "#85BDEF",
      hover: "#C7E5FE",
      description: "Chips de estado activo, badges informativos, alertas de navegación",
    },
    secondarySolid: {
      bg: "#D31338",
      text: "#FFFFFF",
      border: "#D31338",
      hover: "#B70F2F",
      description: "Acciones críticas, firmas digitales, validación jurada y advertencias",
    },
    secondarySoft: {
      bg: "#FCECEF",
      text: "#D31338",
      border: "#F39E8E",
      hover: "#F9D5DB",
      description: "Alertas de expedientes observados, validación de errores y badges de rechazo",
    },
    melocotonWarm: {
      bg: "#FFF5F2",
      text: "#B9381E",
      border: "#F08C6E",
      hover: "#FFE9E3",
      description: "Trámites en revisión intermedia, advertencias previas y convalidación",
    },
    surfaceClean: {
      bg: "#FFFFFF",
      text: "#191A2D",
      border: "#E2E8F0",
      pageBg: "#F9F9F6",
      description: "Estructura general de paneles, tarjetas limpias y tablas del sistema",
    },
  },
} as const;

export type UagrmColorPalette = typeof UAGRM_COLORS;
