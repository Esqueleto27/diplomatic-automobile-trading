import { prisma } from "@/lib/prisma";
import type { TipoAuto } from "@/generated/prisma/enums";

const seleccionPublica = {
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
  fotos: {
    orderBy: [{ portada: "desc" as const }, { orden: "asc" as const }],
    select: { url: true },
    take: 1,
  },
};

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
  tipo: TipoAuto | null;
  fotos: { url: string }[];
};

/** Sólo autos visibles en el sitio, del tipo indicado. */
export async function getAutosPorTipo(
  tipos: TipoAuto[],
  limite = 12,
): Promise<AutoPublico[]> {
  return prisma.car.findMany({
    where: { activo: true, tipo: { in: tipos } },
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
    take: limite,
    select: seleccionPublica,
  });
}

export type AutoDetalle = Omit<AutoPublico, "fotos"> & {
  descripcion: string | null;
  fotos: { id: string; url: string }[];
};

/** Ficha completa de un auto publicado. `null` si no existe o está oculto. */
export async function getAutoPorSlug(slug: string): Promise<AutoDetalle | null> {
  return prisma.car.findFirst({
    where: { slug, activo: true },
    select: {
      ...seleccionPublica,
      descripcion: true,
      fotos: {
        orderBy: [{ portada: "desc" as const }, { orden: "asc" as const }],
        select: { id: true, url: true },
      },
    },
  });
}

export async function getAutosVisibles(limite = 60): Promise<AutoPublico[]> {
  return prisma.car.findMany({
    where: { activo: true },
    orderBy: [{ destacado: "desc" }, { createdAt: "desc" }],
    take: limite,
    select: seleccionPublica,
  });
}
