export type Priority = "high" | "medium" | "low"; 

export type PhaseStatus = "completed" | "in-progress" | "upcoming" | "locked"; 

export interface PhaseTask  {
     id: string; label: string; done: boolean; tag: string; tagColor: string; priority: Priority; dueLabel: string; 
    } 
export interface Phase {
     number: number; 
     title: string; 
     status: PhaseStatus; 
     progress: number; 
     tasks: PhaseTask[]; 
    } 
export interface Insight { 
    icon: React.ReactNode; 
    iconBg: string; 
    title: string; 
    body: string; } 

export interface CoachingNote { 
    text: string; 
    color: string; 
    textColor: string; 
    age: string; } 

export interface Attachment { 
    name: string; 
    meta: string; }

export interface Project {
  id: string;

  title: string;
  description: string;

  deadline?: string;

  progress: number;

  phases: Phase[];

  attachments: Attachment[];

  insights: Insight[];
}