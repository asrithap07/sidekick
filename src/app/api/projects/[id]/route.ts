import { NextResponse } from "next/server";
import type { Project } from "@/types/project";
import { supabase } from "@/lib/supabase";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/projects/[id] — fetch a single project

export async function GET(request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const { data: project, error } = await supabase 
      .from('projects')
      .select(`
        *,
        phases (*, tasks (*)),
        insights (*),
        coach_messages (*),
        attachments (*)
      `)
      .eq('slug', id)
      .single();
  

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    
    }

    const { phases, insights, coach_messages, attachments, ...projectFields } = project;

    // ── Staleness check — compares when the AI overview was last generated
    // against the most recent task edit in this project. If any task has
    // changed more recently, the cached overview/insights are out of date.
    const latestTaskUpdate = phases
      ?.flatMap((p: any) => p.tasks)
      .reduce((latest: number, t: any) =>
        Math.max(latest, new Date(t.updated_at ?? 0).getTime()), 0) ?? 0;

    const analysisStale =
      !projectFields.ai_overview_updated_at ||
      latestTaskUpdate > new Date(projectFields.ai_overview_updated_at).getTime();

    const assembled = {
      ...projectFields,
      overview: projectFields.ai_overview ?? null,
      analysisStale,
      progress: phases?.length
        ? Math.round(phases.reduce((sum: number, p: any) => sum + Number(p.progress ?? 0), 0) / phases.length)
        : 0,
      phases: (phases ?? [])
        .sort((a: any, b: any) => a.number - b.number)
        .map((phase: any) => ({
          id: phase.id,
          number: phase.number,
          title: phase.title,
          status: phase.status,
          progress: phase.tasks.length === 0
            ? 0
            : Math.round(phase.tasks.filter((t: { done: boolean }) => t.done).length / phase.tasks.length * 100),
          tasks: phase.tasks.map((t: any) => ({
            id: t.id,
            label: t.label,
            done: t.done,
            priority: t.priority,
            dueDate: t.due_date,
            tags: [],
          })),
        })),
      insights: (insights ?? []).map((i: any) => ({
        iconName: i.icon_name,
        title: i.title,
        body: i.body,
      })),
      coaching: (coach_messages ?? []).map((c: any) => ({
        type: c.type,
        text: c.message,
        age: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
      attachments: (attachments ?? []).map((a: any) => ({
        name: a.name,
        meta: a.metadata,
      })),
    };

    return NextResponse.json(assembled);
  } catch (err) {
    console.error("PROJECT ROUTE CRASHED:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/projects/[id] — upsert a project (used after generation to save it)
export async function PUT(req: Request, context: Context) {
  const { id: slug } = await context.params;
  const body = await req.json();

  const { data: project, error: lookupError } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single();

  if (lookupError || !project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      title: body.title,
      icon: body.icon,
      description: body.description,
      deadline: body.deadline ?? null,
    })
    .eq('id', project.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/// DELETE /api/projects/[id] — delete a project (cascades to phases + tasks automatically)
export async function DELETE(request: Request, context: Context) {
  const { id: slug } = await context.params;

  const { data: project, error: lookupError } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single();

  if (lookupError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}