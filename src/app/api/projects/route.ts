import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/mock/projects";
import type { ProjectDraft } from "@/types/creation";

// POST /api/projects — create a new project draft
// Returns a mock ID. When Supabase is connected, this will INSERT into the DB.
export async function POST(request: Request) {
  try {
    const body: ProjectDraft = await request.json();
    console.log("CREATE PROJECT DRAFT:", body);

    // Mock: return a stable-ish ID based on the goal name so navigation works
    const id = `mock-${Date.now()}`;

    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// GET /api/projects — list all projects (for sidebar etc.)
export async function GET() {
  return NextResponse.json(getAllProjects());
}
