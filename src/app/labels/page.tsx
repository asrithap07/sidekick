"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sparkles, Tag, X } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import EditTaskModal from "@/components/EditTaskModal";
import { updateTask } from "@/lib/api/tasks";
import { useAIAssistant } from "@/context/AIAssistantContext";
import type { Task } from "@/types/task";
import { getAllLabels, getLabelCounts, filterTasksByLabel, getLabelStyle } from "@/lib/utils/label-utils";
import { ink, inkMuted, inkFaint, surfacePanel, aiAssistBtn } from "@/lib/ui/tint";
import { typeDisplay, typeHeadline, typeBody, typeLabel } from "@/lib/ui/type";

export default function LabelsView() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const { togglePanel, setPageContext } = useAIAssistant();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const allLabels = useMemo(() => getAllLabels(tasks), [tasks]);
  const labelCounts = useMemo(() => getLabelCounts(tasks), [tasks]);
  const filteredTasks = useMemo(
    () => filterTasksByLabel(tasks, selectedLabel),
    [tasks, selectedLabel]
  );

  useEffect(() => {
    setPageContext({ page: "labels", tasks });
  }, [tasks, setPageContext]);

  return (
    <div className={`flex flex-col h-full ${surfacePanel} p-6 overflow-hidden`}>
      <div className="mb-6 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className={`${typeDisplay} ${ink}`}>Labels</h1>
            <p className={`${typeBody} ${inkMuted} mt-1`}>
              Browse and filter tasks by label
            </p>
          </div>
          <button onClick={() => togglePanel()} className={aiAssistBtn}>
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>
      </div>

      {allLabels.length === 0 ? (
        <div className={`flex flex-col items-center justify-center flex-1 gap-3 ${inkFaint} py-10`}>
          <Tag size={40} strokeWidth={1.2} />
          <p className={typeBody}>No labels yet — add some when creating tasks.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {allLabels.map((tag) => {
              const style = getLabelStyle(tag);
              const isActive = selectedLabel === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedLabel(isActive ? null : tag)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${style.text} ${style.border} ${isActive ? style.activeBg : style.bg}`}
                >
                  {tag}
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${inkFaint} bg-[oklch(0.93_0.008_275)] dark:bg-[oklch(0.3_0.015_275)]`}>
                    {labelCounts[tag]}
                  </span>
                  {isActive && <X size={11} className="ml-0.5 opacity-60" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className={`${typeHeadline} ${ink}`}>
              {selectedLabel ? (
                <>
                  Tasks tagged{" "}
                  <span className={getLabelStyle(selectedLabel).text}>&ldquo;{selectedLabel}&rdquo;</span>
                </>
              ) : (
                "All labelled tasks"
              )}
            </h2>
            <span className={`${typeLabel} ${inkMuted}`}>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <p className={`${typeBody} text-center mt-8 ${inkFaint}`}>
                No tasks with this label.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleDone(task.id)}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            )}
          </div>
        </>
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
