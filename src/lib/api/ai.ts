import type { ProjectDraft, GeneratedPhase } from "@/types/creation";

export async function generatePlan(draft: ProjectDraft): Promise<GeneratedPhase[]> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to generate plan" }));
    throw new Error(err.error);
  }

  const data = await res.json();
  return data.phases as GeneratedPhase[];
}