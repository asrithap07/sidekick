import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// In-memory store (dev only)
// Replace with: const { data } = await supabase.from('tasks')...
// ─────────────────────────────────────────────────────────────────────────────



export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_tags(tag), projects(title)')  // add projects(title)
    .eq('due_date', today)
    .eq('done', false)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const tasks = data.map(({ task_tags, projects, ...task }) => ({
    ...task,
    tags: task_tags.map((r: { tag: string }) => r.tag),
    project: projects?.title ?? null,  // flatten to the string your UI expects
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
      due_date: body.due_date,
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
    ...data, //spread everything supabase returned onto the new object
    tags: data.task_tags.map((r: {tag: string}) => r.tag), //ge tthe tag names into an array
    project: data.projects?.title ?? null, //overwrites the projects key from the spread or make it null
  }

  return NextResponse.json(task, { status: 201 });
}