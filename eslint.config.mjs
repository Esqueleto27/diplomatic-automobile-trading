import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next@15.5.x todavía publica sus presets en formato eslintrc
// clásico (extends: [...]), no como config flat nativo — el import directo
// (`import nextVitals from "eslint-config-next/core-web-vitals.js"`) rompe
// con "Plugin '' not found". FlatCompat es el puente oficial para consumir
// ese formato desde un eslint.config.mjs plano.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores de eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build de OpenNext/Wrangler — código generado, no fuente del proyecto.
    ".open-next/**",
    ".wrangler/**",
    "cloudflare-env.d.ts",
  ]),
]);

export default eslintConfig;
