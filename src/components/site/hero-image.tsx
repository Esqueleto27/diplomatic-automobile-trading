"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { heroImageUrl } from "@/lib/site";

/**
 * Foto del hero con un parallax muy suave: al scrollear, la imagen se mueve
 * más lento que la página (apenas ~10%). Es el único bloque del hero que
 * necesita ser client component — el Ken Burns (scale) vive en el `img` vía
 * CSS, así que no pisa el transform del parallax.
 */
export function HeroImage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    // `initial`/`animate` (escala) y `style` (parallax) conviven en el mismo
    // elemento: Motion compone las dos en un solo transform. La foto entra
    // un 12% más grande y se asienta en su tamaño real mientras el telón se
    // levanta — es lo que convierte la carga en una presentación en vez de
    // una aparición. 2,2s, más lento que el telón (1,5s), así que la imagen
    // sigue moviéndose un instante después de quedar descubierta.
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ scale: 1.12 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 -z-10"
    >
      <Image
        src={heroImageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        // En móvil el recorte es más alto/angosto que en desktop y 58%
        // dejaba al auto corrido hacia un borde detrás del texto centrado
        // (ver comentario del velo, arriba) — centrado a secas se ve mejor
        // ahí; desde sm: (donde el texto vuelve a vivir a la izquierda) se
        // conserva el 58% original.
        // El Ken Burns arranca recién a los 3s: si corre encima de la
        // entrada de arriba, los dos movimientos de escala se pisan y el
        // asentamiento se lee tembloroso en vez de firme.
        className="animate-hero-zoom object-cover object-center [animation-delay:3s] sm:object-[58%_center]"
      />
    </motion.div>
  );
}
