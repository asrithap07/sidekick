import {
    Clock,
    Zap,
    TrendingUp,
    CheckCircle2
} from "lucide-react"

import React from "react"

import { Task } from "@/types/task";
import { Stats } from "@/types/stats";


export  function getTaskInsights(tasks: Task[], stats: Stats) {
    const msgs: { icon: React.ReactNode; text: string; color: string }[] = [];
    
    if (stats.overdue > 0)
      msgs.push({ icon: <Clock size={13} />, text: `${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""} need attention`, color: "text-red-500" });
    
    const highPriority = tasks.filter((t) => !t.done && t.priority === "high");
    
    if (highPriority.length > 0)
      msgs.push({ icon: <Zap size={13} />, text: `${highPriority.length} high-priority task${highPriority.length > 1 ? "s" : ""} left today`, color: "text-amber-500" });
    
    if (stats.pct >= 50 && stats.pct < 100)
      msgs.push({ icon: <TrendingUp size={13} />, text: `You're ${stats.pct}% done — strong pace`, color: "text-green-500" });
    
    if (stats.pct === 100)
      msgs.push({ icon: <CheckCircle2 size={13} />, text: "All done! Phenomenal day.", color: "text-indigo-500" });
    
    return msgs.slice(0, 3);
  }