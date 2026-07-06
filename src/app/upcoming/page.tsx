"use client";
import React, { useMemo, useEffect, useState } from "react";
import { Sparkles, CalendarDays, Clock, Inbox } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import EditTaskModal from "@/components/EditTaskModal";
import { updateTask } from "@/lib/api/tasks";
import { useAIAssistant } from "@/context/AIAssistantContext";
import type { Task } from "@/types/task";
import { groupUpcomingTasks } from "@/lib/utils/task-utils";
import {
  ink,
  inkMuted,
  inkFaint,
  borderTint,
  trackTint,
  surfacePanel,
  aiAssistBtn,
} from "@/lib/ui/tint";
import { typeDisplay, typeHeadline, typeBody, typeLabel } from "@/lib/ui/type";

export default function Upcoming() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const { togglePanel, setPageContext } = useAIAssistant();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { overdueGroup, dateGroups, noDueDate } = useMemo(
    () => groupUpcomingTasks(tasks),
    [tasks]
  );

  const totalUpcoming = dateGroups.reduce((n, g) => n + g.tasks.length, 0);

  const isEmpty =
    overdueGroup.length === 0 &&
    totalUpcoming === 0 &&
    noDueDate.length === 0;

  useEffect(() => {
    setPageContext({ page: "upcoming", tasks });
  }, [tasks, setPageContext]);

  return (
    <div className={`flex flex-col h-full ${surfacePanel} p-6 overflow-hidden`}>
      <div className="mb-6 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={`${typeDisplay} ${ink}`}>Upcoming</h1>
            <p className={`${typeBody} ${inkMuted} mt-1`}>
              Your tasks organised by due date
            </p>
          </div>
          <button onClick={() => togglePanel()} className={aiAssistBtn}>
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>

        {!isEmpty && (
          <div
            className={`flex items-center gap-5 py-3 mt-5 border-t border-b ${borderTint} flex-wrap gap-y-2`}
          >
            {overdueGroup.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                <Clock size={13} />
                {overdueGroup.length} overdue
              </div>
            )}
            {overdueGroup.length > 0 && totalUpcoming > 0 && (
              <div className={`w-px h-4 ${trackTint}`} />
            )}
            {totalUpcoming > 0 && (
              <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
                <CalendarDays size={13} className="text-indigo-500" />
                {totalUpcoming} upcoming
              </div>
            )}
            {(overdueGroup.length > 0 || totalUpcoming > 0) && noDueDate.length > 0 && (
              <div className={`w-px h-4 ${trackTint}`} />
            )}
            {noDueDate.length > 0 && (
              <div className={`flex items-center gap-1.5 text-xs ${inkMuted}`}>
                <Inbox size={13} />
                {noDueDate.length} unscheduled
              </div>
            )}
          </div>
        )}
      </div>

      {isEmpty && (
        <div className={`flex flex-col items-center justify-center flex-1 gap-3 ${inkFaint} py-10`}>
          <CalendarDays size={44} strokeWidth={1.2} />
          <p className={`${typeBody} text-center`}>
            No tasks yet — add tasks with due dates to see them here.
          </p>
        </div>
      )}

      {!isEmpty && (
        <div className="flex flex-col gap-8 flex-1 overflow-y-auto">
          {overdueGroup.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`${typeHeadline} text-red-500 dark:text-red-400`}>Overdue</h2>
                <span className={`${typeLabel} ${inkFaint}`}>
                  {overdueGroup.length} task{overdueGroup.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {overdueGroup.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleDone(task.id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {dateGroups.map(({ date, label, tasks: groupTasks }) => {
            const isToday = label === "Today";
            const isTomorrow = label === "Tomorrow";
            const headingColor = isToday
              ? "text-indigo-500 dark:text-indigo-400"
              : isTomorrow
              ? "text-indigo-400 dark:text-indigo-300"
              : ink;

            return (
              <section key={date.toISOString()}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`${typeHeadline} ${headingColor}`}>{label}</h2>
                  <span className={`${typeLabel} ${inkFaint}`}>
                    {groupTasks.length} task{groupTasks.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {groupTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleDone(task.id)}
                      onEdit={() => setEditingTask(task)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          {noDueDate.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`${typeHeadline} ${inkMuted}`}>No due date</h2>
                <span className={`${typeLabel} ${inkFaint}`}>
                  {noDueDate.length} task{noDueDate.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {noDueDate.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleDone(task.id)}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
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
