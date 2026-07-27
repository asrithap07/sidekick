import { generateText, Output } from "ai";
import { model } from "./client";
import { DailyBriefSchema } from "./schemas";
import { computeBaseScore } from "@/lib/utils/task-scoring";
import type { Task } from "@/types/task";
import type { Stats } from "@/types/stats";

export async function generateDailyBrief(todayTasks: Task[], stats: Stats) {
  const scored = todayTasks.map(computeBaseScore);

  const { output } = await generateText({
    model,
    output: Output.object({ schema: DailyBriefSchema }),
    prompt: `You are Sidekick's daily planning coach. Based on today's tasks, write a short, direct daily brief.

STATS: ${JSON.stringify(stats)}
TASKS: ${JSON.stringify(
      scored.map((t) => ({
        label: t.label,
        priority: t.priority,
        done: t.done,
        isOverdue: t.isOverdue,
        daysUntilDue: t.daysUntilDue,
        baseScore: t.baseScore,
      }))
    )}

Return:
- focus: one sentence, the single most important thing to focus on today
- risk: one sentence about what could go wrong today if nothing changes (or "Nothing urgent today" if genuinely nothing stands out)
- doFirst: the one task to tackle first, and briefly why
- avoid: one sentence of what NOT to spend time on right now (e.g. low-priority tasks when something urgent is pending)

Keep every field to one short sentence. Be specific and reference actual task labels, not generic advice. If there are no tasks today, say so honestly instead of inventing something to focus on.`,
  });

  return output;
}