import Image from "next/image";
import Link from "next/link";
import { servicios } from "@/lib/site";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

export function ServiciosAdicionales() {
  return (
    <section className="py-28 sm:py-36" aria-labelledby="servicios">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <SectionHeading>
          <span id="servicios">Servicios Adicionales</span>
        </SectionHeading>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(
            ({ slug, titulo, descripcion, icono: Icono, imagen }, i) => (
              <li key={slug}>
                <Reveal delay={(i % 3) * 0.1}>
                  <Link
                    href={`/servicios#${slug}`}
                    className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden border border-white/[0.07] bg-surface p-6 outline-none transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {imagen ? (
                      <>
                        <Image
                          src={imagen}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-colors duration-300 group-hover:from-black/95"
                        />
                      </>
                    ) : (
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,var(--surface-2),var(--background))]"
                      />
                    )}

                    {/* Insignia del ícono: siempre visible (haya foto o no),
                        estilo "vidrio esmerilado" — es el detalle que le da
                        aire a Apple/Porsche en vez de la típica card plana. */}
                    <div
                      aria-hidden
                      className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 backdrop-blur-sm transition-colors duration-300 group-hover:border-gold/60"
                    >
                      <Icono className="size-5 text-gold transition-transform duration-300 group-hover:scale-110" />
                    </div>

                    <div className="relative">
                      <span
                        aria-hidden
                        className="mb-4 block h-px w-10 bg-gold/70 transition-all duration-500 group-hover:w-16"
                      />
                      <h3 className="line-clamp-2 font-display text-xl leading-snug tracking-wide">
                        {titulo}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {descripcion}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
