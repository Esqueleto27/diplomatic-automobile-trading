import type { Metadata } from "next";
import Link from "next/link";
import { confianza, lineasNegocio } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Empresa — Diplomatic Automobile Trading",
  description: confianza.frase,
};

export default function EmpresaPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-28">
      <div className="max-w-2xl">
        <SectionHeading as="h1">Empresa</SectionHeading>

        <p className="mt-6 text-base leading-[1.8] text-foreground/85 sm:text-lg">
          {confianza.frase} Trabajamos con las principales marcas del
          segmento premium y nos encargamos de que la documentación de cada
          vehículo esté completa y en regla desde el primer día.
        </p>

        <Link
          href="/inventario"
          className="mt-9 inline-flex h-12 items-center justify-center bg-gold px-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-foreground outline-none transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          Ver inventario
        </Link>
      </div>

      {/* Lista apilada con reglas horizontales: a propósito distinta de la
          grilla de LineasNegocio en la home, para no repetir el mismo bloque
          dos veces en el sitio con solo el ancho de columna cambiado. */}
      <dl className="mt-16 max-w-2xl border-t border-border">
        {lineasNegocio.map(({ slug, titulo, descripcion, icono: Icono }) => (
          <div key={slug} className="border-b border-border py-6">
            <dt className="flex items-center gap-2.5 font-display text-lg tracking-wide">
              <Icono className="size-5 text-gold" aria-hidden />
              {titulo}
            </dt>
            <dd className="mt-2 text-base leading-[1.7] text-muted-foreground">
              {descripcion}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
