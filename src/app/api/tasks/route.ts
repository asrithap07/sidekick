import { NextResponse } from "next/server";
import type { Task } from "@/types/task";

// ─────────────────────────────────────────────────────────────────────────────
// In-memory store (dev only)
// Replace with: const { data } = await supabase.from('tasks')...
// ─────────────────────────────────────────────────────────────────────────────

let tasks: Task[] = [
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

export async function GET() {
  // TODO (Supabase): const { data, error } = await supabase.from('tasks').select('*')
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newTask: Task = {
    id: crypto.randomUUID(),
    done: false,
    ...body,
  };

  // TODO (Supabase): const { data, error } = await supabase.from('tasks').insert(newTask).select().single()
  tasks = [...tasks, newTask];

  return NextResponse.json(newTask, { status: 201 });
}