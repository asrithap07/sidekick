"use client";

import React, { useState, useMemo } from "react";
import { Tag, X } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import { getAllLabels, getLabelCounts, filterTasksByLabel, getLabelStyle } from "@/lib/utils/label-utils";


export default function LabelsView() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Collect all unique labels across all tasks
  const allLabels = useMemo(
  () => getAllLabels(tasks),
  [tasks]
);

const labelCounts = useMemo(
  () => getLabelCounts(tasks),
  [tasks]
);

const filteredTasks = useMemo(
  () => filterTasksByLabel(tasks, selectedLabel),
  [tasks, selectedLabel]
);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-100">Labels</h1>
        <p className="text-sm mt-0.5 text-gray-400 dark:text-gray-500">Browse and filter tasks by label</p>
      </div>

      {/* Label chips */}
      {allLabels.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-300 dark:text-gray-600">
          <Tag size={40} strokeWidth={1.2} />
          <p className="text-sm">No labels yet — add some when creating tasks.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
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
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-black/6 dark:bg-white/10">
                    {labelCounts[tag]}
                  </span>
                  {isActive && <X size={11} className="ml-0.5 opacity-60" />}
                </button>
              );
            })}
          </div>

          {/* Section title */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {selectedLabel ? (
                <>Tasks tagged <span className={getLabelStyle(selectedLabel).text}>"{selectedLabel}"</span></>
              ) : (
                "All labelled tasks"
              )}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-center mt-8 text-gray-300 dark:text-gray-600">
                No tasks with this label.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleDone(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}