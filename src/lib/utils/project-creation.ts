"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Step, ProjectDraft } from "@/types/creation";
import { createProject } from "@/lib/api/projects";

// This hook manages the two modal steps (outcome → clarify).
// On completion it POSTs the draft to /api/projects, gets back an ID,
// and navigates to /projects/[id]?status=generating.
//
// ProjectCreationContext no longer exists — the draft doesn't need to
// survive navigation because the project page fetches by ID.

export function useProjectCreation(onClose: () => void) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("outcome");
  const [draft, setLocalDraft] = useState<ProjectDraft>({
    goal: "",
    description: "",
    targetDate: "",
    clarifications: { c1: "", c2: "", c3: "" },
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goTo = (s: Step) => {
    setError(null);
    setStep(s);
  };

  const handleOutcomeNext = (
    data: Pick<ProjectDraft, "goal" | "description" | "targetDate">
  ) => {
    setLocalDraft((d) => ({ ...d, ...data }));
    goTo("clarify");
  };

  const handleClarifyNext = async (
    clarifications: ProjectDraft["clarifications"],
    skip: boolean
  ) => {
    const finalDraft: ProjectDraft = {
      ...draft,
      clarifications: skip ? draft.clarifications : clarifications,
    };

    setSubmitting(true);
    setError(null);

    try {
      // POST to API → get real ID back (mock-123 today, Supabase UUID tomorrow)
      const { id } = await createProject(finalDraft);
      onClose();
      router.push(`/projects/new?status=generating&id=${id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    draft,
    error,
    submitting,
    goTo,
    handleOutcomeNext,
    handleClarifyNext,
  };
}