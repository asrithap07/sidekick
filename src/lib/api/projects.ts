import type { ProjectDraft, GeneratedPhase } from "@/types/creation";
import type { Project } from "@/types/project";

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_PHASES: GeneratedPhase[] = [
  {
    id: "phase-0",
    name: "Resume & Branding",
    description: "Polish your resume, LinkedIn, and portfolio.",
    tasks: [
      { id: "t-0-0", title: "Update resume with latest projects and skills", priority: "high" },
      { id: "t-0-1", title: "Write a compelling LinkedIn headline and summary", priority: "high" },
      { id: "t-0-2", title: "Pin 2–3 best projects to GitHub profile", priority: "medium" },
      { id: "t-0-3", title: "Ask a peer or mentor to review your resume", priority: "medium" },
      { id: "t-0-4", title: "Create or update your personal portfolio site", priority: "low" },
    ],
  },
  {
    id: "phase-1",
    name: "Technical Foundations",
    description: "Build the DSA and system design skills needed to pass technical screens.",
    tasks: [
      { id: "t-1-0", title: "Complete Leetcode easy: Arrays & Strings (20 problems)", priority: "high" },
      { id: "t-1-1", title: "Complete Leetcode medium: Trees & Graphs (15 problems)", priority: "high" },
      { id: "t-1-2", title: "Study Big-O notation and space/time complexity", priority: "high" },
      { id: "t-1-3", title: "Read system design primer: load balancing, caching, DBs", priority: "medium" },
      { id: "t-1-4", title: "Do 2 timed mock interviews on Pramp or Interviewing.io", priority: "medium" },
    ],
  },
  {
    id: "phase-2",
    name: "Applications",
    description: "Research target companies and submit a focused batch of applications.",
    tasks: [
      { id: "t-2-0", title: "Build a spreadsheet to track companies and statuses", priority: "high" },
      { id: "t-2-1", title: "Apply to 5 big tech internship programs", priority: "high" },
      { id: "t-2-2", title: "Apply to 10 mid-size tech companies", priority: "high" },
      { id: "t-2-3", title: "Reach out to 3 alumni at target companies on LinkedIn", priority: "medium" },
    ],
  },
  {
    id: "phase-3",
    name: "Interview Prep",
    description: "Practice interviews end-to-end so you perform confidently under pressure.",
    tasks: [
      { id: "t-3-0", title: "Prepare STAR stories for 5 behavioral questions", priority: "high" },
      { id: "t-3-1", title: "Do a full 45-min mock technical interview with a friend", priority: "high" },
      { id: "t-3-2", title: "Research each company before your scheduled screen", priority: "high" },
      { id: "t-3-3", title: "Practice explaining your projects out loud in under 2 min", priority: "medium" },
    ],
  },
];

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
  // Simulate network delay so the generating animation plays
  await new Promise((r) => setTimeout(r, 3000));
  // TODO: swap for real Anthropic API call via /api/ai
  return MOCK_PHASES;
}

export async function getProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch project ${id}`);
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
