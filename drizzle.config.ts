import { defineConfig } from "drizzle-kit";

// Genera migraciones SQL planas compatibles con `wrangler d1 migrations
// apply` (a diferencia de Prisma, que las genera en carpetas por-timestamp
// que wrangler no entiende). No se declara `driver`/credenciales de D1 acá:
// drizzle-kit sólo genera el SQL, aplicarlo a D1 (local o remota) es tarea
// de wrangler.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
});
