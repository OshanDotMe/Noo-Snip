"use client";

import { useState } from "react";
import { Sparkles, Search, Loader2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>AI Vector Search</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Semantic Snippet Search</h1>
            <p className="text-muted-foreground text-sm">
              Search your code snippets using natural language descriptions (e.g. "How to save data in localstorage").
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Ask anything about your code snippets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-base"
            />
            <Button type="submit" disabled={loading} className="h-12 px-6 gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search</span>
            </Button>
          </form>

          {searched && (
            <div className="space-y-4 pt-4">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Matched Snippets ({results.length})
              </h2>
              {results.length === 0 && !loading ? (
                <div className="p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground text-sm">
                  No semantically similar code snippets found for this query.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((snippet) => (
                    <SnippetCard key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}