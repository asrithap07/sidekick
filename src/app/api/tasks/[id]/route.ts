import { NextResponse } from "next/server";
import type { Task } from "@/types/task";

// In-memory store — shared with route.ts in dev via module scope.
// This is a known limitation of the mock approach: in production Next.js
// each serverless invocation is isolated. It doesn't matter because
// this file goes away when Supabase is wired.
let tasks: Task[] = [];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const patch = await request.json();

  // TODO (Supabase):
  // const { data, error } = await supabase
  //   .from('tasks').update(patch).eq('id', params.id).select().single()

  tasks = tasks.map((t) => (t.id === params.id ? { ...t, ...patch } : t));
  const updated = tasks.find((t) => t.id === params.id);

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  // TODO (Supabase):
  // const { error } = await supabase.from('tasks').delete().eq('id', params.id)

  tasks = tasks.filter((t) => t.id !== params.id);
  return new NextResponse(null, { status: 204 });
}