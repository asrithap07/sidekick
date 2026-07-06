import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_tags(tag), projects(title)')  // add projects(title)
    .eq('due_date', today)
    .order('due_date', { ascending: true })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const tasks = data.map(({ task_tags, projects, due_date, ...task }) => ({
    ...task,
    dueDate: due_date,
    tags: task_tags.map((r: { tag: string }) => r.tag),
    project: projects?.title ?? null,  // flatten to the string your UI expects
  }))

  return NextResponse.json(tasks)
}