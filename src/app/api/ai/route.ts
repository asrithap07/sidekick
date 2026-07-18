import { decomposeProject } from "@/lib/ai/decompose";
import { ProjectDraft } from "@/types/creation";
import { NextResponse } from "next/server";

  export async function POST(request: Request) {
    try {
      //get the body of the request in json form
      const body: ProjectDraft = await request.json();
      //call decomposeProject on the request to get the phases (calling the function that calls the AI on our data)
      const phases = await decomposeProject(body);
      return NextResponse.json({ phases });
    } catch (err) {
      console.error("AI decomposition failed:", err);
      return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
    }
  }