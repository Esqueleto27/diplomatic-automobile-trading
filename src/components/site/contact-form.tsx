"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteButton } from "@/components/site/button";
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
        <Input
          id="nombre"
          name="nombre"
          required
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className="text-xs text-destructive">
            {errors.nombre[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          required
          aria-invalid={Boolean(errors.apellido)}
          aria-describedby={errors.apellido ? "apellido-error" : undefined}
        />
        {errors.apellido && (
          <p id="apellido-error" className="text-xs text-destructive">
            {errors.apellido[0]}
          </p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="asunto">Asunto</Label>
        <Input
          id="asunto"
          name="asunto"
          required
          aria-invalid={Boolean(errors.asunto)}
          aria-describedby={errors.asunto ? "asunto-error" : undefined}
        />
        {errors.asunto && (
          <p id="asunto-error" className="text-xs text-destructive">
            {errors.asunto[0]}
          </p>
        )}
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
        />
        {errors.mensaje && (
          <p id="mensaje-error" className="text-xs text-destructive">
            {errors.mensaje[0]}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        {state?.ok && (
          <p role="status" className="mb-4 text-sm text-gold">
            Mensaje enviado. Le responderemos a la brevedad.
          </p>
        )}
        <SiteButton type="submit" disabled={isPending} size="lg">
          {isPending ? "Enviando..." : "Enviar"}
        </SiteButton>
      </div>
    </form>
  );
}
