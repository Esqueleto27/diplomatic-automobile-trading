import { cn } from "@/lib/utils";

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={cn(
        "font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-light leading-[1.1] tracking-wide",
        className,
      )}
    >
      <span aria-hidden className="mb-4 block h-px w-12 bg-gold/70" />
      {children}
    </Tag>
  );
}
