"use client";
import React from "react";
import {useState} from "react";
import { Focus, Sparkles, Plus, Info, Trash2, Check } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem"
import AddTaskModal from "@/components/AddTaskModal"
 

type TaskBoardProps = {
  onOpenAI: () => void;
};

export default function TaskBoard({onOpenAI}: TaskBoardProps) {
    const [newTask, setNewTask] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    //call useTasks() to get the value from the context provider
    const { tasks, addTask, toggleDone, deleteTask, finishAll } = useTasks();

    return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
              Good Morning, Pristia!
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

        {/* Profile Score Card */}
        <div className="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg">
            🐼
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Nameless Panda #245
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Microsoft</p>
          </div>
          <div className="text-right space-y-0.5">
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Overall Impact Score</span>
              <span className="text-gray-300 dark:text-gray-600">—</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Ideal Session Length</span>
              <span className="text-gray-300 dark:text-gray-600">—</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today Task Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Today's Tasks</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Focus size={13} />
            Focus Mode
          </button>
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <Sparkles size={13} />
            AI Assist
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {
        //map the tasks and make TaskItem objects with each 
        // pass onToggle and onDelete as functions that call these with the current task
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => toggleDone(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))
        }
      </div>

      {/*Footer Actions*/}
      <div className="mt-4 flex items-center gap-2">
        {/*finish button*/}
        <button 
          onClick={finishAll}
          className="px-5 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">
          Finish
        </button>
        {/* add task button */}
        <button
          onClick={() =>setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus size={13} />
          Add Task
        </button>
        <button className="ml-auto text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400">
          <Info size={14} />
        </button>
      </div>
      {/* if isModelOpen is true then we render the addTaskModal
      we pass in a function that calls setModalOpen(false) for the onClose argument
      we pass in a function that accepts a parameter called task from AddTaskModal's onAdd call and then calls addTask in taskboard.tsx with that task from AddTaskModal */}
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setModalOpen(false)}
          onAdd={(task: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[] }) => 
          {
            addTask(task);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}