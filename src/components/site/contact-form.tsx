"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteButton } from "@/components/site/button";
import { enviarMensajeContacto } from "@/server/actions/contacto";
import { cn } from "@/lib/utils";

// Estilo propio sobre los primitivos de shadcn: acá pisamos rounded-lg/h-8
// genéricos por el lenguaje visual del sitio (esquinas rectas, campos altos,
// foco dorado) sin tocar los componentes base — /admin sigue usando su look
// neutro de shadcn sin ajuste.
const campoClases =
  "h-12 rounded-none border-border bg-transparent px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground/50 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

const etiquetaClases =
  "text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted-foreground";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    enviarMensajeContacto,
    undefined,
  );
  const errors = state?.errors ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  // Limpia el formulario tras un envío exitoso.
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-6 sm:grid-cols-2"
    >
      {/* Honeypot: oculto para personas, visible para bots que rellenan todo. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa_web">No completar este campo</label>
        <input
          id="empresa_web"
          name="empresa_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2.5 sm:col-span-2">
        <Label htmlFor="nombre" className={etiquetaClases}>
          Nombre y apellido
        </Label>
        <Input
          id="nombre"
          name="nombre"
          required
          className={campoClases}
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className="text-[0.7rem] text-destructive">
            {errors.nombre[0]}
          </p>
        )}
      </div>

      <div className="space-y-2.5 sm:col-span-2">
        <Label htmlFor="email" className={etiquetaClases}>
          Correo electrónico
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className={campoClases}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-[0.7rem] text-destructive">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2.5 sm:col-span-2">
        <Label htmlFor="asunto" className={etiquetaClases}>
          Asunto
        </Label>
        <Input
          id="asunto"
          name="asunto"
          required
          className={campoClases}
          aria-invalid={Boolean(errors.asunto)}
          aria-describedby={errors.asunto ? "asunto-error" : undefined}
        />
        {errors.asunto && (
          <p id="asunto-error" className="text-[0.7rem] text-destructive">
            {errors.asunto[0]}
          </p>
        )}
      </div>

      <div className="space-y-2.5 sm:col-span-2">
        <Label htmlFor="mensaje" className={etiquetaClases}>
          Mensaje
        </Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          className={cn(campoClases, "h-auto min-h-36 py-3")}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
        />
        {errors.mensaje && (
          <p id="mensaje-error" className="text-[0.7rem] text-destructive">
            {errors.mensaje[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 sm:col-span-2 sm:flex-row sm:items-center">
        <SiteButton
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isPending ? "Enviando..." : "Enviar mensaje"}
        </SiteButton>

        {state?.ok && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-gold"
          >
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            Mensaje enviado. Le responderemos a la brevedad.
          </p>
        )}

        {state?.message && (
          <p
            role="alert"
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <TriangleAlert className="size-4 shrink-0" aria-hidden />
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
