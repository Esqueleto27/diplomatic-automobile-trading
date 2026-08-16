import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { AutoPublico } from "@/lib/cars";
import { esVendido } from "@/lib/cars";
import { CarMedia } from "@/components/site/car-media";
import { SiteButton } from "@/components/site/button";
import { cn } from "@/lib/utils";
import { numeroDe, precioDe } from "@/lib/format";

/** Traductor mínimo que necesita `valorDeCatalogo` — se tipa así (y no con
 * el tipo completo del translator de next-intl) para que la función sirva
 * tanto con `getTranslations` como con `useTranslations`. */
type Traductor = {
  (key: string): string;
  has: (key: string) => boolean;
};

/**
 * Traduce un valor que la base guarda como texto libre pero que en la
 * práctica sale de un desplegable cerrado del admin (transmisión:
 * Automática/Manual; combustible: Gasolina/Diésel/Híbrido/Eléctrico, ver
 * CarForm). Sin esto, un visitante en inglés leía "Automática · Gasolina"
 * en medio de una página en inglés.
 *
 * Si el valor no está en el catálogo —datos viejos, o un admin que en el
 * futuro escriba otra cosa— se devuelve tal cual en vez de romper: el
 * campo sigue siendo texto libre en el schema y no se puede asumir cerrado.
 */
export function valorDeCatalogo(
  t: Traductor,
  grupo: "transmision" | "combustible",
  valor: string | null,
): string | null {
  if (!valor) return valor;
  const key = `${grupo}.${valor}`;
  return t.has(key) ? t(key) : valor;
}

/** `locale` y `t` explícitos, no leídos acá adentro: esta función también la
 * usa la ficha de auto, que ya los resolvió para otras cosas — pedirlos como
 * argumento evita repetir el await en cada llamada. */
export function especificaciones(
  auto: AutoPublico,
  locale: string,
  t: Traductor,
): string {
  return [
    auto.anio?.toString(),
    auto.kilometraje != null
      ? `${numeroDe(locale).format(auto.kilometraje)} km`
      : null,
    valorDeCatalogo(t, "transmision", auto.transmision),
    valorDeCatalogo(t, "combustible", auto.combustible),
  ]
    .filter(Boolean)
    .join(" · ");
}

export async function precioLegible(auto: AutoPublico): Promise<string> {
  if (auto.precio != null) {
    return precioDe(await getLocale()).format(auto.precio);
  }
  const t = await getTranslations("auto");
  return t("precioConsulta");
}

/** Tarjeta completa con specs y acciones, para vehículos usados/diplomáticos. */
export async function CarCardDetalle({ auto }: { auto: AutoPublico }) {
  const vendido = esVendido(auto.estado);
  const [t, precio, locale] = await Promise.all([
    getTranslations("auto"),
    precioLegible(auto),
    getLocale(),
  ]);
  // El badge de estado ya dice "Vendido" cuando corresponde — mostrarlo dos
  // veces (el estado normal + un badge aparte) sería redundante, así que acá
  // sólo cambia el estilo del mismo badge en vez de sumar uno nuevo.
  const estado = vendido ? t("estado.VENDIDO") : null;
  const sinPrecio = auto.precio == null;

  return (
    <article
      className={cn(
        "group flex h-full flex-col border bg-surface transition-all duration-300 ease-out",
        vendido
          ? "border-white/[0.07]"
          : "border-gold/25 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift",
      )}
    >
      <Link
        href={`/autos/${auto.slug}`}
        className="relative block outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CarMedia
          auto={auto}
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
          className={cn(
            "aspect-video sm:aspect-[16/10]",
            vendido && "grayscale",
          )}
        />
        {vendido && <div aria-hidden className="absolute inset-0 bg-black/35" />}
        {estado && (
          <span
            className={cn(
              "absolute left-3 top-3 border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] backdrop-blur-sm",
              vendido
                ? "border-foreground/40 bg-background/90 text-foreground"
                : "border-gold/60 bg-background/85 text-gold",
            )}
          >
            {estado}
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", vendido && "opacity-60")}>
        <h3 className="font-display text-xl leading-tight tracking-wide">
          <Link href={`/autos/${auto.slug}`} className="hover:text-gold">
            {auto.nombre}
          </Link>
        </h3>

        <p className="mt-3 text-sm tracking-wide text-muted-foreground">
          {especificaciones(auto, locale, t)}
        </p>

        {/* mt-auto ancla precio + CTA al fondo de la card: sin esto, un
            título de 2 líneas en una tarjeta y de 1 en la de al lado
            desalinea dónde caen el precio y el botón entre columnas. */}
        <div className="mt-auto pt-3">
          <p
            className={cn(
              "font-semibold tracking-wide text-gold",
              sinPrecio ? "text-base" : "text-[1.375rem]",
            )}
          >
            {precio}
          </p>

          <div className="mt-5 flex flex-wrap gap-3 pt-1 sm:mt-6">
            <SiteButton href={`/autos/${auto.slug}`} size="sm">
              {vendido ? t("verDetalle") : t("verMas")}
            </SiteButton>
          </div>
        </div>
      </div>
    </article>
  );
}
