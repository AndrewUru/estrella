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
  liked_by_user: boolean | null;
  full_name?: string | null;
  avatar_url?: string | null;
  profiles?: ProfileSummary | null;
};

const normalizeFeedPost = (row: FeedRow): FeedPost => ({
  id: row.id,
  user_id: row.user_id,
  content: row.content ?? "",
  mood: (row.mood ?? null) as MoodValue,
  created_at: row.created_at,
  likes_count: row.likes_count,
  comments_count: row.comments_count,
  liked_by_user: row.liked_by_user,
  full_name: row.full_name ?? row.profiles?.full_name ?? null,
  avatar_url: row.avatar_url ?? row.profiles?.avatar_url ?? null,
  profiles: row.profiles ?? null,
});

export function useFeed() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };

    void fetchUser();
  }, []);

  const { data, isLoading, isFetching, refetch } = useQuery<FeedPost[]>({
    queryKey: ["feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_updates")
        .select(
          "id, user_id, content, mood, created_at, likes_count, comments_count, liked_by_user, full_name, avatar_url, profiles(full_name, avatar_url)"
        )
        .order("created_at", { ascending: false })
        .limit(40)
        .returns<FeedRow[]>();

      if (error) throw error;
      return (data ?? []).map(normalizeFeedPost);
    },
  });

  const feed = data ?? [];

  const { likedMap, toggleLike, pending } = useLikes({
    table: "progress_update_likes",
    targetField: "update_id",
    userId,
  });

  useRealtime<FeedRow>("progress_updates", (payload) => {
    queryClient.setQueryData<FeedPost[]>(["feed"], (current = []) => {
      if (payload.type === "INSERT" && payload.new) {
        const newPost = normalizeFeedPost(payload.new);
        if (current.some((post) => post.id === newPost.id)) {
          return current;
        }
        return [newPost, ...current];
      }

      if (payload.type === "DELETE") {
        const removed = payload.old;
        if (!removed) {
          return current;
        }
        return current.filter((post) => post.id !== removed.id);
      }

      if (payload.type === "UPDATE" && payload.new) {
        const updatedPost = normalizeFeedPost(payload.new);
        return current.map((post) =>
          post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        );
      }

      return current;
    });
  });

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
          "id, user_id, content, mood, created_at, likes_count, comments_count, liked_by_user, full_name, avatar_url, profiles(full_name, avatar_url)"
        )
        .single()
        .returns<FeedRow>();

      if (error || !data) throw error ?? new Error("No se pudo crear la publicacion");

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
