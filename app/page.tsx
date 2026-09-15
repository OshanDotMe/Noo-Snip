"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SnippetCard, { Snippet } from "@/components/SnippetCard";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMySnippets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSnippets(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMySnippets();
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your prompts and code snippets efficiently.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-muted-foreground text-sm">Loading your snippets...</div>
            ) : snippets.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">
                  No snippets found in your vault. Create one to see it displayed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} onUpdate={fetchMySnippets}/>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}