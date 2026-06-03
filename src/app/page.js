"use client";
import { useState, useEffect} from "react";
import AIAssistant from "@/components/AIAssistant"
import Sidebar from "@/components/Sidebar"
import Today from "@/components/Today"
import Labels from "@/components/Labels"
import {TaskProvider, useTasks} from "@/context/TaskContext"
import Upcoming from "@/components/Upcoming";


export default function Home() {
  const [theme, setTheme] = useState("light");
  const [aiOpen, setAiOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("Today");

  // Sync the "dark" class on <html> whenever theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (   
    //sidebar and taskboard components are passed to TaskProvider as the children prop
    //now both Sidebar and TaskBoard can access the value object wuth all the tasks and functions that TaskProvider passes to its children
    <TaskProvider> 
      <div
        className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div
          className="flex gap-4 w-full max-w-6xl"
          style={{ height: "calc(100vh - 3rem)" }}
        >
          {/* Sidebar 
            giving the sidebar the current theme and passing the function that changes the theme
          */}
          <Sidebar theme={theme} onToggleTheme={setTheme} activePage = {currentPage} onNavigate = {setCurrentPage}/>

          {/* Main Task Board 
            Render the TaskBoard component, and give it a function called onOpenAI. 
            When that function runs, open the AI assistant.
          */}
          
          <div className="flex-1 min-w-0">
            {currentPage === "Today" && (< Today onOpenAI={() => setAiOpen(true)} />)}
            {currentPage === "Labels" && (< Labels onOpenAI={() => setAiOpen(true)} />)}
            {currentPage === "Upcoming" && (< Upcoming onOpenAI={() => setAiOpen(true)} />)}

          </div>

          {/* AI Assist Panel 
            Only renders when aiOpen is true.
            Passing onClose so the component can hide itself
            by setting aiOpen to false.
          */}
          {/*
          {aiOpen && (
            <div className="w-72 flex-shrink-0">
              <AIAssist onClose={() => setAiOpen(false)} />
            </div>
          )}*/}
        </div>
      </div>
    </TaskProvider>
  );
}