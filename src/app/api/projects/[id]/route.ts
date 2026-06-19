import { NextResponse } from "next/server";
import { getProjectById, addProject } from "@/lib/mock/projects";
import type { Project } from "@/types/project";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/projects/[id] — fetch a single project

export async function GET(
  request: Request,
  context: Context
) {
  const { id } = await context.params;

  console.log("REQUEST URL:", request.url);
  console.log("PARAM ID:", id);

  const project = getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT /api/projects/[id] — upsert a project (used after generation to save it)
export async function PUT(
  request: Request,
  context: Context
) {
  const { id } = await context.params;
  const body: Project = await request.json();

  // Assign the URL's ID to the project so the redirect resolves correctly
  const saved = { ...body, id };
  addProject(saved);

  return NextResponse.json(saved, { status: 200 });
}
