"use client";

import { Trash2, CalendarDays, Lock } from "lucide-react";
import React from "react";
import { Task } from "@/types/task";
import { hoverTint, inkBody, inkFaint, inkMutedHover } from "@/lib/ui/tint";

const PRIORITY_STYLES = {
  high: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500 border border-red-100 dark:bg-red-900/20 dark:border-red-800",
    label: "High",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-500 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800",
    label: "Medium",
  },
  low: {
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-500 border border-green-100 dark:bg-green-900/20 dark:border-green-800",
    label: "Low",
  },
};

const TAG_COLORS = [
  "text-yellow-600",
  "text-lime-600",
  "text-sky-500",
  "text-violet-500",
  "text-pink-500",
  "text-teal-500",
  "text-orange-500",
];

function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash += tag.charCodeAt(i);
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
}

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete?: () => void;
  locked?: boolean;
  /** Hide the project subtitle — use inside project views where context is obvious */
  hideProject?: boolean;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  locked = false,
  hideProject = false,
}: TaskItemProps) {
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low;
  const hasTags = task.tags && task.tags.length > 0;
  const showProject = !hideProject && !hasTags && task.project;

  const dueDateBadge = (() => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate + "T00:00:00");
    if (isNaN(due.getTime())) return null;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.round((dueStart.getTime() - todayStart.getTime()) / 86_400_000);

    let label: string;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Tomorrow";
    else if (diffDays === -1) label = "Yesterday";
    else if (diffDays < 0) label = `${Math.abs(diffDays)}d overdue`;
    else if (diffDays < 7) label = due.toLocaleDateString("en-US", { weekday: "short" });
    else label = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    let style: string;
    if (task.done) {
      style = inkFaint;
    } else if (diffDays < 0) {
      style = "text-red-400 border border-red-100 dark:border-red-800";
    } else if (diffDays === 0) {
      style = "text-indigo-500 dark:text-indigo-400";
    } else if (diffDays <= 2) {
      style = "text-amber-500";
    } else {
      style = inkFaint;
    }

    return { label, style };
  })();

  return (
    <div className={`group flex items-center gap-3 px-3 py-3 rounded-xl ${hoverTint} transition-colors`}>
      <button
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        aria-label={
          locked ? "Task locked" : task.done ? "Mark incomplete" : "Mark complete"
        }
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          locked
            ? "border-[oklch(0.91_0.01_275)] dark:border-[oklch(0.32_0.02_275)] cursor-not-allowed"
            : task.done
            ? "bg-indigo-500 border-indigo-500 animate-check-pop"
            : "border-[oklch(0.64_0.016_275)] dark:border-[oklch(0.52_0.02_275)] hover:border-indigo-400 dark:hover:border-indigo-500"
        }`}
      >
        {locked ? (
          <Lock size={10} className={inkFaint} />
        ) : (
          task.done && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-white">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm transition-colors ${
            task.done ? `line-through ${inkFaint}` : locked ? inkFaint : inkBody
          }`}
        >
          {task.label}
        </span>

        {hasTags && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {task.tags!.map((tag: string, i: number) => (
              <span key={tag} className="flex items-center gap-1">
                {i > 0 && <span className={`${inkFaint} text-xs`}>•</span>}
                <span
                  className={`text-[12px] font-medium ${
                    task.done ? inkFaint : getTagColor(tag)
                  }`}
                >
                  {tag}
                </span>
              </span>
            ))}
          </div>
        )}

        {showProject && (
          <p
            className={`text-[12px] font-medium mt-0.5 ${
              task.done ? inkFaint : "text-indigo-400 dark:text-indigo-500"
            }`}
          >
            {task.project}
          </p>
        )}
      </div>

      <div className="flex flex-row items-center gap-2 flex-shrink-0">
        <span
          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            task.done
              ? "bg-[oklch(0.93_0.008_275)] dark:bg-[oklch(0.3_0.015_275)] text-[oklch(0.64_0.016_275)] dark:text-[oklch(0.52_0.02_275)] border border-[oklch(0.91_0.01_275)] dark:border-[oklch(0.32_0.02_275)]"
              : priority.badge
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              task.done ? "bg-[oklch(0.64_0.016_275)]" : priority.dot
            }`}
          />
          {priority.label}
        </span>

        {dueDateBadge && (
          <span
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${dueDateBadge.style}`}
          >
            <CalendarDays size={10} />
            {dueDateBadge.label}
          </span>
        )}
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${inkFaint} ${inkMutedHover} hover:text-red-400`}
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
