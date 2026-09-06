"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function CreateSnippetModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeContent, setCodeContent] = useState("");
  const [tags, setTags] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();
    if(!title || !codeContent) return;
    
    setLoading(true);

    const tagArray = tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const {error} = await supabase.from("snippets").insert([
      {
        title,
        description: description || null,
        language: language.toLowerCase(),
        code_content: codeContent,
        tags: tagArray,
      },
    ]);

    setLoading(true);

    if(error){
      console.error("Error creating snippet:", error.message);
      alert("Failed to save snippet: " + error.message);
    }else{
      setTitle("");
      setDescription("");
      setCodeContent("");
      setTags("");
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Create New Snippet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., React Custom Fetch Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Short note about what this code or prompt does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              placeholder="javascript, typescript, python, java, sql..."
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="code">Code / Prompt *</Label>
            <Textarea
              id="code"
              placeholder="Paste your code snippet or prompt here..."
              rows={6}
              className="font-mono text-xs"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="react, hooks, frontend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Snippet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}