import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface UseLikesOptions {
  table: string;
  targetField: string;
  userId?: string | null;
}

type LikeRow = Record<string, string | number | null>;

const toKey = (value: string | number) => String(value);

export function useLikes({ table, targetField, userId }: UseLikesOptions) {
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const refreshLikes = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from(table)
      .select(targetField)
      .eq("user_id", userId)
      .returns<LikeRow[]>();

    if (error || !data) {
      if (error) {
        console.error("Error loading likes", error);
      }
      setLikedMap({});
      return;
    }

    const map: Record<string, boolean> = {};
    data.forEach((row) => {
      const key = row[targetField];
      if (typeof key === "string" || typeof key === "number") {
        map[toKey(key)] = true;
      }
    });
    setLikedMap(map);
  }, [table, targetField, userId]);

  const toggleLike = useCallback(
    async (targetId: string) => {
      if (!userId) {
        alert("Inicia sesion para interactuar");
        return;
      }
      if (pending[targetId]) return;

      setPending((prev) => ({ ...prev, [targetId]: true }));

      const isLiked = likedMap[targetId];

      if (isLiked) {
        await supabase
          .from(table)
          .delete()
          .eq(targetField, targetId)
          .eq("user_id", userId);

        setLikedMap((prev) => {
          const rest = { ...prev };
          delete rest[targetId];
          return rest;
        });
      } else {
        await supabase.from(table).insert({
          [targetField]: targetId,
          user_id: userId,
        });
        setLikedMap((prev) => ({ ...prev, [targetId]: true }));
      }

      setPending((prev) => ({ ...prev, [targetId]: false }));
    },
    [likedMap, pending, table, targetField, userId]
  );

  useEffect(() => {
    void refreshLikes();
  }, [refreshLikes]);

  return { likedMap, toggleLike, refreshLikes, pending };
}
