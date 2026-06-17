import type { Task } from "@/types/task";

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// Swap the body of each function for a Supabase call when the backend is ready.
// The signatures and return types stay exactly the same — nothing else changes.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    label: "Create UI",
    priority: "high",
    project: "CS Project",
    tags: ["career", "coding"],
    done: false,
    dueDate: "2026-06-02",
  },
  {
    id: "2",
    label: "Apply to 2 summer internships",
    priority: "low",
    project: null,
    tags: ["career"],
    done: false,
    dueDate: "2026-06-03",
  },
  {
    id: "3",
    label: "Go to the gym",
    priority: "medium",
    project: null,
    tags: ["life"],
    done: true,
    dueDate: "2026-06-02",
  },
];

// In-memory store so mutations feel real during development.
// This goes away entirely when Supabase is wired — the DB is the store.
let store: Task[] = [...MOCK_TASKS];

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(
  data: Omit<Task, "id" | "done">
): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(
  id: string,
  patch: Partial<Task>
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}