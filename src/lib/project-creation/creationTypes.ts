export type Step = "outcome" | "clarify" | "generating" | "review";

export interface GeneratedPhase {
  id: string;
  name: string;
  description: string;
  tasks: GeneratedTask[];
}

export interface GeneratedTask {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
}

export interface ProjectDraft {
  goal: string;
  description: string;
  targetDate: string;
  clarifications: {
    c1: string;
    c2: string;
    c3: string;
  };
  phases: GeneratedPhase[];
}