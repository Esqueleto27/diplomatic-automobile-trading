"use client";

import { useActionState, useRef, useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoPicker } from "@/components/admin/photo-picker";
import { MAX_FOTOS_POR_AUTO } from "@/lib/fotos";
import {
  subirFotos,
  eliminarFoto,
  marcarPortada,
  type SubirFotosState,
} from "@/server/actions/car-photos";

type Foto = { id: string; url: string; portada: boolean };

export function CarPhotos({ carId, fotos }: { carId: string; fotos: Foto[] }) {
  const subirConId = subirFotos.bind(null, carId);
  const [state, formAction, isPending] = useActionState<
    SubirFotosState,
    FormData
  >(subirConId, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  // PhotoPicker guarda sus propios archivos elegidos en estado interno —
  // formRef.current?.reset() sólo limpia el <input> nativo, no ese estado.
  // Cambiar su `key` lo remonta desde cero tras un envío exitoso, que es la
  // forma más simple de vaciarlo sin exponerle un método imperativo.
  const [pickerKey, setPickerKey] = useState(0);

  useEffect(() => {
    if (!state?.error) {
      formRef.current?.reset();
      setPickerKey((k) => k + 1);
    }
  }, [state]);

  // marcarPortada/eliminarFoto no pasan por useActionState (son botones
  // sueltos, no un <form>) — sin este manejo quedaban en fire-and-forget
  // total: si fallaban, no había ningún indicio en la pantalla.
  const handleMarcarPortada = (photoId: string) => {
    startTransition(async () => {
      const error = await marcarPortada(carId, photoId);
      if (error) toast.error(error);
    });
  };

  const handleEliminarFoto = (photoId: string) => {
    startTransition(async () => {
      const error = await eliminarFoto(carId, photoId);
      if (error) toast.error(error);
    });
  };

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
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={foto.url}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                  className="object-cover"
                />
                {foto.portada && (
                  <Badge className="absolute left-1.5 top-1.5 gap-1">
                    <Star className="size-3" />
                    Portada
                  </Badge>
                )}
                {/* Siempre visibles, no sólo al hover: en touch (celular,
                    tablet) no existe hover, así que un overlay hover-only
                    dejaba estos botones inalcanzables — justo el reclamo de
                    "no puedo borrar/marcar portada" en el panel desde
                    mobile. Fondo semi-opaco propio para que se lean sobre
                    cualquier foto sin depender de un overlay general. */}
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  {!foto.portada && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      title="Marcar como portada"
                      aria-label="Marcar como portada"
                      className="bg-background/80 shadow-sm backdrop-blur-sm hover:bg-background"
                      onClick={() => handleMarcarPortada(foto.id)}
                    >
                      <Star className="size-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    title="Borrar foto"
                    aria-label="Borrar foto"
                    className="shadow-sm"
                    onClick={() => handleEliminarFoto(foto.id)}
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
            <PhotoPicker key={pickerKey} name="fotos" />
            <Button type="submit" disabled={isPending} className="mt-3">
              {isPending ? "Subiendo..." : "Subir fotos"}
            </Button>
            {state?.error && (
              <p className="mt-2 text-sm text-destructive">{state.error}</p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
