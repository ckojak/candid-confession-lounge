import { Smile, Frown, Brain, Wind, type LucideIcon } from "lucide-react";

export type MoodId = "happy" | "sad" | "thoughtful" | "anxious";

export interface Mood {
  id: MoodId;
  label: string;
  icon: LucideIcon;
  /** Tailwind text color class for the icon/label */
  color: string;
  /** Tailwind classes applied when the mood chip is selected/displayed */
  chip: string;
}

export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Feliz",
    icon: Smile,
    color: "text-[var(--mood-happy)]",
    chip: "bg-[color-mix(in_oklab,var(--mood-happy)_18%,transparent)] border-[color-mix(in_oklab,var(--mood-happy)_55%,transparent)]",
  },
  {
    id: "sad",
    label: "Triste",
    icon: Frown,
    color: "text-[var(--mood-sad)]",
    chip: "bg-[color-mix(in_oklab,var(--mood-sad)_18%,transparent)] border-[color-mix(in_oklab,var(--mood-sad)_55%,transparent)]",
  },
  {
    id: "thoughtful",
    label: "Pensativo",
    icon: Brain,
    color: "text-[var(--mood-thoughtful)]",
    chip: "bg-[color-mix(in_oklab,var(--mood-thoughtful)_18%,transparent)] border-[color-mix(in_oklab,var(--mood-thoughtful)_55%,transparent)]",
  },
  {
    id: "anxious",
    label: "Ansioso",
    icon: Wind,
    color: "text-[var(--mood-anxious)]",
    chip: "bg-[color-mix(in_oklab,var(--mood-anxious)_18%,transparent)] border-[color-mix(in_oklab,var(--mood-anxious)_55%,transparent)]",
  },
];

export const moodById = (id: MoodId) => MOODS.find((m) => m.id === id)!;