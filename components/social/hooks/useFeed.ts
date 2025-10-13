"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useRealtime } from "./useRealtime";
import type { FeedPost, MoodValue, ProfileSummary } from "../types";

type FeedRow = {
  id: string;
  user_id: string | null;
  content: string | null;
  mood: MoodValue | string | null;
  created_at: string;
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
  comments_count: row.comments_count ?? 0,
  full_name: row.profiles?.full_name ?? null,
  avatar_url: row.profiles?.avatar_url ?? null,
  profiles: row.profiles ?? null,
});

export function useFeed() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch, error, isError } =
    useQuery<FeedPost[]>({
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

  useRealtime<FeedRow>("progress_updates", (payload) => {
    queryClient.setQueryData<FeedPost[]>(["feed"], (current = []) => {
      const event = payload.eventType;

      if (event === "INSERT" && isFeedRow(payload.new)) {
        const newPost = normalizeFeedPost(payload.new);
        if (current.some((post) => post.id === newPost.id)) return current;
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

  useRealtime<{ update_id?: string }>("progress_update_comments", (payload) => {
    const newRow = payload.new as { update_id?: string } | null;
    const oldRow = payload.old as { update_id?: string } | null;

    const updateId = newRow?.update_id ?? oldRow?.update_id;
    if (!updateId) return;

    queryClient.setQueryData<FeedPost[]>(["feed"], (current = []) =>
      current.map((post) => {
        if (post.id !== updateId) return post;

        const currentCount = post.comments_count ?? 0;
        const updatedCount =
          payload.eventType === "INSERT"
            ? currentCount + 1
            : payload.eventType === "DELETE"
            ? Math.max(currentCount - 1, 0)
            : currentCount;

        return { ...post, comments_count: updatedCount };
      })
    );
  });

  return {
    feed,
    isLoading,
    isFetching,
    refetch,
    error,
    isError,
  };
}
