"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Code2, Loader2 } from "lucide-react";
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

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not authenticated!");
        setLoading(false);
        return;
      }

      const tagsArray = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          language: language.trim().toLowerCase(),
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
        <Button className={`shrink-0 text-xs sm:text-sm font-medium h-10 px-4 active:scale-95 transition-all ${triggerClassName}`}>
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Snippet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-auto">
        <DialogHeader className="text-left pb-1">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <Code2 className="w-5 h-5 text-primary shrink-0" />
            <span>Create New Snippet</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateSnippet} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium mb-1 block text-muted-foreground">Title *</label>
            <Input
              placeholder="e.g., React Custom Fetch Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block text-muted-foreground">Description</label>
            <Input
              placeholder="Short note about what this code or prompt does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">Language *</label>
              <Input
                placeholder="javascript"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 sm:h-11 text-xs sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block text-muted-foreground">Collection</label>
              <select
                className="w-full h-10 sm:h-11 px-3 rounded-md border border-input bg-background text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
            <label className="text-xs font-medium mb-1 block text-muted-foreground">Code / Prompt *</label>
            <Textarea
              placeholder="Paste your code snippet or prompt here..."
              className="font-mono text-xs sm:text-sm min-h-[120px] sm:min-h-[140px] resize-y"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block text-muted-foreground">Tags (comma separated)</label>
            <Input
              placeholder="react, hooks, frontend"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="is_public" className="text-xs sm:text-sm font-medium cursor-pointer select-none">
              Make this snippet public (visible to everyone)
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto h-10 sm:h-11 text-xs sm:text-sm font-medium active:scale-[0.98] transition-transform"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving....
                </span>
              ) : (
                "Save Snippet"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}