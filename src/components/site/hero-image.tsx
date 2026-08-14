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
    <motion.div ref={ref} style={{ y }} className="absolute inset-0 -z-10">
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
        className="animate-hero-zoom object-cover object-center sm:object-[58%_center]"
      />
    </motion.div>
  );
}
