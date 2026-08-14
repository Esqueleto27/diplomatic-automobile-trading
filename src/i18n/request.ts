import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export const LOCALE_COOKIE = "locale";
export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

// Sin prefijo de URL a propósito (nada de /en/...): el cliente pidió
// explícitamente que sea "la misma URL pero en inglés". El idioma se guarda
// en una cookie y esta config lo lee en cada request — no hace falta el
// middleware de next-intl (ese es para enrutamiento por URL, que acá no
// existe), así que src/middleware.ts (CSP/auth/seguridad) queda intacto.
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const valor = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = valor === "en" ? "en" : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
