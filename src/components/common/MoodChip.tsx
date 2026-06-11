import { moodById, type MoodId } from "@/lib/mood";
import { cn } from "@/lib/utils";

export function MoodChip({ moodId, className }: { moodId: MoodId; className?: string }) {
  const m = moodById(moodId);
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        m.chip,
        m.color,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
}