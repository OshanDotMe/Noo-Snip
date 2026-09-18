"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Code2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateSnippetModal({
  onCreated,
  triggerClassName = "gap-2",
}: {
  onCreated?: () => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeContent, setCodeContent] = useState("");
  const [tags, setTags] = useState("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (open) {
      supabase
        .from("collections")
        .select("id, name")
        .then(({ data, error }) => {
          if (error) console.error("Error loading collections:", error);
          if (data) setCollections(data);
        });
    }
  }, [open]);

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("User not authenticated!");
      setLoading(false);
      return;
    }

    const tagsArray = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

    try {
      // Client-side direct insert වෙනුවට Vector embeddings හදන /api/snippets route එකට යැවීම
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          language,
          code_content: codeContent,
          tags: tagsArray,
          collection_id: collectionId || null,
          is_public: isPublic,
          user_id: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save snippet");
      }

      toast.success("Snippet saved successfully with AI Vector!");

      // Form එක Reset කිරීම
      setTitle("");
      setDescription("");
      setCodeContent("");
      setTags("");
      setCollectionId("");

      setOpen(false);
      if (onCreated) onCreated();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus className="w-4 h-4" /> New Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" /> Create New Snippet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateSnippet} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium mb-1 block">Title *</label>
            <Input
              placeholder="e.g., React Custom Fetch Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Description</label>
            <Input
              placeholder="Short note about what this code or prompt does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Language *</label>
              <Input
                placeholder="javascript"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block">Collection</label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
              >
                <option value="">Select Collection (Optional)</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Code / Prompt *</label>
            <Textarea
              placeholder="Paste your code snippet or prompt here..."
              className="font-mono text-sm h-32"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Tags (comma separated)</label>
            <Input
              placeholder="react, hooks, frontend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-input"
            />
            <label htmlFor="is_public" className="text-xs font-medium cursor-pointer">
              Make this snippet public (visible to everyone)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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