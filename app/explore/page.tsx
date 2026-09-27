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
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
          <div className="flex items-start sm:items-center gap-3 border-b border-border pb-4 sm:border-0 sm:pb-0">
            <div className="p-2 sm:p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Community Snippets</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Explore code snippets and prompts shared by other developers
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-xs sm:text-sm">Loading public snippets...</div>
          ) : snippets.length === 0 ? (
            <div className="p-8 sm:p-12 border border-dashed border-border rounded-xl text-center space-y-2 bg-card/50">
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                No public snippets shared yet.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {snippets.map((item) => (
                  <div key={item.id} className="min-w-0">
                    <SnippetCard
                      snippet={item}
                      onUpdate={() => fetchPublicSnippets(page)}
                    />
                  </div>
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
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
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