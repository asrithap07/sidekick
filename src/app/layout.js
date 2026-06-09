"use client";

import { Geist_Mono } from "next/font/google";
import "./globals.css";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { TaskProvider } from "@/context/TaskContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");

  const pathname = usePathname();
  const router = useRouter();

  const pageMap = {
    "/today": "Today",
    "/labels": "Labels",
    "/upcoming": "Upcoming",
    "/goals": "Goals",
  };
  const activePage = pageMap[pathname] ?? "Today";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <html lang="en">
      <body>
        <TaskProvider>
          <div
            className={`h-screen flex items-stretch p-4 transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <div className="flex gap-4 w-full h-full">
              <Sidebar
                theme={theme}
                onToggleTheme={setTheme}
                activePage={activePage}
                onNavigate={(label) => router.push(`/${label.toLowerCase()}`)}
              />

              {/* This flex-1 fills all remaining space — the project page's
                  own panel lives inside here and pushes content naturally */}
              <div className="flex-1 min-w-0 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}