import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// Admin único de la plataforma. Sin roles: cualquier fila de esta tabla
// puede administrar todo el inventario. Se crea vía script de seed, no hay
// registro público.
export const users = sqliteTable("User", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashedPassword").notNull(),
  name: text("name"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Todos los campos son opcionales salvo `nombre`: el admin puede publicar un
// auto con datos incompletos y completarlos después.
export const cars = sqliteTable("Car", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  marca: text("marca"),
  anio: integer("anio"),
  precio: integer("precio"),
  kilometraje: integer("kilometraje"),
  transmision: text("transmision"),
  combustible: text("combustible"),
  color: text("color"),
  descripcion: text("descripcion"),
  // "NUEVO" | "USADO" — SQLite/D1 no tiene enums nativos, se valida en la
  // capa de aplicación (src/lib/validations/car.ts). Existió un tercer valor
  // "DIPLOMATICO" que se sacó a pedido del cliente por confuso.
  tipo: text("tipo"),
  // Sólo puede valer "VENDIDO" o null — antes era un select de 5 estados
  // comerciales (DISPONIBLE/RESERVADO/EXONERADO/CUPO_DIPLOMATICO/VENDIDO) que
  // el cliente pidió sacar por no tener sentido para su operación. Se
  // mantiene la misma columna de texto libre (evita una migración) en vez de
  // pasar a boolean; el form ahora la controla con un checkbox "Vendido".
  estado: text("estado"),
  // Existió una columna `destacado` para elegir a mano qué autos salían en la
  // portada. Se quitó: la portada ahora se arma sola con los usados más
  // recientes (ver AUTOS_EN_PORTADA/ordenInventario en src/lib/cars.ts), así
  // que no había nada que la escribiera ni la leyera.
  activo: integer("activo", { mode: "boolean" }).notNull().default(true),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Hasta 10 fotos por auto (regla de negocio validada en la capa de
// aplicación — MAX_FOTOS_POR_AUTO en src/server/actions/car-photos.ts —
// no en el schema). `key` guarda el object key en R2 para poder borrarla
// ahí cuando se borra la foto o el auto.
export const carPhotos = sqliteTable("CarPhoto", {
  id: text("id").primaryKey(),
  carId: text("carId")
    .notNull()
    .references(() => cars.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  key: text("key").notNull(),
  orden: integer("orden").notNull().default(0),
  portada: integer("portada", { mode: "boolean" }).notNull().default(false),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  // Toda consulta de fotos filtra por carId (ficha del auto, panel admin,
  // borrado en cascada) — sin índice, D1 escanea la tabla completa. A 20
  // autos no se nota, pero es gratis evitarlo desde ya.
  index("CarPhoto_carId_idx").on(table.carId),
]);

// Mensajes del formulario de /contacto. A diferencia del botón "Agendar Test
// Drive" (que va directo a WhatsApp sin tocar la base de datos), este
// formulario sí se guarda para que el admin lo revise desde el panel.
export const contactMessages = sqliteTable("ContactMessage", {
  id: text("id").primaryKey(),
  // Un solo campo de nombre y apellido junto — el cliente pidió sacar el
  // campo "Apellido" separado del formulario por sencillez.
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  asunto: text("asunto").notNull(),
  mensaje: text("mensaje").notNull(),
  leido: integer("leido", { mode: "boolean" }).notNull().default(false),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const carsRelations = relations(cars, ({ many }) => ({
  fotos: many(carPhotos),
}));

export const carPhotosRelations = relations(carPhotos, ({ one }) => ({
  car: one(cars, { fields: [carPhotos.carId], references: [cars.id] }),
}));
