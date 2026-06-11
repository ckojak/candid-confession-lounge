import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-2xl font-bold tracking-tight text-foreground select-none",
        className,
      )}
    >
      kojak<span className="text-primary">.</span>
    </span>
  );
}