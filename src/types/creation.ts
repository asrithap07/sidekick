//these types are temporary and they only exist during the creation modal flow

export type Step = "outcome" | "clarify";

//GeneratedPhase and GeneratedTask are what the AI spits back

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
  suggestedDueDate?: string;
}

// ProjectDraft only holds what the USER typed
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