"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  eliminarMensaje,
  marcarMensajeLeido,
} from "@/server/actions/contacto";

export function MensajeLeidoToggle({
  id,
  leido,
}: {
  id: string;
  leido: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={leido}
        disabled={isPending}
        onCheckedChange={(checked) =>
          startTransition(() => marcarMensajeLeido(id, checked === true))
        }
        aria-label="Marcar como leído"
      />
      <span className="text-xs text-muted-foreground">Leído</span>
    </div>
  );
}

export function EliminarMensajeButton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await eliminarMensaje(id);
      toast.success(`Mensaje de "${nombre}" eliminado`);
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive" />
        }
      >
        <Trash2 className="size-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar mensaje de &quot;{nombre}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            {isPending ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
