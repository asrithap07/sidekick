"use client";

// Flow:
// 1. Modal POSTs draft to /api/projects → gets back { id }
// 2. Modal navigates here: /projects/new?status=generating&id=mock-123
// 3. This page runs generateProjectPlan(), saves result, then router.replace(`/projects/${id}`)
// 4. The permanent project page at /projects/[projectId] fetches by ID
//
// ProjectCreationContext is gone. The draft doesn't need to survive
// navigation — the ID is in the URL and the data lives in the API.

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ChevronRight } from "lucide-react";

import StepGenerating from "@/components/steps/StepGenerating";
import { PhaseSection } from "@/components/PhaseSection";
import { generateProjectPlan } from "@/lib/api/projects";
import { draftToProject } from "@/lib/utils/project-utils";
import type { Project } from "@/types/project";
import type { ProjectDraft } from "@/types/creation";

export default function NewProjectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectId = searchParams.get("id");
  const isGenerating = searchParams.get("status") === "generating";

  const [status, setStatus] = useState<"generating" | "ready" | "error">(
    isGenerating ? "generating" : "ready"
  );
  const [project, setProject] = useState<Project | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("Overview");
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);

  const tabs = ["Overview", "Tasks", "Files"];

  useEffect(() => {
    if (!isGenerating) return;

    async function generate() {
      try {
        // In production: the draft would be fetched from the DB by projectId.
        // For now we use an empty draft — the mock plan doesn't use draft contents.
        const mockDraft: ProjectDraft = {
          goal: "My Project",
          description: "",
          targetDate: "",
          clarifications: { c1: "", c2: "", c3: "" },
        };

        const phases = await generateProjectPlan(mockDraft);
        const newProject = draftToProject(mockDraft, phases);

        setProject(newProject);
        setStatus("ready");

        // Replace the URL so the user lands on the permanent project page.
        // TODO (Supabase): INSERT newProject into DB before this redirect,
        // and use the real ID returned from createProject() in the modal.
        if (projectId) {
          router.replace(`/projects/${projectId}`);
        }
      } catch {
        setStatus("error");
      }
    }

    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  function toggleTask(id: string) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (status === "generating") {
    return (
      <div className="flex h-full">
        <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-300 font-medium">New project</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full">
            <StepGenerating />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-3">
        <p className="text-sm text-red-500">Something went wrong generating your plan.</p>
        <button onClick={() => router.push("/")} className="text-xs text-indigo-500 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">No project data found.</p>
      </div>
    );
  }

  const overallProgress = Math.round(
    project.phases.reduce((sum, p) => sum + p.progress, 0) / (project.phases.length || 1)
  );

  return (
    <div className="flex h-full gap-3 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-300 font-medium">{project.title}</span>
          </div>
          <button
            onClick={() => setInsightsPanelOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{project.title}</h1>
            {project.description && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{project.description}</p>
            )}
          </div>

          <div className="flex items-center gap-5 py-3 border-t border-b border-gray-100 dark:border-gray-700 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Progress</span>
              <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${overallProgress}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{overallProgress}%</span>
            </div>
          </div>

          <div className="flex gap-1 border-b border-gray-100 dark:border-gray-700 mb-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-500 font-medium"
                    : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">AI-generated plan</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your project has been broken into {project.phases.length} phases with{" "}
                    {project.phases.reduce((sum, p) => sum + p.tasks.length, 0)} tasks.
                    Head to the Tasks tab to get started.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Tasks" && (
            <div className="flex flex-col gap-6">
              {project.phases.map((phase) => (
                <PhaseSection
                  key={phase.number}
                  phase={phase}
                  checkedTasks={checkedTasks}
                  onToggleTask={toggleTask}
                />
              ))}
            </div>
          )}

          {activeTab === "Files" && (
            <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
              Upload file
            </button>
          )}
        </div>
      </div>
    </div>
  );
}