"use client";

import StepOutcome from "./steps/StepOutcome";
import StepClarify from "./steps/StepClarify";
import type { Step } from "@/types/creation"
import { useProjectCreation } from "@/lib/utils/project-creation"
// The modal is now just a form — 2 steps, no async work.
// Step 1: What are you trying to achieve? (goal, description, date)
// Step 2: A few quick questions (clarifications)
// After step 2 → modal closes, navigation to /projects/new?status=generating

interface CreateProjectModalProps {
  onClose: () => void;
}

const STEPS: Step[] = ["outcome", "clarify"];

const STEP_META: Record<Step, { label: string; heading: string; sub: string }> = {
  outcome: {
    label: "Step 1 of 2",
    heading: "What are you trying to achieve?",
    sub: "Turn your goal into a structured project.",
  },
  clarify: {
    label: "Step 2 of 2",
    heading: "A few quick questions",
    sub: "Help the AI build a more accurate plan.",
  },
};

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const {
    step,
    draft,
    error,
    goTo,
    handleOutcomeNext,
    handleClarifyNext,
  } = useProjectCreation(onClose);

  const stepIndex = STEPS.indexOf(step);
  const meta = STEP_META[step];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            New project
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar — 2 segments now */}
        <div className="flex gap-1.5 px-6 pt-4">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="h-0.5 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  i < stepIndex
                    ? "#6c63ff"
                    : i === stepIndex
                    ? "rgba(108,99,255,0.4)"
                    : "rgba(108,99,255,0.12)",
              }}
            />
          ))}
        </div>

        {/* Step label + heading */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1 tracking-wide">
            {meta.label}
          </p>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {meta.heading}
          </h2>
          {meta.sub && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {meta.sub}
            </p>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Step body */}
        <div className="px-6 pt-4 pb-6">
          {step === "outcome" && (
            <StepOutcome
              initial={draft}
              onNext={handleOutcomeNext}
            />
          )}
          {step === "clarify" && (
            <StepClarify
              initial={draft.clarifications}
              onNext={handleClarifyNext}
              onBack={() => goTo("outcome")}
            />
          )}
        </div>
      </div>
    </div>
  );
}