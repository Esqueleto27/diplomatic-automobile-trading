import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Panel de administración</h1>
          <p className="text-sm text-muted-foreground">
            Diplomatic Automobile Trading
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
