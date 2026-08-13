import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { logoUrl } from "@/lib/site";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src={logoUrl} alt="" aria-hidden width={300} height={74} className="h-9 w-auto" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Panel de administración
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ingresa con tu cuenta para continuar.
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
