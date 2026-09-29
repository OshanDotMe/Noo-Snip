"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Snippet } from "@/components/SnippetCard";
import { Check, FolderPlus, X } from "lucide-react";

interface AddSnippetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  onSuccess: () => void;
}

export default function AddSnippetsModal({
  isOpen,
  onClose,
  collectionId,
  onSuccess,
}: AddSnippetsModalProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserSnippets = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("snippets")
          .select("*")
          .eq("user_id", user.id);

        if (data) {
          setSnippets(data);

          const currentInCollection = data
            .filter((s: any) => s.collection_id === collectionId)
            .map((s) => s.id);
          setSelectedIds(currentInCollection);
        }
      }
      setLoading(false);
    };

    fetchUserSnippets();
  }, [isOpen, collectionId]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    await supabase
      .from("snippets")
      .update({ collection_id: null })
      .eq("collection_id", collectionId);

    if (selectedIds.length > 0) {
      await supabase
        .from("snippets")
        .update({ collection_id: collectionId })
        .in("id", selectedIds);
    }

    setSaving(false);
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <FolderPlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Add Snippets to Collection</h2>
        </div>

        <p className="text-xs text-muted-foreground">
          Select snippets to include in this collection.
        </p>

        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading your snippets...
          </div>
        ) : snippets.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No snippets found. Create some snippets first!
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {snippets.map((snippet) => {
              const isSelected = selectedIds.includes(snippet.id);
              return (
                <div
                  key={snippet.id}
                  onClick={() => toggleSelect(snippet.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">{snippet.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {snippet.language}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}