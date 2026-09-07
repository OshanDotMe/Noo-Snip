"use client";

import { useEffect, useState } from "react";
import { Code, Search } from "lucide-react";
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

  const handleSelect = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code_content);
    setOpen(false);
    alert(`Copied "${snippet.title}" code to clipboard!`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search snippets or code..." />
      <CommandList>
        <CommandEmpty>No snippets found matching your query.</CommandEmpty>
        <CommandGroup heading="Code Snippets">
          {snippets.map((snippet) => (
            <CommandItem
              key={snippet.id}
              value={`${snippet.title} ${snippet.language} ${snippet.tags?.join(" ")}`}
              onSelect={() => handleSelect(snippet)}
              className="cursor-pointer flex items-center justify-between p-2"
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{snippet.title}</span>
              </div>
              <span className="text-xs font-mono uppercase bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {snippet.language}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}