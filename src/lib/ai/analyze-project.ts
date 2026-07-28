import { generateText, Output } from "ai";
import { model } from "./client";
import { ProjectRiskSchema } from "./schemas";
import { buildProjectContext } from "./project-context";
import type { Project } from "@/types/project";
import { withRateLimit } from "./rate-limit";


export async function analyzeProject(project: Project) {
  const context = buildProjectContext(project);

  const { output } = await withRateLimit(() =>
    generateText({
    model,
    output: Output.object({ schema: ProjectRiskSchema }),
    prompt: `You are Sidekick's project coach. Analyze this project and return a structured assessment.

PROJECT CONTEXT:
${JSON.stringify(context, null, 2)}

Write a short (2-3 sentence) "overview" paragraph s
ummarizing where the project stands, in plain, direct language — this appears at the top of the project page.

Compute a riskScore (0-100, how likely the project is to slip) and 
momentumScore (-100 to 100, how much progress is being made recently vs stalling),
and a momentumTrend.

Only include "insight" if you notice something genuinely useful — 
a real pattern, a risk, or something worth flagging. 
Don't force one if nothing stands out. If you're inferring something you can't 
directly verify from the data (e.g. that a task blocks others), 
lower the confidence score accordingly — you don't have explicit task dependency 
data, only titles and phase order, so treat structural claims as informed guesses,
not facts.

Only include "coachingNote" if there's a genuinely useful nudge to give — 
encouragement, a warning, a reflection prompt, or a recommendation. 
Don't generate one just to fill the field.`,
  })
);

  return output;
}