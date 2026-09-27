"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-950 text-slate-50 border border-slate-800 text-xs font-mono w-full min-w-0">
      <div className="flex justify-between items-center px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] select-none">
        <span className="lowercase font-semibold text-slate-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-slate-100 hover:bg-slate-800/60 active:scale-95 transition-all px-2 py-1 rounded text-xs touch-manipulation"
          title="Copy Code"
          aria-label="Copy Code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-3.5 overflow-x-auto text-slate-200 whitespace-pre">
        <code className="block font-mono leading-relaxed text-xs sm:text-sm">{code}</code>
      </pre>
    </div>
  );
}