"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Star, Code2 } from "lucide-react";
import SnippetCard from "@/components/SnippetCard";

export default function FavoritesPage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteSnippets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSnippets([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("snippet_id, snippets(*, user_profiles(first_name, last_name))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error.message);
    } else if (data) {
      // Favorite record එක තුළින් snippet object එක වෙන් කරගැනීම
      const favoritedSnippets = data
        .map((fav: any) => fav.snippets)
        .filter(Boolean);
      setSnippets(favoritedSnippets);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFavoriteSnippets();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-500 rounded-xl">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Favorite Snippets</h1>
              <p className="text-sm text-muted-foreground">
                Your bookmarked code snippets and prompts for quick access.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-sm">Loading favorites...</div>
          ) : snippets.length === 0 ? (
            <div className="p-12 border border-dashed border-border rounded-xl text-center space-y-2">
              <Code2 className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No favorite snippets added yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snippets.map((item) => (
                <SnippetCard
                  key={item.id}
                  snippet={item}
                  onUpdate={fetchFavoriteSnippets}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}