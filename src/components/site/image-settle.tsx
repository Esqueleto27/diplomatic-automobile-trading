"use client";

import { motion } from "motion/react";

/**
 * Asentamiento liviano para fotos de tarjeta (auto, servicio): la imagen
 * arranca 6% más grande y se achica a su tamaño real mientras entra en
 * pantalla — versión reducida de `ImageReveal` (misma familia de gesto,
 * "la foto llega a su lugar"), sin la cortina de `clip-path`.
 *
 * Por qué no ImageReveal acá: esas tarjetas viven en grillas de 4 a 9
 * escalonadas por <Reveal>, que ya trae su propio fade+slide. Sumarle la
 * cortina completa (dos animaciones de más de 1s cada una, por tarjeta) se
 * probó y se leía recargado — demasiado movimiento compitiendo a la vez en
 * una misma pantalla. Esto es sólo la capa de escala, más corta (1.1s) y
 * sincronizada con la entrada del padre en vez de tener su propio delay.
 *
 * Se pide un `overflow-hidden` en el contenedor que la envuelve (ya lo
 * tienen CarMedia y ServiceCard) para que el 8% de más no se salga de la
 * tarjeta mientras asienta. No toca el zoom de hover — ese sigue viviendo
 * en la propia <Image> como transform de CSS; acá sólo se anima el
 * contenedor que la envuelve, así las dos animaciones nunca compiten por
 * la misma propiedad del mismo elemento.
 */
export function ImageSettle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 1.08 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
