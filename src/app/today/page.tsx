"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles, Plus, Info, Focus, Flame, CheckCircle2,
  Clock, TrendingUp, Lightbulb, Target
} from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import AddTaskModal from "@/components/AddTaskModal";
import EditTaskModal from "@/components/EditTaskModal";
import { updateTask } from "@/lib/api/tasks";
import type { Task } from "@/types/task";
import { useAIAssistant } from "@/context/AIAssistantContext";
import { getTaskStats } from "@/lib/utils/task-utils";
import { getTaskInsights } from "@/lib/utils/task-insights";
import { getGreeting } from "@/lib/utils/date-utils";
import { ink, inkBody, inkMuted, inkFaint, borderTint, hoverTint, trackTint, inkHover, inkMutedHover, surfacePanel, aiAssistBtn } from "@/lib/ui/tint";
import { typeDisplay, typeHeadline, typeBody } from "@/lib/ui/type";



export default function TaskBoard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    tasks,
    todayTasks,
    addTask,
    dailyState,
    briefRefreshing,
    toggleDone,
    deleteTask,
    finishAll,
  } = useTasks();  
  
  const { togglePanel, setPageContext } = useAIAssistant();

  const stats = useMemo(() => getTaskStats(todayTasks), [todayTasks]);
  const insights = useMemo(() => getTaskInsights(todayTasks, stats), [todayTasks, stats]);
  const allDone = todayTasks.length > 0 && todayTasks.every((t) => t.done);

  // Derive a friendlier brief object from dailyState
  const dailyBrief = useMemo(() => dailyState ? {
    focus: dailyState.brief_focus,
    risk: dailyState.brief_risk,
    doFirst: dailyState.brief_do_first,
    avoid: dailyState.brief_avoid,
  } : null, [dailyState]);

  // Build the AI-sourced insight item (prepended to the deterministic insights)
  const aiInsight = useMemo(() => {
    if (!dailyBrief) return null;
    if (dailyBrief.doFirst) {
      return {
        icon: <Sparkles size={13} />,
        text: dailyBrief.doFirst,
        color: "text-indigo-500",
      };
    }
    if (dailyBrief.risk) {
      return {
        icon: <Sparkles size={13} />,
        text: dailyBrief.risk,
        color: "text-amber-500",
      };
    }
    return null;
  }, [dailyBrief]);

  // Combined insights: AI insight first, then deterministic ones
  const allInsights = useMemo(() => {
    const result = [];
    if (aiInsight) result.push(aiInsight);
    result.push(...insights);
    return result;
  }, [aiInsight, insights]);

  useEffect(() => {
    setPageContext({ page: "today", tasks, stats, streak: dailyState?.streak ?? 0 });
  }, [tasks, stats, setPageContext]);

  return (
    <div className="flex h-full gap-3">
      <div className={`flex flex-col flex-1 min-w-0 ${surfacePanel} p-6 overflow-y-auto`}>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className={`${typeDisplay} ${ink}`}>
              {getGreeting()}, Asritha!
            </h1>
            <p className={`${typeBody} ${inkMuted} mt-1`}>
              What do you plan to do today?
            </p>
          </div>
          {/* Workspace indicator — dropped the unlabeled "⬆ 1,354" figure and
              emoji cluster from the previous version; a number with no stated
              unit or meaning isn't a stat, it's decoration wearing a stat's
              clothes. An avatar + name is honest about what this actually is. */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              OS
            </div>
            <span className={`text-xs font-medium ${inkBody}`}>Odama Studio</span>
          </div>
        </div>

        {/* Streak — the one number worth spending emphasis on for a "Today"
            view, given its whole job is motivation. Everything else rides in
            the flat metadata row below at normal weight, so this doesn't turn
            into four identical boxes fighting for the same attention. */}
        <div className="flex items-baseline gap-2 mb-1">
          <Flame size={18} className="text-orange-500" />
          <span className={`text-xl font-semibold tabular-nums ${ink}`}>{dailyState?.streak ?? 0}</span>
          <span className={`text-sm ${inkMuted}`}>day streak</span>
        </div>

        {/* Secondary metadata — flat row, dividers instead of cards */}
        <div className={`flex items-center gap-5 py-3 border-t border-b ${borderTint} mb-6 flex-wrap gap-y-2`}>
          <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
            <CheckCircle2 size={13} className="text-green-500" />
            {stats.pct}% complete
            <span className={inkFaint}>· {stats.done}/{stats.total}</span>
          </div>
          <div className={`w-px h-4 ${trackTint}`} />
          <div className={`flex items-center gap-1.5 text-xs ${stats.overdue > 0 ? "text-red-500 dark:text-red-400" : inkMuted}`}>
            <Clock size={13} />
            {stats.overdue} overdue
          </div>
          <div className={`w-px h-4 ${trackTint}`} />
          <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
            <TrendingUp size={13} className="text-indigo-500" />
            {dailyState ? `${dailyState.momentum_delta >= 0 ? "+" : ""}${dailyState.momentum_delta}%` : "—"} vs last week
          </div>
        </div>

        {/* ── Today's plan — typographic statement, not a gradient card ── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-indigo-500 shrink-0" />
            <h2 className={`${typeHeadline} ${ink}`}>Today's plan</h2>
            {briefRefreshing && (
              <span className={`text-xs ${inkFaint} animate-pulse`}>✨ Updating…</span>
            )}
          </div>
          <p className={`${typeBody} ${inkBody} max-w-prose ${briefRefreshing ? 'opacity-60' : ''} transition-opacity`}>
            {dailyBrief?.focus ?? (
              stats.overdue > 0
                ? <>You have <span className={`font-semibold ${ink}`}>{stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}</span>. Tackling the highest-priority one first clears your biggest bottleneck.</>
                : <>You're off to a great start — <span className={`font-semibold ${ink}`}>{stats.done} task{stats.done !== 1 ? "s" : ""} done</span>. Keep the momentum going.</>
            )}
          </p>
          <button
            onClick={() => togglePanel()}
            className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Sparkles size={12} />
            View AI plan
          </button>
        </section>

        {/* ── Insights — flat list, no per-item box ── */}
        {allInsights.length > 0 && (
          <div className={`mb-6 flex flex-col divide-y ${borderTint}`}>
            {allInsights.map((ins, i) => (
              <div key={i} className="flex items-center gap-2 py-2">
                <span className={ins.color}>{ins.icon}</span>
                <p className={`text-xs ${inkBody} flex-1`}>{ins.text}</p>
                <Lightbulb size={12} className={inkFaint} />
              </div>
            ))}
          </div>
        )}

        {/* ── Today's Tasks header ── */}
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${typeHeadline} ${ink}`}>Today's Tasks</h2>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${borderTint} text-xs ${inkMuted} ${hoverTint} transition-colors`}>
              <Focus size={13} />
              Focus Mode
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

        {/* All done celebration */}
        {allDone && !showCelebration && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">All done for today!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Thats a wrap. Your streak is safe — go enjoy the rest of your day.</p>
              </div>
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="flex flex-col gap-2 animate-stagger">
          {todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleDone(task.id)}
              onEdit={() => setEditingTask(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {todayTasks.length === 0 && (
            <div className={`flex flex-col items-center justify-center flex-1 gap-2 ${inkFaint} py-10`}>
              <Target size={36} strokeWidth={1.2} />
              <p className="text-sm text-center">Your day is a clean slate. What&rsquo;s the first thing you want to get done?</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={finishAll}
            className="px-5 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Finish
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs ${inkMuted} ${inkHover} ${hoverTint} rounded-lg transition-colors`}
          >
            <Plus size={13} />
            Add Task
          </button>
          <button className={`ml-auto ${inkFaint} ${inkMutedHover} transition-colors`}>
            <Info size={14} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddTaskModal
          onClose={() => setModalOpen(false)}
          onAdd={(task: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[];}) => {
            addTask(task);
            setModalOpen(false);
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={async (id, updates) => {
            await updateTask(id, updates);
            setEditingTask(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}