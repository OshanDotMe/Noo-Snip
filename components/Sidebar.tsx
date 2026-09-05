import Link from "next/link";
import { Code2, FolderGit2, Home, Search, Settings, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">SnippetVault</span>
        </div>
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </Button>
        <nav className="space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground"
          >
            <Home className="w-4 h-4" />
            All Snippets
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Search
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <FolderGit2 className="w-4 h-4" />
            Collections
          </Link>
        </nav>
      </div>
      <div className="border-t border-border pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}