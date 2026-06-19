"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Sparkles, Target, CheckCircle2, Circle, ChevronRight,
  Plus, Pencil, MoreHorizontal, CalendarDays, Star,
  FileText, MoreVertical,
} from "lucide-react";

import { PhaseSection } from "@/components/PhaseSection";
import { InsightIcon } from "@/lib/utils/insight-icon";
import { getProject } from "@/lib/api/projects";
import { getTagDisplay, getDueDateLabel } from "@/lib/utils/task-display-utils";
import { useAIAssistant } from "@/context/AIAssistantContext";
import type { Project } from "@/types/project";

export default function ProjectPage() {
const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("Overview");
  const { togglePanel, setPageContext } = useAIAssistant();

  const tabs = ["Overview", "Tasks", "Insights", "Files"];

  useEffect(() => {
    if (!id) return;
    getProject(id)
      .then(setProject)
      .catch(() => setError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  // Set page context for AI assistant whenever project loads
  useEffect(() => {
    if (project) {
      setPageContext({ page: "project", project });
    }
  }, [project, setPageContext]);

  function toggleTask(id: string) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Loading project…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-400">{error ?? "Project not found."}</p>
      </div>
    );
  }

  const todayTasks = project.phases
    .flatMap((p) => p.tasks)
    .filter((t) => {
      if (t.done || !t.dueDate) return false;
      const label = getDueDateLabel(t.dueDate);
      return label === "Today" || label === "Tomorrow";
    });

  return (
    <div className="flex h-full gap-3 overflow-hidden">

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-300 font-medium">{project.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
              <MoreHorizontal size={16} />
            </button>
            <button
              onClick={() => togglePanel()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <Sparkles size={13} />
              AI Assist
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Project title */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{project.icon}</span>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{project.title}</h1>
              <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <Pencil size={13} />
              </button>
            </div>
            {project.description && (
              <p className="text-sm text-gray-400 dark:text-gray-500">{project.description}</p>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-5 py-3 border-t border-b border-gray-100 dark:border-gray-700 mb-5 flex-wrap gap-y-2">
            {project.deadline && (
              <>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <CalendarDays size={13} />
                  Due {new Date(project.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <div className="w-px h-4 bg-gray-100 dark:bg-gray-700" />
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Progress</span>
              <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{project.progress}%</span>
            </div>
            <div className="w-px h-4 bg-gray-100 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <span>{project.phases.length} phases</span>
            </div>
          </div>

          {/* Tabs */}
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

          {/* ── Overview tab ── */}
          {activeTab === "Overview" && (
            <>
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">AI Project Overview</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      You're on track to reach your goal! Focus on completing applications and strengthening your DSA skills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phase summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {project.phases.map((phase) => {
                  const barColor =
                    phase.status === "completed" ? "bg-green-400" :
                    phase.status === "in-progress" ? "bg-indigo-500" :
                    "bg-gray-200 dark:bg-gray-600";
                  return (
                    <div
                      key={phase.number}
                      className={`rounded-xl p-3 border ${
                        phase.status === "in-progress"
                          ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/10"
                          : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium mb-0.5">Phase {phase.number}</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-1">{phase.title}</p>
                      <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden my-2">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${phase.progress}%` }} />
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500">
                        {phase.tasks.filter((t) => t.done).length}/{phase.tasks.length} tasks
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Today's focus */}
              {todayTasks.length > 0 && (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <Target size={15} className="text-indigo-500" />
                      Today's Focus
                    </h2>
                    <button onClick={() => setActiveTab("Tasks")} className="text-xs text-indigo-500 hover:text-indigo-600">
                      View all tasks
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {todayTasks.map((task) => {
                      const isDone = checkedTasks.has(task.id);
                      const tagDisplay = getTagDisplay(task.tags);
                      return (
                        <div key={task.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                          <button onClick={() => toggleTask(task.id)} className="shrink-0">
                            {isDone ? <CheckCircle2 size={16} className="text-indigo-500" /> : <Circle size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400" />}
                          </button>
                          <span className={`flex-1 text-sm truncate ${isDone ? "line-through text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-200"}`}>
                            {task.label}
                          </span>
                          {tagDisplay && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${tagDisplay.tagColor}`}>{tagDisplay.tag}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current phase with task list */}
              {project.phases.filter((p) => p.status === "in-progress").map((phase) => (
                <div key={phase.number} className="mt-4">
                  <PhaseSection
                    phase={phase}
                    checkedTasks={checkedTasks}
                    onToggleTask={toggleTask}
                    showTags
                  />
                </div>
              ))}
            </>
          )}

          {/* ── Tasks tab ── */}
          {activeTab === "Tasks" && (
            <div className="flex flex-col gap-6">
              {project.phases.map((phase) => (
                <PhaseSection
                  key={phase.number}
                  phase={phase}
                  checkedTasks={checkedTasks}
                  onToggleTask={toggleTask}
                  showTags
                />
              ))}
            </div>
          )}

          {/* ── Insights tab ── */}
          {activeTab === "Insights" && (
            <div className="flex flex-col gap-3">
              {(project.insights ?? []).map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <InsightIcon iconName={insight.iconName} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{insight.title}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{insight.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Files tab ── */}
          {activeTab === "Files" && (
            <div className="flex flex-col gap-2">
              {(project.attachments ?? []).map((file, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <FileText size={15} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{file.meta}</p>
                  </div>
                  <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
                    <MoreVertical size={14} />
                  </button>
                </div>
              ))}
              <button className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <Plus size={13} />
                Upload file
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}