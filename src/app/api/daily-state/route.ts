import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDailyBrief } from "@/lib/ai/daily-brief";
import { getTaskStats } from "@/lib/utils/task-utils";
import { computeStreak, computeMomentumDelta } from "@/lib/utils/daily-metrics";

export async function POST(request: Request) {
  const { tasks } = await request.json(); // today's tasks
  const today = new Date().toISOString().split("T")[0];
  const stats = getTaskStats(tasks);

  try {
    const brief = await generateDailyBrief(tasks, stats);
    const streak = await computeStreak(today, stats.pct, stats.total);
    const momentumDelta = await computeMomentumDelta(today);

    const { data } = await supabase
      .from("daily_state")
      .upsert(
        {
          state_date: today,
          streak,
          completion_rate: stats.pct,
          overdue_count: stats.overdue,
          momentum_delta: momentumDelta,
          brief_focus: brief.focus,
          brief_risk: brief.risk,
          brief_do_first: brief.doFirst,
          brief_avoid: brief.avoid,
          generated_at: new Date().toISOString(),
        },
        { onConflict: "state_date" }
      )
      .select()
      .single();

    return NextResponse.json(data);
  } catch (err) {
    console.error("DAILY STATE GENERATION FAILED:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("daily_state")
    .select("*")
    .eq("state_date", today)
    .maybeSingle();

  return NextResponse.json(data ?? null);
}