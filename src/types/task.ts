export interface Task {
  id: string;
  label: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  project: string | null;
  dueDate?: string;
  tags: string[];
}