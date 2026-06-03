"use client";

import React, { useState, useMemo } from "react";
import { Tag, X } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";

const TAG_COLORS = [
  { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", activeBg: "bg-yellow-100" },
  { text: "text-lime-600",   bg: "bg-lime-50",   border: "border-lime-200",   activeBg: "bg-lime-100"   },
  { text: "text-sky-500",    bg: "bg-sky-50",    border: "border-sky-200",    activeBg: "bg-sky-100"    },
  { text: "text-violet-500", bg: "bg-violet-50", border: "border-violet-200", activeBg: "bg-violet-100" },
  { text: "text-pink-500",   bg: "bg-pink-50",   border: "border-pink-200",   activeBg: "bg-pink-100"   },
  { text: "text-teal-500",   bg: "bg-teal-50",   border: "border-teal-200",   activeBg: "bg-teal-100"   },
  { text: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", activeBg: "bg-orange-100" },
];

function getLabelStyle(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash += tag.charCodeAt(i);
  return TAG_COLORS[hash % TAG_COLORS.length];
}

export default function LabelsView() {
  const { tasks, toggleDone, deleteTask } = useTasks();
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Collect all unique labels across all tasks
  const allLabels = useMemo(() => {
    const seen = new Set<string>();
    tasks.forEach((t) => (t.tags ?? []).forEach((tag) => seen.add(tag)));
    return Array.from(seen).sort();
  }, [tasks]);

  // Count tasks per label
  const labelCounts = useMemo(() => {
    const counts: Record<string,number> = {};
    //outer loop: go through every task
    tasks.forEach((t) =>
      //inner loop: go through each tag in a task, ?? [] says if tags is null/undefined, just use an empty array
      (t.tags ?? []).forEach((tag) => {
        //add 1 to counts[tag], if null, make counts[tag] = 1
        counts[tag] = (counts[tag] ?? 0) + 1;
      })
    );
    return counts;
  }, [tasks]);

  // Filter tasks by selected label, or show all tagged tasks
  const filteredTasks = useMemo(() => {
    if (!selectedLabel) return tasks.filter((t) => t.tags && t.tags.length > 0);
    return tasks.filter((t) => t.tags?.includes(selectedLabel));
  }, [tasks, selectedLabel]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold leading-tight text-gray-800">Labels</h1>
        <p className="text-sm mt-0.5 text-gray-400">Browse and filter tasks by label</p>
      </div>

      {/* Label chips */}
      {allLabels.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-300">
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
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-black/6">
                    {labelCounts[tag]}
                  </span>
                  {isActive && <X size={11} className="ml-0.5 opacity-60" />}
                </button>
              );
            })}
          </div>

          {/* Section title */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">
              {selectedLabel ? (
                <>Tasks tagged <span className={getLabelStyle(selectedLabel).text}>"{selectedLabel}"</span></>
              ) : (
                "All labelled tasks"
              )}
            </h2>
            <span className="text-xs text-gray-400">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-center mt-8 text-gray-300">
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

/*
"use client";
import React from "react"
import { useTasks } from "@/context/TaskContext";

export default function Labels({onOpenAI}) {
    const {tasks} = useTasks();
    return (
        <div>
            {tasks.map((t) => (
                <h1 key={t.id}>{t.tags}</h1>
            ))}
        </div>
    );
}
*/