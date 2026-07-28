"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles, Target, CheckCircle2, Circle, ChevronRight,
  Plus, Pencil, MoreHorizontal, CalendarDays,
  FileText, MoreVertical,
} from "lucide-react";

import { PhaseSection } from "@/components/PhaseSection";
import { InsightIcon } from "@/lib/utils/insight-icon";
import { getProject, saveProject, deleteProject } from "@/lib/api/projects";
import { updateTask, createTask, deleteTask } from "@/lib/api/tasks";
import TaskItem from "@/components/TaskItem";
import EditTaskModal from "@/components/EditTaskModal";
import EditProjectModal from "@/components/EditProjectModal";
import AddTaskModal from "@/components/AddTaskModal";
import { getDueDateLabel, getTagDisplay } from "@/lib/utils/task-display-utils";
import { useAIAssistant } from "@/context/AIAssistantContext";
import type { Project, Phase } from "@/types/project";
import type { Task } from "@/types/task";

import { formatRelativeTime } from "@/lib/utils/date-utils";

// Tinted neutral scale — shared with TaskBoard via lib/ui/tint. Previously
// defined locally here; promoted once a second page needed the same ramp.
import { ink, inkBody, inkMuted, inkFaint, borderTint, hoverTint, trackTint, inkHover, inkMutedHover, inkMutedGroupHover, surfacePanel, aiAssistBtn } from "@/lib/ui/tint";
import { typeDisplay, typeHeadline, typeTitle, typeBody } from "@/lib/ui/type";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("Overview");
  const { togglePanel, setPageContext } = useAIAssistant();

  // Edit modals
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState(false);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [addingTaskToPhase, setAddingTaskToPhase] = useState<Phase | null>(null);
  const [phaseNameInput, setPhaseNameInput] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const hasAutoAnalyzed = useRef(false);

  const tabs = ["Overview", "Tasks", "Insights", "Files"];

  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    getProject(id)
      .then(setProject)
      .catch((err) => {
        console.error("PROJECT FETCH FAILED:", err);
        setError("Failed to load project");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (project) {
      setPageContext({ page: "project", project });
    }
  }, [project, setPageContext]);

  const handleDeleteProject = useCallback(async () => {
    if (!id) return;
    const confirmed = window.confirm(
      `Delete "${project?.title}"? This will permanently delete all its phases and tasks. This can't be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteProject(id);
      router.push("/"); // or wherever your project list / Today page lives
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  }, [id, project, router]);

  function toggleTask(id: string) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const handleEditTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates);
      // Refresh project data using the project slug
      if (id) {
        getProject(id).then(setProject);
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }, [id]);

  const handleSaveProject = useCallback(async (updates: Partial<Project>) => {
    if (!project || !id) return;
    try {
      await saveProject(id, { ...project, ...updates });
      setProject((prev) => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error("Failed to save project:", err);
    }
  }, [project, id]);

  const handleSavePhaseName = useCallback(async () => {
    if (!editingPhase || !phaseNameInput.trim()) return;
    try {
      const res = await fetch(`/api/phases/${editingPhase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: phaseNameInput.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update phase");
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phases: prev.phases.map((p) =>
            p.number === editingPhase.number ? { ...p, title: phaseNameInput.trim() } : p
          ),
        };
      });
      setEditingPhase(null);
      setPhaseNameInput("");
    } catch (err) {
      console.error("Failed to update phase:", err);
    }
  }, [editingPhase, phaseNameInput]);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      await deleteTask(taskId);
      if (id) getProject(id).then(setProject);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, [id]);

  const handleAddTaskToPhase = useCallback(async (taskData: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[] }) => {
    if (!addingTaskToPhase || !project) return;
    try {
      const created = await createTask({
        ...taskData,
        project: project.id,
        phase_id: addingTaskToPhase.id,
      } as any);
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phases: prev.phases.map((p) =>
            p.number === addingTaskToPhase.number
              ? { ...p, tasks: [...p.tasks, { ...created, project: project.id }] }
              : p
          ),
        };
      });
      setAddingTaskToPhase(null);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }, [addingTaskToPhase, project]);

  // ── AI insight regeneration ──
  // Moved above the loading/error early-returns intentionally: hooks (including
  // useCallback and useEffect) must run in the same order on every render, so
  // nothing that calls a hook can live after a conditional `return`.
  const handleRefreshInsights = useCallback(async () => {
    if (!id || analyzing) return;
    setAnalyzing(true);
    try {
      await fetch(`/api/projects/${id}/analyze`, { method: "POST" });
      const fresh = await getProject(id);
      setProject(fresh);
    } catch (err) {
      console.error("INSIGHT REFRESH FAILED:", err);
    } finally {
      setAnalyzing(false);
    }
  }, [id, analyzing]);

  // Auto-trigger once per page visit if the cached overview/insights are stale.
  // The ref guard means this fires at most once, even if the refresh fails and
  // analysisStale stays true after refetching — no retry storms.
  useEffect(() => {
    if (!project?.analysisStale || hasAutoAnalyzed.current) return;
    hasAutoAnalyzed.current = true;
    handleRefreshInsights();
  }, [project?.analysisStale, handleRefreshInsights]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className={`text-sm ${inkMuted}`}>Loading project…</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500 dark:text-red-400">{error ?? "Project not found."}</p>
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

  const totalTasks = project.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const doneTasks = project.phases.reduce((sum, p) => sum + p.tasks.filter((t) => t.done).length, 0);

  return (
    <div className="flex h-full gap-3 overflow-hidden">
      <div className={`flex flex-col flex-1 min-w-0 ${surfacePanel} overflow-hidden`}>

        {/* Top bar */}
        <div className={`flex items-center justify-between px-6 py-3 border-b ${borderTint} shrink-0`}>
          <div className={`flex items-center gap-2 text-xs ${inkMuted}`}>
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className={`${ink} font-medium`}>{project.title}</span>
          </div>
          <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingProject(true)}
                className={`p-1.5 rounded-lg ${hoverTint} ${inkFaint} transition-colors`}
              >
                <Pencil size={14} />
              </button>
            <button
              onClick={() => togglePanel()}
              className={aiAssistBtn}
            >
              <Sparkles size={13} />
              AI Assist
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Title */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl leading-none">{project.icon}</span>
              <h1 className={`${typeDisplay} ${ink}`}>{project.title}</h1>
              <button
                onClick={() => setEditingProject(true)}
                className={`p-1 rounded-lg ${hoverTint} ${inkFaint} transition-colors`}
              >
                <Pencil size={13} />
              </button>
            </div>
            {project.description && (
              <p className={`${typeBody} ${inkMuted} max-w-prose`}>{project.description}</p>
            )}
          </div>

          {/* Metadata row — flat, no card, dividers do the separating */}
          <div className={`flex items-center gap-5 py-3 border-t border-b ${borderTint} mb-6 flex-wrap gap-y-2`}>
            {project.deadline && (
              <>
                <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
                  <CalendarDays size={13} />
                  Due {new Date(project.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
                <div className={`w-px h-4 ${trackTint}`} />
              </>
            )}
            <div className="flex items-center gap-2">
              <span className={`text-xs ${inkMuted}`}>Progress</span>
              <div className={`w-24 h-1.5 rounded-full ${trackTint} overflow-hidden`}>
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
              </div>
              <span className={`text-xs font-medium ${inkBody}`}>{project.progress}%</span>
            </div>
            <div className={`w-px h-4 ${trackTint}`} />
            <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
              <span>{project.phases.length} phases</span>
            </div>
          </div>

          {/* Tabs */}
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

          {/* ── Overview tab ── */}
          {activeTab === "Overview" && (
            <div className="flex flex-col gap-8">

              {/* AI overview — a typographic statement, not a boxed gradient card */}
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-indigo-500 shrink-0" />
                  <h2 className={`${typeHeadline} ${ink}`}>Overview</h2>
                </div>
                <p className={`${typeBody} ${inkBody} max-w-prose`}>
                  {project.overview ?? "You're making progress on this project — check back after a bit of activity for a personalized overview."}
                </p>
              </section>

              {/* Phase progress — a flat manifest instead of a grid of identical cards */}
              <section>
                <h2 className={`${typeHeadline} ${ink} mb-3`}>Phases</h2>
                <div className={`flex flex-col divide-y ${borderTint} animate-stagger`}>
                  {project.phases.map((phase) => {
                    const isActive = phase.status === "active";
                    const isComplete = phase.status === "completed";
                    const barColor = isComplete ? "bg-green-500" : isActive ? "bg-indigo-500" : trackTint;
                    return (
                      <div key={phase.number} className="flex items-center gap-4 py-3 group">
                        <span className={`text-sm tabular-nums w-5 shrink-0 ${isActive ? "text-indigo-500 font-semibold" : inkFaint}`}>
                          {phase.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${isActive ? `font-semibold ${ink}` : inkBody} truncate`}>
                              {phase.title}
                            </p>
                            <button
                              onClick={() => { setEditingPhase(phase); setPhaseNameInput(phase.title); }}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity ${inkFaint} ${inkMutedHover} hover:text-indigo-400`}
                            >
                              <Pencil size={11} />
                            </button>
                          </div>
                          <div className={`h-1 w-full max-w-56 rounded-full ${trackTint} overflow-hidden mt-1.5`}>
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${phase.progress}%` }} />
                          </div>
                        </div>
                        <span className={`text-xs ${inkMuted} shrink-0 tabular-nums`}>
                          {phase.tasks.filter((t) => t.done).length}/{phase.tasks.length}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Today's focus — flat section, no bordered box */}
              {todayTasks.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className={`${typeHeadline} ${ink} flex items-center gap-2`}>
                      <Target size={16} className="text-indigo-500" />
                      Today&apos;s Focus
                    </h2>
                    <button onClick={() => setActiveTab("Tasks")} className="text-xs text-indigo-500 hover:text-indigo-600">
                      View all tasks
                    </button>
                  </div>
                  <div className={`flex flex-col divide-y ${borderTint} animate-stagger`}>
                    {todayTasks.map((task) => {
                      const isDone = checkedTasks.has(task.id);
                      const tagDisplay = getTagDisplay(task.tags);
                      return (
                        <div key={task.id} className={`flex items-center gap-3 py-2.5 ${hoverTint} -mx-2 px-2 rounded-lg transition-colors group`}>
                          <button onClick={() => toggleTask(task.id)} className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 size={16} className="text-indigo-500" />
                            ) : (
                              <Circle size={16} className={`${inkFaint} ${inkMutedGroupHover}`} />
                            )}
                          </button>
                          <span className={`flex-1 text-sm truncate ${isDone ? `line-through ${inkFaint}` : inkBody}`}>
                            {task.label}
                          </span>
                          {tagDisplay && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${tagDisplay.tagColor}`}>
                              {tagDisplay.tag}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Current phase task list */}
              {project.phases.filter((p) => p.status === "active").map((phase) => (
                <section key={phase.number}>
                  <PhaseSection
                    phase={phase}
                    checkedTasks={checkedTasks}
                    onToggleTask={toggleTask}
                    onEditTask={(taskId) => {
                      const task = phase.tasks.find((t) => t.id === taskId);
                      if (task) setEditingTask(task);
                    }}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={() => setAddingTaskToPhase(phase)}
                    showTags
                  />
                </section>
              ))}
            </div>
          )}

          {/* ── Tasks tab ── */}
          {activeTab === "Tasks" && (
            <div className="flex flex-col gap-8">
              {project.phases.map((phase) => (
                <PhaseSection
                  key={phase.number}
                  phase={phase}
                  checkedTasks={checkedTasks}
                  onToggleTask={toggleTask}
                  onEditTask={(taskId) => {
                    const task = phase.tasks.find((t) => t.id === taskId);
                    if (task) setEditingTask(task);
                  }}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={() => setAddingTaskToPhase(phase)}
                  showTags
                />
              ))}
            </div>
          )}

          {/* ── Insights tab — flat list, no per-item card ── */}
          {activeTab === "Insights" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${inkFaint}`}>
                  {project.ai_overview_updated_at
                    ? `Updated ${formatRelativeTime(project.ai_overview_updated_at)}`
                    : "Not generated yet"}
                </span>
                <button
                  onClick={handleRefreshInsights}
                  disabled={analyzing}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={12} className={analyzing ? "animate-pulse" : ""} />
                  {analyzing ? "Refreshing…" : "Refresh insights"}
                </button>
              </div>
              <div className={`flex flex-col divide-y ${borderTint}`}>
                {(project.insights ?? []).map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 py-4">
                    <InsightIcon iconName={insight.iconName} />
                    <div>
                      <h3 className={`${typeTitle} ${ink} mb-0.5`}>{insight.title}</h3>
                      <p className={`${typeBody} ${inkMuted}`}>{insight.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Files tab — flat list, tightened row spacing ── */}
          {activeTab === "Files" && (
            <div className={`flex flex-col divide-y ${borderTint}`}>
              {(project.attachments ?? []).length > 0 ? (
                <>
                  {(project.attachments ?? []).map((file, i) => (
                    <div key={i} className={`flex items-center gap-3 py-2.5 -mx-2 px-2 rounded-lg ${hoverTint} transition-colors`}>
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-red-400" />
                      </div>
                      <p className={`flex-1 min-w-0 text-sm font-medium ${inkBody} truncate`}>{file.name}</p>
                      <button className={`${inkFaint} ${inkMutedHover} transition-colors`}>
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  ))}
                  <button className={`flex items-center gap-1.5 py-3 text-xs ${inkMuted} ${inkHover} transition-colors`}>
                    <Plus size={13} />
                    Upload file
                  </button>
                </>
              ) : (
                <div className={`flex flex-col items-center justify-center py-12 gap-2 ${inkFaint}`}>
                  <FileText size={32} strokeWidth={1.2} />
                  <p className="text-sm text-center">No files yet. Upload a brief, a reference, or anything else this project needs.</p>
                  <button className={`mt-2 flex items-center gap-1.5 text-xs ${inkMuted} ${inkHover} transition-colors`}>
                    <Plus size={13} />
                    Upload file
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(taskId, updates) => {
            handleEditTask(taskId, updates);
            setEditingTask(null);
          }}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && project && (
        <EditProjectModal
          project={project}
          onClose={() => setEditingProject(false)}
          onSave={(updates) => {
            handleSaveProject(updates);
            setEditingProject(false);
          }}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Edit Phase Name Inline */}
      {editingPhase && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setEditingPhase(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-sm mx-4 animate-fade-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Edit phase name</h2>
            <input
              autoFocus
              type="text"
              value={phaseNameInput}
              onChange={(e) => setPhaseNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSavePhaseName()}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingPhase(null)}
                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhaseName}
                className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task to Phase Modal */}
      {addingTaskToPhase && (
        <AddTaskModal
          onClose={() => setAddingTaskToPhase(null)}
          onAdd={(taskData) => handleAddTaskToPhase(taskData)}
        />
      )}
    </div>
  );
}