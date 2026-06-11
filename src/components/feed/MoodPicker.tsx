import { MOODS, type MoodId } from "@/lib/mood";
import { cn } from "@/lib/utils";

export function MoodPicker({
  value,
  onChange,
}: {
  value: MoodId | null;
  onChange: (m: MoodId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MOODS.map((m) => {
        const Icon = m.icon;
        const active = value === m.id;
        return (
          <button
            type="button"
            key={m.id}
            onClick={() => onChange(m.id)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? `${m.chip} ${m.color}`
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}