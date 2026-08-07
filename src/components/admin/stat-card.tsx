import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  /** "warning" resalta el número en dorado — para cosas que piden atención
   * (mensajes sin leer, autos sin fotos), no para conteos neutros. */
  tone?: "default" | "warning";
}) {
  return (
    <Card className="flex-row items-center gap-4 px-5 py-5">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-lg",
          tone === "warning"
            ? "bg-primary/15 text-primary"
            : "bg-accent text-foreground/70",
        )}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <p
          className={cn(
            "text-2xl font-semibold tabular-nums tracking-tight",
            tone === "warning" && "text-primary",
          )}
        >
          {value}
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
