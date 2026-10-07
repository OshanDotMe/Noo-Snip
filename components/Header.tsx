"use client";

import { useState } from "react";
import { Search, Command, Menu } from "lucide-react";
import CommandMenu from "@/components/CommandMenu";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 gap-3 w-full">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:bg-accent shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          suppressHydrationWarning
          onClick={() => setOpen(true)}
          className="relative w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-muted-foreground bg-background/60 border border-border rounded-lg hover:bg-accent/50 transition-colors text-left active:scale-[0.99] shrink min-w-0"
        >
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="truncate flex-1">Search snippets or prompts....</span>
          <div className="hidden sm:flex items-center gap-0.5 text-[10px] sm:text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border shrink-0">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      <CommandMenu open={open} setOpen={setOpen} />

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ThemeToggle />
      </div>
    </header>
  );
}