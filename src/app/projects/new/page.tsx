"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, ChevronRight } from "lucide-react";

import { PhaseSection } from "@/components/PhaseSection";
import { generateProjectPlan, saveProject } from "@/lib/api/projects";
import { draftToProject } from "@/lib/utils/project-utils";
import type { Project } from "@/types/project";
import type { ProjectDraft } from "@/types/creation";
import {
  ink,
  inkBody,
  inkMuted,
  inkFaint,
  borderTint,
  trackTint,
  hoverTint,
  inkHover,
  surfacePanel,
  aiAssistBtn,
} from "@/lib/ui/tint";
import { typeDisplay, typeHeadline, typeBody } from "@/lib/ui/type";

const GENERATING_MESSAGES = [
  "Analyzing your goal…",
  "Mapping out phases…",
  "Generating starter tasks…",
  "Estimating timelines…",
  "Finalizing your plan…",
];

function GeneratingSpinner() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, GENERATING_MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-6 w-full">
      <div className="relative w-12 h-12">
        <svg
          className="motion-reduce:animate-none animate-spin w-12 h-12 text-indigo-500"
          viewBox="0 0 48 48"
          fill="none"
          style={{ animationDuration: "0.9s" }}
          aria-hidden
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="3"
          />
          <path
            d="M24 4a20 20 0 0 1 20 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={18} className="text-indigo-500 opacity-80" aria-hidden />
        </div>
      </div>

      <p key={msgIndex} className={`${typeBody} ${inkMuted} text-center`}>
        {GENERATING_MESSAGES[msgIndex]}
      </p>

      <div className={`w-full flex flex-col divide-y ${borderTint} mt-2`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 motion-reduce:transition-none transition-opacity duration-300"
            style={{ opacity: msgIndex > i ? 1 : 0.35 }}
          >
            <div className={`w-7 h-7 rounded-full shrink-0 bg-indigo-500/10`} />
            <div className="flex-1 space-y-1.5">
              <div
                className={`h-2.5 rounded-full ${trackTint}`}
                style={{ width: `${55 + i * 10}%` }}
              />
              <div
                className={`h-2 rounded-full ${trackTint} opacity-70`}
                style={{ width: `${35 + i * 5}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const tabs = ["Overview", "Tasks", "Files"];

  useEffect(() => {
    if (!isGenerating) return;

    async function generate() {
      try {
        const mockDraft: ProjectDraft = {
          goal: "My Project",
          description: "",
          targetDate: "",
          clarifications: { c1: "", c2: "", c3: "" },
        };

        const phases = await generateProjectPlan(mockDraft);
        const newProject = draftToProject(mockDraft, phases);

        if (projectId) {
          await saveProject(projectId, newProject);
        }

        setProject(newProject);
        setStatus("ready");

        if (projectId) {
          router.replace(`/projects/${projectId}`);
        }
      } catch {
        setStatus("error");
      }
    }

    generate();
  }, [isGenerating, projectId, router]);

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
        <div className={`flex flex-col flex-1 min-w-0 ${surfacePanel} overflow-hidden`}>
          <div className={`flex items-center gap-2 px-6 py-3 border-b ${borderTint} text-xs ${inkMuted}`}>
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className={`${inkBody} font-medium`}>New project</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full">
            <GeneratingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-3">
        <p className={`${typeBody} text-red-500 dark:text-red-400`}>
          Something went wrong generating your plan.
        </p>
        <button
          onClick={() => router.push("/")}
          className={`${typeBody} text-indigo-500 hover:underline`}
        >
          Go back
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className={`${typeBody} ${inkMuted}`}>No project data found.</p>
      </div>
    );
  }

  const overallProgress = Math.round(
    project.phases.reduce((sum, p) => sum + p.progress, 0) / (project.phases.length || 1)
  );

  return (
    <div className="flex h-full gap-3 overflow-hidden">
      <div className={`flex flex-col flex-1 min-w-0 ${surfacePanel} overflow-hidden`}>
        <div className={`flex items-center justify-between px-6 py-3 border-b ${borderTint} shrink-0`}>
          <div className={`flex items-center gap-2 text-xs ${inkMuted}`}>
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className={`${inkBody} font-medium`}>{project.title}</span>
          </div>
          <button className={aiAssistBtn}>
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-5">
            <h1 className={`${typeDisplay} ${ink}`}>{project.title}</h1>
            {project.description && (
              <p className={`${typeBody} ${inkMuted} mt-1 max-w-prose`}>{project.description}</p>
            )}
          </div>

          <div className={`flex items-center gap-5 py-3 border-t border-b ${borderTint} mb-6 flex-wrap gap-y-2`}>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${inkMuted}`}>Progress</span>
              <div className={`w-24 h-1.5 rounded-full ${trackTint} overflow-hidden`}>
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${inkBody}`}>{overallProgress}%</span>
            </div>
          </div>

          <div className={`flex gap-1 border-b ${borderTint} mb-6`}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-500 font-medium"
                    : `border-transparent ${inkMuted} ${inkHover}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-indigo-500 shrink-0" />
                <h2 className={`${typeHeadline} ${ink}`}>AI-generated plan</h2>
              </div>
              <p className={`${typeBody} leading-relaxed ${inkBody} max-w-prose`}>
                Your project has been broken into {project.phases.length} phases with{" "}
                {project.phases.reduce((sum, p) => sum + p.tasks.length, 0)} tasks. Head to the
                Tasks tab to get started.
              </p>
            </section>
          )}

          {activeTab === "Tasks" && (
            <div className="flex flex-col gap-8">
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
            <button
              className={`flex items-center gap-1.5 py-3 text-xs ${inkMuted} ${inkHover} ${hoverTint} rounded-lg transition-colors`}
            >
              Upload file
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
