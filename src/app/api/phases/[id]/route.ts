import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH /api/phases/[id] — update a phase (e.g. rename it)
export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();

  const patch: Record<string, unknown> = {};
  if (body.title !== undefined) patch.title = body.title;
  if (body.status !== undefined) patch.status = body.status;

  const { data, error } = await supabase
    .from("phases")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Phase not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}