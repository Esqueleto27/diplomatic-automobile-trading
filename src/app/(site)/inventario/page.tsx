import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAutosVisibles } from "@/lib/cars";
import { CarCardDetalle } from "@/components/site/car-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("inventarioTitulo"),
    description: t("inventarioDescripcion"),
    alternates: { canonical: "/inventario" },
  };
}

// Sin filtro por tipo: todo el inventario es de vehículos usados (los
// "diplomáticos" son una variante de usado, no una categoría aparte para el
// visitante), así que separar con tabs no aportaba nada — se muestra todo
// junto directamente.
export default async function InventarioPage() {
  const [autos, t] = await Promise.all([
    getAutosVisibles(),
    getTranslations("inventario"),
  ]);

  return (
    <div className="mx-auto max-w-site px-5 py-14 sm:px-8 sm:py-32">
      <SectionHeading as="h1">{t("titulo")}</SectionHeading>
      <p className="mt-6 max-w-lg text-base leading-[1.8] text-muted-foreground sm:text-lg">
        {t("texto")}
      </p>

      {autos.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">
          {t("vacioTexto")}{" "}
          <Link href="/contacto" className="text-gold hover:underline">
            {t("vacioLink")}
          </Link>{" "}
          {t("vacioFin")}
        </p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {autos.map((auto, i) => (
            <li key={auto.id}>
              <Reveal delay={(i % 4) * 0.06}>
                <CarCardDetalle auto={auto} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
