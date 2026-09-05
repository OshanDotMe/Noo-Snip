import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your prompts and code snippets efficiently.
            </p>
            <div className="mt-8 border border-dashed border-border rounded-xl p-12 text-center">
              <p className="text-muted-foreground">No snippets found. Click "New Snippet" to add one.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
