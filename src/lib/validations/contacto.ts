import { z } from "zod";

// Límites de tamaño: el endpoint es público y sin sesión (cualquiera puede
// enviar POSTs directos sin pasar por el formulario), así que sin tope
// alguien podría insertar mensajes de varios MB repetidamente en D1.
export const contactoSchema = z.object({
  nombre: z.string().trim().min(1, "Ingrese su nombre y apellido").max(150),
  email: z.string().trim().email("Ingrese un correo válido").max(254),
  asunto: z.string().trim().min(1, "Ingrese un asunto").max(200),
  mensaje: z.string().trim().min(1, "Escriba su mensaje").max(5000),
});
