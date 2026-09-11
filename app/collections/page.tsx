"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { FolderGit2, Plus } from "lucide-react";

export default function CollectionsPage(){
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Collections</h1>
              <p className="text-sm text-muted-foreground">Organize your snippets into categories.</p>
            </div>
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Collection</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["React Utilities", "Database Queries", "CSS Snippets"].map((folder, i) => (
              <div key={i} className="p-4 border border-border rounded-xl bg-card hover:bg-muted/50 cursor-pointer flex items-center gap-3">
                <FolderGit2 className="w-6 h-6 text-primary" />
                <span className="font-medium">{folder}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}