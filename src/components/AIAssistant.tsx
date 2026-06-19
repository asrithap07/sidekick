"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, X, Send, TrendingUp, Clock, Zap,
  CheckCircle2, Target, Lightbulb, ChevronRight, RotateCcw,
} from "lucide-react";

import { Task } from "@/types/task";
import { Stats } from "@/types/stats";
import type { PageContext } from "@/context/AIAssistantContext";
import { InsightIcon, COACHING_STYLE } from "@/lib/utils/insight-icon";

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  onClose: () => void;
  pageContext: PageContext;
}

// ── Suggestion chips shown before first message ────────────────────────────

const TODAY_SUGGESTIONS = [
  "What should I focus on first?",
  "Help me plan my day",
  "Why am I falling behind?",
  "Break down my hardest task",
];

const PROJECT_SUGGESTIONS = [
  "What should I work on next?",
  "Am I on track with this project?",
  "How do I break down the hardest phase?",
  "Give me tips to stay motivated",
];

const UPCOMING_SUGGESTIONS = [
  "What's coming up that I should prep for?",
  "Help me prioritize my week",
  "Which tasks should I reschedule?",
];

const GENERIC_SUGGESTIONS = [
  "Help me get started",
  "What can you help me with?",
];

// ── Insight cards derived from context ──────────────────────────────────

function TodayInsights({ tasks, stats, streak }: { tasks: Task[]; stats: Stats; streak: number }) {
  const insights: { icon: React.ReactNode; iconBg: string; title: string; body: string }[] = [];

  const highPriority = tasks.filter((t) => !t.done && t.priority === "high");
  if (highPriority.length > 0) {
    insights.push({
      icon: <Zap size={14} />,
      iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-500",
      title: `${highPriority.length} high-priority task${highPriority.length > 1 ? "s" : ""} remaining`,
      body: `Start with "${highPriority[0].label}" to make the most impact today.`,
    });
  }

  if (stats.overdue > 0) {
    insights.push({
      icon: <Clock size={14} />,
      iconBg: "bg-red-100 dark:bg-red-900/40 text-red-500",
      title: `${stats.overdue} overdue — address these first`,
      body: "Clearing overdue tasks reduces cognitive load and keeps your streak clean.",
    });
  }

  if (stats.pct >= 70) {
    insights.push({
      icon: <TrendingUp size={14} />,
      iconBg: "bg-green-100 dark:bg-green-900/40 text-green-500",
      title: `${stats.pct}% complete — great momentum`,
      body: "You're in a strong position. Finish your remaining tasks to close the day strong.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      icon: <Target size={14} />,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500",
      title: "Ready to plan your day?",
      body: "Ask me anything — I can help prioritise, break down tasks, or suggest a focus order.",
    });
  }

  return (
    <>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
        Today's Insights
      </p>
      <div className="flex flex-col gap-2 mb-5">
        {insights.map((ins, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${ins.iconBg}`}>
              {ins.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{ins.title}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">{ins.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Streak callout */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 mb-5">
        <span className="text-2xl">🔥</span>
        <div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{streak}-day streak</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">Complete at least 1 task today to keep it going.</p>
        </div>
      </div>
    </>
  );
}

function ProjectInsights({ project }: { project: import("@/types/project").Project }) {
  return (
    <>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
        Project Insights
      </p>
      <div className="flex flex-col gap-3 mb-4">
        {project.insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <InsightIcon iconName={insight.iconName} />
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 mb-0.5">{insight.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{insight.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
        Phase Progress
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {project.phases.map((phase) => (
          <div key={phase.number} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/40">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">{phase.title}</p>
              <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-600 mt-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${phase.progress}%` }} />
              </div>
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{phase.progress}%</span>
          </div>
        ))}
      </div>

      {project.coaching.length > 0 && (
        <>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-3">
            Recent AI Coaching
          </p>
          <div className="flex flex-col gap-2">
            {project.coaching.map((note, i) => {
              const style = COACHING_STYLE[note.type];
              return (
                <div key={i} className={`rounded-xl p-3 ${style.bg}`}>
                  <p className={`text-xs leading-relaxed ${style.text}`}>{note.text}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">{note.age}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function DefaultInsights() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 mb-5">
      <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
        <Sparkles size={13} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">AI Sidekick</p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">Ask me anything about your tasks and projects.</p>
      </div>
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 mr-2 mt-0.5">
          <Sparkles size={12} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-500 text-white rounded-br-sm"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AIAssistant({ onClose, pageContext }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasMessages = messages.length > 0;

  // Derive suggestions and system prompt from page context
  const suggestions = pageContext.page === "today"
    ? TODAY_SUGGESTIONS
    : pageContext.page === "project"
    ? PROJECT_SUGGESTIONS
    : pageContext.page === "upcoming"
    ? UPCOMING_SUGGESTIONS
    : GENERIC_SUGGESTIONS;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function buildSystemPrompt(): string {
    const base = "You are TaskFlow's AI sidekick — a sharp, warm productivity assistant. You help users stay on top of their tasks.\n\n";

    switch (pageContext.page) {
      case "today": {
        const { tasks, stats, streak } = pageContext;
        const taskSummary = tasks
          .slice(0, 20)
          .map((t) => `- [${t.done ? "x" : " "}] ${t.label} (priority: ${t.priority ?? "none"}, due: ${t.dueDate ?? "no date"})`)
          .join("\n");
        return `${base}Current user stats:
- Streak: ${streak} days
- Tasks today: ${stats.total} total, ${stats.done} done (${stats.pct}%)
- Overdue: ${stats.overdue}

Today's tasks:
${taskSummary}

Keep responses concise (2-4 sentences max unless breaking something down). Be direct and actionable. Use bullet points sparingly — only when listing 3+ items. Don't be sycophantic.`;
      }
      case "project": {
        const { project } = pageContext;
        const taskCount = project.phases.reduce((sum, p) => sum + p.tasks.length, 0);
        const doneCount = project.phases.reduce((sum, p) => sum + p.tasks.filter((t) => t.done).length, 0);
        return `${base}You are looking at the project "${project.title}".
- Progress: ${project.progress}%
- Phases: ${project.phases.length}
- Tasks: ${doneCount}/${taskCount} done
- Deadline: ${project.deadline ?? "No deadline set"}

Keep responses focused on project planning, task breakdown, and motivation. Be concise (2-4 sentences).`;
      }
      case "upcoming": {
        return `${base}The user is looking at their upcoming tasks organized by due date. Help them prepare for what's ahead, prioritize effectively, and plan their schedule.`;
      }
      case "labels": {
        return `${base}The user is browsing tasks filtered by labels. Help them organize, find patterns, and manage their labeled tasks effectively.`;
      }
      default: {
        return `${base}Help the user with general productivity advice, task management tips, or answer any questions they have. Be concise and actionable.`;
      }
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const systemPrompt = buildSystemPrompt();

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: history,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text ?? "Sorry, I couldn't get a response. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="w-80 shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none">AI Sidekick</p>
            <p className="text-[10px] text-indigo-400 mt-0.5">Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasMessages && (
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
              title="Clear chat"
            >
              <RotateCcw size={13} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        {!hasMessages ? (
          <>
            {pageContext.page === "today" ? (
              <TodayInsights tasks={pageContext.tasks} stats={pageContext.stats} streak={pageContext.streak} />
            ) : pageContext.page === "project" ? (
              <ProjectInsights project={pageContext.project} />
            ) : (
              <DefaultInsights />
            )}

            {/* Suggestions */}
            <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium mb-2">
              Ask me anything
            </p>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 text-left text-xs text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                >
                  {s}
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-indigo-400 shrink-0" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {messages.map((msg, i) => (
              <Bubble key={i} msg={msg} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-600 focus-within:border-indigo-300 dark:focus-within:border-indigo-600 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your sidekick..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none min-w-0"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}