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

  const tasks = data.map(({ task_tags, projects, due_date, updated_at, ...task }) => ({
    ...task,
    dueDate: due_date,
    tags: task_tags.map((r: { tag: string }) => r.tag),
    project: projects?.title ?? null,
    updatedAt: updated_at
  }))

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const body = await request.json();

  // 1. Insert the task
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      label: body.label,
      priority: body.priority,
      due_date: body.dueDate ?? body.due_date ?? null,
      project_id: body.project_id ?? null,
      phase_id: body.phase_id ?? null,
      updated_at: body.updatedAt,
      done: false,
    })
    .select('id')
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const taskId = data.id;

  // 2. Insert tags into task_tags
  const tags: string[] = body.tags ?? [];
  if (tags.length > 0) {
    const { error: tagError } = await supabase
      .from('task_tags')
      .insert(tags.map((tag) => ({ task_id: taskId, tag })))

    if (tagError) {
      console.error(tagError)
      // Clean up the task if tags failed
      await supabase.from('tasks').delete().eq('id', taskId)
      return NextResponse.json({ error: tagError.message }, { status: 500 })
    }
  }

  // 3. Fetch the complete task with tags
  const { data: fullTask, error: fetchError } = await supabase
    .from('tasks')
    .select('*, task_tags(tag), projects(title)')
    .eq('id', taskId)
    .single()

  if (fetchError) {
    console.error(fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  const task = {
    ...fullTask,
    dueDate: fullTask.due_date,
    tags: fullTask.task_tags?.map((r: { tag: string }) => r.tag) ?? [],
    project: fullTask.projects?.title ?? null,
  }
  delete task.due_date
  delete task.task_tags
  delete task.projects

  return NextResponse.json(task, { status: 201 });
}
