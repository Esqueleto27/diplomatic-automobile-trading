import { asc, desc, sql, type SQL } from "drizzle-orm";
import { cars } from "@/db/schema";
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

// Badge de estado comercial — independiente de `tipo` (categoría de
// inventario): un auto DIPLOMATICO puede estar además EXONERADO o RESERVADO.
// VENDIDO es un estado más de esta misma lista (no un campo booleano aparte)
// a propósito: reutiliza el mismo badge/select que ya existía en vez de
// sumar un segundo mecanismo de estado en el schema.
export type EstadoAuto =
  | "DISPONIBLE"
  | "RESERVADO"
  | "EXONERADO"
  | "CUPO_DIPLOMATICO"
  | "VENDIDO";

export const ESTADO_LABELS: Record<EstadoAuto, string> = {
  DISPONIBLE: "Disponible",
  RESERVADO: "Reservado",
  EXONERADO: "Exonerado",
  CUPO_DIPLOMATICO: "Con cupo diplomático",
  VENDIDO: "Vendido",
};

export const ESTADO_OPTIONS: { value: EstadoAuto; label: string }[] = (
  Object.entries(ESTADO_LABELS) as [EstadoAuto, string][]
).map(([value, label]) => ({ value, label }));

export function estadoLabel(estado: string | null): string | null {
  return estado && estado in ESTADO_LABELS
    ? ESTADO_LABELS[estado as EstadoAuto]
    : null;
}

/** `Car.estado` es texto libre en el schema — este helper es el único punto
 * que decide qué string cuenta como "vendido" para ordenar y para el
 * tratamiento visual (grid/tarjeta), en vez de comparar "VENDIDO" a mano en
 * cada lugar que lo necesita. */
export function esVendido(estado: string | null): boolean {
  return estado === "VENDIDO";
}

// Orden compartido por las consultas públicas de inventario: los vendidos
// siempre van al final (quedan en "segundo plano"), y dentro de cada grupo
// se mantiene destacado > más reciente. `sql<number>` en vez de un booleano
// porque D1/SQLite ordena 0/1, no true/false.
const ordenInventario: SQL[] = [
  asc(sql<number>`case when ${cars.estado} = 'VENDIDO' then 1 else 0 end`),
  desc(cars.destacado),
  desc(cars.createdAt),
];

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
  estado: true,
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
  // string (no TipoAuto/EstadoAuto): el schema los guarda como texto libre en
  // D1/SQLite; los union types sólo restringen los valores que la app escribe.
  tipo: string | null;
  estado: string | null;
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
    orderBy: ordenInventario,
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
    orderBy: ordenInventario,
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
