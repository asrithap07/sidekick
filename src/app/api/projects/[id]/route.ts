import { NextResponse } from "next/server";
import type { Project } from "@/types/project";
import { supabase } from "@/lib/supabase";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/projects/[id] — fetch a single project

export async function GET(
  request: Request,
  context: Context
) {
  
  const {id} = await context.params;

  //fetch the project row with that id
  const { data: project, error: projectError} = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  //fetch phases
  const { data: phases, error: phasesError } = await supabase
    .from('phase_progress')       // use your view — gives progress for free
    .select('*')
    .eq('project_id', id)
    .order('number');

  if (phasesError) {
    return NextResponse.json({ error: phasesError.message }, { status: 500 });
  }

  //fetch the insights, coachign, and attachments
  const [
    { data: insights },
    { data: coaching },
    { data: attachments },
  ] = await Promise.all([
    supabase.from('insights').select('*').eq('project_id', id),
    supabase.from('coach_messages').select('*').eq('project_id', id),
    supabase.from('attachments').select('*').eq('project_id', id),
  ]);

  //assemble the full proejct with its progress calculated, its phases and tasks, ingihts, coaching, and attachments
  const assembled = {
    ...project,
    progress: phases?.length
      ? Math.round(phases.reduce((sum, p) => sum + Number(p.progress), 0) / phases.length)
      : 0,
    phases: (phases ?? []).map(phase => ({
      id: phase.id,
      number: phase.number,
      title: phase.title,
      status: phase.status,
      progress: phase.tasks.length === 0 ? 0 : Math.round(
        phase.tasks.filter((t: {done: boolean}) => t.done).length 
        / phase.tasks.length * 100
      ),
      tasks: phase.tasks.map((t: any) => ({
        id: t.id,
        label: t.label,
        done: t.done,
        priority: t.priority,
        due_date: t.due_date,
        tags: [],
      })),
    })),
    insights: (insights ?? []).map(i => ({
      iconName: i.icon_name,
      title: i.title,
      body: i.body,
    })),
    coaching: (coaching ?? []).map(c => ({
      type: c.type,
      text: c.message,
      age: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })),
    attachments: (attachments ?? []).map(a => ({
      name: a.name,
      meta: a.metadata,
    })),
  };

  return NextResponse.json(assembled);
}

// PUT /api/projects/[id] — upsert a project (used after generation to save it)
export async function PUT(req: Request, context: Context) {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id,
      title: body.title,
      icon: body.icon,
      description: body.description,
      deadline: body.deadline ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}