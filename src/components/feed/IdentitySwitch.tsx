import { VenetianMask } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function IdentitySwitch({
  anonymous,
  onChange,
  userName,
}: {
  anonymous: boolean;
  onChange: (anonymous: boolean) => void;
  userName: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Identidade do post"
      className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-background/50 p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!anonymous}
        onClick={() => onChange(false)}
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
          !anonymous
            ? "bg-primary/15 text-foreground ring-1 ring-primary shadow-[var(--shadow-glow)]"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarFallback className="bg-secondary text-xs text-foreground">
            {initials(userName)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 truncate">
          <span className="block text-xs opacity-70">Postar como</span>
          <span className="block truncate font-semibold">{userName.split(" ")[0]}</span>
        </span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={anonymous}
        onClick={() => onChange(true)}
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
          anonymous
            ? "bg-primary/15 text-foreground ring-1 ring-primary shadow-[var(--shadow-glow)]"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted">
          <VenetianMask className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs opacity-70">Postar</span>
          <span className="block font-semibold">Anonimamente</span>
        </span>
      </button>
    </div>
  );
}