// Formateadores compartidos entre el sitio público y el panel admin — antes
// cada uno definía su propia copia (a veces con configuración distinta por
// descuido: la tabla de autos del admin llegó a mostrar un precio con otro
// formato que las tarjetas del sitio). Un solo `Intl.NumberFormat`/
// `Intl.DateTimeFormat` por tipo, reusado en todos lados.

// Los números SÍ dependen del idioma, no sólo el texto: en español el punto
// separa miles ("$168.000") pero en inglés ese mismo string se lee como
// "168 dólares con cero centavos" — un precio de seis cifras pasaba a
// parecer uno de tres. Igual con el kilometraje ("38.000 km" vs "38,000
// km"). Por eso el sitio público pide el formateador de su locale en vez de
// usar uno fijo.
const LOCALES = { es: "es-EC", en: "en-US" } as const;
const intlLocale = (locale: string) =>
  LOCALES[locale as keyof typeof LOCALES] ?? LOCALES.es;

// Cacheados por locale: construir un Intl.NumberFormat no es gratis y estas
// funciones se llaman una vez por auto en cada render del inventario.
const cacheNumero = new Map<string, Intl.NumberFormat>();
const cachePrecio = new Map<string, Intl.NumberFormat>();

export function numeroDe(locale: string): Intl.NumberFormat {
  const key = intlLocale(locale);
  let f = cacheNumero.get(key);
  if (!f) { f = new Intl.NumberFormat(key); cacheNumero.set(key, f); }
  return f;
}

export function precioDe(locale: string): Intl.NumberFormat {
  const key = intlLocale(locale);
  let f = cachePrecio.get(key);
  if (!f) {
    f = new Intl.NumberFormat(key, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    cachePrecio.set(key, f);
  }
  return f;
}

// Fijos en español: los usa sólo /admin, que es herramienta interna y no
// tiene selector de idioma.
export const formatoNumero = numeroDe("es");
export const formatoPrecio = precioDe("es");

export const formatoFecha = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
});

export const formatoFechaHora = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});
