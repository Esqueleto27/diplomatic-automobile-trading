import { siteConfig } from "@/lib/site";
import { HeroImage } from "@/components/site/hero-image";
import { SiteButton } from "@/components/site/button";

export function Hero() {
  return (
    <section className="relative isolate min-h-[clamp(30rem,72vh,46rem)] overflow-hidden">
      <HeroImage />

      {/* Doble degradado: un velo general oscurece toda la imagen apenas y
          la franja izquierda se oscurece más —lo justo para que el titular
          tenga contraste—, fundiendo el borde inferior con la página. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-overlay-strong via-overlay-strong/60 via-45% to-overlay-strong/15"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto flex min-h-[clamp(30rem,72vh,46rem)] max-w-site items-center px-5 py-24 sm:px-8">
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
            className="animate-fade-up-in mt-9 flex flex-wrap gap-4"
          >
            <SiteButton href="/contacto" size="xl">
              Solicitar Asesor
            </SiteButton>
            <SiteButton href="/inventario" size="xl" variant="outline">
              Ver Inventario
            </SiteButton>
          </div>
        </div>
      </div>
    </section>
  );
}
