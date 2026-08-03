"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { loginSchema } from "@/lib/validations/auth";

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return "Email o contraseña incorrectos.";
  }

  const db = await getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.email, parsed.data.email),
  });
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
