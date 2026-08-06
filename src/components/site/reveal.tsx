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
      ? { opacity: 0, y: 24 }
      : direction === "left"
        ? { opacity: 0, x: -24 }
        : direction === "right"
          ? { opacity: 0, x: 24 }
          : { opacity: 0, scale: 0.96 };

  return (
    <motion.div
      initial={inicial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
