import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeProject } from "@/lib/ai/analyze-project";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  const { id: slug } = await context.params;

  // Reuse the same assembly logic as GET /api/projects/[id] — consider
  // extracting that into a shared getProjectBySlug() helper so both routes
  // stay in sync instead of duplicating the query + mapping.
  const projectRes = await fetch(new URL(`/api/projects/${slug}`, request.url));
  if (!projectRes.ok) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const project = await projectRes.json();

  const { data: projectRow } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!projectRow) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const result = await analyzeProject(project);

    await supabase
      .from("projects")
      .update({
        ai_overview: result.overview,
        ai_overview_updated_at: new Date().toISOString(),
      })
      .eq("id", projectRow.id);

    if (result.insight) {
      await supabase.from("insights").insert({
        project_id: projectRow.id,
        icon_name: result.insight.iconName,
        title: result.insight.title,
        body: result.insight.body,
      });
      // Keep only the 3 most recent insights per project
      const { data: allInsights } = await supabase
        .from("insights")
        .select("id, created_at")
        .eq("project_id", projectRow.id)
        .order("created_at", { ascending: false });
      const staleIds = (allInsights ?? []).slice(3).map(i => i.id);
      if (staleIds.length) {
        await supabase.from("insights").delete().in("id", staleIds);
      }
    }

    if (result.coachingNote) {
      await supabase.from("coach_messages").insert({
        project_id: projectRow.id,
        type: result.coachingNote.type,
        message: result.coachingNote.text,
      });
      const { data: allNotes } = await supabase
        .from("coach_messages")
        .select("id, created_at")
        .eq("project_id", projectRow.id)
        .order("created_at", { ascending: false });
      const staleIds = (allNotes ?? []).slice(3).map(n => n.id);
      if (staleIds.length) {
        await supabase.from("coach_messages").delete().in("id", staleIds);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PROJECT ANALYSIS FAILED:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}