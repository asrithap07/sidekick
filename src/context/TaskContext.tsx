"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { Task } from "@/types/task";
import type { DailyState } from "@/types/daily-state";
import { fetchTasks, fetchTodayTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";

type TaskContextType = {
  tasks: Task[];
  todayTasks: Task[];
  loading: boolean;
  error: string | null;
  dailyState: DailyState | null;
  briefRefreshing: boolean;
  addTask: (task: Omit<Task, "id" | "done" | "updatedAt">) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  finishAll: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dailyState, setDailyState] = useState<DailyState | null>(null);
  const [briefRefreshing, setBriefRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTasks = useCallback(() => {
    Promise.all([
      fetchTasks().then(setTasks),
      fetchTodayTasks().then(setTodayTasks),
    ])
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  // Load tasks once on mount
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Load today's cached daily state once on mount (safety net — doesn't
  // generate anything, just reads whatever's already in Supabase for today)
  useEffect(() => {
    fetch("/api/daily-state")
      .then((r) => r.json())
      .then(setDailyState)
      .catch(() => {}); // non-critical — Today page just falls back to defaults
  }, []);

  // Debounced regeneration — called after any task mutation. Waits 600ms
  // so a burst of actions (e.g. finishAll) only triggers one AI call.
  const scheduleRefreshBrief = useCallback((currentTodayTasks: Task[]) => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(async () => {
      setBriefRefreshing(true);
      try {
        const res = await fetch("/api/daily-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: currentTodayTasks }),
        });
        setDailyState(await res.json());
      } catch {
        // leave the previous dailyState in place on failure
      } finally {
        setBriefRefreshing(false);
      }
    }, 600);
  }, []);

  const addTask = useCallback(async (data: Omit<Task, "id" | "done" | "updatedAt">) => {
    const created = await createTask(data);
    setTasks((prev) => [...prev, created]);
    const updatedToday = await fetchTodayTasks();
    setTodayTasks(updatedToday);
    scheduleRefreshBrief(updatedToday);
  }, [scheduleRefreshBrief]);

  const toggleDone = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    try {
      await updateTask(id, { done: !task.done });
      const updatedToday = await fetchTodayTasks();
      setTodayTasks(updatedToday);
      scheduleRefreshBrief(updatedToday);
    } catch {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: task.done } : t)));
    }
  }, [tasks, scheduleRefreshBrief]);

  const removeTask = useCallback(async (id: string) => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      const updatedToday = await fetchTodayTasks();
      setTodayTasks(updatedToday);
      scheduleRefreshBrief(updatedToday);
    } catch {
      setTasks(snapshot);
    }
  }, [tasks, scheduleRefreshBrief]);

  const finishAll = useCallback(async () => {
    const snapshot = tasks;
    setTasks((prev) => prev.map((t) => ({ ...t, done: true })));
    try {
      await Promise.all(
        tasks.filter((t) => !t.done).map((t) => updateTask(t.id, { done: true }))
      );
      const updatedToday = await fetchTodayTasks();
      setTodayTasks(updatedToday);
      scheduleRefreshBrief(updatedToday);
    } catch {
      setTasks(snapshot);
    }
  }, [tasks, scheduleRefreshBrief]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        todayTasks,
        loading,
        error,
        dailyState,
        briefRefreshing,
        addTask,
        toggleDone,
        deleteTask: removeTask,
        finishAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
}