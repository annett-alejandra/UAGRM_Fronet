import reactPlugin from "eslint-plugin-react";
import boundariesPlugin from "eslint-plugin-boundaries";

export default [
  {
    plugins: {
      react: reactPlugin,
      boundaries: boundariesPlugin,
    },
    rules: {
      // 1. Prohibición estricta de elementos HTML crudos en pantallas
      "react/forbid-elements": [
        "error",
        {
          forbid: [
            {
              element: "button",
              message: "⛔ Prohibido el uso de <button> nativo. Importe { Button } desde '@/shared/ui/button'.",
            },
            {
              element: "input",
              message: "⛔ Prohibido el uso de <input> nativo. Importe { Input } desde '@/shared/ui/input'.",
            },
          ],
        },
      ],
      // 2. La capa UI no puede importar nada de capas superiores
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              from: "shared",
              allow: ["shared"], // ui solo puede depender de sí misma o utilidades puras
            },
          ],
        },
      ],
    },
  },
  // Excepción: Los archivos de la propia caja de herramientas sí pueden usar HTML
  {
    files: ["src/shared/ui/**/*.{ts,tsx}", "packages/ui/**/*.{ts,tsx}"],
    rules: {
      "react/forbid-elements": "off",
    },
  },
];
