"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Edit2, Trash2, Loader2, AlertTriangle, X, Star, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeBlock from "@/components/COdeBlock";

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
  user_profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface SnippetCardProps {
  snippet?: Snippet;
  onUpdate?: () => void;
}

export default function SnippetCard({ snippet, onUpdate }: SnippetCardProps) {
  if (!snippet) return null;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
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
    fetchUserAndFavoriteStatus();
  }, [snippet.id]);

  const fetchUserAndFavoriteStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);

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
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to favorite snippets!");
      setFavLoading(false);
      return;
    }

    if (isFavorited) {
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

  const isOwner = currentUserId && snippet.user_id && currentUserId === snippet.user_id;

  return (
    <div className="p-4 border border-border rounded-xl bg-card space-y-3 relative group flex flex-col justify-between w-full min-w-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base truncate" title={snippet.title}>
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {snippet.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={isFavorited ? "Remove Favorite" : "Add to Favorites"}
            >
              <Star className={`w-4 h-4 ${isFavorited ? "fill-amber-400" : ""}`} />
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit Snippet"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Snippet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full min-w-0">
          <CodeBlock
            code={snippet.code_content}
            language={snippet.language || "text"}
          />
        </div>
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {snippet.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs bg-muted/80 border border-border/60 px-2 py-0.5 rounded-md text-muted-foreground max-w-[120px] truncate"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {snippet.user_profiles && (
        <div className="pt-2 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground mt-2 shrink-0">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            Shared by:{" "}
            <strong className="font-medium text-foreground">
              {snippet.user_profiles.first_name
                ? `${snippet.user_profiles.first_name} ${snippet.user_profiles.last_name || ""}`.trim()
                : "Anonymous Developer"}
            </strong>
          </span>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border w-[calc(100vw-2rem)] sm:max-w-md space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Delete Snippet</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">"{snippet.title}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)} className="text-xs sm:text-sm">
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="text-xs sm:text-sm">
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-bold">Edit Snippet</h2>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 text-xs sm:text-sm" required />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-10 text-xs sm:text-sm" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Code / Prompt</label>
                <textarea
                  className="w-full p-2.5 bg-background border border-input rounded-md text-xs font-mono min-h-[120px] sm:min-h-[140px] focus:outline-none focus:ring-1 focus:ring-ring"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id={`edit-public-${snippet.id}`}
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-input cursor-pointer h-4 w-4 text-primary"
                />
                <label htmlFor={`edit-public-${snippet.id}`} className="text-xs sm:text-sm cursor-pointer select-none">
                  Make snippet public
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="text-xs sm:text-sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="text-xs sm:text-sm font-medium">
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