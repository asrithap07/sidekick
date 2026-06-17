"use client";

import { useState } from "react";
import type { ProjectDraft, GeneratedPhase} from "@/lib/project-creation/creationTypes";
interface Props {
  draft: ProjectDraft;
  onBack: () => void;
  onCreate: () => void;
}

const PHASE_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
];

export default function StepReview({ draft, onBack, onCreate }: Props) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const totalTasks = draft.phases.reduce((sum, p) => sum + p.tasks.length, 0);

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 400));
    onCreate();
  };

  const toggle = (id: string) =>
    setExpandedPhase((prev) => (prev === id ? null : id));

  return (
    <div>
      {/* Summary badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1 3.2L10 5 6.8 6.2 6 10 5 6.2 2 5l3-0.8L6 1z" fill="currentColor" />
          </svg>
          {totalTasks} tasks generated
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
          {draft.phases.length} phases
        </div>
      </div>

      {/* Phase list */}
      <div className="space-y-2">
        {draft.phases.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            index={i}
            colorClass={PHASE_COLORS[i % PHASE_COLORS.length]}
            expanded={expandedPhase === phase.id}
            onToggle={() => toggle(phase.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          disabled={isCreating}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6.5 3.5L3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="white" strokeOpacity="0.3" strokeWidth="2" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Creating…
            </>
          ) : (
            <>
              Create project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  index,
  colorClass,
  expanded,
  onToggle,
}: {
  phase: GeneratedPhase;
  index: number;
  colorClass: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
      >
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${colorClass}`}
        >
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
            {phase.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {phase.description}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-neutral-400">{phase.tasks.length} tasks</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-neutral-400 transition-transform"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-neutral-100 dark:border-neutral-800 divide-y divide-neutral-100 dark:divide-neutral-800">
          {phase.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-neutral-900"
            >
              <div className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-600 flex-shrink-0" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
                {task.title}
              </span>
              <PriorityBadge priority={task.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
    medium: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    low: "text-neutral-500 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[priority]}`}>
      {priority}
    </span>
  );
}