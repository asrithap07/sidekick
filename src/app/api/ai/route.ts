import { NextResponse } from "next/server";
import type { ProjectDraft, GeneratedPhase } from "@/types/creation";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai — generate a project plan from a ProjectDraft
//
// Currently returns mock phases. When you're ready for real AI:
// 1. Install @anthropic-ai/sdk or @openai/openai
// 2. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local
// 3. Replace the mock return with an API call
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

export async function POST(request: Request) {
  try {
    const body: ProjectDraft = await request.json();

    // ──────────────────────────────────────────────────────────────────────────
    // TODO: Replace with real AI call
    //
    // Example (Anthropic):
    //
    //   import Anthropic from "@anthropic-ai/sdk";
    //   const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    //
    //   const response = await anthropic.messages.create({
    //     model: "claude-3-5-sonnet-20241022",
    //     max_tokens: 4096,
    //     messages: [{
    //       role: "user",
    //       content: `Generate a project plan for: ${body.goal}\n\nDescription: ${body.description}\nTarget date: ${body.targetDate}\n\nReturn a JSON array of phases with tasks. Each phase has: id, name, description, tasks[]. Each task has: id, title, priority.`,
    //     }],
    //   });
    //
    //   const phases = JSON.parse(response.content[0].text);
    //
    // ──────────────────────────────────────────────────────────────────────────

    // For now, return mock phases after a short delay so the spinner plays
    await new Promise((r) => setTimeout(r, 3000));

    // Optionally save the draft to projects table if needed
    // (The project was already created via POST /api/projects, so this is just for AI generation)

    return NextResponse.json({ phases: MOCK_PHASES });
  } catch {
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}