"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Plus, CalendarDays } from "lucide-react";
import type { Phase, Priority } from "@/types/project";
import { getTagDisplay, getDueDateLabel } from "@/lib/utils/task-display-utils";

// Shared by both /projects/new and /projects/[projectId].
// Previously duplicated in both files — now lives here.

function PriorityDot({ priority }: { priority: Priority }) {
  const colors: Record<Priority, string> = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-green-400",
  };
  const labels: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${colors[priority]}`}>
      ● {labels[priority]}
    </span>
  );
}

interface PhaseSectionProps {
  phase: Phase;
  checkedTasks: Set<string>;
  onToggleTask: (id: string) => void;
  // showTags: project page shows tag pills, new-project page doesn't (tags are empty at creation time)
  showTags?: boolean;
}

export function PhaseSection({ phase, checkedTasks, onToggleTask, showTags = false }: PhaseSectionProps) {
  const [collapsed, setCollapsed] = useState(phase.status === "locked");
  const doneCount = phase.tasks.filter((t) => checkedTasks.has(t.id) || t.done).length;
  const total = phase.tasks.length;
  const isLocked = phase.status === "locked";

  const barColor =
    phase.status === "completed"
      ? "bg-green-400"
      : phase.status === "in-progress"
      ? "bg-indigo-500"
      : "bg-gray-300 dark:bg-gray-600";

  const titleColor =
    phase.status === "completed"
      ? "text-green-500"
      : phase.status === "in-progress"
      ? "text-indigo-500"
      : phase.status === "locked"
      ? "text-gray-300 dark:text-gray-600"
      : "text-gray-400 dark:text-gray-500";

  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 flex-1 text-left group"
        >
          <span className={`text-xs font-semibold uppercase tracking-wide ${titleColor}`}>
            Phase {phase.number} · {phase.title}
          </span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
          <PhaseStatusBadge status={phase.status} />
          <span className="text-[11px] text-gray-300 dark:text-gray-600">
            {doneCount}/{total}
          </span>
          {collapsed ? (
            <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronUp size={13} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mb-3">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${phase.progress}%` }} />
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-1 mb-1">
          {phase.tasks.map((task) => {
            const isDone = checkedTasks.has(task.id) || task.done;
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <button
                  onClick={() => !isLocked && onToggleTask(task.id)}
                  className="shrink-0"
                  disabled={isLocked}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-indigo-500" />
                  ) : isLocked ? (
                    <Lock size={15} className="text-gray-300 dark:text-gray-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm min-w-0 truncate ${
                    isDone
                      ? "line-through text-gray-300 dark:text-gray-600"
                      : isLocked
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {task.label}
                </span>
                {showTags && getTagDisplay(task.tags) && (() => {
                  const display = getTagDisplay(task.tags)!;
                  return (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${display.tagColor}`}>
                      {display.tag}
                    </span>
                  );
                })()}
                <PriorityDot priority={task.priority} />
                {showTags && getDueDateLabel(task.dueDate) && (
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                    <CalendarDays size={11} />
                    {getDueDateLabel(task.dueDate)}
                  </span>
                )}
              </div>
            );
          })}

          {!isLocked && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
              <Plus size={13} />
              Add task to {phase.title}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// ── Shared status badge ────────────────────────────────────────────────────

export function PhaseStatusBadge({ status }: { status: import("@/types/project").PhaseStatus }) {
  if (status === "completed")
    return <span className="text-[11px] font-medium text-green-500">Completed</span>;
  if (status === "in-progress")
    return <span className="text-[11px] font-medium text-indigo-500">In Progress</span>;
  if (status === "locked")
    return (
      <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
        <Lock size={10} /> Locked
      </span>
    );
  return <span className="text-[11px] text-gray-400 dark:text-gray-500">Upcoming</span>;
}