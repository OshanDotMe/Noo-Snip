"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Globe, Code2 } from "lucide-react";
import SnippetCard from "@/components/SnippetCard";

export default function ExplorePage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSnippets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("snippets")
      .select("*, user_profiles(first_name, last_name)")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Explore fetch error:", error.message);
      const { data: fallbackData } = await supabase
        .from("snippets")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (fallbackData) setSnippets(fallbackData);
    } else if (data) {
      setSnippets(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPublicSnippets();
  }, []);

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
                Explore code snippets and prompts shared by other developers.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snippets.map((item) => (
                <SnippetCard
                  key={item.id}
                  snippet={item}
                  onUpdate={fetchPublicSnippets}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}