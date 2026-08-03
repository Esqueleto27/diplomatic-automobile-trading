import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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
  // "NUEVO" | "USADO" | "DIPLOMATICO" — SQLite/D1 no tiene enums nativos,
  // se valida en la capa de aplicación (src/lib/validations/car.ts).
  tipo: text("tipo"),
  destacado: integer("destacado", { mode: "boolean" })
    .notNull()
    .default(false),
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
});

// Mensajes del formulario de /contacto. A diferencia del botón "Agendar Test
// Drive" (que va directo a WhatsApp sin tocar la base de datos), este
// formulario sí se guarda para que el admin lo revise desde el panel.
export const contactMessages = sqliteTable("ContactMessage", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
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
