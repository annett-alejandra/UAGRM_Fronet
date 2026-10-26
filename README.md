<div align="center">

<!-- Título principal -->
<h1>🏛️ Sistema UAGRM — Frontend</h1>
<h3>Título Supletorio & Gestión Documental</h3>

<br/>

<!-- 🎬 ANIMACIÓN DE LOS LENGUAJES (Efecto máquina de escribir) -->
[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&pause=1000&color=191A7D&center=true&vCenter=true&width=600&lines=TypeScript+5.7%2B+%F0%9F%9A%80;React+18.3%2B+%E2%9A%9B%EF%B8%8F;Vite+6.0%2B+%E2%9A%A1;Tailwind+CSS+%2B+CVA+%F0%9F%8E%A8)](https://git.io/typing-svg)

<!-- Badges estáticos (Respaldo visual) -->
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CVA-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-Internal-D31338?style=for-the-badge)

<br/>

<p><i>Repositorio oficial del frontend institucional para la gestión, emisión de títulos, folios y digitalización documental de la Universidad Autónoma Gabriel René Moreno (UAGRM).</i></p>

</div>

---

## 🚀 1. Stack Tecnológico Oficial

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **Lenguaje** | **TypeScript** | `5.7+` — Estrictamente `.tsx` / `.ts`. Cero `.js` o `.jsx`. |
| **Librería UI** | **React** | `18.3+` — React Funcional con Hooks. |
| **Bundler** | **Vite** | `6.0+` — Puerto `3000`, alias `@/` → `src/`. |
| **Estilos** | **Tailwind CSS + CVA** | Utilitarios + `class-variance-authority`. Cero `style={{...}}`. |
| **Iconografía** | **Lucide React** | Íconos vectoriales limpios. |
| **Enrutamiento** | **React Router DOM** | Rutas declarativas + layouts anidados. |
| **Estado** | **Zustand** | Stores ligeros de sesión y tokens. |
| **Cliente API** | **Fetch / REST Client** | `credentials: 'include'` para cookies seguras con Django. |

---

## 🧰 2. Caja de Herramientas Institucional (`@/shared/ui`)

Toda pantalla **DEBE** construirse consumiendo exclusivamente el Design System en `src/shared/ui/`.

### ❌ Prohibido
- Botones nativos: `<button className="...">`
- Inputs crudos: `<input type="text">`
- CSS monolítico (`portal.css`)
- Mover o duplicar `shared/` fuera de `src/`

### ✅ Obligatorio

```tsx
import {
  Button, Input, Card, CardHeader, CardTitle, CardContent,
  Badge, Select, Textarea, Checkbox, Modal, Table, Spinner, LogoUAGRM
} from "@/shared/ui";
```

---

## 🎨 3. Paleta de Colores y Tokens UAGRM

Se respeta estrictamente la identidad corporativa oficial (primarios, secundarios y grises):

### A. Variaciones de Azul
| Token | Color | HEX |
| :--- | :--- | :--- |
| **UAGRM Blue** | 🔵 | `#191A7D` |
| **Medio** | 🔵 | `#191A7D` *(Mismo tono base)* |
| **Suave** | 🔵 | `#5566DE` |
| **Muy Suave** | 🔵 | `#8AAFF0` |

### B. Variaciones de Rojo
| Token | Color | HEX |
| :--- | :--- | :--- |
| **Rojo** | 🔴 | `#D31338` |
| **Melocotón** | 🟠 | *(Usar según manual)* |
| **Salmón** | 🟠 | *(Usar según manual)* |
| **Rosado** | 🟠 | `#EFFAFE` *(Aprox. fondo rosado)* |

### C. Escala de Grises
| Token | Color | HEX |
| :--- | :--- | :--- |
| **Un-gris-profundo** | ⚫ | `#191A5D` |
| **Gris** | ⚫ | *(Usar según manual)* |
| **Gris-suave** | ⚪ | *(Usar según manual)* |
| **Blanco-hueso** | ⚪ | *(Usar según manual)* |
| **Blanco (Background)**| ⚪ | `#FFFFFF` |

> 🛡️ **Escudo Oficial:** Usar el componente `<LogoUAGRM size="md" />` que apunta a tu imagen local. *(Para que la imagen se vea en GitHub, recuerda subir el archivo `UAGRM-Bolivia.webp` a la raíz del repositorio).*

---

## 🏛️ 4. Reglas de Impresión y Folios Legales

- **Formatos de papel:** **Carta** (`215.9mm × 279.4mm`) u **Oficio/Legal** (`215.9mm × 355.6mm`).
- **Margen de encuadernación:** **4 cm (40mm)** a la izquierda — obligatorio para empastado en libros matrices.
- **`@media print`:** limpiar encabezados y pies de página del navegador.

---

## 🔌 5. Conexión con Backend (Cero datos mockeados)

Prohibido dejar datos quemados en `useState` o JSON locales. Todo consume la capa de servicios:

```typescript
import { restClient } from "@/shared/api/rest-client";

const expediente = await restClient.get(`/api/v1/titulos/tramites/${id}/`);
```

---

## 📁 6. Estructura de Directorios

```text
src/
├── app/                  # Rutas globales (routes.tsx) y Providers
├── shared/
│   ├── ui/               # 🧰 CAJA DE HERRAMIENTAS INSTITUCIONAL
│   ├── api/              # Clientes HTTP, REST y GraphQL
│   ├── types/            # Interfaces TypeScript globales
│   └── lib/              # Utilidades (auth, cn, format)
├── modules/
│   ├── dev1/             # Solicitante & Plantillas
│   ├── dev2/             # Portal Convenios & Admisión
│   └── dev3/             # Títulos & Doble Factor
└── widgets/              # SidebarNavWidget (menú lateral unificado)
```

---

## ⚠️ 7. Definition of Done (Reglas de PR)

Todo Pull Request debe cumplir:

1. **UTF-8 estricto** — cero `Ã³` / `GestiÃ³n`.
2. **Cero etiquetas crudas** — 100% `@/shared/ui`.
3. **Tipado estricto** — cero `any` arbitrario.

---

## 🧭 8. Flujo Git del Equipo

| Acción | Comando |
| :--- | :--- |
| Crear rama | `git checkout -b feat/modulo-dev1-login` |
| Agregar cambios | `git add .` |
| Commit convencional | `git commit -m "feat(auth): agrega doble factor"` |
| Subir rama | `git push -u origin feat/modulo-dev1-login` |
| Actualizar main | `git pull --rebase origin main` |

**Prefijos de commit:** `feat:` · `fix:` · `docs:` · `style:` · `refactor:` · `chore:` · `test:`

---

<div align="center">

**Universidad Autónoma Gabriel René Moreno · Santa Cruz — Bolivia**

_Repositorio de uso interno._

</div>
