import { Task } from "@/types/task";
import React from "react"
import { parseDate, isOverdue, startOfDay, formatGroupLabel } from "./date-utils";



export function getTaskStats(tasks: Task[]) {
    const total = tasks.length;

    const done = tasks.filter((t) => t.done).length;

    const today = new Date();

    const overdue = tasks.filter((t) => {
      if (t.done || !t.dueDate) return false;
      const parts = t.dueDate.split("-").map(Number);
      if (parts.length !== 3) return false;
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }).length;

    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, overdue, pct };
}

export function groupUpcomingTasks(tasks: Task[]) {
  
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    // Split tasks into: overdue, upcoming (grouped by date), no-date
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
}