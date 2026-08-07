import Image from "next/image";
import { oficinaImageUrl } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteButton } from "@/components/site/button";
import { Reveal } from "@/components/site/reveal";

/**
 * Foto real de la oficina (misma que usa /empresa) + texto, en layout
 * imagen/texto sobre fondo sólido — a propósito NO a sangre completa como
 * el hero: la primera versión de esta sección reusaba esa misma estructura
 * (imagen de fondo + texto superpuesto + botón outline) a un scroll de
 * distancia del hero, y se leía como un segundo hero, no una sección nueva.
 *
 * Imagen a la izquierda / texto a la derecha en desktop — invertido respecto
 * de /empresa (que la pone a la derecha), para que las dos páginas no
 * repitan el mismo layout con la misma foto.
 *
 * El copy es propio de esta sección, no `confianza.frase` (esa frase ya
 * aparece como leyenda en BrandStrip, un scroll más arriba en la misma
 * página — repetirla acá sería la misma oración dos veces en un mismo scroll).
 *
 * No lleva nombre/cargo de quien atiende: el cliente no confirmó ese dato
 * todavía. Inventar un nombre de contacto sería fabricar información sobre
 * una persona real — se deja pendiente hasta tenerlo confirmado.
 */
export function OficinaTrust() {
  return (
    <section className="section-py bg-background" aria-labelledby="oficina">
      <div className="mx-auto grid max-w-site gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal
          className="relative aspect-[3/4] overflow-hidden border border-white/[0.07] shadow-lift sm:mx-auto sm:max-w-sm lg:mx-0 lg:order-1 lg:max-w-none"
          direction="left"
        >
          {/* La foto tira a frío (azul-cian) — un filtro cálido la acerca a
              la temperatura del resto del sitio (dorados, negros cálidos)
              en vez de leerse pegada de otra parte. */}
          <Image
            src={oficinaImageUrl}
            alt="Oficina de Diplomatic Automobile Trading"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover [filter:sepia(.25)_saturate(.85)_hue-rotate(-12deg)]"
          />
          <div aria-hidden className="absolute inset-0 bg-[#140e08]/30" />
        </Reveal>

        <Reveal className="lg:order-2" delay={0.1}>
          <SectionHeading as="h2">
            <span id="oficina">Un mismo equipo, de principio a fin</span>
          </SectionHeading>
          <p className="mt-6 max-w-md text-base leading-[1.8] text-muted-foreground">
            Elegir el vehículo, armar la documentación y coordinar la entrega
            pasan por las mismas manos en nuestra oficina en Quito — sin
            derivar su proceso a terceros en el camino.
          </p>
          <SiteButton href="/empresa" size="md" variant="outline" className="mt-8">
            Conocer la empresa
          </SiteButton>
        </Reveal>
      </div>
    </section>
  );
}
