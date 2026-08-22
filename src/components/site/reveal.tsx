"use client";

import { motion } from "motion/react";

/**
 * Entrada en pantalla discreta, una sola vez. Variantes de dirección:
 * - "up"   → sube 24px
 * - "left" → viene desde la izquierda (24px)
 * - "right"→ viene desde la derecha (24px)
 * - "scale"→ crece desde 0.96
 * Deliberadamente sutil — la idea es que la página se sienta viva al bajar,
 * no que el efecto se note como "efecto".
 */
export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const inicial =
    direction === "up"
      ? { opacity: 0, y: 32 }
      : direction === "left"
        ? { opacity: 0, x: -24 }
        : direction === "right"
          ? { opacity: 0, x: 24 }
          : { opacity: 0, scale: 0.96 };

  return (
    <motion.div
      initial={inicial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      // "-80px 0px" y no "-80px": un solo valor encoge la caja de detección
      // por los cuatro lados, también a izquierda y derecha. En un teléfono de
      // 390px eso deja una franja activa de apenas 230px (de x=80 a x=310), y
      // cualquier elemento angosto pegado a un borde — las columnas 1 y 4 de
      // la grilla de logos de /empresa — nunca la tocaba: se quedaban en
      // opacity 0 para siempre, o sea que la mitad de las marcas no se veían
      // en móvil. El margen sólo tenía sentido en vertical (disparar 80px
      // antes de que el elemento entre desde abajo).
      viewport={{ once: true, margin: "-80px 0px" }}
      // 0.85s y no 0.6: a esta distancia de recorrido, 600ms se lee como
      // "aparece", 850ms se lee como "entra". Es la misma diferencia que hay
      // entre una puerta con amortiguador y una sin él — el gesto es el
      // mismo, lo que cambia es cuánto cuidado transmite.
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
