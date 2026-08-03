import type { Metadata } from "next";
import Link from "next/link";
import { getAutosVisibles } from "@/lib/cars";
import { CarCardDetalle } from "@/components/site/car-card";
import { SectionHeading } from "@/components/site/section-heading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventario — Diplomatic Automobile Trading",
  description:
    "Vehículos usados y diplomáticos disponibles en Diplomatic Automobile Trading.",
};

// Sin filtro por tipo: todo el inventario es de vehículos usados (los
// "diplomáticos" son una variante de usado, no una categoría aparte para el
// visitante), así que separar con tabs no aportaba nada — se muestra todo
// junto directamente.
export default async function InventarioPage() {
  const autos = await getAutosVisibles();

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-28">
      <SectionHeading as="h1">Inventario</SectionHeading>
      <p className="mt-3 max-w-lg text-base leading-[1.8] text-muted-foreground sm:text-lg">
        Unidades disponibles hoy. Si busca un modelo que no aparece en la lista,
        podemos importarlo a pedido.
      </p>

      {autos.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">
          No hay vehículos publicados por el momento.{" "}
          <Link href="/contacto" className="text-gold hover:underline">
            Escríbanos
          </Link>{" "}
          y le avisamos apenas ingrese uno.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {autos.map((auto) => (
            <li key={auto.id}>
              <CarCardDetalle auto={auto} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
