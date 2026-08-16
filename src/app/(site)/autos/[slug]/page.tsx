import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { esVendido, getAutoPorSlug } from "@/lib/cars";
import { CarGallery } from "@/components/site/car-gallery";
import { SiteButton } from "@/components/site/button";
import { precioLegible, valorDeCatalogo } from "@/components/site/car-card";
import { mensajeTestDrive, whatsappHref } from "@/lib/whatsapp";
import { numeroDe } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [auto, t] = await Promise.all([
    getAutoPorSlug(slug),
    getTranslations("metadata"),
  ]);
  if (!auto) return { title: t("vehiculoNoEncontrado") };

  const descripcion =
    auto.descripcion ??
    `${auto.nombre}${auto.marca ? ` ${auto.marca}` : ""} ${t("disponibleEn")}`;
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

  const [hrefTestDrive, t, locale] = await Promise.all([
    whatsappHref(await mensajeTestDrive(auto.nombre)),
    getTranslations("auto"),
    getLocale(),
  ]);
  // Ver la nota junto al mismo patrón en SiteLayout.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

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
      availability: esVendido(auto.estado)
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };

  // tipo/estado son texto libre en la base (ver TipoAuto/estado en
  // lib/cars.ts) — sólo pueden valer NUEVO/USADO y VENDIDO/null, así que se
  // traducen acá con esas claves fijas en vez de con tipoLabel/estadoLabel
  // (que devuelven el string en español a secas, usado por /admin).
  const tipoTraducido =
    auto.tipo === "NUEVO" || auto.tipo === "USADO" ? t(`tipo.${auto.tipo}`) : null;
  const estadoTraducido = esVendido(auto.estado) ? t("estado.VENDIDO") : null;

  const fichaTecnica = [
    { etiqueta: t("ficha.marca"), valor: auto.marca },
    { etiqueta: t("ficha.anio"), valor: auto.anio?.toString() },
    {
      etiqueta: t("ficha.kilometraje"),
      valor:
        auto.kilometraje != null
          ? `${numeroDe(locale).format(auto.kilometraje)} km`
          : null,
    },
    {
      etiqueta: t("ficha.transmision"),
      valor: valorDeCatalogo(t, "transmision", auto.transmision),
    },
    {
      etiqueta: t("ficha.combustible"),
      valor: valorDeCatalogo(t, "combustible", auto.combustible),
    },
    { etiqueta: t("ficha.color"), valor: auto.color },
    { etiqueta: t("ficha.condicion"), valor: tipoTraducido },
    { etiqueta: t("ficha.estado"), valor: estadoTraducido },
  ].filter((fila) => Boolean(fila.valor));

  return (
    <div className="mx-auto max-w-site px-5 py-16 sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        nonce={nonce}
        // El navegador oculta el valor real de `nonce` una vez aplicada la
        // CSP (devuelve "" al leer la propiedad), así que React ve el atributo
        // del HTML del servidor distinto del DOM y avisa por hidratación. Es
        // comportamiento esperado del navegador, no un bug del componente.
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehiculoSchema) }}
      />
      <Link
        href="/inventario"
        className="inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
      >
        <ChevronLeft className="size-3.5" />
        {t("volverInventario")}
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
            {await precioLegible(auto)}
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

          <div className="mt-10 flex flex-wrap gap-4">
            <SiteButton
              href={hrefTestDrive}
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              {t("ctaTestDrive")}
            </SiteButton>
            <SiteButton
              href="/inventario"
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              {t("ctaVerMasVehiculos")}
            </SiteButton>
          </div>
        </div>
      </div>
    </div>
  );
}
