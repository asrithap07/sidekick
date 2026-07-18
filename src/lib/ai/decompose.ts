import { generateText, Output } from "ai";
import { model } from "./client";
import { ProjectDecompositionSchema } from "./schemas";
import type { ProjectDraft } from "@/types/creation";

export async function decomposeProject(draft: ProjectDraft) {
  //get the output directly from the ai sdk
  const { output } = await generateText({
    model,
    //here we define the output formate
    output: Output.object({
      schema: ProjectDecompositionSchema,
    }),
    prompt: `You are Sidekick's project planning engine.

Your job is to transform a user's desired outcome into a realistic, actionable project plan.

The user may provide a vague or incomplete goal. Do not simply repeat the user's words, ask for more information, or create vague tasks. Instead, use reasonable assumptions and your general knowledge to infer the major steps required to make meaningful progress toward the outcome.

USER'S PROJECT:
Goal: ${draft.goal}
Description: ${draft.description || "No additional description provided."}
Target date: ${draft.targetDate || "No target date specified."}
Clarifications: ${JSON.stringify(draft.clarifications || {})}

Create a plan with 3-5 sequential phases. Each phase should represent a meaningful stage of progress toward the final outcome. The phases should follow a logical order, where completing earlier phases helps enable later phases.

Each phase should contain 3-6 concrete, actionable tasks.

TASK QUALITY RULES:
- Tasks should describe something the user can actually do.
- Avoid vague tasks such as "work on the project", "do research", "prepare", or "make progress".
- Prefer specific actions such as "Compare three internship programs based on location, role, and application deadline."
- Break large activities into smaller steps when appropriate.
- Prioritize tasks based on urgency, importance, and how much they unblock future work.
- A task should be independently understandable without needing to read the entire project description.
- Do not create unnecessary tasks simply to fill the phase.
- If the user's goal is vague, make reasonable assumptions about the most common path to achieving that goal.
- If a target date is provided, consider it when determining task priority and sequencing.
- The final phase should move the user toward completing, launching, achieving, or otherwise realizing the original goal.

Return only the structured project plan described by the schema.`,
  });

  return output.phases;
}