"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { TaskProvider } from "@/context/TaskContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "TaskFlow",
//   description: "an AI-powered task organizer and productivity app",
// };


export default function RootLayout({ children }) {
  const [theme, setTheme] = useState("light");
  const [aiOpen, setAiOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const pageMap = {
    "/today": "Today",
    "/labels": "Labels",
    "/upcoming": "Upcoming",
  };
  const activePage = pageMap[pathname] ?? "Today";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <html lang="en">
      <body>
        <TaskProvider>
          <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-100"
          }`}>
            <div className="flex gap-4 w-full max-w-6xl" style={{ height: "calc(100vh - 3rem)" }}>
              
              <Sidebar
                theme={theme}
                onToggleTheme={setTheme}
                activePage={activePage}
                onNavigate={(label) => router.push(`/${label.toLowerCase()}`)}
              />

              <div className="flex-1 min-w-0">
                {children}
              </div>

              {aiOpen && (
                <div className="w-72 flex-shrink-0">
                  <AIAssistant onClose={() => setAiOpen(false)} />
                </div>
              )}

            </div>
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}