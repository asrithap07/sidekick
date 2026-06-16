"use client";

import { useState } from "react";
import type { ProjectDraft } from "../CreateProjectModal";

type Clarifications = ProjectDraft["clarifications"];

interface Props {
  initial: Clarifications;
  onNext: (clarifications: Clarifications, skip: boolean) => void;
  onBack: () => void;
}

const QUESTIONS: { key: keyof Clarifications; question: string; placeholder: string }[] = [
  {
    key: "resume",
    question: "Do you already have a resume?",
    placeholder: "Yes / No / In progress…",
  },
  {
    key: "dsa",
    question: "How comfortable are you with DSA / Leetcode?",
    placeholder: "Beginner · Some experience · Comfortable…",
  },
  {
    key: "targets",
    question: "Are you targeting big tech only, or open to mid-size?",
    placeholder: "Big tech only · Open to all sizes…",
  },
];

export default function StepClarify({ initial, onNext, onBack }: Props) {
  const [answers, setAnswers] = useState<Clarifications>(initial);

  const set = (key: keyof Clarifications, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const anyAnswered = Object.values(answers).some((v) => v.trim().length > 0);

  return (
    <div>
      <div className="space-y-3">
        {QUESTIONS.map(({ key, question, placeholder }) => (
          <div
            key={key}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-3.5"
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
              {question}
            </p>
            <input
              type="text"
              value={answers[key]}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-3">
        Answering these helps the AI tailor your plan. You can skip if you prefer.
      </p>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 7H3M6.5 3.5L3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNext(answers, true)}
            className="rounded-xl px-3.5 py-2.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => onNext(answers, false)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Generate plan
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5l1.2 3.7L12 6.5l-3.8 1.3L7 12.5 5.8 7.8 2 6.5l3.8-1.3L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}