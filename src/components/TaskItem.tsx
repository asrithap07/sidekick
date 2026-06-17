"use client";

import { Trash2, CalendarDays } from "lucide-react";
import React from "react";
import { Task
  
 } from "@/types/task";
//design system for the priorities
const PRIORITY_STYLES = {
  high: {
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500 border border-red-100",
    label: "High",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-500 border border-amber-100",
    label: "Medium",
  },
  low: {
    dot: "bg-green-400",
    badge: "bg-green-50 text-green-500 border border-green-100",
    label: "Low",
  },
};

//tag color palette
const TAG_COLORS = [
  "text-yellow-600",
  "text-lime-600",
  "text-sky-500",
  "text-violet-500",
  "text-pink-500",
  "text-teal-500",
  "text-orange-500",
];

//picking a color for each tag
function getTagColor(tag: string) {
  let hash = 0;
  //here we make the hash for the tag using each of its character values
  for (let i = 0; i < tag.length; i++) {
    hash += tag.charCodeAt(i);
  }
  //use modulo to assign it to one of the TAG_COLORS, 
  // now this tag will always get that color bc of its unique hashcode
  return TAG_COLORS[hash % TAG_COLORS.length];
}

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};



//here we are making a component called TaskItem that receives a task object, a function to toggle it, and a function to delete it 
// (its called by taskboard)
export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  //get this style task.priority for this task's priority and if that doesn't exist, sue the low priority style instead.
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low;
  const hasTags = task.tags && task.tags.length > 0;

  // Due date badge: compute label + urgency style
  const dueDateBadge = (() => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate + "T00:00:00");
    if (isNaN(due.getTime())) return null;
 
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dueStart  = new Date(due.getFullYear(),  due.getMonth(),  due.getDate());
    const diffDays  = Math.round((dueStart.getTime() - todayStart.getTime()) / 86_400_000);
 
    let label: string;
    if (diffDays === 0)       label = "Today";
    else if (diffDays === 1)  label = "Tomorrow";
    else if (diffDays === -1) label = "Yesterday";
    else if (diffDays < 0)    label = `${Math.abs(diffDays)}d overdue`;
    else if (diffDays < 7)    label = due.toLocaleDateString("en-US", { weekday: "short" });
    else                      label = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
 
    // Urgency tiers (muted when done)
    let style: string;
    if (task.done) {
      style = "text-gray-300 dark:text-gray-600";
    } else if (diffDays < 0) {
      style = "text-red-400 border border-red-100 dark:border-red-800";
    } else if (diffDays === 0) {
      style = "text-indigo-500 dark:text-indigo-400";
    } else if (diffDays <= 2) {
      style = "text-amber-500";
    } else {
      style = "text-gray-400 dark:text-gray-500";
    }
 
    return { label, style };
  })();

  return (
    <div className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {/* Checkbox — aligned to the top when there are tags */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          task.done
            ? "bg-indigo-500 border-indigo-500"
            : "border-gray-300 dark:border-gray-500 hover:border-indigo-400 dark:hover:border-indigo-500"
        }`}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-white">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Left: label + tags */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm transition-colors ${
            task.done ? "line-through text-gray-300 dark:text-gray-600" : "text-gray-800 dark:text-gray-100"
          }`}
        >
          {task.label}
        </span>

        {hasTags && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {task.tags!.map((tag: string, i: number) => (
              <span key={tag} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>}
                <span className={`text-[12px] font-medium ${task.done ? "text-gray-300 dark:text-gray-600" : getTagColor(tag)}`}>
                  {tag}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: priority badge + project name + due date */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${task.done
        ? "bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-600"
        : priority.badge
        }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${task.done ? "bg-gray-200 dark:bg-gray-500" : priority.dot}`} />
          {priority.label}
        </span>

        {task.project && (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{task.project}</span>
        )}
        {dueDateBadge && (
          <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${dueDateBadge.style}`}>
            <CalendarDays size={10} />
            {dueDateBadge.label}
          </span>
        )}
      </div>

      {/* Delete — hover reveal */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600 hover:text-red-400"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}