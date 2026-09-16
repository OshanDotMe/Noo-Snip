"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Edit2, Trash2, Loader2, AlertTriangle, X, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "./COdeBlock";

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code_content: string;
  language?: string;
  tags?: string[];
  is_public: boolean;
  user_id?: string;
  created_at?: string;
}

interface SnippetCardProps {
  snippet?: Snippet;
  onUpdate?: () => void;
}

export default function SnippetCard({ snippet, onUpdate }: SnippetCardProps) {
  if (!snippet) return null;

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(snippet.title || "");
  const [description, setDescription] = useState(snippet.description || "");
  const [codeContent, setCodeContent] = useState(snippet.code_content || "");
  const [isPublic, setIsPublic] = useState(snippet.is_public ?? false);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    checkIfFavorited();
  }, [snippet.id]);

  const checkIfFavorited = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("snippet_id", snippet.id)
      .single();

    if (data) setIsFavorited(true);
  };

  const toggleFavorite = async () => {
    setFavLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to favorite snippets!");
      setFavLoading(false);
      return;
    }

    if (isFavorited) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("snippet_id", snippet.id);

      if (error) toast.error(error.message);
      else {
        setIsFavorited(false);
        toast.success("Removed from favorites");
        onUpdate?.();
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, snippet_id: snippet.id });

      if (error) toast.error(error.message);
      else {
        setIsFavorited(true);
        toast.success("Added to favorites!");
        onUpdate?.();
      }
    }
    setFavLoading(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase.from("snippets").delete().eq("id", snippet.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Snippet deleted successfully!");
      setShowDeleteModal(false);
      onUpdate?.();
    }
    setIsDeleting(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("snippets")
      .update({
        title,
        description,
        code_content: codeContent,
        is_public: isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq("id", snippet.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Snippet updated successfully!");
      setIsEditing(false);
      onUpdate?.();
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border border-border rounded-xl bg-card space-y-3 relative group">
      {/* Top Section with Title, Edit/Delete & Favorite */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-xs text-muted-foreground">{snippet.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className={`p-1.5 rounded-md transition-colors ${
              isFavorited
                ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={isFavorited ? "Remove Favorite" : "Add to Favorites"}
          >
            <Star className={`w-4 h-4 ${isFavorited ? "fill-amber-400" : ""}`} />
          </button>

          {/* Edit / Delete Buttons */}
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Edit Snippet"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
            title="Delete Snippet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Block */}
      <CodeBlock
        code={snippet.code_content}
        language={snippet.language || "javascript"}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-2xl border border-border w-full max-w-md space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Delete Snippet</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">"{snippet.title}"</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Delete Snippet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-2xl border border-border w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Snippet</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <label className="text-xs font-medium">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium">Code / Prompt</label>
                <textarea
                  className="w-full p-2.5 bg-background border border-input rounded-md text-xs font-mono h-32 focus:outline-none focus:ring-1 focus:ring-ring"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`edit-public-${snippet.id}`}
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-input cursor-pointer"
                />
                <label htmlFor={`edit-public-${snippet.id}`} className="text-xs cursor-pointer select-none">
                  Make snippet public
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}