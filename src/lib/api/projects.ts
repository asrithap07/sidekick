import type { ProjectDraft } from "@/types/creation";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) {
    const body = await res.text();
    console.error("API ERROR: ", res.status, body);
    throw new Error("Failed to get projects")
  }
  return res.json()
}

export async function createProject(draft: ProjectDraft): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("API ERROR:", res.status, body);
    throw new Error("Failed to create project");
  }
  return res.json(); 
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
  // Kept for future editing use — not used in the creation flow anymore
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to save project");
  return res.json();
}

export async function deleteProject(slug: string): Promise<void> {
  const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.text();
    console.error("API ERROR:", res.status, body);
    throw new Error("Failed to delete project");
  }
}