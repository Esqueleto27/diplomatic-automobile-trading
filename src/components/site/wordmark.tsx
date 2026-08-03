import Image from "next/image";
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center leading-none", className)}>
      <Image
        src="/img/logo/logo-300x74.png"
        alt="Diplomatic Automobile Trading"
        width={300}
        height={74}
        priority={priority}
        className="h-10 w-auto sm:h-12"
      />
    </span>
  );
}
