/**
 * Datos de DEMO para desarrollo local: sirven para ver el sitio con inventario
 * mientras el cliente no carga el suyo. NO se ejecuta en producción — el seed
 * real (`prisma/seed.ts`, que sólo crea el admin) es otro archivo.
 *
 *   npm run db:seed-demo
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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

function slugify(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  for (const auto of AUTOS) {
    const slug = slugify(`${auto.marca} ${auto.nombre}`);
    await prisma.car.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        nombre: auto.nombre,
        marca: auto.marca,
        anio: auto.anio,
        precio: auto.precio ?? null,
        kilometraje: "kilometraje" in auto ? auto.kilometraje : null,
        transmision: auto.transmision,
        combustible: auto.combustible,
        color: auto.color,
        tipo: auto.tipo,
        destacado: auto.tipo === "NUEVO",
        activo: true,
      },
    });
  }
  console.log(`${AUTOS.length} autos de demo listos.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
