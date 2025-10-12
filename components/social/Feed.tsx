"use client";

import { motion } from "framer-motion";
import { Loader2, RefreshCw, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFeed } from "./hooks/useFeed";
import { CommentSection } from "./CommentSection";
import Image from "next/image";
import { useState } from "react";

/**
 * Feed comunitario con publicaciones recientes, likes y comentarios.
 * Se actualiza en tiempo real gracias a useFeed + useRealtime.
 */
export function Feed() {
  const {
    feed,
    isLoading,
    isFetching,
    refetch,
    likedMap,
    toggleLike,
    pending,
  } = useFeed();

  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Conversaciones recientes
        </h2>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Actualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" /> Refrescar
            </>
          )}
        </Button>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/60 bg-card/60 animate-pulse">
              <CardContent className="p-5 space-y-3">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : feed.length === 0 ? (
        <Card className="border-dashed border-border/70 bg-card/70">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            🌱 Aún no hay publicaciones. Sé la primera en compartir tu proceso.
          </CardContent>
        </Card>
      ) : (
        feed.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
          >
            <Card className="border-border/70 bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition">
              <CardContent className="p-5 space-y-4">
                {/* Cabecera */}
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-primary/10">
                    {post.profiles?.avatar_url ? (
                      <Image
                        src={post.profiles.avatar_url}
                        alt={post.profiles.full_name ?? "Integrante"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                        {getInitials(post.profiles?.full_name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {post.profiles?.full_name ?? "Integrante"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>
                  {post.mood && (
                    <span className="ml-auto text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">
                      {getMoodMeta(post.mood)?.emoji}{" "}
                      {getMoodMeta(post.mood)?.label}
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                  {post.content}
                </p>

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-1.5 border border-border/60 px-3 py-1 text-xs ${
                      likedMap[post.id] ? "bg-primary/10 text-primary" : ""
                    }`}
                    disabled={pending[post.id]}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        likedMap[post.id] ? "fill-current" : ""
                      }`}
                    />
                    {post.likes_count ?? 0}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border border-border/60 px-3 py-1 text-xs"
                    onClick={() =>
                      setOpenComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.comments_count ?? 0}
                  </Button>
                </div>

                {/* Comentarios */}
                {openComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CommentSection postId={post.id} />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
}

/* 🪶 Utilidades */

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

function getMoodMeta(value: string) {
  const moods: Record<string, { label: string; emoji: string }> = {
    gratitud: { label: "Gratitud", emoji: "🌸" },
    inspiracion: { label: "Inspiración", emoji: "✨" },
    en_proceso: { label: "En proceso", emoji: "🌙" },
    necesito_apoyo: { label: "Necesito apoyo", emoji: "💧" },
  };
  return moods[value] || { label: "Sin estado", emoji: "🌞" };
}
