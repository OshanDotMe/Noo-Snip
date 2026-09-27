"use client";

import { useEffect, useState } from "react";
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
    <div className="space-y-6">
      <div className="flex items-start sm:items-center gap-3 border-b border-border pb-4 sm:border-0 sm:pb-0">
        <div className="p-2 sm:p-2.5 bg-amber-400/10 text-amber-500 rounded-xl shrink-0 mt-0.5 sm:mt-0">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Favorite Snippets</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your bookmarked code snippets and prompts for quick access.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-xs sm:text-sm">Loading favorites...</div>
      ) : snippets.length === 0 ? (
        <div className="p-8 sm:p-12 border border-dashed border-border rounded-xl text-center space-y-2 bg-card/50">
          <Code2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground opacity-50" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            No favorite snippets added yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {snippets.map((item) => (
            <div key={item.id} className="min-w-0">
              <SnippetCard
                snippet={item}
                onUpdate={fetchFavoriteSnippets}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}