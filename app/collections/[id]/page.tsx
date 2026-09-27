"use client";

import { useEffect, useState, use } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CreateSnippetModal from "@/components/CreateSnippetModal";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Code2 } from "lucide-react";
import Link from "next/link";
import CodeBlock from "@/components/COdeBlock";

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collection, setCollection] = useState<any>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollectionData = async () => {
    setLoading(true);
    const { data: colData } = await supabase.from("collections").select("*").eq("id", id).single();
    setCollection(colData);

    const { data: snipData } = await supabase.from("snippets").select("*").eq("collection_id", id);
    setSnippets(snipData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {collection?.name || "Collection"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {collection?.description || "All snippets in this category"}
              </p>
            </div>
            <div className="shrink-0 w-full sm:w-auto">
              <CreateSnippetModal 
                onCreated={fetchCollectionData} 
                triggerClassName="w-full sm:w-auto justify-center gap-2" 
              />
            </div>
          </div>
          {loading ? (
            <div className="text-muted-foreground text-xs sm:text-sm">Loading snippets...</div>
          ) : snippets.length === 0 ? (
            <div className="p-8 sm:p-12 border border-dashed border-border rounded-xl text-center space-y-2 bg-card/50">
              <Code2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                No snippets in this collection yet. Click "+ New Snippet" to add one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {snippets.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 sm:p-4 border border-border rounded-xl bg-card space-y-3 min-w-0 overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                    <span className="text-[11px] sm:text-xs bg-muted px-2 py-0.5 rounded font-mono shrink-0">
                      {item.language}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg">
                    <CodeBlock
                      code={item.code_content}
                      language={item.language || "javascript"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}