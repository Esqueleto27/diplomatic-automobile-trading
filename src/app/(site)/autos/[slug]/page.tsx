import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getAutoPorSlug, tipoLabel } from "@/lib/cars";
import { CarGallery } from "@/components/site/car-gallery";
import { SiteButton } from "@/components/site/button";
import { mensajeTestDrive, whatsappHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const formatoNumero = new Intl.NumberFormat("es-EC");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const auto = await getAutoPorSlug(slug);
  if (!auto) return { title: "Vehículo no encontrado" };

  const descripcion =
    auto.descripcion ??
    `${auto.nombre}${auto.marca ? ` ${auto.marca}` : ""} disponible en Diplomatic Automobile Trading.`;
  const foto = auto.fotos[0]?.url;

  return {
    title: auto.nombre,
    description: descripcion,
    alternates: { canonical: `/autos/${auto.slug}` },
    openGraph: foto
      ? { title: auto.nombre, description: descripcion, images: [{ url: foto }] }
      : { title: auto.nombre, description: descripcion },
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

  const hrefTestDrive = await whatsappHref(mensajeTestDrive(auto.nombre));

  const vehiculoSchema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: auto.nombre,
    brand: auto.marca ?? undefined,
    vehicleModelDate: auto.anio ?? undefined,
    mileageFromOdometer: auto.kilometraje ?? undefined,
    vehicleTransmission: auto.transmision ?? undefined,
    fuelType: auto.combustible ?? undefined,
    color: auto.color ?? undefined,
    image: auto.fotos.map((foto) => foto.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: auto.precio ?? undefined,
      availability: "https://schema.org/InStock",
    },
  };

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
    { etiqueta: "Condición", valor: tipoLabel(auto.tipo) },
  ].filter((fila) => Boolean(fila.valor));

  return (
    <div className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehiculoSchema) }}
      />
      <Link
        href="/inventario"
        className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
      >
        <ChevronLeft className="size-3.5" />
        Inventario
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
        <CarGallery fotos={auto.fotos} nombre={auto.nombre} />

        <div>
          <h1 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] font-light leading-tight tracking-wide">
            {auto.nombre}
          </h1>
          {auto.marca && (
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {auto.marca}
            </p>
          )}

          <p className="mt-8 font-display text-2xl font-semibold text-gold">
            {auto.precio != null
              ? `USD ${formatoNumero.format(auto.precio)}`
              : "Precio bajo consulta"}
          </p>

          {auto.descripcion && (
            <p className="mt-8 text-base leading-[1.8] text-foreground/85">
              {auto.descripcion}
            </p>
          )}

          {fichaTecnica.length > 0 && (
            <dl className="mt-10 border-t border-border">
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

          <SiteButton
            href={hrefTestDrive}
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 w-full sm:w-auto"
          >
            Agenda un Test Drive
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
