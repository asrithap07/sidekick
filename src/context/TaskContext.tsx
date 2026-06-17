"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Task } from "@/types/task";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasks";

// TaskContext is a shared client-side cache over the tasks API.
// It does NOT own the data — the API (and eventually Supabase) does.
//
// Why context and not per-page fetching?
// Tasks are shown on Today, Upcoming, Labels, and project pages simultaneously.
// If each page fetched independently, adding a task on Today wouldn't update
// Upcoming until a full refresh. Context gives us one source of truth on the
// client without a heavy state management library.
//
// When Supabase is ready: swap the functions in src/lib/api/tasks.ts.
// Nothing in this file or any consumer component needs to change.

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id" | "done">) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  finishAll: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks once on mount
  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, []);

  const addTask = useCallback(async (data: Omit<Task, "id" | "done">) => {
    const created = await createTask(data);
    setTasks((prev) => [...prev, created]);
  }, []);

  const toggleDone = useCallback(async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    // Optimistic update — UI flips immediately, API call confirms
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    try {
      await updateTask(id, { done: !task.done });
    } catch {
      // Roll back if the API call fails
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: task.done } : t)));
    }
  }, [tasks]);

  const removeTask = useCallback(async (id: string) => {
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch {
      setTasks(snapshot);
    }
  }, [tasks]);

  const finishAll = useCallback(async () => {
    const snapshot = tasks;
    setTasks((prev) => prev.map((t) => ({ ...t, done: true })));
    try {
      await Promise.all(
        tasks.filter((t) => !t.done).map((t) => updateTask(t.id, { done: true }))
      );
    } catch {
      setTasks(snapshot);
    }
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
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