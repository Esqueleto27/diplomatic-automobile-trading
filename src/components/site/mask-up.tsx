"use client";

import { motion } from "motion/react";

/**
 * El título sube desde detrás de un borde en vez de aparecer con un fade.
 *
 * Es el gesto editorial clásico —y el que más "hecho a mano" hace ver a una
 * página— porque implica que el texto ya existía debajo del recorte y sólo
 * se está mostrando. Un fade, en cambio, comunica que recién se está
 * dibujando.
 *
 * No se parte el texto en palabras ni en letras: el título entero sube como
 * un bloque. Partirlo obligaría a manipular el string, que acá viene
 * traducido desde next-intl y puede tener cualquier cantidad de líneas
 * según el idioma — además de romper el copiado y los lectores de pantalla.
 *
 * **El disparador va en el elemento de afuera, no en el que se mueve.**
 * No es un detalle de estilo: el hijo arranca desplazado 115% hacia abajo
 * dentro de un padre con `overflow-hidden`, así que su área visible al
 * inicio es exactamente cero — e IntersectionObserver recorta contra los
 * ancestros, o sea que un elemento de área cero nunca se reporta como
 * visible. Con `whileInView` puesto en el hijo, el observador no disparaba
 * nunca y el título quedaba oculto para siempre (pasó: en /empresa
 * desaparecieron tres títulos). El padre sí tiene área real, así que
 * observa bien; el hijo se mueve por variantes heredadas.
 *
 * `pb/-mb` de 0.14em: `overflow-hidden` recorta al ras de la caja de línea,
 * y las colas de las letras (la "j" de "vehículos", la tilde de una
 * mayúscula acentuada) sobresalen de ahí. Sin ese colchón se ven cortadas
 * al terminar la animación, cuando ya no debería quedar ningún recorte
 * visible.
 */
export function MaskUp({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.span
      className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px 0px" }}
    >
      <motion.span
        className="block"
        variants={{ oculto: { y: "115%" }, visible: { y: 0 } }}
        transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * La rayita dorada del título se dibuja de izquierda a derecha cuando la
 * sección entra en pantalla, en vez de estar ya puesta.
 *
 * Va acá y no en SectionHeading porque necesita ser client component, y
 * SectionHeading se usa desde páginas de servidor: separarlo deja que el
 * título siga renderizándose en el servidor y sólo este trazo (y el
 * MaskUp de arriba) viajen al navegador.
 *
 * Arranca un poco antes que el título (sin delay, contra los 0,12s del
 * texto): el trazo abre y el título entra atrás. Al revés se lee como que
 * la línea llega tarde.
 *
 * `scaleX` no cambia la caja de layout del elemento, así que acá el
 * observador sí puede ir en el mismo elemento que se anima (a diferencia
 * de MaskUp, ver la nota de arriba).
 */
export function RuleDraw({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "left" }}
    />
  );
}
