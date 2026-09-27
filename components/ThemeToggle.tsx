"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div className="w-[108px] h-[38px] bg-muted/40 rounded-xl border border-border/50 animate-pulse" />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Select theme"
      className="flex items-center gap-0.5 bg-muted/80 p-1 rounded-xl border border-border select-none"
    >
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
          theme === "light"
            ? "bg-background text-foreground shadow-sm font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        }`}
        title="Light Mode"
        aria-label="Switch to Light Theme"
        aria-checked={theme === "light"}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
          theme === "dark"
            ? "bg-background text-foreground shadow-sm font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        }`}
        title="Dark Mode"
        aria-label="Switch to Dark Theme"
        aria-checked={theme === "dark"}
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-lg transition-all active:scale-95 ${
          theme === "system"
            ? "bg-background text-foreground shadow-sm font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        }`}
        title="System Theme"
        aria-label="Switch to System Theme"
        aria-checked={theme === "system"}
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}