"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, FolderGit2, Globe, Home, LogIn, Settings, Sparkles, Star } from "lucide-react";
import CreateSnippetModal from "@/components/CreateSnippetModal";

export default function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      pathname === path
        ? "bg-secondary text-secondary-foreground font-semibold"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

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
          <Link href="/" className={getLinkClass("/")}>
            <Home className="w-4 h-4" />
            All Snippets
          </Link>
          <Link href="/explore" className={getLinkClass("/explore")}>
            <Globe className="w-4 h-4" />
            Explore Community
          </Link>
          <Link href="/favorites" className={getLinkClass("/favorites")}>
            <Star className="w-4 h-4 text-amber-400" />
            Favorites
          </Link>
          <Link href="/ai-search" className={getLinkClass("/ai-search")}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Search
          </Link>
          <Link href="/collections" className={getLinkClass("/collections")}>
            <FolderGit2 className="w-4 h-4" />
            Collections
          </Link>
        </nav>
      </div>

      <div className="border-t border-border pt-4">
        <Link href="/settings" className={getLinkClass("/settings")}>
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        <Link href="/login" className={getLinkClass("/login")}>
          <LogIn className="w-4 h-4 text-emerald-500" />
          Login / Account
        </Link>
      </div>
    </aside>
  );
}