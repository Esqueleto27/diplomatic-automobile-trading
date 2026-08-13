"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Muestra un toast de éxito una sola vez cuando `show` es true (viene de un
 * query param que la Server Action agrega al redirect: `?creado=1`,
 * `?actualizado=1`) y después limpia ese param con `router.replace` para que
 * no vuelva a dispararse si el usuario refresca la página. Server Actions
 * como `createCar`/`updateCar` terminan en `redirect()`, así que no hay
 * forma de correr código en el cliente justo después de que la acción
 * termina — esta es la señal que cruza esa frontera.
 */
export function ActionToast({
  show,
  message,
  pathname,
  variant = "success",
}: {
  show: boolean;
  message: string;
  pathname: string;
  /** "error" para casos como "el auto se creó pero fallaron las fotos" —
   * un éxito parcial que igual merece la atención del admin. */
  variant?: "success" | "error";
}) {
  const router = useRouter();

  useEffect(() => {
    if (!show) return;
    if (variant === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
    router.replace(pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return null;
}
