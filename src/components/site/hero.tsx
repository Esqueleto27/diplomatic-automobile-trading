import Image from "next/image";
import Link from "next/link";
import { siteConfig, heroImageUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate min-h-[clamp(30rem,72vh,46rem)] overflow-hidden">
      <Image
        src={heroImageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-hero-zoom -z-10 object-cover object-[58%_center]"
      />
      {/* Doble degradado: oscurece sólo la franja izquierda —lo justo para que
          el titular tenga contraste— y funde el borde inferior con la página.
          Se mantiene suave a propósito: el auto es el sujeto del hero. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-overlay-strong via-overlay-strong/50 via-45% to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className="mx-auto flex min-h-[clamp(30rem,72vh,46rem)] max-w-[1280px] items-center px-5 py-24 sm:px-8">
        <div className="max-w-xl">
          <h1 className="animate-fade-up-in font-display text-[clamp(2.2rem,6vw,4.2rem)] font-light uppercase leading-[0.95] tracking-[0.02em]">
            Luxury
            <br />
            Diplomatic
            <br />
            Trading
          </h1>

          <p
            style={{ animationDelay: "0.1s" }}
            className="animate-fade-up-in mt-6 max-w-sm text-[1.375rem] leading-relaxed tracking-wide text-foreground/85 sm:text-[1.5rem]"
          >
            {siteConfig.tagline}
          </p>

          <Link
            href="/contacto"
            style={{ animationDelay: "0.2s" }}
            className="animate-fade-up-in mt-9 inline-flex h-14 items-center justify-center bg-gold px-10 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-gold-foreground shadow-[0_12px_32px_-10px_rgba(199,163,84,0.5)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-strong hover:shadow-[0_16px_36px_-8px_rgba(199,163,84,0.6)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            Contact a Specialist
          </Link>
        </div>
      </div>
    </section>
  );
}
