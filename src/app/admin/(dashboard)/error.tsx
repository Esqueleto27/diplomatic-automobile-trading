"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Sin este archivo, cualquier excepción no controlada en /admin/* (incluida
 * la que motivó este archivo: un error de cliente al elegir fotos) tumbaba
 * toda la pantalla con el "Application error" genérico de Next.js — sin
 * contexto, sin forma de volver atrás sin recargar todo. Next.js monta este
 * error boundary automáticamente para toda la ruta `(dashboard)` cuando un
 * componente debajo tira una excepción durante el render.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-lg font-semibold">Algo salió mal</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Hubo un error inesperado en esta pantalla. Puedes intentar de nuevo
        sin perder la sesión — si vuelve a pasar, avísale a soporte con el
        detalle de qué estabas haciendo.
      </p>
      <Button onClick={() => reset()} className="gap-2">
        <RotateCcw className="size-4" aria-hidden />
        Intentar de nuevo
      </Button>
    </div>
  );
}
