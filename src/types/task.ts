// Canonical Task type — used by TaskContext, useTasks(), and all pages.
// PhaseTask extends this so there's one source of truth for the DB shape.
export interface Task {
  id: string;
  label: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  project?: string | null; // project id, or null if standalone
  dueDate?: string;       // ISO date string YYYY-MM-DD
  tags: string[];
}

// PhaseTask is a Task that belongs to a project phase.
// tag / tagColor / dueLabel are display-only fields that don't need
// to be stored in the DB — they can be derived. But we keep them for
// now so the UI doesn't break, and we'll clean them up once Supabase
// is wired and we know the real query shape.
export interface PhaseTask extends Task{
  project: string;
}