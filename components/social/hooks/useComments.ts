//C:\estrella\components\social\hooks\useComments.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PostComment } from "../types";

type CommentRow = {
  id: string;
  update_id: string;
  content: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const normalizeComment = (row: CommentRow): PostComment => ({
  id: row.id,
  update_id: row.update_id,
  content: row.content ?? "",
  created_at: row.created_at,
  user_id: row.user_id,
  full_name: row.profiles?.full_name ?? null,
  avatar_url: row.profiles?.avatar_url ?? null,
});

export function useComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    };
    void loadUser();
  }, []);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("progress_update_comments")
      .select(
        `
          id,
          update_id,
          content,
          created_at,
          user_id,
          profiles(full_name, avatar_url)
        `
      )
      .eq("update_id", postId)
      .order("created_at", { ascending: false })
      .returns<CommentRow[]>();

    if (error) {
      console.error("Error loading comments", error);
      setComments([]);
      setIsLoading(false);
      return;
    }

    setComments((data ?? []).map(normalizeComment));
    setIsLoading(false);
  }, [postId]);

  const addComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("progress_update_comments")
        .insert({
          update_id: postId,
          content: trimmed,
          user_id: user.id,
        })
        .select(
          `
            id,
            update_id,
            content,
            created_at,
            user_id,
            profiles(full_name, avatar_url)
          `
        )
        .single()
        .returns<CommentRow>();

      if (error || !data) {
        console.error("Error adding comment", error);
        return;
      }

      setComments((prev) => [normalizeComment(data), ...prev]);
    },
    [postId]
  );

  const deleteComment = useCallback(async (commentId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from("progress_update_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting comment", error);
      return;
    }

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  }, []);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  return { comments, addComment, deleteComment, isLoading, currentUserId };
}
