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
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </Link>

          <div className="flex items-center justify-between border-b border-border pb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{collection?.name || "Collection"}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {collection?.description || "All snippets in this category"}
              </p>
            </div>
            <div className="shrink-0">
              <CreateSnippetModal onCreated={fetchCollectionData} triggerClassName="gap-2 shrink-0" />
            </div>
          </div>

          {loading ? (
            <div className="text-muted-foreground text-sm">Loading snippets...</div>
          ) : snippets.length === 0 ? (
            <div className="p-12 border border-dashed border-border rounded-xl text-center space-y-2">
              <Code2 className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                No snippets in this collection yet. Click "+ New Snippet" to add one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snippets.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-xl bg-card space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded font-mono">{item.language}</span>
                  </div>
                  <CodeBlock
                    code={item.code_content}
                    language={item.language || "javascript"}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}