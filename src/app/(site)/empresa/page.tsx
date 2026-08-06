import type { Metadata } from "next";
import Image from "next/image";
import { confianza, lineasNegocio, oficinaImageUrl } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";

export const metadata: Metadata = {
  title: "Empresa",
  description: confianza.frase,
  alternates: { canonical: "/empresa" },
};

export default function EmpresaPage() {
  return (
    <div className="mx-auto max-w-site px-5 py-20 sm:px-8 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <SectionHeading as="h1">Empresa</SectionHeading>

          <p className="mt-6 text-base leading-[1.8] text-foreground/85 sm:text-lg">
            {confianza.frase} Trabajamos con las principales marcas del
            segmento premium y nos encargamos de que la documentación de cada
            vehículo esté completa y en regla desde el primer día.
          </p>

          <SiteButton href="/inventario" size="lg" className="mt-10">
            Ver inventario
          </SiteButton>
        </div>

        {/* Foto real de la oficina, no generada — a diferencia del hero y los
            fondos de servicios, acá el punto es mostrar el lugar real. */}
        <div className="relative aspect-[3/4] overflow-hidden border border-white/[0.07] shadow-lift sm:mx-auto sm:max-w-sm lg:mx-0 lg:max-w-none">
          <Image
            src={oficinaImageUrl}
            alt="Oficina de Diplomatic Automobile Trading"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Lista apilada con reglas horizontales: a propósito distinta de la
          grilla de LineasNegocio en la home, para no repetir el mismo bloque
          dos veces en el sitio con solo el ancho de columna cambiado. */}
      <dl className="mt-20 max-w-2xl border-t border-border">
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
