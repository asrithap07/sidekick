import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tasks/[id] — update a task (toggle done, change priority, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  context: Context
) {
  const { id } = await context.params;
  const body = await request.json();

  // Map camelCase frontend fields → snake_case Supabase columns
  const patch: Record<string, unknown> = {};
  if (body.label !== undefined) patch.label = body.label;
  if (body.done !== undefined) patch.done = body.done;
  if (body.priority !== undefined) patch.priority = body.priority;
  if (body.dueDate !== undefined) patch.due_date = body.dueDate;
  if (body.project_id !== undefined) patch.project_id = body.project_id;
  if (body.phase_id !== undefined) patch.phase_id = body.phase_id;

  if (Object.keys(patch).length > 0) {
   patch.updated_at = new Date().toISOString();
  }

  // Update task fields (if any)
  if (Object.keys(patch).length > 0) {
    const { error } = await supabase
      .from("tasks")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Sync tags: if tags were provided, replace all existing task_tags
  if (body.tags !== undefined) {
    const tags: string[] = body.tags ?? [];

    // Delete existing tags
    const { error: deleteError } = await supabase
      .from("task_tags")
      .delete()
      .eq("task_id", id);

    if (deleteError) {
      console.error(deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Insert new tags
    if (tags.length > 0) {
      const { error: insertError } = await supabase
        .from("task_tags")
        .insert(tags.map((tag) => ({ task_id: id, tag })));

      if (insertError) {
        console.error(insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }
  }

  // Fetch the complete updated task
  const { data, error } = await supabase
    .from("tasks")
    .select("*, task_tags(tag), projects(title)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Map snake_case Supabase response → camelCase frontend Task
  const task = {
    ...data,
    dueDate: data.due_date,
    updatedAt: data.updated_at,
    tags: data.task_tags?.map((r: { tag: string }) => r.tag) ?? [],
    project: data.projects?.title ?? null,
  };
  delete task.due_date;
  delete task.updated_at;
  delete task.task_tags;
  delete task.projects;

  return NextResponse.json(task);
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/tasks/[id] — delete a task
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(
  _request: Request,
  context: Context
) {
  const { id } = await context.params;

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}