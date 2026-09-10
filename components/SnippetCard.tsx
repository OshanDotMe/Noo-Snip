"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

export interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code_content: string;
  language: string;
  tags: string[];
  created_at: string;
}

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({snippet}: SnippetCardProps){
  const [copied, setCopied] = useState(false);

  const handleCopy = async () =>{
    await navigator.clipboard.writeText(snippet.code_content);
    toast.success("Code copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base text-card-foreground">
            {snippet.title}
          </h3>
          {snippet.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {snippet.description}
            </p>
          )}
        </div>
        <span className="text-xs font-mono uppercase bg-muted px-2 py-1 rounded text-muted-foreground border border-border">
          {snippet.language}
        </span>
      </div>

      <div className="relative group text-sm max-h-60 overflow-y-auto font-mono bg-[#1e1e1e]">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          className="absolute right-2 top-2 h-8 w-8 bg-background/80 backdrop-blur hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
        
        <SyntaxHighlighter
          language={snippet.language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
          }}
        >
          {snippet.code_content}
        </SyntaxHighlighter>
      </div>

      <div className="p-3 bg-muted/30 border-t border-border flex flex-wrap gap-1.5 items-center">
        {snippet.tags && snippet.tags.length > 0 ? (
          snippet.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No tags
          </span>
        )}
      </div>
    </div>
  );
}