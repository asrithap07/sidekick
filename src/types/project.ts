// Priority lives here canonically and is imported everywhere else.
// (Previously it was re-typed inline in TaskContext — now there's one source.)
export type Priority = "high" | "medium" | "low";

export type PhaseStatus = "completed" | "in-progress" | "upcoming" | "locked";

// PhaseTask is defined in types/task.ts and extended there.
// We re-export it here so project-related imports stay clean.
export type { PhaseTask } from "./task";

//this is onestep of the project with status, progress, and tasks

export interface Phase {
  number: number;
  title: string;
  status: PhaseStatus;
  progress: number;
  tasks: import("./task").PhaseTask[];
}

// Insight.iconName is a string key (e.g. "trending-up") instead of
// React.ReactNode. The UI layer maps this to an actual icon component.
// This makes Insight serializable — it can round-trip through JSON
// and eventually come straight from Supabase.
export type InsightIconName = "trending-up" | "target" | "lightbulb" | "zap" | "clock";

export interface Insight {
  iconName: InsightIconName;
  title: string;
  body: string;
}

// CoachingNote uses a semantic type instead of raw Tailwind class strings.
// The UI maps type → className. Supabase stores "info", not
// "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300".
export type CoachingNoteType = "info" | "success" | "warning";

export interface CoachingNote {
  type: CoachingNoteType;
  text: string;
  age: string;
}

export interface Attachment {
  name: string;
  meta: string;
}

//this object is whats actually getting stored in our app, its the full thing with phases, insights, attachments ,and coachign notes

export interface Project {
  id: string;
  title: string;
  icon: string;
  description: string;
  deadline?: string;
  progress: number;
  phases: Phase[];
  attachments: Attachment[];
  insights: Insight[];
  coaching: CoachingNote[];
}