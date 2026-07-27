import { Task } from "@/types/task";
import { parseDate, isOverdue } from "./date-utils";

export interface ScoredTask extends Task {
  baseScore: number;
  daysUntilDue: number | null;
  isOverdue: boolean;
}

const PRIORITY_WEIGHT = { high: 30, medium: 15, low: 5 };

export function computeBaseScore(task: Task): ScoredTask {
  const today = new Date();
  const due = task.dueDate ? parseDate(task.dueDate) : null;

  const daysUntilDue = due
    ? Math.ceil((due.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const taskIsOverdue = !task.done && due ? isOverdue(due, today) : false;

  let urgency = 0;
  if (taskIsOverdue) urgency = 40;
  else if (daysUntilDue === 0) urgency = 35;
  else if (daysUntilDue !== null && daysUntilDue <= 2) urgency = 25;
  else if (daysUntilDue !== null && daysUntilDue <= 7) urgency = 10;

  const priorityPoints = PRIORITY_WEIGHT[task.priority] ?? 0;

  return {
    ...task,
    baseScore: Math.min(100, urgency + priorityPoints),
    daysUntilDue,
    isOverdue: taskIsOverdue,
  };
}