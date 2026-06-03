"use client";
import React from "react"
import { createContext, useContext, useState } from "react";

/*
    context is like a global store for your React app
    normally data is passsed top-down through props part of the components
    with context we can put data in a shared container (TaskConteext) and any component wrapped in it can read or update the data directly without props
*/



export type Task = {
  id: number;
  label: string;
  priority: "high" | "medium" | "low";
  project: string | null;
  tags?: string[];
  done: boolean;
  dueDate: string | undefined;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: { label: string; priority: "high" | "medium" | "low"; dueDate?: string; tags?: string[] }) => void;
  toggleDone: (id: number) => void;
  deleteTask: (id: number) => void;
  finishAll: () => void;
};

const INITIAL_TASKS: Task[] = [
    {
        id: 1, 
        label: "Create UI", 
        priority: "high", 
        project: "CS Project", 
        tags: ["career", "coding"],
        done: false,
        dueDate: "2026-06-02"
    },
    {
        id: 2,
        label: "Apply to 2 summer internships",
        priority: "low",
        project: null,
        tags: ["career"],
        done: false,
        dueDate: "2026-06-03"
    },
    {
        id: 3,
        label: "go to the gym",
        priority: "medium",
        project: null,
        tags: ["life"],
        done: true,
        dueDate: "2026-06-02"
    }
 ]

 //creats a new context object
//initially, it has no value, we provide the value in TaskProvider
const TaskContext = createContext<TaskContextType | null>(null);

//wrapping components with TaskProvider lets them access tasks and update functions
export function TaskProvider({ children }: { children: React.ReactNode }) { //children is a special prop that represents whatever JSX you put inside a component
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  //the function takes a task id
    const toggleDone = (id: number) =>
        // we are calling setTasks and giving it a function that takes the prev tasks state and calculates a new one from it
        setTasks((prev) =>
            //we use map to go through every tasks and if that task id 
            // matches the curretn one we are toggling, then we return a new object that is toggled as  
            // otherwise we leave it as the same
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
    
    //the function deleteTask takes a task id
    const deleteTask = (id: number) =>
        //we call setTasks and give it a function that takes the prev tasjs
        //it returns a list of tasks that ids dont match the id given to deleteTask
        setTasks((prev) => prev.filter((t) => t.id !== id));

    //take the current tasks and add a new one to the end
    const addTask = ({label, priority, dueDate, tags}: {label: string; priority: "high" | "medium" | "low"; dueDate?: string; tags?: string[] }) => {
        //add new task to state -> set tasks to be all the previous tasks along with this new task at the end
        setTasks((prev) => [
            //copy all previous tasks
            ...prev,
            // create the new task object and use Date.now() to track id so its easier
            {id: Date.now(), label: label, priority: priority, project: null, tags: tags, done: false, dueDate: dueDate}
        ])
        //setNewTask("");
    };
    //sets everything to done
    const finishAll = () => {
        setTasks((prev) =>
            //the parentheces around the object tells javascript to reutn this object
            prev.map((t) =>  ({...t, done: true}))
        );
    }

  return (
    /*
        every context you create (TaskContext = createContext()) comes with a Provider
        the Provider is like a container that wraps other components and makes the context value available to all of them
    */
   //anything inside this box can see an use the things I'm giving it
   //the value prop is what you're giving to the components inside
   //   here we are passing an object with all our state and functions and any component inside this Provider can grab this object using useContext(TaskContext)
    <TaskContext.Provider value={{tasks, addTask, toggleDone, deleteTask, finishAll }}>
      {/* this renders wahtever JSX was inside TaskProvider when you used it */}
      {children}
    </TaskContext.Provider>
  );
}

{/* 
    useContext(TaskContext) goes and finds the nearest <TaskContext.Provider> 
    above me in the component tree and give me its value (the object with tasks, addTask, etc)
    useTasks returns that value that the provider gives which makes our app a lot simpler

*/}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }

  return context;
}