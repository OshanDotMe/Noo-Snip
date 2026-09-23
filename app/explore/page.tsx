"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Globe, Code2, ChevronLeft, ChevronRight } from "lucide-react";
import SnippetCard from "@/components/SnippetCard";

const ITEMS_PER_PAGE = 6;

export default function ExplorePage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPublicSnippets = async (currentPage: number) => {
    setLoading(true);

    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { count } = await supabase
      .from("snippets")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true);

    if (count !== null) {
      setTotalPages(Math.ceil(count / ITEMS_PER_PAGE) || 1);
    }

    const { data, error } = await supabase
      .from("snippets")
      .select("*, user_profiles(first_name, last_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Explore fetch error:", error.message);
      const { data: fallbackData } = await supabase
        .from("snippets")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (fallbackData) setSnippets(fallbackData);
    } else if (data) {
      setSnippets(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPublicSnippets(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Community Snippets</h1>
              <p className="text-sm text-muted-foreground">
                Explore code snippets and prompts shared by other developers
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-sm">Loading public snippets...</div>
          ) : snippets.length === 0 ? (
            <div className="p-12 border border-dashed border-border rounded-xl text-center space-y-2">
              <Code2 className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No public snippets shared yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snippets.map((item) => (
                  <SnippetCard
                    key={item.id}
                    snippet={item}
                    onUpdate={() => fetchPublicSnippets(page)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page <span className="font-medium text-foreground">{page}</span> of{" "}
                    <span className="font-medium text-foreground">{totalPages}</span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}