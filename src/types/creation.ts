export type Step = "outcome" | "clarify";

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

// ProjectDraft only holds what the USER typed.
// The AI output (phases) is kept separate and only merged at save time.
export interface ProjectDraft {
  goal: string;
  description: string;
  targetDate: string;
  clarifications: {
    c1: string;
    c2: string;
    c3: string;
  };
}