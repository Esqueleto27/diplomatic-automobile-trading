import { siteConfig } from "@/lib/site";
import { HeroImage } from "@/components/site/hero-image";
import { SiteButton } from "@/components/site/button";

export function Hero() {
  return (
    <section className="relative isolate -mt-20 min-h-[clamp(34rem,84vh,52rem)] overflow-hidden">
      {/* -mt-20 cancela el `pt-20` que el layout del sitio agrega para
          compensar el header `fixed` (ver SiteLayout): así la foto arranca
          en el borde superior real de la ventana, debajo del header
          transparente, en vez de dejar un hueco de fondo sólido arriba. */}
      <HeroImage />

      {/* El velo cambia de forma según el viewport: en desktop el texto vive
          a la izquierda, así que un degradado horizontal (oscuro→claro)
          alcanza y deja ver el auto a la derecha. En móvil el texto está
          centrado y cae encima del auto (puede tocar zonas claras — faro,
          cromados — en cualquier punto de la foto), así que ahí va un velo
          parejo y más oscuro sobre toda la imagen en vez de un degradado
          direccional: no hay "lado seguro" para el texto en móvil. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/50 md:bg-[linear-gradient(90deg,rgba(0,0,0,.68)_0%,rgba(0,0,0,.58)_25%,rgba(0,0,0,.32)_50%,rgba(0,0,0,.08)_72%,transparent_88%)]"
      />

      {/* Fade en el borde inferior para fundir con la página. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto flex min-h-[clamp(34rem,84vh,52rem)] max-w-site items-center px-5 py-24 sm:px-8">
        <div className="max-w-xl">
          <h1 className="animate-fade-up-in font-display text-[clamp(2.2rem,6vw,4.2rem)] font-light uppercase leading-[0.88] tracking-[0.02em]">
            Diplomatic
            <br />
            Automobile
            <br />
            Trading
          </h1>

          <p
            style={{ animationDelay: "0.1s" }}
            className="animate-fade-up-in mt-6 max-w-xl text-[1.375rem] leading-relaxed tracking-wide text-foreground/85 sm:text-[1.5rem]"
          >
            {siteConfig.tagline}
          </p>

          <div
            style={{ animationDelay: "0.2s" }}
            className="animate-fade-up-in mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <SiteButton href="/contacto" size="xl" className="w-full sm:w-auto">
              Hablar con un Asesor
            </SiteButton>
            <SiteButton
              href="/inventario"
              size="xl"
              variant="outline"
              className="w-full bg-black/30 backdrop-blur-sm sm:w-auto"
            >
              Ver Inventario
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
