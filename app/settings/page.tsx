"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 max-w-2xl space-y-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="space-y-4 border border-border p-6 rounded-xl bg-card">
            <h2 className="font-semibold text-lg">AI & Vector Configurations</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Search Threshold</label>
              <Input defaultValue="0.1" type="number" step="0.01" />
            </div>
            <Button onClick={() => toast.success("Settings saved successfully!")}>Save Changes</Button>
          </div>
        </main>
      </div>
    </div>
  );
}