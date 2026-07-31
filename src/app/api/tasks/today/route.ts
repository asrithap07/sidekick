import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  // Calculate 3 days ago — only show overdue tasks within this window
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_tags(tag), projects(title)')
    .lte('due_date', today)                   // today + recently overdue
    .gte('due_date', threeDaysAgoStr)          // only overdue by ≤ 3 days
    .eq('done', false)                         // only undone tasks
    .order('due_date', { ascending: true })

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

  // Sort: overdue tasks first (most recently overdue first), then today's tasks
  const todayStart = new Date(today).getTime();
  tasks.sort((a, b) => {
    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();
    const aOverdue = aTime < todayStart ? 1 : 0;
    const bOverdue = bTime < todayStart ? 1 : 0;
    if (aOverdue !== bOverdue) return bOverdue - aOverdue; // overdue first
    if (aOverdue) return bTime - aTime; // most recently overdue first
    return aTime - bTime; // today's tasks earliest first
  });

  return NextResponse.json(tasks)
}