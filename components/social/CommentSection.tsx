"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "./hooks/useComments";

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [draft, setDraft] = useState("");
  const { comments, addComment, isLoading } = useComments(postId);

  const handleDraftChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
  };

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    await addComment(draft);
    setDraft("");
  };

  return (
    <div
      className="mt-3 space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4"
      data-post-id={postId}
    >
      <Textarea
        placeholder="Escribe un comentario de apoyo..."
        value={draft}
        onChange={handleDraftChange}
        rows={3}
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Comentar"}
        </Button>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2 text-xs">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {comment.full_name?.[0] ?? "?"}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-semibold">
                    {comment.full_name ?? "Integrante"}
                  </span>
                  <span>{formatRelativeTime(comment.created_at)}</span>
                </div>
                <p>{comment.content}</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 text-muted-foreground transition hover:text-primary"
                aria-label="Reaccionar al comentario"
              >
                <Heart className="h-3 w-3" /> {comment.likes_count ?? 0}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Aun no hay comentarios. Deja el primero :)
        </p>
      )}
    </div>
  );
}

function formatRelativeTime(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return new Date(date).toLocaleDateString();
}
