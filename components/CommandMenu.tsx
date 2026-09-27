"use client";

import { useEffect, useState } from "react";
import { Code } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Snippet } from "@/components/SnippetCard";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      fetchSnippets();
    }
  }, [open]);

  const fetchSnippets = async () => {
    const { data } = await supabase
      .from("snippets")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setSnippets(data);
    }
  };

  const handleSelect = async (snippet: Snippet) => {
    const codeToCopy = snippet.code_content || (snippet as any).code_content || "";

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = codeToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setOpen(false);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search snippets or code..." />
      <CommandList className="max-h-[70vh] sm:max-h-[400px] overflow-y-auto p-1">
        <CommandEmpty className="py-6 text-center text-xs sm:text-sm text-muted-foreground">
          No snippets found matching your query.
        </CommandEmpty>
        <CommandGroup heading="Code Snippets" className="text-xs font-semibold text-muted-foreground px-2">
          {snippets.map((snippet) => (
            <CommandItem
              key={snippet.id}
              value={`${snippet.title} ${snippet.language} ${snippet.tags?.join(" ")}`}
              onSelect={() => handleSelect(snippet)}
              className="cursor-pointer flex items-center justify-between p-2.5 sm:p-2 my-0.5 rounded-md hover:bg-accent active:bg-accent/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <Code className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-xs sm:text-sm truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                  {snippet.title}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono uppercase bg-muted/80 border border-border px-2 py-0.5 rounded text-muted-foreground shrink-0">
                {snippet.language || "text"}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}