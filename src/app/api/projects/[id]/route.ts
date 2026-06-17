import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/lib/mock/projects";


type Context = {
  params: Promise<{
    id: string;
  }>;
};

//replace with supabase call later
export async function GET(
  request: Request,
  context: Context
) {
  const { id } = await context.params;

  console.log("REQUEST URL:", request.url);
  console.log("PARAM ID:", id);

  const project = MOCK_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}