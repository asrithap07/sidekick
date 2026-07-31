import { NextResponse } from "next/server";
import { generateText } from "ai";
import { model } from "@/lib/ai/client";
import { withRateLimit } from "@/lib/ai/rate-limit";

export async function POST(request: Request) {
  try {
    const { messages, system } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Build the prompt from the conversation history
    const conversation = messages
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    const prompt = `${system ? system + "\n\n" : ""}${conversation}\n\nAssistant:`;

    const { text } = await withRateLimit(() =>
      generateText({
        model,
        prompt,
        maxTokens: 1000,
      } as any)
    );

    return NextResponse.json({ content: text });
  } catch (err) {
    console.error("AI CHAT FAILED:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}