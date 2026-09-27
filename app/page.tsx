"use client";

import { useEffect, useState } from "react";
import SnippetCard, { Snippet } from "@/components/SnippetCard";
import { supabase } from "@/lib/supabase";
import { Search, Filter, Code2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 6; 

export default function Dashboard() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedLanguage]);

  const languages = Array.from(
    new Set(snippets.map((s) => s.language).filter(Boolean))
  );

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

  const totalPages = Math.ceil(filteredSnippets.length / ITEMS_PER_PAGE) || 1;
  const paginatedSnippets = filteredSnippets.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">All Snippets</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage and organize your personal code snippets and prompts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium bg-muted/60 px-3 py-1.5 rounded-lg w-fit shrink-0">
          <Code2 className="w-4 h-4 text-primary" />
          <span>{snippets.length} Total Snippets</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets by title, description or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="h-10 text-xs rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring w-full sm:w-auto shrink-0"
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

      {loading ? (
        <div className="text-muted-foreground text-sm py-12 text-center">
          Loading your snippets....
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="p-8 sm:p-12 border border-dashed border-border rounded-xl text-center space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">
            {searchQuery || selectedLanguage !== "all"
              ? "No snippets match your search criteria."
              : "No snippets found. Click 'New Snippet' in the sidebar to create your first snippet!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onUpdate={fetchMySnippets}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                Page <span className="font-medium text-foreground">{page}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}