import { supabase } from "@/lib/supabase";

function fmt(d: Date) {
  return d.toISOString().split("T")[0];
}

export async function computeStreak(todayISO: string, todayCompletionRate: number, todayTotal: number) {
  let streak = todayTotal > 0 && todayCompletionRate === 100 ? 1 : 0;

  const cursor = new Date(todayISO);
  while (true) {
    cursor.setDate(cursor.getDate() - 1);
    const { data } = await supabase
      .from("daily_state")
      .select("completion_rate")
      .eq("state_date", fmt(cursor))
      .maybeSingle();

    if (!data || Number(data.completion_rate) < 100) break;
    streak++;
  }
  return streak;
}

export async function computeMomentumDelta(todayISO: string) {
  const thisWeekStart = new Date(todayISO);
  thisWeekStart.setDate(thisWeekStart.getDate() - 6);

  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
  const lastWeekStart = new Date(lastWeekEnd);
  lastWeekStart.setDate(lastWeekStart.getDate() - 6);

  const [{ data: thisWeek }, { data: lastWeek }] = await Promise.all([
    supabase.from("daily_state").select("completion_rate").gte("state_date", fmt(thisWeekStart)).lte("state_date", todayISO),
    supabase.from("daily_state").select("completion_rate").gte("state_date", fmt(lastWeekStart)).lte("state_date", fmt(lastWeekEnd)),
  ]);

  const avg = (rows: { completion_rate: number }[] | null) =>
    rows && rows.length ? rows.reduce((s, r) => s + Number(r.completion_rate), 0) / rows.length : 0;

  return Math.round(avg(thisWeek) - avg(lastWeek));
}