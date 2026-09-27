"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateCollectionModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const insertPayload: Record<string, any> = {
        name: name.trim(),
        description: description.trim(),
      };

      if (user) {
        insertPayload.user_id = user.id;
      }

      const { error } = await supabase.from("collections").insert([insertPayload]);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Collection "${name.trim()}" created!`);
        setName("");
        setDescription("");
        setOpen(false);
        if (onCreated) onCreated();
      }
    } catch (err) {
      toast.error("An unexpected error occurred while creating the collection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0 w-full sm:w-auto text-xs sm:text-sm font-medium h-10 px-4 active:scale-95 transition-all">
          <Plus className="w-4 h-4 shrink-0" />
          <span>New Collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-auto">
        <DialogHeader className="text-left pb-1">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <FolderPlus className="w-5 h-5 text-primary shrink-0" />
            <span>Create New Collection</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <Input
            placeholder="Collection Name (e.g. React Hooks)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 sm:h-11 text-xs sm:text-sm"
            required
          />
          <Input
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10 sm:h-11 text-xs sm:text-sm"
          />
          <Button
            type="submit"
            className="w-full h-10 sm:h-11 text-xs sm:text-sm font-medium active:scale-[0.98] transition-transform"
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              "Save Collection"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}