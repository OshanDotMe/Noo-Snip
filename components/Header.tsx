"use client";

import { useState } from "react";
import { Search, Command } from "lucide-react";
import CommandMenu from "@/components/CommandMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between">
      <button
        onClick={() => setOpen(true)}
        className="relative w-96 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-background/50 border border-muted rounded-md hover:bg-muted/50 transition-colors text-left"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="flex-1">Search snippets or prompts...</span>
        <div className="flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      <CommandMenu open={open} setOpen={setOpen} />
      {/* <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
          OA
        </div>
      </div> */}
    </header>
  );
}