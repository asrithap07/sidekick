import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// In-memory store (dev only)
// Replace with: const { data } = await supabase.from('tasks')...
// ─────────────────────────────────────────────────────────────────────────────



export async function GET() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const cutoff = threeDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_tags(tag), projects(title)')
    .or(`due_date.gte.${cutoff},due_date.is.null`)
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const tasks = data.map(({ task_tags, projects, due_date, ...task }) => ({
    ...task,
    dueDate: due_date,
    tags: task_tags.map((r: { tag: string }) => r.tag),
    project: projects?.title ?? null,
  }))

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      label: body.label,
      priority: body.priority,
      due_date: body.dueDate ?? body.due_date ?? null,
      project_id: body.project_id ?? null,
      phase_id: body.phase_id ?? null,
      done: false,
    })
    // returning the task we just inserted
    // look in the task_tags table for all rows connected to this task but only return the tag column
    // do the same with projects
    .select('*, task_tags(tag), projects(title)')
    //unwrap it so the data is one instead of [object]
    .single()
  
  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const task = {
    ...data,
    dueDate: data.due_date,
    tags: data.task_tags.map((r: { tag: string }) => r.tag),
    project: data.projects?.title ?? null,
  }
  delete task.due_date
  delete task.task_tags
  delete task.projects

  return NextResponse.json(task, { status: 201 });
}