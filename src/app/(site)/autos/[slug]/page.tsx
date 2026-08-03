import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAutoPorSlug } from "@/lib/cars";
import { CarGallery } from "@/components/site/car-gallery";
import { mensajeTestDrive, whatsappHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const formatoNumero = new Intl.NumberFormat("es-EC");

const TIPO_LABELS: Record<string, string> = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  DIPLOMATICO: "Diplomático",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const auto = await getAutoPorSlug(slug);
  if (!auto) return { title: "Vehículo no encontrado" };

  return {
    title: `${auto.nombre} — Diplomatic Automobile Trading`,
    description:
      auto.descripcion ??
      `${auto.nombre}${auto.marca ? ` ${auto.marca}` : ""} disponible en Diplomatic Automobile Trading.`,
  };
}

export default async function AutoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const auto = await getAutoPorSlug(slug);

  if (!auto) notFound();

  const fichaTecnica = [
    { etiqueta: "Marca", valor: auto.marca },
    { etiqueta: "Año", valor: auto.anio?.toString() },
    {
      etiqueta: "Kilometraje",
      valor:
        auto.kilometraje != null
          ? `${formatoNumero.format(auto.kilometraje)} km`
          : null,
    },
    { etiqueta: "Transmisión", valor: auto.transmision },
    { etiqueta: "Combustible", valor: auto.combustible },
    { etiqueta: "Color", valor: auto.color },
    { etiqueta: "Condición", valor: auto.tipo ? TIPO_LABELS[auto.tipo] : null },
  ].filter((fila) => Boolean(fila.valor));

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/inventario"
        className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
      >
        <ChevronLeft className="size-3.5" />
        Inventario
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
        <CarGallery fotos={auto.fotos} nombre={auto.nombre} />

        <div>
          <h1 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-light leading-tight tracking-wide">
            {auto.nombre}
          </h1>
          {auto.marca && (
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {auto.marca}
            </p>
          )}

          <p className="mt-6 font-display text-2xl font-semibold text-gold">
            {auto.precio != null
              ? `USD ${formatoNumero.format(auto.precio)}`
              : "Precio bajo consulta"}
          </p>

          {auto.descripcion && (
            <p className="mt-6 text-base leading-[1.8] text-foreground/85">
              {auto.descripcion}
            </p>
          )}

          {fichaTecnica.length > 0 && (
            <dl className="mt-8 border-t border-border">
              {fichaTecnica.map((fila) => (
                <div
                  key={fila.etiqueta}
                  className="flex items-center justify-between border-b border-border py-3"
                >
                  <dt className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {fila.etiqueta}
                  </dt>
                  <dd className="text-base">{fila.valor}</dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href={whatsappHref(mensajeTestDrive(auto.nombre))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 w-full items-center justify-center bg-gold px-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-foreground outline-none transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:w-auto"
          >
            Agenda un Test Drive
          </a>
        </div>
      </div>
    </div>
  );
}
