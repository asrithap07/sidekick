"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Step, ProjectDraft } from "@/types/creation";
import { createProject } from "@/lib/api/projects";

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
    const project = await createProject(finalDraft);
    onClose();
    router.push(`/projects/${project.slug}`);
  } catch {
    setError("Something went wrong. Please try again.");
    setSubmitting(false);
  }
  };

  return { step, draft, error, submitting, goTo, handleOutcomeNext, handleClarifyNext };
}