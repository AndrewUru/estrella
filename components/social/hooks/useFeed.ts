"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useRealtime } from "./useRealtime";
import { useLikes } from "./useLikes";
import type { FeedPost, MoodValue, ProfileSummary } from "../types";

type FeedRow = {
  id: string;
  user_id: string | null;
  content: string | null;
  mood: MoodValue | string | null;
  created_at: string;
  likes_count: number | null;
  comments_count: number | null;
  profiles?: ProfileSummary | null;
};

const isFeedRow = (value: unknown): value is FeedRow =>
  Boolean(
    value && typeof value === "object" && "id" in value && "created_at" in value
  );

const normalizeFeedPost = (row: FeedRow): FeedPost => ({
  id: row.id,
  user_id: row.user_id,
  content: row.content ?? "",
  mood: (row.mood ?? null) as MoodValue,
  created_at: row.created_at,
  likes_count: row.likes_count ?? 0,
  comments_count: row.comments_count ?? 0,
  full_name: row.profiles?.full_name ?? null,
  avatar_url: row.profiles?.avatar_url ?? null,
  profiles: row.profiles ?? null,
});

export function useFeed() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Obtener usuario actual
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    void fetchUser();
  }, []);

  // Cargar feed inicial
  const { data, isLoading, isFetching, refetch } = useQuery<FeedPost[]>({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_updates")
        .select(
          `
          id,
          user_id,
          content,
          mood,
          created_at,
          likes_count,
          comments_count,
          profiles(full_name, avatar_url)
        `
        )
        .order("created_at", { ascending: false })
        .limit(40)
        .returns<FeedRow[]>();

      if (error) throw error;
      return (data ?? []).map(normalizeFeedPost);
    },
  });

  const feed = data ?? [];

  // Hook de likes
  const { likedMap, toggleLike, pending } = useLikes({
    table: "progress_update_likes",
    targetField: "update_id",
    userId,
  });

  // 🔁 Realtime: actualizaciones de publicaciones
  useRealtime<FeedRow>("progress_updates", (payload) => {
    queryClient.setQueryData<FeedPost[]>(["feed"], (current = []) => {
      const event = payload.eventType;

      if (event === "INSERT" && isFeedRow(payload.new)) {
        const newPost = normalizeFeedPost(payload.new);
        if (current.some((post) => post.id === newPost.id)) {
          return current;
        }
        return [newPost, ...current];
      }

      if (event === "DELETE" && isFeedRow(payload.old)) {
        return current.filter((post) => post.id !== payload.old.id);
      }

      if (event === "UPDATE" && isFeedRow(payload.new)) {
        const updated = normalizeFeedPost(payload.new);
        return current.map((post) =>
          post.id === updated.id ? { ...post, ...updated } : post
        );
      }

      return current;
    });
  });

  // 🔁 Realtime: comentarios añadidos o eliminados
  useRealtime("progress_update_comments", (payload) => {
    const event = payload.eventType;
    if (event === "INSERT" || event === "DELETE") {
      // Refresca el feed para actualizar el contador de comentarios
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    }
  });

  // ➕ Crear nueva publicación
  const addPost = useCallback(
    async (content: string, mood: MoodValue) => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      if (!currentUser) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from("progress_updates")
        .insert({
          user_id: currentUser.id,
          content,
          mood,
        })
        .select(
          `
          id,
          user_id,
          content,
          mood,
          created_at,
          likes_count,
          comments_count,
          profiles(full_name, avatar_url)
        `
        )
        .single()
        .returns<FeedRow>();

      if (error || !data)
        throw error ?? new Error("No se pudo crear la publicación");

      queryClient.setQueryData<FeedPost[]>(["feed"], (old = []) => [
        normalizeFeedPost(data),
        ...old,
      ]);
    },
    [queryClient]
  );

  return {
    feed,
    isLoading,
    isFetching,
    refetch,
    likedMap,
    toggleLike,
    pending,
    addPost,
  };
}
