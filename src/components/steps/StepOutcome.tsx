"use client";

import { useState } from "react";
import type { ProjectDraft } from "../CreateProjectModal";

interface Props {
  initial: Pick<ProjectDraft, "goal" | "description" | "targetDate">;
  onNext: (data: Pick<ProjectDraft, "goal" | "description" | "targetDate">) => void;
}

export default function StepOutcome({ initial, onNext }: Props) {
  const [goal, setGoal] = useState(initial.goal);
  const [description, setDescription] = useState(initial.description);
  const [targetDate, setTargetDate] = useState(initial.targetDate);

  const canContinue = goal.trim().length > 0;

  const handleSubmit = () => {
    if (!canContinue) return;
    onNext({ goal: goal.trim(), description: description.trim(), targetDate });
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Goal or outcome
          </label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Land a Summer 2027 SWE internship"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Describe your goal{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="I want a SWE internship at a mid-large tech company by Summer 2027. I'm a sophomore CS student with some project experience."
            rows={3}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            Target date{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={!canContinue}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}