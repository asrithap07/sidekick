"use client";
import React, { useMemo } from "react";
import { Sparkles, CalendarDays, Clock, Inbox } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";

type UpcomingProps = {
  onOpenAI: () => void;
};

// ── helpers ────────────────────────────────────────────────────────────────

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Parse YYYY-MM-DD as local date (not UTC) to avoid timezone shifts
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m - 1, d);
}

function formatGroupLabel(date: Date, today: Date, tomorrow: Date): string {
  const d = startOfDay(date);
  const t = startOfDay(today);
  const tm = startOfDay(tomorrow);

  if (d.getTime() === t.getTime()) return "Today";
  if (d.getTime() === tm.getTime()) return "Tomorrow";

  // Same week → weekday name
  const diffDays = Math.round((d.getTime() - t.getTime()) / 86_400_000);
  if (diffDays > 0 && diffDays < 7) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }

  // Otherwise full date
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function isOverdue(date: Date, today: Date): boolean {
  return startOfDay(date) < startOfDay(today);
}

// ── component ──────────────────────────────────────────────────────────────

export default function Upcoming({ onOpenAI }: UpcomingProps) {
  const { tasks, toggleDone, deleteTask } = useTasks();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Split tasks into: overdue, upcoming (grouped by date), no-date
  const { overdueGroup, dateGroups, noDueDate } = useMemo(() => {
    const overdue: typeof tasks = [];
    const dated: typeof tasks = [];
    const noDue: typeof tasks = [];

    tasks.forEach((t) => {
      if (!t.dueDate) {
        noDue.push(t);
        return;
      }
      const d = parseDate(t.dueDate);
      if (!d) { noDue.push(t); return; }
      if (isOverdue(d, today)) overdue.push(t);
      else dated.push(t);
    });

    // Sort overdue: most recently overdue first
    overdue.sort((a, b) => {
      const da = parseDate(a.dueDate!)?.getTime() ?? 0;
      const db = parseDate(b.dueDate!)?.getTime() ?? 0;
      return db - da;
    });

    // Group upcoming by date string (YYYY-MM-DD key for stable sorting)
    const groups: Map<string, typeof tasks> = new Map();
    dated.forEach((t) => {
      const d = parseDate(t.dueDate!)!;
      const key = startOfDay(d).toISOString();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(t);
    });

    // Sort groups chronologically
    const sortedGroups = Array.from(groups.entries())
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([isoKey, groupTasks]) => ({
        date: new Date(isoKey),
        label: formatGroupLabel(new Date(isoKey), today, tomorrow),
        tasks: groupTasks,
      }));

    return { overdueGroup: overdue, dateGroups: sortedGroups, noDueDate: noDue };
  }, [tasks]);

  const totalUpcoming = dateGroups.reduce((n, g) => n + g.tasks.length, 0);
  const isEmpty = overdueGroup.length === 0 && totalUpcoming === 0 && noDueDate.length === 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Upcoming</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Your tasks organised by due date</p>
          </div>
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>

        {/* Summary pills */}
        {!isEmpty && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {overdueGroup.length > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-xs font-medium text-red-500 dark:text-red-400">
                <Clock size={11} />
                {overdueGroup.length} overdue
              </span>
            )}
            {totalUpcoming > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-xs font-medium text-indigo-500 dark:text-indigo-400">
                <CalendarDays size={11} />
                {totalUpcoming} upcoming
              </span>
            )}
            {noDueDate.length > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-400 dark:text-gray-500">
                <Inbox size={11} />
                {noDueDate.length} unscheduled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-300 dark:text-gray-600">
          <CalendarDays size={44} strokeWidth={1.2} />
          <p className="text-sm text-center">
            No tasks yet — add tasks with due dates to see them here.
          </p>
        </div>
      )}

      {/* Scrollable content */}
      {!isEmpty && (
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-0.5">

          {/* Overdue */}
          {overdueGroup.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                  Overdue
                </span>
                <div className="flex-1 h-px bg-red-100 dark:bg-red-900" />
                <span className="text-[11px] text-red-300 dark:text-red-500">
                  {overdueGroup.length} task{overdueGroup.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {overdueGroup.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleDone(task.id)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming date groups */}
          {dateGroups.map(({ date, label, tasks: groupTasks }) => {
            const isToday = label === "Today";
            const isTomorrow = label === "Tomorrow";
            return (
              <section key={date.toISOString()}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isToday
                        ? "text-indigo-500 dark:text-indigo-400"
                        : isTomorrow
                        ? "text-violet-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                  {isToday && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-400">
                      Today
                    </span>
                  )}
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                  <span className="text-[11px] text-gray-300 dark:text-gray-500">
                    {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {groupTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleDone(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Unscheduled */}
          {noDueDate.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-300 dark:text-gray-600 uppercase tracking-wide">
                  No due date
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                <span className="text-[11px] text-gray-300 dark:text-gray-500">
                  {noDueDate.length} task{noDueDate.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {noDueDate.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleDone(task.id)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}