"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enviarMensajeContacto } from "@/server/actions/contacto";

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
      className="grid gap-5 sm:grid-cols-2"
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

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido">Apellido</Label>
        <Input id="apellido" name="apellido" required />
        {errors.apellido && (
          <p className="text-xs text-destructive">{errors.apellido[0]}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" name="email" type="email" required />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="asunto">Asunto</Label>
        <Input id="asunto" name="asunto" required />
        {errors.asunto && (
          <p className="text-xs text-destructive">{errors.asunto[0]}</p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea id="mensaje" name="mensaje" rows={5} required />
        {errors.mensaje && (
          <p className="text-xs text-destructive">{errors.mensaje[0]}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        {state?.ok && (
          <p className="mb-4 text-sm text-gold">
            Mensaje enviado. Le responderemos a la brevedad.
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 items-center justify-center bg-gold px-8 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-foreground outline-none transition-colors hover:bg-gold-strong focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
