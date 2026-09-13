"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, FolderGit2, Globe, Home, LogIn, Settings, Sparkles } from "lucide-react";
import CreateSnippetModal from "@/components/CreateSnippetModal";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">SnippetVault</span>
        </div>

        {/* New Snippet Trigger Button with Modal */}
        <CreateSnippetModal />

        <nav className="space-y-1">
          <Link
            href="/explore"
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent"
          >
            <Globe className="w-4 h-4" />
            Explore Community
          </Link>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === "/"
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
              }`}
          >
            <Home className="w-4 h-4" />
            All Snippets
          </Link>
          <Link
            href="/ai-search"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === "/ai-search"
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted"
              }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Search
          </Link>
          <Link
            href="/collections"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <FolderGit2 className="w-4 h-4" />
            Collections
          </Link>
        </nav>
      </div>

      <div className="border-t border-border pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        <Link
          href="/login"
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === "/login"
              ? "bg-secondary text-secondary-foreground font-semibold"
              : "text-muted-foreground hover:bg-muted"
            }`}
        >
          <LogIn className="w-4 h-4 text-emerald-500" />
          Login / Account
        </Link>
      </div>
    </aside>
  );
}