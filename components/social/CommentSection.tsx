//C:\estrella\components\social\CommentSection.tsx

"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "./hooks/useComments";

interface CommentSectionProps {
  postId: string;
  onCountChange?: (count: number) => void;
}

export function CommentSection({ postId, onCountChange }: CommentSectionProps) {
  const [draft, setDraft] = useState("");
  const { comments, addComment, deleteComment, isLoading, currentUserId } =
    useComments(postId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleDraftChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
  };

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    await addComment(draft);
    setDraft("");
  };

  const handleReply = (name?: string | null) => {
    const mention = name ? `@${name.split(" ")[0] ?? "integrante"} ` : "@integrante ";
    setDraft((prev) => (prev.trim() ? `${prev.trimEnd()} ${mention}` : mention));
    textareaRef.current?.focus();
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };

  useEffect(() => {
    onCountChange?.(comments.length);
  }, [comments.length, onCountChange]);

  return (
    <div
      className="mt-4 space-y-4 rounded-3xl border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur"
      data-post-id={postId}
    >
      <Textarea
        placeholder="Escribe un comentario de apoyo..."
        value={draft}
        onChange={handleDraftChange}
        ref={textareaRef}
        rows={3}
        className="resize-none rounded-2xl border-border/60 bg-background/90 text-sm focus-visible:ring-1 focus-visible:ring-primary"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isLoading}
          className="rounded-full px-5 text-xs font-semibold uppercase tracking-wide"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            "Comentar"
          )}
        </Button>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 text-xs shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-xs font-semibold text-secondary-foreground">
                {comment.full_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 space-y-1 text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {comment.full_name ?? "Integrante"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-wide">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                    {comment.user_id === currentUserId ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        className="text-[11px] font-semibold text-destructive transition hover:text-destructive/80"
                      >
                        Eliminar
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {comment.content}
                </p>
                <button
                  type="button"
                  onClick={() => handleReply(comment.full_name)}
                  className="text-xs font-semibold text-primary transition hover:text-primary/80"
                >
                  Responder
                </button>
              </div>
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
