// Derives display-only fields (tag label, tag color, due label) from the actual
// data stored on a PhaseTask (tags array, dueDate string).
// These are presentation-layer helpers, not stored in the DB.

const TAG_COLORS: Record<string, string> = {
  resume: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  linkedin: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  portfolio: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  research: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  application: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  admin: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
  dsa: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  "system-design": "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  planning: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  budget: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  booking: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  travel: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  activities: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  documents: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  packing: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  language: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
};

export function getTagDisplay(tags: string[]): { tag: string; tagColor: string } | null {
  if (!tags || tags.length === 0) return null;
  const tag = tags[0];
  const tagColor = TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  return { tag: tag.charAt(0).toUpperCase() + tag.slice(1), tagColor };
}

export function getDueDateLabel(dueDate?: string): string | null {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `${diffDays} days`;
  return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}