"use client";

import { useState } from "react";
import { Sparkles, Search, Loader2, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SnippetCard, { Snippet } from "@/components/SnippetCard";

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Snippet[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.snippets || []);
      } else {
        alert("Search failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm sm:text-base">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>AI Vector Search</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Semantic Snippet Search
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Search your code snippets using natural language descriptions (e.g. "How to save data in localstorage").
        </p>
      </div>

      <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-600 dark:text-amber-400 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-amber-500" />
        <div className="space-y-1">
          <p className="font-medium">
            Tip: AI Search works best with natural language queries or questions rather than single keywords.
          </p>
          <p className="text-[11px] sm:text-xs opacity-90">
            Try searching: <span className="italic">"How to set up Supabase client in Next.js"</span> instead of just <span className="italic">"Supabase"</span>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Input
            placeholder='Try asking: "How to handle search input debouncing in React?"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 sm:h-12 text-sm sm:text-base pr-4"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading} 
          className="h-11 sm:h-12 px-6 gap-2 w-full sm:w-auto shrink-0 font-medium"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Search</span>
        </Button>
      </form>

      {searched && (
        <div className="space-y-4 pt-2 sm:pt-4">
          <h2 className="text-xs sm:text-sm font-semibold text-muted-foreground">
            Matched Snippets ({results.length})
          </h2>

          {results.length === 0 && !loading ? (
            <div className="p-6 sm:p-10 border border-dashed border-border rounded-xl text-center text-muted-foreground text-xs sm:text-sm bg-card/50">
              No semantically similar code snippets found for this query. Try rephrasing your prompt.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((snippet) => (
                <div key={snippet.id} className="min-w-0">
                  <SnippetCard snippet={snippet} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}