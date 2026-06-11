import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className, label = false }: { className?: string; label?: boolean }) {
  return (
    <span
      title="Identidade verificada"
      className={cn("inline-flex items-center gap-1 text-primary", className)}
    >
      <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
      {label && <span className="text-xs font-medium">Verificado</span>}
    </span>
  );
}