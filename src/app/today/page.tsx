"use client";
import React, { useState, useMemo } from "react";
import {
  Sparkles, Plus, Info, Focus, Flame, CheckCircle2,
  Clock, TrendingUp, Lightbulb, ChevronRight, CalendarDays,
  Zap, Target
} from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/types/task";
import TaskItem from "@/components/TaskItem";
import AddTaskModal from "@/components/AddTaskModal";
import AIAssistant from "@/components/AIAssistant";
import { getTaskStats } from "@/lib/utils/task-utils";
import {getTaskInsights} from "@/lib/utils/task-insights"
import { getGreeting } from "@/lib/utils/date-utils";

type TaskBoardProps = {
  onOpenAI: () => void;
};

// Static for now — wire to Supabase/localStorage later
const STREAK = 7;
const MOMENTUM = "+15%";



export default function TaskBoard({ onOpenAI }: TaskBoardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { tasks, addTask, toggleDone, deleteTask, finishAll } = useTasks();



  const stats = useMemo(
  () => getTaskStats(tasks),
  [tasks]);

  const insights = useMemo(
  () => getTaskInsights(tasks, stats),
  [tasks, stats]);
  
  return (
    <div className="flex h-full gap-3 overflow-hidden">
      {/* ── Main board ── */}
      <div className="flex flex-col flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              {getGreeting()}, Pristia!
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              What do you plan to do today?
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-lg">😎🐼👾</span>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200">Odama Studio</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">⬆ 1,354</p>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Streak */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-none">{STREAK}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Day streak</p>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <div>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-none">{stats.pct}%</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{stats.done}/{stats.total} done</p>
            </div>
          </div>

          {/* Overdue */}
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${
            stats.overdue > 0
              ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30"
              : "bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700"
          }`}>
            <Clock size={18} className={stats.overdue > 0 ? "text-red-400 shrink-0" : "text-gray-300 dark:text-gray-600 shrink-0"} />
            <div>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-none">{stats.overdue}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Overdue</p>
            </div>
          </div>

          {/* Momentum */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
            <TrendingUp size={18} className="text-indigo-500 shrink-0" />
            <div>
              <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-none">{MOMENTUM}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">vs last week</p>
            </div>
          </div>
        </div>

        {/* ── Daily Brief ── */}
        <div className="mb-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Daily Brief</p>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium">
                  HIGH IMPACT
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {stats.overdue > 0
                  ? <>You have <span className="font-semibold">{stats.overdue} overdue task{stats.overdue > 1 ? "s" : ""}</span>. Tackling your highest-priority item first would clear your biggest bottleneck.</>
                  : <>You're off to a great start! <span className="font-semibold">{stats.done} task{stats.done !== 1 ? "s" : ""} done</span>. Keep the momentum going.</>
                }
              </p>
              <button
                onClick={() => setAiOpen(true)}
                className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-600 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <Sparkles size={12} />
                View AI Plan
              </button>
            </div>
          </div>
        </div>

        {/* ── Insights strip (only shown when there are insights) ── */}
        {insights.length > 0 && (
          <div className="mb-4 flex flex-col gap-1.5">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/40">
                <span className={ins.color}>{ins.icon}</span>
                <p className="text-xs text-gray-600 dark:text-gray-300 flex-1">{ins.text}</p>
                <Lightbulb size={12} className="text-gray-300 dark:text-gray-600" />
              </div>
            ))}
          </div>
        )}

        {/* ── Today's Tasks header ── */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Today's Tasks</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Focus size={13} />
              Focus Mode
            </button>
            <button
              onClick={() => setAiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <Sparkles size={13} />
              AI Assist
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleDone(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-gray-300 dark:text-gray-600 py-10">
              <Target size={36} strokeWidth={1.2} />
              <p className="text-sm text-center">No tasks yet — add one to get started.</p>
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
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Task
          </button>
          <button className="ml-auto text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* ── AI Assistant panel ── */}
      {aiOpen && (
        <AIAssistant
          onClose={() => setAiOpen(false)}
          tasks={tasks}
          stats={stats}
          streak={STREAK}
        />
      )}

      {isModalOpen && (
        <AddTaskModal
          onClose={() => setModalOpen(false)}
          onAdd={(task: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[] }) => {
            addTask(task);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
