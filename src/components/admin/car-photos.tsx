"use client";

import { useActionState, useRef, useEffect } from "react";
import { Star, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          Fotos
          <span className="text-sm font-normal text-muted-foreground">
            {fotos.length}/{MAX_FOTOS_POR_AUTO}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fotos.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {fotos.map((foto) => (
              <li
                key={foto.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- URL dinámica de R2, panel interno sin necesidad de optimización */}
                <img
                  src={foto.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {foto.portada && (
                  <Badge className="absolute left-1.5 top-1.5 gap-1">
                    <Star className="size-3" />
                    Portada
                  </Badge>
                )}
                {/* Overlay de acciones al hover, en vez de dos botones fijos
                    debajo de cada foto: la grilla queda mucho más compacta y
                    limpia, sobre todo con 8-10 fotos. */}
                <div className="absolute inset-0 flex items-end justify-center gap-1.5 bg-black/0 p-1.5 opacity-0 transition-all duration-150 group-hover:bg-black/50 group-hover:opacity-100 focus-within:bg-black/50 focus-within:opacity-100">
                  {!foto.portada && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      title="Marcar como portada"
                      onClick={() => marcarPortada(carId, foto.id)}
                    >
                      <Star className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    title="Borrar foto"
                    onClick={() => eliminarFoto(carId, foto.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {fotos.length < MAX_FOTOS_POR_AUTO && (
          <form ref={formRef} action={formAction}>
            <label
              htmlFor="fotos-subir"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-accent/40"
            >
              <UploadCloud className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                Hacé clic para elegir fotos
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG o WebP · hasta 8 MB cada una
              </span>
            </label>
            <input
              id="fotos-subir"
              type="file"
              name="fotos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              className="sr-only"
              onChange={(e) => {
                if (e.currentTarget.files?.length) {
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            {state?.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
            {isPending && (
              <p className="mt-2 text-sm text-muted-foreground">Subiendo...</p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
