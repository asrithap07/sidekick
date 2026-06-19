"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Stats } from "@/types/stats";

export type PageContext =
  | { page: "today"; tasks: Task[]; stats: Stats; streak: number }
  | { page: "project"; project: Project }
  | { page: "upcoming"; tasks: Task[] }
  | { page: "labels"; tasks: Task[] }
  | { page: "new-project" }
  | { page: "other" };

interface AIAssistantContextValue {
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  pageContext: PageContext;
  setPageContext: (ctx: PageContext) => void;
}

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [pageContext, setPageContext] = useState<PageContext>({ page: "other" });

  const togglePanel = useCallback(() => setIsOpen((v) => !v), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  return (
    <AIAssistantContext.Provider value={{ isOpen, togglePanel, closePanel, pageContext, setPageContext }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const ctx = useContext(AIAssistantContext);
  if (!ctx) throw new Error("useAIAssistant must be used within AIAssistantProvider");
  return ctx;
}