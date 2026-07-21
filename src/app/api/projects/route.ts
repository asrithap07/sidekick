import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ProjectDraft } from "@/types/creation";
import { decomposeProject } from "@/lib/ai/decompose";

export function createSlug(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, icon, description, deadline, created_at, slug")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  let createdProjectId: string | null = null;

  try {
    const draft: ProjectDraft = await request.json();

    const generatedPhases = await decomposeProject(draft);

    // Append a shorcollidet random suffix so two projects with the same goal text
    // never  on slug — e.g. "swe-internship-2027-a8f3"
    const slug = createSlug(draft.goal);
    // const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        title: draft.goal,
        slug,
        description: draft.description ?? null,
        deadline: draft.targetDate ?? null,
        icon: "🎯",
      })
      .select("id, slug")
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: projectError?.message ?? "Failed to create project" },
        { status: 500 }
      );
    }

    createdProjectId = project.id; // tracked so we can clean up on later failure

    // NOTE: phases table has no `progress` column — progress is computed
    // from task completion, never stored.
    const phaseRows = generatedPhases.map((phase, index) => ({
      project_id: project.id,
      number: index + 1,
      title: phase.name,
      status: index === 0 ? "active" : "upcoming",
    }));

    const { data: insertedPhases, error: phasesError } = await supabase
      .from("phases")
      .insert(phaseRows)
      .select("id, number");

    if (phasesError || !insertedPhases) {
      await supabase.from("projects").delete().eq("id", project.id); // rollback
      return NextResponse.json({ error: phasesError?.message ?? "Failed to create phases" }, { status: 500 });
    }

    // tasks table has BOTH project_id and phase_id — populate both
    const taskRows = generatedPhases.flatMap((phase, index) => {
      const phaseId = insertedPhases.find((p) => p.number === index + 1)!.id;
      return phase.tasks.map((task) => ({
        project_id: project.id,
        phase_id: phaseId,
        label: task.title,
        priority: task.priority,
        due_date: task.suggestedDueDate ?? null,
        done: false,
      }));
    });

    if (taskRows.length > 0) {
      const { error: tasksError } = await supabase.from("tasks").insert(taskRows);
      if (tasksError) {
        await supabase.from("projects").delete().eq("id", project.id); // rollback (cascades via FK? confirm below)
        return NextResponse.json({ error: tasksError.message }, { status: 500 });
      }
    }

    const { data: fullProject, error: fetchError } = await supabase
      .from("projects")
      .select(`*, phases (*, tasks (*)), insights (*), coach_messages (*), attachments (*)`)
      .eq("id", project.id)
      .single();

    if (fetchError || !fullProject) {
      return NextResponse.json({ error: "Project created but failed to load" }, { status: 500 });
    }

    const { phases, insights, coach_messages, attachments, ...projectFields } = fullProject;

    const assembled = {
      ...projectFields,
      slug: project.slug,
      progress: 0, // fresh project, 0 tasks done — computed, not stored
      phases: (phases ?? [])
        .sort((a: any, b: any) => a.number - b.number)
        .map((phase: any) => ({
          id: phase.id,
          number: phase.number,
          title: phase.title,
          status: phase.status,
          progress: 0, // computed field on the assembled object, not a DB column
          tasks: phase.tasks.map((t: any) => ({
            id: t.id,
            label: t.label,
            done: t.done,
            priority: t.priority,
            dueDate: t.due_date,
            tags: [],
          })),
        })),
      insights: [],
      coaching: [],
      attachments: [],
    };

    return NextResponse.json(assembled, { status: 201 });
  } catch (err) {
    console.error("PROJECT CREATION FAILED:", err);
    if (createdProjectId) {
      await supabase.from("projects").delete().eq("id", createdProjectId); // rollback on any unexpected error too
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}