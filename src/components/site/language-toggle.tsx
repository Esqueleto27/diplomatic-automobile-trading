"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { setLocale } from "@/server/actions/locale";
import type { Locale } from "@/i18n/request";
import { FlagES, FlagUS } from "@/components/site/flag-icons";

const BANDERAS: Record<Locale, typeof FlagES> = { es: FlagES, en: FlagUS };

/**
 * ES/EN en la misma URL (sin /en/...): guarda la elección en cookie
 * (setLocale) y pide un router.refresh() — el árbol de Server Components se
 * re-renderiza con los mensajes nuevos, y como NextIntlClientProvider vive
 * en el layout del sitio (ver SiteLayout), los Client Components debajo
 * (este mismo botón, el menú móvil) también reciben el idioma actualizado.
 */
export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations("idioma");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function cambiar(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  // Bandera en vez de texto ES/EN, a pedido del cliente — el nombre del
  // idioma sigue existiendo como aria-label (accesible), la bandera sola no
  // es una etiqueta suficiente por su cuenta.
  //
  // Dos decisiones para que no desentonen con el resto del sitio, donde todo
  // es marfil, dorado y negro cálido:
  //
  // 1. Más chicas (20px de alto contra 28px): un selector de idioma es un
  //    control de servicio, no un elemento de marca. Antes pesaban más que
  //    los links del nav.
  // 2. El aro pasa de blanco frío al hairline cálido del tema, y se le suma
  //    un borde interior oscuro: la bandera queda embutida en la página en
  //    vez de pegada encima.
  //
  // Las dos banderas van siempre a todo color — se probó apagar la inactiva
  // a gris (`opacity-45 grayscale`) y el cliente lo vio como "una bandera
  // oscura", no como un estado apagado legible. El subrayado dorado ya
  // marca cuál está activa sin necesidad de tocar el color de la bandera en
  // sí; `saturate(.85)` en las dos por igual las mete en la misma familia
  // tonal que el resto del sitio sin que ninguna se lea "apagada".
  const opcion = (value: Locale) => {
    const activo = locale === value;
    const Bandera = BANDERAS[value];

    return (
      <button
        type="button"
        onClick={() => cambiar(value)}
        aria-pressed={activo}
        aria-label={t(value)}
        disabled={isPending}
        className="group relative cursor-pointer p-1 pb-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-wait"
      >
        <Bandera
          className="h-[1.125rem] w-[1.6875rem] rounded-[1px] shadow-[0_0_0_1px_var(--hairline-strong),inset_0_0_0_1px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out sm:h-5 sm:w-[1.875rem] [filter:saturate(.85)]"
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-1 bottom-0 h-px origin-left bg-gold transition-transform duration-300 ease-out",
            activo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            !activo && "bg-gold/40",
          )}
        />
      </button>
    );
  };

  return (
    <div role="group" aria-label={t("aria")} className="flex items-center gap-2">
      {opcion("es")}
      {/* Filete vertical entre las dos: las convierte en un control único
          con dos posiciones, en vez de dos botones sueltos al lado del
          menú. Es el mismo hairline que separa todo lo demás del sitio. */}
      <span aria-hidden className="h-3 w-px bg-hairline-strong" />
      {opcion("en")}
    </div>
  );
}
