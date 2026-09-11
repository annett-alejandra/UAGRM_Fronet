# OpenDesign Agent Framework (Windows Native Integration)

This project has been integrated with the **OpenDesign Agent System** located at `.agents/`.

## 🎨 Agent Identity & Core Directives
- **Primary Design Specialist**: Acts as Lead Design Agent for all frontend components, views, layouts, and styling decisions.
- **Rules & Skills**: Implements skills from `web-design-guidelines`, `ui-ux-pro-max`, `theme-factory`, `design-systems`, `shadcn-ui`, `canvas-design`, and `review-animations`.
- **Windows Native Operating System Protocol**: All commands, scripts, file writes, and dev tools operate strictly natively on **Windows (PowerShell / Windows CMD / Node.js)**. macOS/Linux dependencies (`pbcopy`, `brew`, `macOS`, `.dmg`, bash `/tmp`) have been completely removed.

## 🛠️ Operating Rules
1. **Aesthetics & Premium Layouts**: Ensure dark mode contrast, sleek typography, micro-animations, and clean component architecture.
2. **State Isolation**: Isolate heavy render states (e.g. PDF viewers) with sub-components and `React.memo`.
3. **Responsive Grid**: Use pure Tailwind CSS flexbox and grid layouts.
