"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, FolderGit2, Globe, Home, LogIn, Settings, Sparkles, Star, X } from "lucide-react";
import CreateSnippetModal from "@/components/CreateSnippetModal";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const getLinkClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors active:scale-[0.98] ${
      pathname === path
        ? "bg-secondary text-secondary-foreground font-semibold"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-border bg-card p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:min-h-screen md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">NooSnip</span>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-all"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div onClick={handleLinkClick}>
            <CreateSnippetModal triggerClassName="w-full justify-center" />
          </div>

          <nav className="space-y-1">
            <Link href="/" onClick={handleLinkClick} className={getLinkClass("/")}>
              <Home className="w-4 h-4 shrink-0" />
              <span>All Snippets</span>
            </Link>
            <Link href="/explore" onClick={handleLinkClick} className={getLinkClass("/explore")}>
              <Globe className="w-4 h-4 shrink-0" />
              <span>Explore Community</span>
            </Link>
            <Link href="/favorites" onClick={handleLinkClick} className={getLinkClass("/favorites")}>
              <Star className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Favorites</span>
            </Link>
            <Link href="/ai-search" onClick={handleLinkClick} className={getLinkClass("/ai-search")}>
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>AI Search</span>
            </Link>
            <Link href="/collections" onClick={handleLinkClick} className={getLinkClass("/collections")}>
              <FolderGit2 className="w-4 h-4 shrink-0" />
              <span>Collections</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <Link href="/settings" onClick={handleLinkClick} className={getLinkClass("/settings")}>
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </Link>

          <Link href="/login" onClick={handleLinkClick} className={getLinkClass("/login")}>
            <LogIn className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Login / Account</span>
          </Link>
        </div>
      </aside>
    </>
  );
}