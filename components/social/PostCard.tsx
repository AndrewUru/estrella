"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "./CommentSection";
import type { FeedPost, MoodValue } from "./types";

type MoodMeta = { label: string; emoji: string };

const MOOD_META: Record<Exclude<MoodValue, null>, MoodMeta> = {
  gratitud: { label: "Gratitud", emoji: ":)" },
  inspiracion: { label: "Inspiracion", emoji: "!!" },
  en_proceso: { label: "En proceso", emoji: "..." },
  necesito_apoyo: { label: "Necesito apoyo", emoji: "<3" },
};

export function PostCard({ post }: { post: FeedPost }) {
  const authorName = post.full_name ?? post.profiles?.full_name ?? "Integrante";
  const avatarUrl = post.avatar_url ?? post.profiles?.avatar_url ?? null;
  const [openComments, setOpenComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments_count ?? 0);

  useEffect(() => {
    setCommentCount(post.comments_count ?? 0);
  }, [post.comments_count]);

  const moodMeta = post.mood ? getMoodMeta(post.mood) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-border/60 shadow-sm backdrop-blur-sm p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-primary/10">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={authorName}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
              {getInitials(authorName)}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(post.created_at)}
          </span>
        </div>
        {moodMeta ? (
          <Badge variant="outline" className="ml-auto text-xs">
            {moodMeta.emoji} {moodMeta.label}
          </Badge>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenComments((prev) => !prev)}
          className="gap-2 px-0 text-xs font-semibold text-primary hover:text-primary/80"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {openComments ? "Ocultar comentarios" : "Ver comentarios"}
        </Button>
        <span className="rounded-full bg-secondary/70 px-3 py-1 text-[11px] font-medium text-secondary-foreground">
          {commentCount} {commentCount === 1 ? "comentario" : "comentarios"}
        </span>
      </div>

      {openComments && (
        <CommentSection postId={post.id} onCountChange={setCommentCount} />
      )}
    </motion.div>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function formatRelativeTime(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "Hace un momento";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return new Date(date).toLocaleDateString();
}

function getMoodMeta(value: MoodValue) {
  if (!value) return null;
  return MOOD_META[value] ?? null;
}
