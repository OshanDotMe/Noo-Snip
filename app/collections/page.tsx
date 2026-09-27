"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import { supabase } from "@/lib/supabase";
import { FolderGit2, Trash2, Code2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CollectionItem {
  id: string;
  name: string;
  description: string;
  snippets: { count: number }[];
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("collections")
      .select("*, snippets(count)");

    if (error) toast.error("Failed to load collections");
    else setCollections(data || []);
    setLoading(false);
  };

  const deleteCollection = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Collection deleted");
      fetchCollections();
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 sm:border-0 sm:pb-0">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Collections</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Organize your snippets into categories
              </p>
            </div>
            <div className="w-full sm:w-auto shrink-0">
              <CreateCollectionModal onCreated={fetchCollections} />
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-xs sm:text-sm">Loading collections...</div>
          ) : collections.length === 0 ? (
            <div className="p-8 sm:p-12 border border-dashed border-border rounded-xl text-center space-y-3 bg-card/50">
              <FolderGit2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                No collections found. Create your first one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="group p-4 sm:p-5 border border-border rounded-xl bg-card hover:border-primary/50 transition-all flex items-center justify-between shadow-sm hover:shadow-md min-w-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                    <div className="p-2.5 sm:p-3 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{col.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Code2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{col.snippets?.[0]?.count || 0} Snippets</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteCollection(col.id, col.name);
                    }}
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all shrink-0"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}