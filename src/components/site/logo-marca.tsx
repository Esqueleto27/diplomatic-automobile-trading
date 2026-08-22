import type { marcas } from "@/lib/site";

/**
 * Un logo del muro de marcas — o su fallback tipográfico si la marca no
 * tiene SVG todavía (ver la nota junto a `marcas` en site.ts). Usado por
 * BrandStrip (home) y por la sección de marcas de /empresa: antes cada una
 * tenía su propia copia de este mismo bloque, con el mismo cálculo de
 * altura (`2.76 * escala`) — ajustar el tamaño de los logos exigía tocar
 * los dos archivos y acordarse del segundo.
 *
 * No es `next/image`: son ~20 SVG livianos servidos como estáticos desde
 * R2, tratados con `opacity` (no `currentColor`), así que van en `<img>`
 * corriente — mismo criterio que ya tenían BrandStrip y /empresa.
 *
 * `hover` distingue si el hover dispara directo sobre este elemento
 * ("direct", el caso de BrandStrip) o sobre un `.group` que lo envuelve
 * ("group", el caso de /empresa, que además anima con <Reveal>).
 */
export function LogoMarca({
  marca,
  hover = "direct",
}: {
  marca: (typeof marcas)[number];
  hover?: "direct" | "group";
}) {
  if (!marca.logo) {
    return (
      <span
        className={`whitespace-nowrap font-display text-lg uppercase tracking-[0.18em] text-foreground/70 transition-colors duration-300 ${hover === "group" ? "group-hover:text-foreground" : "hover:text-foreground"}`}
      >
        {marca.nombre}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={marca.logo}
      alt={marca.nombre}
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      // Alto fluido, no fijo: 2.76rem (44px) es la medida pensada para el
      // muro de desktop y en una grilla de 390px dejaba los logos casi
      // pegados entre filas. `clamp` los baja a ~26px en móvil y recupera el
      // valor original desde tablet. `escala` sigue siendo el ajuste óptico
      // por forma del glifo (ver la nota de `marcas` en site.ts).
      style={{
        height: `calc(clamp(1.6rem, 5.5vw, 2.76rem) * ${marca.escala ?? 1})`,
      }}
      className={`w-auto opacity-75 transition-all duration-500 ease-out ${hover === "group" ? "group-hover:scale-110 group-hover:opacity-100" : "hover:scale-110 hover:opacity-100"}`}
    />
  );
}
