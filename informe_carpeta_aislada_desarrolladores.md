# Guía de Arquitectura y Estructura de Carpeta Aislada (Módulo Standalone)
## Archivo Central y Libros Matrices Jerárquicos

---

### 1. Concepto de "Carpeta Aislada" (Standalone Module)

Para que un desarrollador externo o un equipo secundario pueda construir, probar y entregar el módulo de **Archivo Central / Libros Matrices** sin romper el resto de la aplicación (Títulos y Grados, SSO, etc.), el código debe empaquetarse en un **Módulo Auto-contenido (Plug & Play)**.

Esta arquitectura garantiza que:
1. **Se pueda probar de forma independiente** con datos ficticios (Mocks) antes de tener el Backend listo.
2. **Se integre en 1 solo paso** al proyecto principal copiando la carpeta del módulo e importando su punto de entrada (`index.ts`).
3. **Refleje exactamente la organización de almacenamiento físico real** de la UAGRM.

---

### 2. Estructura Físico-Digital en el Servidor de Archivos (MinIO / S3)

La estructura de carpetas de archivos PDF y scans de OCR en el servidor de almacenamiento debe imitar al 100% el archivo físico universitario:

```plaintext
🗄️ storage-root/ (MinIO Bucket: uagrm-archivo-central)
   └── 📁 gestion_2001/
        └── 📁 carrera_derecho_lic/
             └── 📁 legajo_tomo_01/
                  ├── 📄 metadata_tomo.json        (Rango correlativo Del 03399 al 03010)
                  ├── 📁 fojas_ocr/               (Escaneos OCR de cada folio)
                  │    ├── foja_03399_Arispe.pdf
                  │    ├── foja_03398_Navarro.pdf
                  │    └── foja_03393_Orellana.pdf
                  └── 📁 expedientes_digitales/   (Legajos completos por estudiante/C.I.)
                       ├── 📁 ci_4589214_Arispe/
                       │    ├── cedula_identidad.pdf
                       │    ├── certificado_notas.pdf
                       │    └── diploma_bachiller.pdf
                       └── ...
```

---

### 3. Estructura de la Carpeta Aislada en el Frontend (`src/modules/archivo-central/`)

El desarrollador Frontend debe entregar el módulo dentro de una **carpeta aislada** estructurada de la siguiente manera:

```plaintext
📁 src/modules/archivo-central/
   ├── 📄 index.ts                            # Punto de entrada exportable (API pública del módulo)
   ├── 📄 README.md                            # Guía de integración y contrato del módulo
   │
   ├── 📁 types/                              # Modelos de datos e interfaces TypeScript
   │    ├── gestion.types.ts                  # Interfaces: Gestion, Carrera, TomoLegajo
   │    └── graduado.types.ts                 # Interfaces: Graduado, ExpedienteDigital, DocumentoDossier
   │
   ├── 📁 api/                                # Cliente API REST / Mocks independientes
   │    ├── archivoCentralApi.ts              # Métodos de llamada al backend real
   │    └── archivoCentralMocks.ts            # Datos ficticios para desarrollo aislado (Offline)
   │
   ├── 📁 components/                         # Componentes de interfaz propios
   │    ├── FiltroCascadaJerarquico.tsx       # Dropdowns: [Gestión] ➔ [Carrera] ➔ [Tomo/Legajo]
   │    ├── TablaGraduadosIndexada.tsx        # Tabla ordenada por N° Título Correlativo
   │    ├── VisorLegajoDrawer.tsx             # File Explorer lateral del expediente del graduado
   │    └── TarjetaMetadatosTomo.tsx          # Card descriptiva del Rango Correlativo (Del/Al)
   │
   └── 📁 pages/                              # Vista Principal Integrada
        └── BusquedaExpedientesArchivoPage.tsx # Orquestador de la vista completa
```

---

### 4. Contrato de Integración (Punto de Entrada `index.ts`)

Para que el proyecto principal instancie el módulo de Archivo Central sin conocer su implementación interna, la carpeta aislada expone una API pública limpia en `index.ts`:

```typescript
// src/modules/archivo-central/index.ts

// 1. Exportar la Vista Principal para el Enrutador
export { BusquedaExpedientesArchivoPage as ArchivoCentralModule } from './pages/BusquedaExpedientesArchivoPage';

// 2. Exportar Componentes Reutilizables por si se requieren en otros módulos
export { FiltroCascadaJerarquico } from './components/FiltroCascadaJerarquico';
export { TablaGraduadosIndexada } from './components/TablaGraduadosIndexada';
export { VisorLegajoDrawer } from './components/VisorLegajoDrawer';

// 3. Exportar Tipos de Datos para contratos con el Backend
export type {
  GestionArchivo,
  CarreraArchivo,
  TomoLegajo,
  GraduadoLegajo,
  DossierDocumento
} from './types/gestion.types';
```

---

### 5. Reglas de Desarrollo Aislado para Programadores

Al solicitar la carpeta a un desarrollador externo, se le deben exigir las siguientes **5 reglas estrictas**:

1. **Cero Dependencias Circulares o Rutas Absolutas a Otros Módulos**:
   - Todo lo que necesite el módulo de Archivo Central debe estar contenido dentro de `src/modules/archivo-central/` o importado desde `@shared`. No puede depender directamente de componentes privados de `src/pages/titulos/`.

2. **Modo Autónomo (Standalone / Mock Mode)**:
   - El módulo debe funcionar al 100% de manera visual utilizando `archivoCentralMocks.ts` cuando la API de backend no responda o se configure una variable de entorno `VITE_USE_MOCK=true`.

3. **Cumplimiento del Filtro en Cascada**:
   - La selección de **Gestión (Año)** debe filtrar automáticamente las **Carreras** disponibles.
   - La selección de **Carrera** debe habilitar únicamente los **Tomos / Legajos** existentes para esa gestión.
   - La tabla debe **ordenarse obligatoriamente por el N° de Título Correlativo** (`nro_titulo_correlativo`), reflejando la lista física del tomo.

4. **Visor Multidocumento (Drawer File Explorer)**:
   - Al hacer clic en *"Ver Expediente"* o *"Ver Foja"*, el módulo debe abrir un contenedor lateral (Drawer) con navegación por pestañas o lista de documentos (Cédula, Notas, Diploma o Foja Única Reconstruida por OCR).

5. **Exportación e Integración de 1 Línea en React Router**:
   - En el proyecto principal (`AppRoutes.tsx`), integrar el módulo solo debe requerir:
     ```tsx
     import { ArchivoCentralModule } from './modules/archivo-central';

     <Route path="/archivo-central/busqueda" element={<ArchivoCentralModule />} />
     ```
