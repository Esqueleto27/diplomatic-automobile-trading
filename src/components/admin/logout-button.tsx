"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground"
      >
        <LogOut className="size-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}
