"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import SnippetCard, { Snippet } from "@/components/SnippetCard";
import { supabase } from "@/lib/supabase";
import { Search, Filter, Code2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const fetchMySnippets = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSnippets([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("snippets")
      .select("*, user_profiles(first_name, last_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching snippets:", error.message);
    } else {
      setSnippets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMySnippets();
  }, []);

  // Language List extracted from snippets
  const languages = Array.from(
    new Set(snippets.map((s) => s.language).filter(Boolean))
  );

  // Filtered Snippets Search & Language
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesLang =
      selectedLanguage === "all" ||
      snippet.language?.toLowerCase() === selectedLanguage.toLowerCase();

    return matchesSearch && matchesLang;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-6">
          {/* Header Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">All Snippets</h1>
              <p className="text-sm text-muted-foreground">
                Manage and organize your personal code snippets and prompts.
              </p>
            </div>

            {/* Total Snippets Count Badge */}
            <div className="flex items-center gap-2 text-xs font-medium bg-muted/60 px-3 py-1.5 rounded-lg w-fit">
              <Code2 className="w-4 h-4 text-primary" />
              <span>{snippets.length} Total Snippets</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets by title, description or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-10 text-xs rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Snippet Grid */}
          {loading ? (
            <div className="text-muted-foreground text-sm py-8 text-center">
              Loading your snippets...
            </div>
          ) : filteredSnippets.length === 0 ? (
            <div className="p-12 border border-dashed border-border rounded-xl text-center space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedLanguage !== "all"
                  ? "No snippets match your search criteria."
                  : "No snippets found. Click 'New Snippet' in the sidebar to create your first snippet!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onUpdate={fetchMySnippets}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}