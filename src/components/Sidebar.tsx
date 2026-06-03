"use client";

import React from "react";
import { useState } from "react";
import {
  CheckSquare,
  CalendarDays,
  CalendarClock,
  Tag,
  ChevronDown,
  Plus,
  CirclePlus,
  Send,
  HelpCircle,
  Sun,
  Moon,
  Folder,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

import AddTaskModal from "@/components/AddTaskModal"
import {useTasks} from "@/context/TaskContext"

const NAV_ITEMS = [
  { icon: CalendarDays, label: "Today" },
  { icon: CalendarClock, label: "Upcoming" },
  { icon: Tag, label: "Labels" },
];

const PROJECTS = [
  { icon: "🧑‍💻", label: "Code Project" },
];

type SidebarProps = {
  onAddTask?: () => void;
  theme: string;
  onToggleTheme: (theme: string) => void;
  activePage: string;
  onNavigate: (page: string) => void;
};

export default function Sidebar({ onAddTask, theme, onToggleTheme, activePage, onNavigate}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Today");
  const [isModalOpen, setModalOpen] = useState(false);
  const { addTask } = useTasks();
  

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${
        collapsed ? "w-20" : "w-56"
      } bg-white border-r border-gray-100 rounded-2xl shadow-sm p-4`}
    >
      {/* Logo */}
      <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
            <CheckSquare size={14} className="text-white" />
            </div>

            {!collapsed && (
            <span className="font-semibold text-gray-800 text-sm">
                TaskFlow
            </span>
            )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 ml-auto"
        >
          {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Menu */}
      {!collapsed && (
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2 px-1">
          Main Menu
        </p>
      )}

      <nav className="flex flex-col gap-0.5 mb-4">
        {/* Add Task button */}
        <button
          onClick={() =>setModalOpen(true)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors w-full text-left mb-1"
        >
          <CirclePlus size={15} className="text-indigo-500 flex-shrink-0" />
          {!collapsed && <span>Add Task</span>}
        </button>

        {NAV_ITEMS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => onNavigate(label)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors w-full text-left ${
              activePage === label
                ? "bg-indigo-50 text-indigo-600 font-medium"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Icon size={15} />
            {!collapsed && <span className="flex-1 truncate">{label}</span>}
          </button>
        ))}
      </nav>

      {/* Projects */}

        <>
          <div className={`flex items-center ${!collapsed ? "justify-between px-1 mb-2" : "justify-center"}`}>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              {!collapsed && "Projects"}
            </p>
            <button className={`text-indigo-400 hover:text-indigo-600`}>
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto">
            {PROJECTS.map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => onNavigate(label)}
                className={`flex items-center ${collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-2.5 py-2 text-left"
                    } rounded-lg text-sm transition-colors w-full ${
                    activePage === label
                        ? "bg-indigo-50 text-indigo-600 font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
              >
                {/*<Folder size={14} className="flex-shrink-0" />*/}
                <span className="truncate">{icon} {!collapsed && label}</span>
              </button>
            ))}
          </div>
        </>


      {/* Upgrade Card */}
  
      {/* {!collapsed && (
        
        <div className="mt-4 bg-indigo-500 rounded-xl p-3 text-white relative overflow-hidden">
          <div className="absolute -right-3 -top-3 w-14 h-14 bg-indigo-400 rounded-full opacity-30" />
          <div className="absolute -right-1 top-4 w-8 h-8 bg-indigo-300 rounded-full opacity-20" />
          <p className="text-xs font-semibold mb-0.5">Upgrade plan</p>
          <p className="text-[10px] text-indigo-100 leading-tight">
            Unlock your personal to-do workspace, share your impact with multiple
            people, and much more...
          </p>
          <button className="mt-2 w-6 h-6 bg-white rounded-full flex items-center justify-center ml-auto shadow">
            <ChevronRightIcon size={12} className="text-indigo-500" />
          </button>
        </div>
      )} */}
      

      {/* Bottom */}
      <div className="mt-4 flex flex-col gap-1">
        {!collapsed && (
          <>
            <button className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <Send size={13} /> Invites
            </button>
            <button className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <HelpCircle size={13} /> FAQs
            </button>
          </>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mt-1">
          <button
            onClick={() => onToggleTheme("light")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-xs transition-colors ${
              theme === "light"
                ? "bg-white text-gray-700 shadow-sm font-medium"
                : "text-gray-400"
            }`}
          >
            <Sun size={11} />
            {!collapsed && "Light"}
          </button>
          <button
            onClick={() => onToggleTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-xs transition-colors ${
              theme === "dark"
                ? "bg-white text-gray-700 shadow-sm font-medium"
                : "text-gray-400"
            }`}
          >
            <Moon size={11} />
            {!collapsed && "Dark"}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="w-7 h-7 rounded-full bg-orange-300 flex items-center justify-center text-xs font-bold text-orange-700">
              P
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                Pristia Candra
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                @nameless.pristia #112
              </p>
            </div>
            <ChevronDown size={12} className="text-gray-400 flex-shrink-0" />
          </div>
        )}
      </div>
      {isModalOpen && (
              <AddTaskModal
                onClose={() => setModalOpen(false)}
                onAdd={(task: { label: string; priority: "high" | "medium" | "low"; dueDate: string; tags: string[] }) => {
                  addTask(task); //call the onAdd prop that calls addTask to update the tasks state
                  setModalOpen(false); //close the modal after adding
                }}
              />
            )}
    </aside>
    
  );
}