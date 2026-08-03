"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  subirFotos,
  eliminarFoto,
  marcarPortada,
  type SubirFotosState,
} from "@/server/actions/car-photos";

const MAX_FOTOS_POR_AUTO = 10;

type Foto = { id: string; url: string; portada: boolean };

export function CarPhotos({ carId, fotos }: { carId: string; fotos: Foto[] }) {
  const subirConId = subirFotos.bind(null, carId);
  const [state, formAction, isPending] = useActionState<
    SubirFotosState,
    FormData
  >(subirConId, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">
        Fotos ({fotos.length}/{MAX_FOTOS_POR_AUTO})
      </h2>

      {fotos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {fotos.map((foto) => (
            <li key={foto.id} className="space-y-1.5">
              <div className="relative aspect-square overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element -- URL dinámica de R2, panel interno sin necesidad de optimización */}
                <img
                  src={foto.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {foto.portada && (
                  <Badge className="absolute left-1.5 top-1.5">Portada</Badge>
                )}
              </div>
              <div className="flex gap-1">
                {!foto.portada && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => marcarPortada(carId, foto.id)}
                  >
                    Portada
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-xs text-destructive"
                  onClick={() => eliminarFoto(carId, foto.id)}
                >
                  Borrar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {fotos.length < MAX_FOTOS_POR_AUTO && (
        <form ref={formRef} action={formAction} className="space-y-2">
          <input
            type="file"
            name="fotos"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? "Subiendo..." : "Subir fotos"}
          </Button>
        </form>
      )}
    </div>
  );
}
