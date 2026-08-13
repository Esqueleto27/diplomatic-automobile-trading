"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";
import { errorAdmin } from "@/lib/action-error";
import { dentroDelLimite, getRateLimiter } from "@/lib/rate-limit";

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  // Hay un único admin y su email es adivinable — sin este límite, nada
  // impedía lanzarle intentos de contraseña a la velocidad que aguantara
  // el Worker. 5 intentos por minuto por IP alcanza de sobra para un login
  // legítimo (incluso con algún typo) y frena la fuerza bruta.
  const limiter = await getRateLimiter("RATE_LIMITER_LOGIN");
  if (!(await dentroDelLimite(limiter))) {
    return "Demasiados intentos. Espera un minuto y vuelve a intentar.";
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return "Email o contraseña incorrectos.";
  }

  let user;
  try {
    const db = await getDb();
    user = await db.query.users.findFirst({
      where: eq(users.email, parsed.data.email),
    });
  } catch (error) {
    return errorAdmin(error, "loginAction: lookup");
  }

  if (!user) {
    return "Email o contraseña incorrectos.";
  }

  const isValidPassword = await verifyPassword(
    parsed.data.password,
    user.hashedPassword,
  );
  if (!isValidPassword) {
    return "Email o contraseña incorrectos.";
  }

  await createSession({ userId: user.id, email: user.email });
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
