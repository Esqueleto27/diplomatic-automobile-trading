import type { Metadata } from "next";
import Image from "next/image";
import { confianza, lineasNegocio, marcas, oficinaImageUrl } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";
import { Reveal } from "@/components/site/reveal";

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
            className="object-cover [filter:sepia(.25)_saturate(.85)_hue-rotate(-12deg)]"
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

      {/* Muro de marcas: mismo array que BrandStrip (home), pero acá con
          tratamiento de tarjeta individual — la home muestra el logo suelto
          para no saturar la franja de confianza, /empresa es la página donde
          alguien viene a evaluar la seriedad del negocio, así que cada marca
          gana su propio recuadro. */}
      <div className="mt-24">
        <SectionHeading>Marcas con las que trabajamos</SectionHeading>

        <p className="mt-6 max-w-2xl text-base leading-[1.8] text-foreground/85 sm:text-lg">
          Durante más de 30 años hemos construido relaciones de confianza con
          las marcas más exigentes del mercado automotor, tanto de lujo como
          generalistas. Ese respaldo nos permite asesorar con criterio real
          en cada compra o venta: conocemos el vehículo, su documentación y
          su valor en el mercado ecuatoriano, marca por marca.
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {marcas.map((marca, i) => (
            <li key={marca.nombre}>
              <Reveal delay={(i % 10) * 0.04}>
                <div className="group flex aspect-square flex-col items-center justify-center gap-3 border border-white/[0.07] bg-surface px-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6),0_0_0_1px_rgba(199,163,84,0.12)]">
                  {marca.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={marca.logo}
                      alt={marca.nombre}
                      width={48}
                      height={48}
                      loading="lazy"
                      decoding="async"
                      style={{ height: `${2.5 * (marca.escala ?? 1)}rem` }}
                      className="w-auto opacity-75 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-center font-display text-lg uppercase tracking-[0.18em] text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                      {marca.nombre}
                    </span>
                  )}
                  <span className="text-center text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:text-gold">
                    {marca.nombre}
                  </span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
