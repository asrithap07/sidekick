import { Task } from "@/types/task";

const TAG_COLORS = [
  { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", activeBg: "bg-yellow-100" },
  { text: "text-lime-600",   bg: "bg-lime-50",   border: "border-lime-200",   activeBg: "bg-lime-100"   },
  { text: "text-sky-500",    bg: "bg-sky-50",    border: "border-sky-200",    activeBg: "bg-sky-100"    },
  { text: "text-violet-500", bg: "bg-violet-50", border: "border-violet-200", activeBg: "bg-violet-100" },
  { text: "text-pink-500",   bg: "bg-pink-50",   border: "border-pink-200",   activeBg: "bg-pink-100"   },
  { text: "text-teal-500",   bg: "bg-teal-50",   border: "border-teal-200",   activeBg: "bg-teal-100"   },
  { text: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", activeBg: "bg-orange-100" },
];

export function getLabelStyle(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash += tag.charCodeAt(i);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export function getAllLabels(tasks: Task[]) {
  const seen = new Set<string>();

  tasks.forEach((t) =>
    (t.tags ?? []).forEach((tag) =>
      seen.add(tag)
    )
  );

  return Array.from(seen).sort();
}

export function getLabelCounts(tasks: Task[]) {
  const counts: Record<string, number> = {};

  tasks.forEach((t) =>
    (t.tags ?? []).forEach((tag) => {
      counts[tag] = (counts[tag] ?? 0) + 1;
    })
  );

  return counts;
}

export function filterTasksByLabel(
  tasks: Task[],
  selectedLabel: string | null
) {
  if (!selectedLabel)
    return tasks.filter(
      (t) => t.tags?.length
    );

  return tasks.filter((t) =>
    t.tags?.includes(selectedLabel)
  );
}