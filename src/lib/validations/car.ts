import { z } from "zod";

const emptyToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

export const carSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  marca: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  anio: z.preprocess(emptyToUndefined, z.coerce.number().int().optional()),
  precio: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().nonnegative().optional(),
  ),
  kilometraje: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().nonnegative().optional(),
  ),
  transmision: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  combustible: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  color: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  descripcion: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  tipo: z.preprocess(emptyToUndefined, z.enum(["NUEVO", "USADO"]).optional()),
  // Ya no es un select de varios valores — parseCarForm (cars.ts) traduce el
  // checkbox "vendido" del form a "VENDIDO" o undefined antes de llegar acá.
  estado: z.literal("VENDIDO").optional(),
  activo: z.boolean().default(true),
});

export type CarFormValues = z.infer<typeof carSchema>;
