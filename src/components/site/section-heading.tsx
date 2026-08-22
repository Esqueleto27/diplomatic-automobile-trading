import { cn } from "@/lib/utils";
import { MaskUp, RuleDraw } from "@/components/site/mask-up";

/**
 * Título de sección del sitio. Un solo archivo controla el ritmo
 * tipográfico de casi toda la página: cambiar acá la escala o la rayita
 * repinta todas las secciones a la vez.
 *
 * La rayita dorada dejó de ser un bloque de color plano (`bg-gold/70`) y
 * pasó a un degradado que se apaga hacia la derecha (`.rule-gold`). Es un
 * detalle chico con una consecuencia grande: una línea que corta seco se
 * lee como el borde de una caja, una que se disuelve se lee como un trazo
 * — el mismo gesto que usa una marca de lujo en un catálogo impreso. De
 * paso es más larga (80px contra 48px), que es lo que la vuelve un
 * elemento de composición y no una viñeta.
 */
export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={cn(
        // `text-balance` reparte las palabras entre líneas en vez de dejar
        // una huérfana al final: en un display grande, un título que corta
        // con una sola palabra en la segunda línea se ve como un error de
        // maquetado, no como una decisión.
        "font-display text-[clamp(1.9rem,3.9vw,3rem)] font-light leading-[1.08] tracking-[0.015em] text-balance",
        className,
      )}
    >
      <RuleDraw className="rule-gold mb-5 block h-px w-20" />
      <MaskUp delay={0.12}>{children}</MaskUp>
    </Tag>
  );
}
