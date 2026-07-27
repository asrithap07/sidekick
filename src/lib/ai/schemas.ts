import { z } from "zod";

//this file defines the exact shape every AI response must match -> the contract between the AI and the app
//if the response is valid according to zod then well save it in the database

  export const GeneratedTaskSchema = z.object({
    title: z.string(),
    priority: z.enum(["high", "medium", "low"]),
    suggestedDueDate: z.string().optional(),
  });

  export const GeneratedPhaseSchema = z.object({
    name: z.string(),
    description: z.string(),
    tasks: z.array(GeneratedTaskSchema),
  });

  export const ProjectDecompositionSchema = z.object({
    phases: z.array(GeneratedPhaseSchema).min(2).max(6),
  });

  export const DailyBriefSchema = z.object({
    focus: z.string(),
    risk: z.string(),
    doFirst: z.string(),
    avoid: z.string(),
  });

  export const TaskScoreSchema = z.object({
    scores: z.array(z.object({
      taskId: z.string(),
      score: z.number().min(0).max(100),
      reason: z.string(),
    })),
  });

  export const ProjectRiskSchema = z.object({
    overview: z.string(), // NEW — narrative paragraph for the Overview tab
    riskScore: z.number().min(0).max(100),
    momentumScore: z.number().min(-100).max(100),
    momentumTrend: z.enum(["up", "down", "flat"]),
    insight: z.object({
      iconName: z.enum(["trending-up", "target", "lightbulb", "zap", "clock"]),
      title: z.string(),
      body: z.string(),
      confidence: z.number().min(0).max(1).optional(), // NEW — hedge language when inferring things you don't have real data for (e.g. "this task seems foundational" — you have no dependency graph, so the model is guessing from context)
    }).optional(),
    coachingNote: z.object({
      type: z.enum(["encouragement", "warning", "reflection", "recommendation"]),
      text: z.string(),
    }).optional(),
  });