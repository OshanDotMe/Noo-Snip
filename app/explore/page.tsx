"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { Globe, Code2, User } from "lucide-react";

export default function ExplorePage() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicSnippets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("snippets")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
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
                <div key={item.id} className="p-5 border border-border rounded-xl bg-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-mono">
                      {item.language}
                    </span>
                  </div>

                  <pre className="p-3 bg-slate-950 text-slate-50 text-xs rounded-lg overflow-x-auto font-mono max-h-48">
                    <code>{item.code_content}</code>
                  </pre>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}