import { getDb } from "@/lib/db";

// SQLite/D1 no tiene enums nativos: "tipo" es String en el schema, validado
// como este union en la capa de aplicación (ver src/lib/validations/car.ts).
export type TipoAuto = "NUEVO" | "USADO" | "DIPLOMATICO";

// Única fuente de verdad para las etiquetas en español de TipoAuto — antes
// estaba copiado como TIPO_LABELS en dos páginas y como TIPO_OPTIONS en el
// form del admin, los tres con los mismos 3 valores hardcodeados.
export const TIPO_LABELS: Record<TipoAuto, string> = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  DIPLOMATICO: "Diplomático",
};

export const TIPO_OPTIONS: { value: TipoAuto; label: string }[] = (
  Object.entries(TIPO_LABELS) as [TipoAuto, string][]
).map(([value, label]) => ({ value, label }));

/** Accesor seguro para mostrar `tipo` en UI: `Car.tipo` es texto libre en el
 * schema (SQLite/D1 no tiene enums), así que en tiempo de ejecución puede no
 * ser exactamente un TipoAuto — indexar TIPO_LABELS directo con ese string
 * no compila en modo estricto. */
export function tipoLabel(tipo: string | null): string | null {
  return tipo && tipo in TIPO_LABELS ? TIPO_LABELS[tipo as TipoAuto] : null;
}

const columnasPublicas = {
  id: true,
  slug: true,
  nombre: true,
  marca: true,
  anio: true,
  precio: true,
  kilometraje: true,
  transmision: true,
  combustible: true,
  color: true,
  tipo: true,
} as const;

export type AutoPublico = {
  id: string;
  slug: string;
  nombre: string;
  marca: string | null;
  anio: number | null;
  precio: number | null;
  kilometraje: number | null;
  transmision: string | null;
  combustible: string | null;
  color: string | null;
  // string (no TipoAuto): el schema lo guarda como texto libre en D1/SQLite;
  // TipoAuto sólo restringe los valores que la app misma escribe.
  tipo: string | null;
  fotos: { url: string }[];
};

/** Sólo autos visibles en el sitio, del tipo indicado. */
export async function getAutosPorTipo(
  tipos: TipoAuto[],
  limite = 12,
): Promise<AutoPublico[]> {
  const db = await getDb();
  return db.query.cars.findMany({
    where: (car, { and, eq, inArray }) =>
      and(eq(car.activo, true), inArray(car.tipo, tipos)),
    orderBy: (car, { desc }) => [desc(car.destacado), desc(car.createdAt)],
    limit: limite,
    columns: columnasPublicas,
    with: {
      fotos: {
        orderBy: (foto, { desc, asc }) => [desc(foto.portada), asc(foto.orden)],
        limit: 1,
        columns: { url: true },
      },
    },
  });
}

export type AutoDetalle = Omit<AutoPublico, "fotos"> & {
  descripcion: string | null;
  fotos: { id: string; url: string }[];
};

/** Ficha completa de un auto publicado. `null` si no existe o está oculto. */
export async function getAutoPorSlug(slug: string): Promise<AutoDetalle | null> {
  const db = await getDb();
  const auto = await db.query.cars.findFirst({
    where: (car, { and, eq }) => and(eq(car.slug, slug), eq(car.activo, true)),
    columns: { ...columnasPublicas, descripcion: true },
    with: {
      fotos: {
        orderBy: (foto, { desc, asc }) => [desc(foto.portada), asc(foto.orden)],
        columns: { id: true, url: true },
      },
    },
  });
  return auto ?? null;
}

export async function getAutosVisibles(limite = 60): Promise<AutoPublico[]> {
  const db = await getDb();
  return db.query.cars.findMany({
    where: (car, { eq }) => eq(car.activo, true),
    orderBy: (car, { desc }) => [desc(car.destacado), desc(car.createdAt)],
    limit: limite,
    columns: columnasPublicas,
    with: {
      fotos: {
        orderBy: (foto, { desc, asc }) => [desc(foto.portada), asc(foto.orden)],
        limit: 1,
        columns: { url: true },
      },
    },
  });
}
