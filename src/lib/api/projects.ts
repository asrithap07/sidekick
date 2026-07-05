import type { ProjectDraft, GeneratedPhase } from "@/types/creation";
import type { Project } from "@/types/project";
import { generatePlan } from "./ai";

// ─────────────────────────────────────────────────────────────────────────────
// API functions
// ─────────────────────────────────────────────────────────────────────────────

export async function createProject(draft: ProjectDraft): Promise<{ id: string }> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function generateProjectPlan(
  draft: ProjectDraft
): Promise<GeneratedPhase[]> {
  // Calls the real /api/ai endpoint (which currently returns mock data,
  // but is ready to swap for Anthropic/OpenAI when you're ready)
  return generatePlan(draft);
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) {
    const body = await res.text();
    console.error("API ERROR:", res.status, body);
    throw new Error(body);
  }
  return res.json();
}

export async function saveProject(id: string, project: Project): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to save project");
  return res.json();
}