import type { ProjectDraft, GeneratedPhase } from "@/types/creation";
import type { Project, Phase } from "@/types/project";

/*
  draftToProject takes a ProjectDraft + GeneratedPhase[] and produces a realProject.
  Its like the translation function bewtween the creation flow and the app view for projects
*/

export function draftToProject(draft: ProjectDraft, phases: GeneratedPhase[]): Project {
  const mappedPhases: Phase[] = phases.map((gPhase, i) => ({
    number: i + 1,
    title: gPhase.name,
    //the first phase becomes in-progress and rest become upcoming
    status: i === 0 ? "in-progress" : "upcoming",
    progress: 0,
    tasks: gPhase.tasks.map((gTask) => ({
      id: gTask.id,
      label: gTask.title,
      //all tasks start as not done
      done: false,
      priority: gTask.priority,
      project: draft.goal, // will be replaced with real project ID post-Supabase
      tags: [],
      dueDate: gTask.suggestedDueDate,
    })),
  }));

  return {
    id: crypto.randomUUID(),
    icon: "🎯",
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
