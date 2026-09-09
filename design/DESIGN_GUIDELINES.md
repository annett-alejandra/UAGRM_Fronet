# 🎨 Guía de Diseño y UI/UX - Sistema Título Supletorio UAGRM

¡Bienvenido/a al equipo de diseño! Este documento contiene los lineamientos, estructura y especificaciones para el rediseño estético y de experiencia de usuario (UI/UX) del sistema **Título Supletorio UAGRM**.

---

## 📌 1. Reglas Principales de Diseño

1. **Tecnología de Estilos:**
   - Usar **únicamente Vanilla CSS** (CSS nativo moderno con variables `:root`, Flexbox, CSS Grid, Glassmorphism y animaciones fluidas).
   - **NO usar Tailwind CSS** ni librerías pesadas de terceros.
   
2. **Estética y Paleta de Colores:**
   - **Paleta UAGRM Premium:** Azules profundos, acentos dorados/rojos institucionales de la UAGRM, fondos oscuros/semi-transparentes (Glassmorphic) o temas claros ultra-limpios.
   - **Tipografía:** Usar fuentes modernas de Google Fonts (ej. `Inter`, `Outfit` o `Roboto`).
   - **Sombras y Bordes:** Transiciones suaves (`transition: all 0.2s ease`), bordes redondeados (`border-radius: 12px` - `16px`), sombras sutiles (`box-shadow: 0 8px 32px 0 rgba(...)`).

3. **Independencia del Trabajo:**
   - Todo el trabajo de exploración de diseño se centralizará en este directorio `/design` y/o en la carpeta `C:\Users\MSI\open-design`.
   - Los cambios de estilos finalizados se guardarán en `design/theme.css` para ser integrados al sistema principal sin romper la lógica.

---

## 🖥️ 2. Vista General de Pantallas y Módulos a Rediseñar

Actualmente el sistema cuenta con los siguientes módulos activos visibles en `http://localhost:10001`:

| Módulo | Ruta URL | Componente React | Descripción del Contenido |
| :--- | :--- | :--- | :--- |
| **Triaje Documental** | `/triaje` | `TriajePage.tsx` | Tabla de documentos recibidos, estados de validación, botones de acción. |
| **Búsqueda Universal** | `/busqueda-universal` | `BusquedaUniversalPage.tsx` | Barra de búsqueda avanzada, filtros, resultados en tarjetas/tablas. |
| **OCR Split Screen** | `/ocr-split` | `OcrSplitPage.tsx` | Vista dividida: PDF/Imagen a la izquierda y formulario de extracción OCR a la derecha. |
| **Plantillas A4 / Editor** | `/plantillas-a4` | `PlantillaA4Page.tsx` | Vista previa de documentos impresos en formato A4 y controles de plantilla. |
| **Dashboard Principal** | `/` | `DashboardPage.tsx` | Resumen de métricas, navegación lateral y acceso rápido. |

---

## 🛠️ 3. Estructura de Tokens de Diseño (CSS Variables)

El archivo `design/theme.css` define las variables base que debes ajustar:

```css
:root {
  /* Colores Principales (UAGRM Premium) */
  --primary-color: #0d47a1;
  --primary-accent: #1976d2;
  --secondary-color: #d32f2f;
  --gold-accent: #fbc02d;

  /* Fondos y Superficies */
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --surface-glass: rgba(255, 255, 255, 0.05);
  --border-glass: rgba(255, 255, 255, 0.1);

  /* Texto */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;

  /* Efectos y Sombras */
  --shadow-premium: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
  --radius-card: 16px;
  --radius-btn: 10px;
}
```

---

## 🚀 4. Flujo de Trabajo para el Diseñador

1. Modifica o crea tus propuestas visuales en `design/theme.css` o dentro de `C:\Users\MSI\open-design`.
2. Para probar tus diseños en tiempo real en el navegador, la aplicación está corriendo en:
   👉 **`http://localhost:10001`**
3. Notifica cuando un módulo esté listo para la sincronización con el código fuente en `src/`.
