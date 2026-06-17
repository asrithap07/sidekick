import { TrendingUp, Target, Lightbulb, Zap, Clock } from "lucide-react";
import type { InsightIconName } from "@/types/project";

// Maps the serializable iconName string (stored in DB) to an actual React component.
// This is the only place that knows about the icon → component mapping.

const ICON_MAP: Record<InsightIconName, React.ReactNode> = {
  "trending-up": <TrendingUp size={15} />,
  "target":      <Target size={15} />,
  "lightbulb":   <Lightbulb size={15} />,
  "zap":         <Zap size={15} />,
  "clock":       <Clock size={15} />,
};

const BG_MAP: Record<InsightIconName, string> = {
  "trending-up": "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
  "target":      "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400",
  "lightbulb":   "bg-amber-100 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400",
  "zap":         "bg-purple-100 dark:bg-purple-900/40 text-purple-500 dark:text-purple-400",
  "clock":       "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
};

// Maps the semantic CoachingNote type to Tailwind classes.
// Supabase stores "info" — the UI layer decides what that looks like.
export const COACHING_STYLE: Record<"info" | "success" | "warning", { bg: string; text: string }> = {
  info:    { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-300" },
  success: { bg: "bg-green-50 dark:bg-green-900/20",   text: "text-green-700 dark:text-green-300" },
  warning: { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-700 dark:text-amber-300" },
};

export function InsightIcon({ iconName }: { iconName: InsightIconName }) {
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${BG_MAP[iconName]}`}>
      {ICON_MAP[iconName]}
    </div>
  );
}