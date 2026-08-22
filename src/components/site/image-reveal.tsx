"use client";

import { motion } from "motion/react";

/**
 * Revelado de "cortina" para las fotos editoriales grandes (oficina,
 * /empresa, /contacto).
 *
 * Son dos animaciones sincronizadas, no una: el marco se descubre de abajo
 * hacia arriba (`clip-path`) mientras la foto que hay adentro baja de una
 * escala mayor a la suya real. El resultado es que la imagen parece
 * *llegar* a su lugar en vez de aparecer — el mismo gesto de una cortina
 * que sube sobre algo que ya estaba ahí. Un fade simple, en cambio, se lee
 * como que la página todavía está cargando.
 *
 * Por qué `clip-path` y `scale` y no `height`/`width`: las dos se resuelven
 * en el compositor sin recalcular layout, así que la animación corre a 60
 * cuadros por segundo incluso en un teléfono. Animar el alto real
 * empujaría todo el contenido de abajo en cada cuadro.
 *
 * El hijo va dentro de un contenedor `absolute inset-0`, así que este
 * componente espera recibir en `className` la caja con su relación de
 * aspecto (`relative aspect-[3/2] …`), igual que el div que reemplaza, y
 * adentro un `<Image fill>`.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px 0px" }}
      variants={{
        oculto: { clipPath: "inset(100% 0% 0% 0%)" },
        visible: { clipPath: "inset(0% 0% 0% 0%)" },
      }}
      transition={{ duration: 1.15, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        // Más lenta que la cortina a propósito: la foto sigue asentándose
        // un instante después de quedar descubierta. Si las dos terminan
        // juntas el movimiento se corta seco y pierde todo el efecto.
        //
        // Sin `whileInView` propio: hereda las variantes del padre. Un
        // observador aparte acá adentro sería poco fiable —este div es
        // `absolute inset-0` dentro de un padre recortado a altura cero al
        // inicio— y el navegador puede reportarlo como nunca visible, con lo
        // que la foto quedaría escondida para siempre. Ver la nota larga en
        // mask-up.tsx: es el mismo problema.
        variants={{ oculto: { scale: 1.16 }, visible: { scale: 1 } }}
        transition={{ duration: 1.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
