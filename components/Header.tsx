import { Search, Command } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur px-6 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search snippets or prompts..."
          className="pl-9 pr-12 bg-background/50 border-muted"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
          OA
        </div>
      </div>
    </header>
  );
}