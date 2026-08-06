/**
 * Datos de DEMO para desarrollo local: sirven para ver el sitio con inventario
 * mientras el cliente no carga el suyo. NO se ejecuta en producción — el seed
 * real (`scripts/seed-admin.ts`, que sólo crea el admin) es otro archivo.
 *
 *   npm run db:seed-demo             (D1 local)
 *   npm run db:seed-demo -- --remote (D1 remota — no usar con datos reales)
 */
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";
import { slugify } from "../src/lib/slug";

const DB_NAME = "diplomatic-automobile-trading-db";

function sqlEscape(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

const AUTOS = [
  { nombre: "S-Class 580", marca: "Mercedes-Benz", anio: 2025, precio: 168000, tipo: "NUEVO", transmision: "Automática", combustible: "Gasolina", color: "Negro obsidiana" },
  { nombre: "Range Rover Autobiography", marca: "Land Rover", anio: 2025, precio: 194000, tipo: "NUEVO", transmision: "Automática", combustible: "Híbrido", color: "Gris Santorini" },
  { nombre: "Urus Performante", marca: "Lamborghini", anio: 2024, precio: 312000, tipo: "NUEVO", transmision: "Automática", combustible: "Gasolina", color: "Amarillo Auge" },
  { nombre: "Bentayga EWB", marca: "Bentley", anio: 2025, precio: 289000, tipo: "NUEVO", transmision: "Automática", combustible: "Gasolina", color: "Azul Sequin" },
  { nombre: "Cayenne Turbo GT", marca: "Porsche", anio: 2024, precio: 226000, tipo: "NUEVO", transmision: "Automática", combustible: "Gasolina", color: "Blanco Carrara" },
  { nombre: "S-Class 450", marca: "Mercedes-Benz", anio: 2022, precio: 112000, kilometraje: 38000, tipo: "DIPLOMATICO", transmision: "Automática", combustible: "Gasolina", color: "Negro" },
  { nombre: "Q7 55 TFSI quattro", marca: "Audi", anio: 2021, precio: null, kilometraje: 54200, tipo: "DIPLOMATICO", transmision: "Automática", combustible: "Gasolina", color: "Azul Navarra" },
  { nombre: "Serie 7 740i", marca: "BMW", anio: 2022, precio: 98500, kilometraje: 41800, tipo: "USADO", transmision: "Automática", combustible: "Gasolina", color: "Gris mineral" },
  { nombre: "Continental GT", marca: "Bentley", anio: 2020, precio: 175000, kilometraje: 29500, tipo: "USADO", transmision: "Automática", combustible: "Gasolina", color: "Verde Cumbria" },
] as const;

function main() {
  const remote = process.argv.includes("--remote");

  const values = AUTOS.map((auto) => {
    const slug = slugify(`${auto.marca} ${auto.nombre}`);
    const kilometraje = "kilometraje" in auto ? auto.kilometraje : null;
    const destacado = auto.tipo === "NUEVO" ? 1 : 0;
    return `(${sqlEscape(randomUUID())}, ${sqlEscape(slug)}, ${sqlEscape(auto.nombre)}, ${sqlEscape(auto.marca)}, ${auto.anio}, ${auto.precio ?? "NULL"}, ${kilometraje ?? "NULL"}, ${sqlEscape(auto.transmision)}, ${sqlEscape(auto.combustible)}, ${sqlEscape(auto.color)}, ${sqlEscape(auto.tipo)}, ${destacado}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  });

  const sql = `
    INSERT INTO "Car" (id, slug, nombre, marca, anio, precio, kilometraje, transmision, combustible, color, tipo, destacado, activo, createdAt, updatedAt)
    VALUES ${values.join(",\n           ")}
    ON CONFLICT(slug) DO NOTHING;
  `.trim();

  const tmpFile = join(os.tmpdir(), `seed-demo-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql, "utf-8");

  try {
    execFileSync(
      "npx",
      [
        "wrangler",
        "d1",
        "execute",
        DB_NAME,
        remote ? "--remote" : "--local",
        `--file=${tmpFile}`,
      ],
      { stdio: "inherit", shell: true },
    );
  } finally {
    unlinkSync(tmpFile);
  }

  console.log(`${AUTOS.length} autos de demo listos.`);
}

main();
