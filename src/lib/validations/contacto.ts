import { z } from "zod";

export const contactoSchema = z.object({
  nombre: z.string().trim().min(1, "Ingrese su nombre"),
  apellido: z.string().trim().min(1, "Ingrese su apellido"),
  email: z.string().trim().email("Ingrese un correo válido"),
  asunto: z.string().trim().min(1, "Ingrese un asunto"),
  mensaje: z.string().trim().min(1, "Escriba su mensaje"),
});
