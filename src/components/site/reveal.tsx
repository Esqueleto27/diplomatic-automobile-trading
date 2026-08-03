"use client";

import { motion } from "motion/react";

/**
 * Fade + slide-up al entrar en pantalla, una sola vez. Deliberadamente
 * discreto (24px, 0.6s) — la idea es que la página se sienta viva al
 * bajar, no que el efecto se note como "efecto".
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
