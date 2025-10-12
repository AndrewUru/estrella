import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PostComment } from "../types";

type CommentRow = {
  id: string;
  update_id: string;
  content: string | null;
  created_at: string;
  user_id: string;
  likes_count: number | null;
  profiles: {
    full_name: string | null;
  } | null;
};

const mapComment = (row: CommentRow): PostComment => ({
  id: row.id,
  update_id: row.update_id,
  content: row.content ?? "",
  created_at: row.created_at,
  user_id: row.user_id,
  likes_count: row.likes_count,
  full_name: row.profiles?.full_name ?? null,
});

export function useComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("progress_update_comments")
      .select(
        "id, update_id, content, created_at, user_id, likes_count, profiles(full_name)"
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

    setComments((data ?? []).map(mapComment));
    setIsLoading(false);
  }, [postId]);

  const addComment = useCallback(
    async (content: string) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      await supabase.from("progress_update_comments").insert({
        update_id: postId,
        content,
        user_id: user.id,
      });

      await fetchComments();
    },
    [fetchComments, postId]
  );

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  return { comments, addComment, isLoading };
}
