"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function loginAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Email o contraseña incorrectos.";
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
