"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Target,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  Plus,
  Pencil,
  MoreHorizontal,
  CalendarDays,
  Star,
  TrendingUp,
  Lightbulb,
  FileText,
  MoreVertical,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Priority = "high" | "medium" | "low";
type PhaseStatus = "completed" | "in-progress" | "upcoming" | "locked";

interface PhaseTask {
  id: string;
  label: string;
  done: boolean;
  tag: string;
  tagColor: string;
  priority: Priority;
  dueLabel: string;
}

interface Phase {
  number: number;
  name: string;
  status: PhaseStatus;
  progress: number;
  tasks: PhaseTask[];
}

interface Insight {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  body: string;
}

interface CoachingNote {
  text: string;
  color: string;
  textColor: string;
  age: string;
}

interface Attachment {
  name: string;
  meta: string;
}

// ── Static data (swap with Supabase fetches later) ─────────────────────────

const PHASES: Phase[] = [
  {
    number: 1,
    name: "Resume & Branding",
    status: "completed",
    progress: 100,
    tasks: [
      { id: "1-1", label: "Update resume with latest projects", tag: "resume", tagColor: "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400", priority: "high", dueLabel: "Done", done: true },
      { id: "1-2", label: "Optimise LinkedIn headline + about", tag: "linkedin", tagColor: "bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400", priority: "medium", dueLabel: "Done", done: true },
      { id: "1-3", label: "Polish portfolio project write-ups", tag: "portfolio", tagColor: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400", priority: "low", dueLabel: "Done", done: true },
    ],
  },
  {
    number: 2,
    name: "Applications",
    status: "in-progress",
    progress: 60,
    tasks: [
      { id: "2-1", label: "Research target companies list", tag: "research", tagColor: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", priority: "high", dueLabel: "Done", done: true },
      { id: "2-2", label: "Apply to Google SWE Intern", tag: "application", tagColor: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400", priority: "high", dueLabel: "Today", done: false },
      { id: "2-3", label: "Apply to Meta University Program", tag: "application", tagColor: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400", priority: "high", dueLabel: "Today", done: false },
      { id: "2-4", label: "Set up application tracker spreadsheet", tag: "admin", tagColor: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400", priority: "medium", dueLabel: "Tomorrow", done: false },
    ],
  },
  {
    number: 3,
    name: "Interview Prep",
    status: "upcoming",
    progress: 0,
    tasks: [
      { id: "3-1", label: "LeetCode: Top 150 – Arrays", tag: "dsa", tagColor: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", priority: "high", dueLabel: "Aug 1", done: false },
      { id: "3-2", label: "LeetCode: Top 150 – Trees", tag: "dsa", tagColor: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", priority: "high", dueLabel: "Aug 5", done: false },
      { id: "3-3", label: "System design: URL shortener", tag: "system-design", tagColor: "bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400", priority: "medium", dueLabel: "Aug 10", done: false },
      { id: "3-4", label: "Record behavioural answers (STAR)", tag: "behavioural", tagColor: "bg-pink-50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-400", priority: "medium", dueLabel: "Aug 12", done: false },
    ],
  },
  {
    number: 4,
    name: "Offers & Negotiation",
    status: "locked",
    progress: 0,
    tasks: [
      { id: "4-1", label: "Complete mock interviews x3", tag: "mock", tagColor: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400", priority: "high", dueLabel: "TBD", done: false },
      { id: "4-2", label: "Research offer benchmarks (levels.fyi)", tag: "research", tagColor: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", priority: "medium", dueLabel: "TBD", done: false },
      { id: "4-3", label: "Negotiate final offer", tag: "negotiation", tagColor: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400", priority: "high", dueLabel: "TBD", done: false },
    ],
  },
];

const INSIGHTS: Insight[] = [
  {
    icon: <TrendingUp size={15} />,
    iconBg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    title: "12% ahead of schedule",
    body: "Great momentum! Keep it up.",
  },
  {
    icon: <Target size={15} />,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400",
    title: "Focus on applications",
    body: "Completing 5 more applications this week is ideal.",
  },
  {
    icon: <Lightbulb size={15} />,
    iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-500 dark:text-amber-400",
    title: "DSA consistency",
    body: "You solve more problems on Tuesdays and Thursdays.",
  },
];

const COACHING: CoachingNote[] = [
  {
    text: "Consider applying to more mid-size companies. They have higher intern conversion rates!",
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    textColor: "text-indigo-700 dark:text-indigo-300",
    age: "2 days ago",
  },
  {
    text: "Great job completing your resume and portfolio! This strong foundation will help your applications stand out.",
    color: "bg-green-50 dark:bg-green-900/20",
    textColor: "text-green-700 dark:text-green-300",
    age: "5 days ago",
  },
];

const ATTACHMENTS: Attachment[] = [
  { name: "Resume_Prstia.pdf", meta: "PDF · Updated 2 days ago" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function PhaseStatusBadge({ status }: { status: PhaseStatus }) {
  if (status === "completed")
    return <span className="text-[11px] font-medium text-green-500">Completed</span>;
  if (status === "in-progress")
    return <span className="text-[11px] font-medium text-indigo-500">In Progress</span>;
  if (status === "locked")
    return (
      <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
        <Lock size={10} /> Locked
      </span>
    );
  return <span className="text-[11px] text-gray-400 dark:text-gray-500">Upcoming</span>;
}

function PriorityDot({ priority }: { priority: Priority }) {
  const colors: Record<Priority, string> = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-green-400",
  };
  const labels: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${colors[priority]}`}>
      ● {labels[priority]}
    </span>
  );
}

// ── Phase section with collapsible task list ───────────────────────────────

function PhaseSection({
  phase,
  checkedTasks,
  onToggleTask,
}: {
  phase: Phase;
  checkedTasks: Set<string>;
  onToggleTask: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(phase.status === "locked");
  const doneCount = phase.tasks.filter((t) => checkedTasks.has(t.id) || t.done).length;
  const total = phase.tasks.length;

  const barColor =
    phase.status === "completed"
      ? "bg-green-400"
      : phase.status === "in-progress"
      ? "bg-indigo-500"
      : "bg-gray-300 dark:bg-gray-600";

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-2 flex-1 text-left group"
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              phase.status === "completed"
                ? "text-green-500"
                : phase.status === "in-progress"
                ? "text-indigo-500"
                : phase.status === "locked"
                ? "text-gray-300 dark:text-gray-600"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            Phase {phase.number} · {phase.name}
          </span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
          <PhaseStatusBadge status={phase.status} />
          <span className="text-[11px] text-gray-300 dark:text-gray-600">
            {doneCount}/{total}
          </span>
          {collapsed ? (
            <ChevronDown size={13} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronUp size={13} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${phase.progress}%` }}
        />
      </div>

      {/* Task rows */}
      {!collapsed && (
        <div className="flex flex-col gap-1 mb-1">
          {phase.tasks.map((task) => {
            const isDone = checkedTasks.has(task.id) || task.done;
            const isLocked = phase.status === "locked";
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <button
                  onClick={() => !isLocked && onToggleTask(task.id)}
                  className="shrink-0"
                  disabled={isLocked}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-indigo-500" />
                  ) : isLocked ? (
                    <Lock size={15} className="text-gray-300 dark:text-gray-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm min-w-0 truncate ${
                    isDone
                      ? "line-through text-gray-300 dark:text-gray-600"
                      : isLocked
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {task.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${task.tagColor}`}>
                  {task.tag}
                </span>
                <PriorityDot priority={task.priority} />
                <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                  <CalendarDays size={11} />
                  {task.dueLabel}
                </span>
              </div>
            );
          })}

          {!isLocked(phase.status) && (
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
              <Plus size={13} />
              Add task to {phase.name}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function isLocked(status: PhaseStatus) {
  return status === "locked";
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ProjectPage() {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [insightsPanelOpen, setInsightsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Tasks", "Insights", "Files"];

  function toggleTask(id: string) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    // This outer div fills whatever space the layout gives it (same as Today page)
    <div className="flex h-full gap-3 overflow-hidden">

      {/* ── Center Content — shrinks when panel opens ── */}
      <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Projects</span>
            <ChevronRight size={12} />
            <span className="text-gray-600 dark:text-gray-300 font-medium">Internship Search</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
              <MoreHorizontal size={16} />
            </button>
            <button
              onClick={() => setInsightsPanelOpen((v) => !v)}
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
              <span className="text-xl">💼</span>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Internship Search</h1>
              <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                <Pencil size={13} />
              </button>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">Land a Summer 2027 SWE internship</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-5 py-3 border-t border-b border-gray-100 dark:border-gray-700 mb-5 flex-wrap gap-y-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <CalendarDays size={13} />
              Due Aug 15, 2027
            </div>
            <div className="w-px h-4 bg-gray-100 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">Progress</span>
              <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-indigo-500" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-200">62%</span>
            </div>
            <div className="w-px h-4 bg-gray-100 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400 dark:text-gray-500">Impact Score</span>
              <span className="font-medium text-gray-700 dark:text-gray-200">84</span>
              <Star size={11} className="text-amber-400 fill-amber-400" />
            </div>
            <div className="w-px h-4 bg-gray-100 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-400 dark:text-gray-500">Ideal Session</span>
              <span className="font-medium text-indigo-500">90 min</span>
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
              {/* AI Overview card */}
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 p-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">AI Project Overview</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        You're on track to reach your goal! Focus on completing applications and strengthening your DSA skills to hit your next milestone.
                      </p>
                      <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-600 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
                        <Sparkles size={12} />
                        View AI Plan
                      </button>
                    </div>
                  </div>
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="shrink-0 opacity-80">
                    <circle cx="36" cy="36" r="32" stroke="#C4BEFF" strokeWidth="1.5" fill="#EEF0FF" />
                    <circle cx="36" cy="36" r="22" stroke="#A89EFA" strokeWidth="1.5" fill="#DDD9FB" />
                    <circle cx="36" cy="36" r="12" stroke="#8B81F5" strokeWidth="1.5" fill="#C4BEFF" />
                    <circle cx="36" cy="36" r="5" fill="#6C63FF" />
                    <line x1="36" y1="6" x2="50" y2="22" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" />
                    <polygon points="50,15 57,15 57,22" fill="#6C63FF" />
                  </svg>
                </div>
              </div>

              {/* Phase summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {PHASES.map((phase) => {
                  const barColor =
                    phase.status === "completed"
                      ? "bg-green-400"
                      : phase.status === "in-progress"
                      ? "bg-indigo-500"
                      : "bg-gray-200 dark:bg-gray-600";
                  return (
                    <div
                      key={phase.number}
                      className={`rounded-xl p-3 border ${
                        phase.status === "in-progress"
                          ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-900/10"
                          : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium mb-0.5">
                        Phase {phase.number}
                      </p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug mb-1">
                        {phase.name}
                      </p>
                      <PhaseStatusBadge status={phase.status} />
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

              {/* Today's focus — in-progress tasks only */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Target size={15} className="text-indigo-500" />
                    Today's Focus
                  </h2>
                  <button
                    onClick={() => setActiveTab("Tasks")}
                    className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    View all tasks
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Recommended tasks to maximise your progress
                </p>
                <div className="flex flex-col gap-1">
                  {PHASES.flatMap((p) => p.tasks)
                    .filter((t) => !t.done && ["Today", "Tomorrow"].includes(t.dueLabel))
                    .map((task) => {
                      const isDone = checkedTasks.has(task.id);
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                          <button onClick={() => toggleTask(task.id)} className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 size={16} className="text-indigo-500" />
                            ) : (
                              <Circle size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
                            )}
                          </button>
                          <span className={`flex-1 text-sm min-w-0 truncate ${isDone ? "line-through text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-200"}`}>
                            {task.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${task.tagColor}`}>
                            {task.tag}
                          </span>
                          <PriorityDot priority={task.priority} />
                          <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                            <CalendarDays size={11} />
                            {task.dueLabel}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}

          {/* ── Tasks tab — grouped by phase ── */}
          {activeTab === "Tasks" && (
            <div className="flex flex-col gap-6">
              {PHASES.map((phase) => (
                <PhaseSection
                  key={phase.number}
                  phase={phase}
                  checkedTasks={checkedTasks}
                  onToggleTask={toggleTask}
                />
              ))}
            </div>
          )}

          {/* ── Insights tab ── */}
          {activeTab === "Insights" && (
            <div className="flex flex-col gap-3">
              {INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                    {insight.icon}
                  </div>
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
              {ATTACHMENTS.map((file, i) => (
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

      {/* ── AI Insights Panel — grows in from the right, center shrinks ── */}
      {insightsPanelOpen && (
        <div className="w-80 shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              AI Insights
            </p>
            <button
              onClick={() => setInsightsPanelOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
              aria-label="Close AI Insights"
            >
              <X size={14} />
            </button>
          </div>

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3 mb-4">
              {INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.iconBg}`}>
                    {insight.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{insight.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{insight.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-5">
              <Sparkles size={12} className="text-indigo-400" />
              Ask AI for Advice
            </button>

            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
              Recent AI Coaching
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {COACHING.map((note, i) => (
                <div key={i} className={`rounded-xl p-3 ${note.color}`}>
                  <p className={`text-xs leading-relaxed ${note.textColor}`}>{note.text}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">{note.age}</p>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-5">
              View All Coaching
            </button>

            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
              Attachments
            </p>
            <div className="flex flex-col gap-2">
              {ATTACHMENTS.map((file, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{file.meta}</p>
                  </div>
                  <button className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
                    <MoreVertical size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}