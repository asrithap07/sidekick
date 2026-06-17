import type { ProjectDraft, GeneratedPhase } from "@/types/creation";
import type { Project, Phase } from "@/types/project";

// This is the one place where a ProjectDraft + AI-generated phases
// get translated into a real Project object ready to be saved to Supabase.
//
// Think of it as the border crossing between the creation flow and
// the rest of the app. Everything on the left is temporary; everything
// on the right is persistent.

export function draftToProject(draft: ProjectDraft, phases: GeneratedPhase[]): Project {
  const mappedPhases: Phase[] = phases.map((gPhase, i) => ({
    number: i + 1,
    title: gPhase.name,
    status: i === 0 ? "in-progress" : "upcoming",
    progress: 0,
    tasks: gPhase.tasks.map((gTask) => ({
      // Base Task fields
      id: gTask.id,
      label: gTask.title,
      done: false,
      priority: gTask.priority,
      project: draft.goal, // will be replaced with real project ID post-Supabase
      tags: [],
      dueDate: undefined,
      // PhaseTask display fields — filled in by user or future AI features
      tag: "",
      tagColor: "",
      dueLabel: "",
    })),
  }));

  return {
    id: crypto.randomUUID(),
    title: draft.goal,
    description: draft.description,
    deadline: draft.targetDate || undefined,
    progress: 0,
    phases: mappedPhases,
    attachments: [],
    insights: [],
    coaching: [],
  };
}