"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing your goal…",
  "Mapping out phases…",
  "Generating starter tasks…",
  "Estimating timelines…",
  "Finalizing your plan…",
];

export default function StepGenerating() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-5">
      {/* Spinner ring */}
      <div className="relative w-12 h-12">
        <svg
          className="animate-spin w-12 h-12"
          viewBox="0 0 48 48"
          fill="none"
          style={{ animationDuration: "0.9s" }}
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="rgba(108,99,255,0.15)"
            strokeWidth="3"
          />
          <path
            d="M24 4a20 20 0 0 1 20 20"
            stroke="#6c63ff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2l1.5 4.5L15 8l-4.5 1.5L9 16 7.5 9.5 3 8l4.5-1.5L9 2z"
              fill="#6c63ff"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* Animated message */}
      <div className="text-center">
        <p
          key={msgIndex}
          className="text-sm text-neutral-600 dark:text-neutral-400 transition-all"
          style={{ animation: "fadeUp 0.3s ease" }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Phase skeleton preview */}
      <div className="w-full space-y-2 mt-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3"
            style={{ opacity: msgIndex > i ? 1 : 0.3, transition: "opacity 0.4s ease" }}
          >
            <div
              className="w-7 h-7 rounded-full flex-shrink-0"
              style={{ background: "rgba(108,99,255,0.12)" }}
            />
            <div className="flex-1 space-y-1.5">
              <div
                className="h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700"
                style={{ width: `${55 + i * 10}%` }}
              />
              <div
                className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700/50"
                style={{ width: `${35 + i * 5}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}