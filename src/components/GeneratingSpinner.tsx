"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { borderTint, inkMuted, trackTint } from "@/lib/ui/tint";
import { typeBody } from "@/lib/ui/type";

const GENERATING_MESSAGES = [
  "Analyzing your goal…",
  "Mapping out phases…",
  "Generating starter tasks…",
  "Estimating timelines…",
  "Finalizing your plan…",
];

export default function GeneratingSpinner() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, GENERATING_MESSAGES.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-6 w-full">
      <div className="relative w-12 h-12">
        <svg
          className="motion-reduce:animate-none animate-spin w-12 h-12 text-indigo-500"
          viewBox="0 0 48 48"
          fill="none"
          style={{ animationDuration: "0.9s" }}
          aria-hidden
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="3"
          />
          <path
            d="M24 4a20 20 0 0 1 20 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={18} className="text-indigo-500 opacity-80" aria-hidden />
        </div>
      </div>

      <p key={msgIndex} className={`${typeBody} ${inkMuted} text-center`}>
        {GENERATING_MESSAGES[msgIndex]}
      </p>

      <div className={`w-full flex flex-col divide-y ${borderTint} mt-2`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 motion-reduce:transition-none transition-opacity duration-300"
            style={{ opacity: msgIndex > i ? 1 : 0.35 }}
          >
            <div className={`w-7 h-7 rounded-full shrink-0 bg-indigo-500/10`} />
            <div className="flex-1 space-y-1.5">
              <div
                className={`h-2.5 rounded-full ${trackTint}`}
                style={{ width: `${55 + i * 10}%` }}
              />
              <div
                className={`h-2 rounded-full ${trackTint} opacity-70`}
                style={{ width: `${35 + i * 5}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}