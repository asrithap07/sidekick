"use client";

import { useState } from "react";
import { Lock, ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Phase } from "@/types/project";
import TaskItem from "@/components/TaskItem";
import {
  ink,
  inkMuted,
  inkFaint,
  borderTint,
  trackTint,
  hoverTint,
  inkHover,
  inkMutedGroupHover,
} from "@/lib/ui/tint";
import { typeHeadline, typeLabel } from "@/lib/ui/type";

interface PhaseSectionProps {
  phase: Phase;
  checkedTasks: Set<string>;
  onToggleTask: (id: string) => void;
  showTags?: boolean;
}

export function PhaseSection({
  phase,
  checkedTasks,
  onToggleTask,
}: PhaseSectionProps) {
  const [collapsed, setCollapsed] = useState(phase.status === "locked");
  const doneCount = phase.tasks.filter((t) => checkedTasks.has(t.id) || t.done).length;
  const total = phase.tasks.length;
  const isLocked = phase.status === "locked";

  const barColor =
    phase.status === "completed"
      ? "bg-green-500"
      : phase.status === "active"
      ? "bg-indigo-500"
      : trackTint;

  const titleColor =
    phase.status === "completed"
      ? "text-green-500"
      : phase.status === "active"
      ? "text-indigo-500 dark:text-indigo-400"
      : phase.status === "locked"
      ? inkFaint
      : inkMuted;

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 flex-1 text-left group min-w-0"
        >
          <h3 className={`${typeHeadline} ${titleColor} truncate`}>
            Phase {phase.number} · {phase.title}
          </h3>
          <div className={`flex-1 h-px ${trackTint} min-w-6`} />
          <PhaseStatusBadge status={phase.status} />
          <span className={`${typeLabel} ${inkFaint} tabular-nums shrink-0`}>
            {doneCount}/{total}
          </span>
          {collapsed ? (
            <ChevronDown size={13} className={`${inkFaint} ${inkMutedGroupHover} shrink-0`} />
          ) : (
            <ChevronUp size={13} className={`${inkFaint} ${inkMutedGroupHover} shrink-0`} />
          )}
        </button>
      </div>

      <div className={`h-1 w-full rounded-full ${trackTint} overflow-hidden mb-3`}>
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${phase.progress}%` }} />
      </div>

      {!collapsed && (
        <div className="flex flex-col gap-2 mb-1">
          {phase.tasks.map((task) => {
            const isDone = checkedTasks.has(task.id) || task.done;
            return (
              <TaskItem
                key={task.id}
                task={{ ...task, done: isDone }}
                onToggle={() => onToggleTask(task.id)}
                locked={isLocked}
                hideProject
              />
            );
          })}

          {!isLocked && (
            <button
              className={`flex items-center gap-1.5 px-3 py-2 text-xs ${inkMuted} ${inkHover} ${hoverTint} rounded-xl transition-colors`}
            >
              <Plus size={13} />
              Add task to {phase.title}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export function PhaseStatusBadge({ status }: { status: import("@/types/project").PhaseStatus }) {
  if (status === "completed")
    return <span className={`${typeLabel} text-green-500 shrink-0`}>Completed</span>;
  if (status === "active")
    return <span className={`${typeLabel} text-indigo-500 dark:text-indigo-400 shrink-0`}>In progress</span>;
  if (status === "locked")
    return (
      <span className={`flex items-center gap-1 ${typeLabel} ${inkMuted} shrink-0`}>
        <Lock size={10} /> Locked
      </span>
    );
  return <span className={`${typeLabel} ${inkMuted} shrink-0`}>Upcoming</span>;
}
