import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ProjectDraft } from "@/types/creation";

// GET /api/projects — list all projects (for sidebar)
export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, icon, description, deadline, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/projects — create a new project
export async function POST(request: Request) {
  try {
    const body: ProjectDraft = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: body.goal,
        description: body.description ?? null,
        deadline: body.targetDate ?? null,
        icon: '🎯',          // default icon, user can change later
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}