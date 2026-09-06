import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SnippetCard, { Snippet } from "@/components/SnippetCard";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const revalidate = 0;

async function getSnippets(): Promise<Snippet[]>{
  const {data, error} = await supabase
    .from("snippets")
    .select("*")
    .order("created_at", {ascending: false});

    if(error) {
      console.error("Error fetching snippets:", error);
      return [];
    }

    return data || [];
}

export default async function HomePage() {
  const snippets = await getSnippets();

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

            {snippets.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">
                  No snippets found in Supabase. Create one to see it displayed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
