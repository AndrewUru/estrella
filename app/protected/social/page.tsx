"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Loader2,
  MessageCircle,
  RefreshCw,
  Home,
  Compass,
  Users,
  Bookmark,
  MessageSquare,
  Sparkles,
  Pencil,
  Trash2,
} from "lucide-react";

type ProgressPost = {
  id: string;
  content: string;
  created_at: string;
  mood: string | null;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  likes_count: number;
  comments_count: number;
  liked_by_user?: boolean;
};

type ProgressPostRecord = {
  id: string;
  content: string;
  created_at: string;
  mood?: string | null;
  user_id: string;
  likes_count?: number | null;
  comments_count?: number | null;
  profiles?:
    | {
        full_name: string | null;
        avatar_url: string | null;
      }
    | Array<{
        full_name: string | null;
        avatar_url: string | null;
      }>
    | null;
};

type ComposerFeedback = {
  type: "success" | "error";
  message: string;
};

type ProgressComment = {
  id: string;
  update_id: string;
  content: string;
  created_at: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  likes_count: number;
  liked_by_user?: boolean;
};

const moodOptions: Array<{ value: string; label: string; emoji: string }> = [
  { value: "gratitud", label: "Gratitud", emoji: ":)" },
  { value: "inspiracion", label: "Inspiracion", emoji: "*" },
  { value: "en_proceso", label: "En proceso", emoji: "~" },
  { value: "necesito_apoyo", label: "Necesito apoyo", emoji: "+" },
];

export default function SocialPage() {
  const router = useRouter();
  const { fullName, loading: loadingProfile } = useUserProfile();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [feed, setFeed] = useState<ProgressPost[]>([]);
  const [loadingFeed, setLoadingFeed] = useState<boolean>(true);
  const [refreshingFeed, setRefreshingFeed] = useState<boolean>(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [newUpdate, setNewUpdate] = useState<string>("");
  const [mood, setMood] = useState<string>(moodOptions[0]?.value ?? "gratitud");
  const [submittingUpdate, setSubmittingUpdate] = useState<boolean>(false);
  const [composerFeedback, setComposerFeedback] =
    useState<ComposerFeedback | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [likePending, setLikePending] = useState<Record<string, boolean>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] =
    useState<Record<string, boolean>>({});
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, ProgressComment[]>
  >({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [commentFeedback, setCommentFeedback] = useState<
    Record<string, ComposerFeedback | null>
  >({});
  const [commentLikePending, setCommentLikePending] = useState<
    Record<string, boolean>
  >({});
  const [commentEditing, setCommentEditing] = useState<
    Record<string, boolean>
  >({});
  const [commentEditDrafts, setCommentEditDrafts] = useState<
    Record<string, string>
  >({});
  const [commentActionPending, setCommentActionPending] = useState<
    Record<string, boolean>
  >({});

  const isMountedRef = useRef(true);

  const safeSetFeed = useCallback((value: ProgressPost[]) => {
    if (!isMountedRef.current) return;
    setFeed(value);
  }, []);

  const safeSetState = useCallback(
    <T,>(setter: (value: T) => void, value: T) => {
      if (!isMountedRef.current) return;
      setter(value);
    },
    [],
  );

  const mapRecordToPost = useCallback(
    (record: ProgressPostRecord): ProgressPost => {
      const profileData = Array.isArray(record.profiles)
        ? record.profiles[0] ?? null
        : record.profiles ?? null;

      return {
        id: record.id,
        content: record.content,
        created_at: record.created_at,
        mood: record.mood ?? null,
        user_id: record.user_id,
        full_name: profileData?.full_name ?? null,
        avatar_url: profileData?.avatar_url ?? null,
        likes_count: record.likes_count ?? 0,
        comments_count: record.comments_count ?? 0,
        liked_by_user: false,
      };
    },
    [],
  );

  const fetchFeed = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") {
        safeSetState(setLoadingFeed, true);
      } else {
        safeSetState(setRefreshingFeed, true);
      }
      safeSetState(setFeedError, null);

      const { data, error } = await supabase
        .from("progress_updates")
        .select(
          "id, content, created_at, mood, user_id, likes_count, comments_count, profiles(full_name, avatar_url)",
        )
        .order("created_at", { ascending: false })
        .limit(60);

      if (error) {
        console.error("progress_updates fetch error", error.message);
        safeSetFeed([]);
        safeSetState(
          setFeedError,
          "No pudimos cargar la actividad comunitaria. Intenta refrescar.",
        );
      } else {
        const normalized = (data ?? []).map(mapRecordToPost);
        safeSetFeed(normalized);
      }

      if (mode === "initial") {
        safeSetState(setLoadingFeed, false);
      } else {
        safeSetState(setRefreshingFeed, false);
      }
    },
    [mapRecordToPost, safeSetFeed, safeSetState],
  );

  const refreshLikes = useCallback(async () => {
    if (!currentUserId) return;
    const { data, error } = await supabase
      .from("progress_update_likes")
      .select("update_id")
      .eq("user_id", currentUserId);

    if (!error && data && isMountedRef.current) {
      const likedMap: Record<string, boolean> = {};
      data.forEach((row) => {
        likedMap[row.update_id as string] = true;
      });
      setLikedPosts(likedMap);
    }
  }, [currentUserId]);

  const handleCreateUpdate = useCallback(async () => {
    if (!currentUserId) {
      setComposerFeedback({
        type: "error",
        message: "Necesitas iniciar sesión para compartir.",
      });
      return;
    }

    const payload = newUpdate.trim();
    if (!payload) {
      setComposerFeedback({
        type: "error",
        message: "Comparte una nota o reflexión antes de publicar.",
      });
      return;
    }

    setSubmittingUpdate(true);
    setComposerFeedback(null);

    const { data, error } = await supabase
      .from("progress_updates")
      .insert({
        content: payload,
        mood,
        user_id: currentUserId,
      })
      .select(
        "id, content, created_at, mood, user_id, likes_count, comments_count, profiles(full_name, avatar_url)",
      )
      .single();

    if (error) {
      console.error("progress_updates insert error", error.message);
      if (isMountedRef.current) {
        setComposerFeedback({
          type: "error",
          message: "No pudimos compartir tu avance. Intenta más tarde.",
        });
      }
    } else if (data && isMountedRef.current) {
      const normalized = mapRecordToPost(data as ProgressPostRecord);
      setFeed((current) => [normalized, ...current]);
      setNewUpdate("");
      setMood(moodOptions[0]?.value ?? "gratitud");
      setComposerFeedback({
        type: "success",
        message: "Tu avance ya es visible para la comunidad.",
      });
    }

    if (isMountedRef.current) setSubmittingUpdate(false);
  }, [currentUserId, mapRecordToPost, mood, newUpdate]);

  const handleToggleLike = useCallback(
    async (postId: string) => {
      if (!currentUserId) {
        setComposerFeedback({
          type: "error",
          message: "Necesitas iniciar sesión para interactuar.",
        });
        return;
      }

      if (likePending[postId]) return;
      setLikePending((prev) => ({ ...prev, [postId]: true }));

      const isLiked = likedPosts[postId] ?? false;

      if (isLiked) {
        const { error } = await supabase
          .from("progress_update_likes")
          .delete()
          .eq("update_id", postId)
          .eq("user_id", currentUserId);

        if (!error && isMountedRef.current) {
          setLikedPosts((prev) => {
            const next = { ...prev };
            delete next[postId];
            return next;
          });
          setFeed((current) =>
            current.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes_count: Math.max(0, post.likes_count - 1),
                    liked_by_user: false,
                  }
                : post,
            ),
          );
        }
      } else {
        const { error } = await supabase
          .from("progress_update_likes")
          .insert({
            update_id: postId,
            user_id: currentUserId,
          });

        if (!error && isMountedRef.current) {
          setLikedPosts((prev) => ({ ...prev, [postId]: true }));
          setFeed((current) =>
            current.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    likes_count: post.likes_count + 1,
                    liked_by_user: true,
                  }
                : post,
            ),
          );
        }
      }

      if (isMountedRef.current) {
        setLikePending((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [currentUserId, likePending, likedPosts],
  );

  const loadCommentsForPost = useCallback(
    async (postId: string) => {
      if (loadingComments[postId]) return;
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));

      const { data, error } = await supabase
        .from("progress_update_comments")
        .select(
          "id, update_id, content, created_at, user_id, profiles(full_name, avatar_url)",
        )
        .eq("update_id", postId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && isMountedRef.current) {
        let normalized =
          data?.map((comment) => {
            const rawProfile =
              comment.profiles as
                | { full_name: string | null; avatar_url: string | null }
                | Array<{ full_name: string | null; avatar_url: string | null }>
                | null;
            const profile = Array.isArray(rawProfile)
              ? rawProfile[0] ?? null
              : rawProfile;
            return {
              id: comment.id as string,
              update_id: comment.update_id as string,
              content: comment.content as string,
              created_at: comment.created_at as string,
              user_id: comment.user_id as string,
              full_name: profile?.full_name ?? null,
              avatar_url: profile?.avatar_url ?? null,
              likes_count: 0,
              liked_by_user: false,
            } as ProgressComment;
          }) ?? [];

        if (normalized.length > 0) {
          const commentIds = normalized.map((comment) => comment.id);
          if (commentIds.length > 0) {
            const { data: likeRows, error: likesError } = await supabase
              .from("progress_update_comment_likes")
              .select("comment_id, user_id")
              .in("comment_id", commentIds);

            if (!likesError && likeRows) {
              const likeCountMap = new Map<string, number>();
              const likedByUserSet = new Set<string>();

              likeRows.forEach((row) => {
                const commentId = row.comment_id as string;
                likeCountMap.set(
                  commentId,
                  (likeCountMap.get(commentId) ?? 0) + 1,
                );
                if (
                  currentUserId &&
                  (row.user_id as string) === currentUserId
                ) {
                  likedByUserSet.add(commentId);
                }
              });

              normalized = normalized.map((comment) => ({
                ...comment,
                likes_count: likeCountMap.get(comment.id) ?? comment.likes_count,
                liked_by_user: currentUserId
                  ? likedByUserSet.has(comment.id)
                  : false,
              }));
            }
          }
        }

        setCommentsByPost((prev) => ({ ...prev, [postId]: normalized }));
      }

      if (isMountedRef.current) {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [loadingComments, currentUserId],
  );

  const handleSubmitComment = useCallback(
    async (postId: string) => {
      if (!currentUserId) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Necesitas iniciar sesión para comentar.",
          },
        }));
        return;
      }

      const draft = commentDrafts[postId]?.trim() ?? "";
      if (!draft) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Escribe un comentario antes de publicar.",
          },
        }));
        return;
      }

      setCommentFeedback((prev) => ({ ...prev, [postId]: null }));
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));

      const { data, error } = await supabase
        .from("progress_update_comments")
        .insert({
          update_id: postId,
          content: draft,
          user_id: currentUserId,
        })
        .select(
          "id, update_id, content, created_at, user_id, profiles(full_name, avatar_url)",
        )
        .single();

      if (error) {
        if (isMountedRef.current) {
          setCommentFeedback((prev) => ({
            ...prev,
            [postId]: {
              type: "error",
              message: "No se pudo publicar el comentario.",
            },
          }));
          setLoadingComments((prev) => ({ ...prev, [postId]: false }));
        }
        return;
      }

      if (!isMountedRef.current) return;

      const rawProfile =
        data.profiles as
          | { full_name: string | null; avatar_url: string | null }
          | Array<{ full_name: string | null; avatar_url: string | null }>
          | null;
      const profile = Array.isArray(rawProfile)
        ? rawProfile[0] ?? null
        : rawProfile;
      const normalized: ProgressComment = {
        id: data.id as string,
        update_id: data.update_id as string,
        content: data.content as string,
        created_at: data.created_at as string,
        user_id: data.user_id as string,
        full_name: profile?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        likes_count: 0,
        liked_by_user: false,
      };

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [normalized, ...(prev[postId] ?? [])],
      }));
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      setFeed((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, comments_count: post.comments_count + 1 }
            : post,
        ),
      );
      setCommentFeedback((prev) => ({
        ...prev,
        [postId]: {
          type: "success",
          message: "Comentario publicado.",
        },
      }));
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    },
    [commentDrafts, currentUserId],
  );

  const handleToggleCommentLike = useCallback(
    async (postId: string, commentId: string) => {
      if (!currentUserId) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Necesitas iniciar sesión para reaccionar.",
          },
        }));
        return;
      }

      if (commentLikePending[commentId]) return;

      const comment = commentsByPost[postId]?.find(
        (item) => item.id === commentId,
      );
      if (!comment) return;

      const alreadyLiked = comment.liked_by_user ?? false;
      setCommentLikePending((prev) => ({ ...prev, [commentId]: true }));

      if (alreadyLiked) {
        const { error } = await supabase
          .from("progress_update_comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", currentUserId);

        if (error) {
          setCommentFeedback((prev) => ({
            ...prev,
            [postId]: {
              type: "error",
              message: "No pudimos actualizar tu reacción.",
            },
          }));
        } else {
          setCommentsByPost((prev) => {
            const postComments = prev[postId] ?? [];
            const updated = postComments.map((item) =>
              item.id === commentId
                ? {
                    ...item,
                    likes_count: Math.max(0, item.likes_count - 1),
                    liked_by_user: false,
                  }
                : item,
            );
            return { ...prev, [postId]: updated };
          });
        }
      } else {
        const { error } = await supabase
          .from("progress_update_comment_likes")
          .insert({
            comment_id: commentId,
            user_id: currentUserId,
          });

        if (error) {
          setCommentFeedback((prev) => ({
            ...prev,
            [postId]: {
              type: "error",
              message: "No pudimos registrar tu reacción.",
            },
          }));
        } else {
          setCommentsByPost((prev) => {
            const postComments = prev[postId] ?? [];
            const updated = postComments.map((item) =>
              item.id === commentId
                ? {
                    ...item,
                    likes_count: item.likes_count + 1,
                    liked_by_user: true,
                  }
                : item,
            );
            return { ...prev, [postId]: updated };
          });
        }
      }

      setCommentLikePending((prev) => ({ ...prev, [commentId]: false }));
    },
    [commentLikePending, commentsByPost, currentUserId],
  );

  const handleStartEditComment = useCallback((commentId: string, content: string) => {
    setCommentEditing((prev) => ({ ...prev, [commentId]: true }));
    setCommentEditDrafts((prev) => ({ ...prev, [commentId]: content }));
  }, []);

  const handleCancelEditComment = useCallback((commentId: string) => {
    setCommentEditing((prev) => {
      if (!prev[commentId]) return prev;
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
    setCommentEditDrafts((prev) => {
      if (!(commentId in prev)) return prev;
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
    setCommentActionPending((prev) => {
      if (!prev[commentId]) return prev;
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  }, []);

  const handleUpdateComment = useCallback(
    async (postId: string, commentId: string) => {
      if (!currentUserId) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Necesitas iniciar sesión para editar tu comentario.",
          },
        }));
        return;
      }

      const draft = commentEditDrafts[commentId]?.trim() ?? "";
      if (!draft) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Tu comentario no puede quedar vacío.",
          },
        }));
        return;
      }

      setCommentActionPending((prev) => ({ ...prev, [commentId]: true }));

      const { error } = await supabase
        .from("progress_update_comments")
        .update({ content: draft })
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "No pudimos actualizar tu comentario.",
          },
        }));
      } else {
        setCommentsByPost((prev) => {
          const updated = (prev[postId] ?? []).map((comment) =>
            comment.id === commentId ? { ...comment, content: draft } : comment,
          );
          return { ...prev, [postId]: updated };
        });
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "success",
            message: "Comentario actualizado.",
          },
        }));
        setCommentEditing((prev) => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
        setCommentEditDrafts((prev) => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
      }

      setCommentActionPending((prev) => ({ ...prev, [commentId]: false }));
    },
    [commentEditDrafts, currentUserId],
  );

  const handleDeleteComment = useCallback(
    async (postId: string, commentId: string) => {
      if (!currentUserId) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "Necesitas iniciar sesión para gestionar tus comentarios.",
          },
        }));
        return;
      }

      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("¿Quieres eliminar este comentario?")
          : false;

      if (!confirmed) return;

      setCommentActionPending((prev) => ({ ...prev, [commentId]: true }));

      const { error } = await supabase
        .from("progress_update_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) {
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "error",
            message: "No pudimos eliminar tu comentario.",
          },
        }));
      } else {
        setCommentsByPost((prev) => {
          const filtered = (prev[postId] ?? []).filter(
            (comment) => comment.id !== commentId,
          );
          return { ...prev, [postId]: filtered };
        });
        setFeed((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments_count: Math.max(0, post.comments_count - 1),
                }
              : post,
          ),
        );
        setCommentFeedback((prev) => ({
          ...prev,
          [postId]: {
            type: "success",
            message: "Comentario eliminado.",
          },
        }));
      }

      setCommentActionPending((prev) => ({ ...prev, [commentId]: false }));
      setCommentEditing((prev) => {
        if (!prev[commentId]) return prev;
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
      setCommentEditDrafts((prev) => {
        if (!(commentId in prev)) return prev;
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    },
    [currentUserId, setFeed],
  );

  const handleRefreshFeed = useCallback(async () => {
    await fetchFeed("refresh");
    await refreshLikes();
  }, [fetchFeed, refreshLikes]);

  useEffect(() => {
    isMountedRef.current = true;

    const bootstrap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/social");
        return;
      }

      if (isMountedRef.current) {
        setCurrentUserId(user.id);
      }

      await fetchFeed("initial");
      await refreshLikes();
    };

    bootstrap();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchFeed, refreshLikes, router]);

  const moodStats = useMemo(() => {
    const total = feed.length;
    const byMood = moodOptions.reduce<Record<string, number>>((acc, option) => {
        acc[option.value] = 0;
        return acc;
      },
      {},
    );

    feed.forEach((post) => {
      if (post.mood && byMood[post.mood] !== undefined) {
        byMood[post.mood] += 1;
      }
    });

    const topMood =
      Object.entries(byMood).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      total,
      byMood,
      topMood,
    };
  }, [feed]);

  const moodRanking = useMemo(() => {
    return Object.entries(moodStats.byMood)
      .map(([key, value]) => ({
        key,
        label: getMoodMeta(key)?.label ?? key,
        emoji: getMoodMeta(key)?.emoji ?? "",
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [moodStats.byMood]);

  const suggestedUsers = useMemo(() => {
    const uniques = new Map<string, ProgressPost>();
    feed.forEach((post) => {
      if (!post.user_id || uniques.has(post.user_id)) return;
      uniques.set(post.user_id, post);
    });
    return Array.from(uniques.values()).slice(0, 5);
  }, [feed]);

  const profileInitials = useMemo(() => {
    if (loadingProfile) return "..";
    return getInitials(fullName);
  }, [fullName, loadingProfile]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <aside className="space-y-6">
            <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Navegación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <QuickLink icon={<Home className="h-4 w-4" />} label="Inicio" href="/protected" />
                <QuickLink
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Prácticas"
                  href="#"
                  disabled
                  helper="Muy pronto"
                />
                <QuickLink
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Comunidad"
                  active
                />
                <QuickLink
                  icon={<Users className="h-4 w-4" />}
                  label="Círculos en vivo"
                  href="#"
                  disabled
                />
                <QuickLink
                  icon={<Compass className="h-4 w-4" />}
                  label="Recursos"
                  href="#"
                  disabled
                />
                <QuickLink
                  icon={<Bookmark className="h-4 w-4" />}
                  label="Guardados"
                  href="#"
                  disabled
                />
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Estados recientes</CardTitle>
                <CardDescription>Cómo vibra el grupo hoy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {moodRanking.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.emoji} {item.label}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <section className="space-y-6">
            <header className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    Espacio comunitario
                  </Badge>
                  <div className="space-y-2 text-foreground">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Comparte tu proceso
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Celebra avances, pide apoyo y sostén la constancia junto a la comunidad.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 text-center sm:grid-cols-2 lg:text-right">
                  <StatCard
                    label="Historias activas"
                    value={moodStats.total}
                    helper="Entradas compartidas"
                  />
                  <StatCard
                    label="Estado más repetido"
                    value={
                      moodStats.topMood
                        ? getMoodMeta(moodStats.topMood)?.label ?? "Sin datos"
                        : "Sin datos"
                    }
                    helper={
                      moodStats.topMood
                        ? `${getMoodMeta(moodStats.topMood)?.emoji ?? ""} ${
                            getMoodMeta(moodStats.topMood)?.label ?? ""
                          }`
                        : "Esperando publicaciones"
                    }
                  />
                </div>
              </div>
            </header>

            <Card className="border border-border/80 bg-card/90 shadow-sm backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">Escribe tu actualización</CardTitle>
              <CardDescription>
                Una frase, un aprendizaje o aquello que quieras recordar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {profileInitials}
                </div>
                <div className="flex-1 space-y-4">
                  <Textarea
                    value={newUpdate}
                    onChange={(event) => setNewUpdate(event.target.value)}
                    placeholder="¿Qué integración, sensación o logro quieres compartir hoy?"
                    rows={4}
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <label htmlFor="social-mood" className="text-xs uppercase">
                        Estado
                      </label>
                      <select
                        id="social-mood"
                        value={mood}
                        onChange={(event) => setMood(event.target.value)}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        {moodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.emoji} {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      {composerFeedback ? (
                        <span
                          aria-live="polite"
                          className={`text-xs ${
                            composerFeedback.type === "success"
                              ? "text-emerald-600"
                              : "text-destructive"
                          }`}
                        >
                          {composerFeedback.message}
                        </span>
                      ) : null}
                      <Button
                        type="button"
                        onClick={handleCreateUpdate}
                        disabled={submittingUpdate || !newUpdate.trim()}
                        className="gap-2"
                      >
                        {submittingUpdate ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Publicando...
                          </>
                        ) : (
                          "Compartir"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Conversaciones recientes
              </h2>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={handleRefreshFeed}
                disabled={loadingFeed || refreshingFeed}
              >
                {refreshingFeed ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Actualizando
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refrescar
                  </>
                )}
              </Button>
            </div>

            {feedError ? (
              <p className="text-sm text-destructive">{feedError}</p>
            ) : null}

            <div className="space-y-4">
              {loadingFeed ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={`feed-skeleton-${index}`}
                    className="border-border/70 bg-card/80"
                  >
                    <CardContent className="space-y-3 p-5">
                      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))
              ) : feed.length === 0 ? (
                <Card className="border-dashed border-border/70 bg-card/80">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    Aún no hay publicaciones. Sé la primera en compartir tu proceso.
                  </CardContent>
                </Card>
              ) : (
              feed.map((post) => {
                  const moodMeta = getMoodMeta(post.mood);
                  const liked =
                    likedPosts[post.id] ?? post.liked_by_user ?? false;
                  return (
                    <Card
                      key={post.id}
                      className="border-border/70 bg-card/90 transition hover:border-primary/40 hover:shadow-lg"
                    >
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-primary/10">
                            {post.avatar_url ? (
                              <Image
                                src={post.avatar_url}
                                alt={post.full_name ?? "Integrante"}
                                width={44}
                                height={44}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                                {getInitials(post.full_name)}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {post.full_name ?? "Integrante"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(post.created_at)}
                            </span>
                          </div>
                          {moodMeta ? (
                            <Badge
                              variant="outline"
                              className="text-xs uppercase tracking-wide"
                            >
                              {moodMeta.emoji} {moodMeta.label}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                          {post.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`gap-1.5 border border-border/60 px-3 py-1 text-xs ${
                              liked ? "bg-primary/10 text-primary" : ""
                            }`}
                            disabled={likePending[post.id]}
                            onClick={() => handleToggleLike(post.id)}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${
                                liked ? "fill-current" : ""
                              }`}
                            />
                            {post.likes_count}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1.5 border border-border/60 px-3 py-1 text-xs"
                            onClick={async () => {
                              setOpenComments((prev) => ({
                                ...prev,
                                [post.id]: !prev[post.id],
                              }));
                              if (!openComments[post.id]) {
                                await loadCommentsForPost(post.id);
                              }
                            }}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {post.comments_count}
                          </Button>
                        </div>
                        {openComments[post.id] ? (
                          <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                            <div className="space-y-2">
                              <Textarea
                                value={commentDrafts[post.id] ?? ""}
                                onChange={(event) =>
                                  setCommentDrafts((prev) => ({
                                    ...prev,
                                    [post.id]: event.target.value,
                                  }))
                                }
                                placeholder="Escribe un comentario de apoyo..."
                                rows={3}
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  Comparte desde el respeto y la escucha.
                                </span>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => handleSubmitComment(post.id)}
                                  disabled={loadingComments[post.id]}
                                >
                                  {loadingComments[post.id] ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      Publicando...
                                    </>
                                  ) : (
                                    "Comentar"
                                  )}
                                </Button>
                              </div>
                              {commentFeedback[post.id] ? (
                                <p
                                  className={`text-xs ${
                                    commentFeedback[post.id]?.type === "success"
                                      ? "text-emerald-600"
                                      : "text-destructive"
                                  }`}
                                >
                                  {commentFeedback[post.id]?.message}
                                </p>
                              ) : null}
                            </div>

                            <div className="space-y-3">
                              {loadingComments[post.id] &&
                              !(commentsByPost[post.id]?.length ?? 0) ? (
                                <p className="text-xs text-muted-foreground">
                                  Cargando comentarios...
                                </p>
                              ) : commentsByPost[post.id]?.length ? (
                                commentsByPost[post.id]?.map((comment) => {
                                  const isOwner = comment.user_id === currentUserId;
                                  const isEditing = commentEditing[comment.id] ?? false;
                                  const editDraft =
                                    commentEditDrafts[comment.id] ?? comment.content;
                                  const likeLoading =
                                    commentLikePending[comment.id] ?? false;
                                  const actionPending =
                                    commentActionPending[comment.id] ?? false;

                                  return (
                                    <div
                                      key={comment.id}
                                      className="flex items-start gap-3 rounded-xl bg-card/80 p-3"
                                    >
                                      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
                                        {comment.avatar_url ? (
                                          <Image
                                            src={comment.avatar_url}
                                            alt={comment.full_name ?? "Integrante"}
                                            width={32}
                                            height={32}
                                            className="h-full w-full object-cover"
                                            unoptimized
                                          />
                                        ) : (
                                          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                                            {getInitials(comment.full_name)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs font-semibold text-foreground">
                                            {comment.full_name ?? "Integrante"}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">
                                            {formatRelativeTime(comment.created_at)}
                                          </span>
                                        </div>
                                        {isEditing ? (
                                          <Textarea
                                            rows={3}
                                            value={editDraft}
                                            onChange={(event) =>
                                              setCommentEditDrafts((prev) => ({
                                                ...prev,
                                                [comment.id]: event.target.value,
                                              }))
                                            }
                                            className="text-xs"
                                          />
                                        ) : (
                                          <p className="text-xs text-muted-foreground">
                                            {comment.content}
                                          </p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-muted-foreground">
                                          <button
                                            type="button"
                                            className={`flex items-center gap-1 rounded-md border border-border/60 px-2 py-1 transition ${
                                              comment.liked_by_user
                                                ? "bg-primary/10 text-primary"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleToggleCommentLike(
                                                post.id,
                                                comment.id,
                                              )
                                            }
                                            disabled={likeLoading}
                                          >
                                            {likeLoading ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              <Heart
                                                className={`h-3 w-3 ${
                                                  comment.liked_by_user
                                                    ? "fill-current"
                                                    : ""
                                                }`}
                                              />
                                            )}
                                            {comment.likes_count}
                                          </button>
                                          {isOwner ? (
                                            isEditing ? (
                                              <>
                                                <Button
                                                  type="button"
                                                  size="sm"
                                                  className="h-7 px-3 text-xs"
                                                  onClick={() =>
                                                    handleUpdateComment(
                                                      post.id,
                                                      comment.id,
                                                    )
                                                  }
                                                  disabled={actionPending}
                                                >
                                                  {actionPending ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                  ) : (
                                                    "Guardar"
                                                  )}
                                                </Button>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-7 px-3 text-xs"
                                                  onClick={() =>
                                                    handleCancelEditComment(
                                                      comment.id,
                                                    )
                                                  }
                                                  disabled={actionPending}
                                                >
                                                  Cancelar
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                <button
                                                  type="button"
                                                  className="flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-muted"
                                                  onClick={() =>
                                                    handleStartEditComment(
                                                      comment.id,
                                                      comment.content,
                                                    )
                                                  }
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                  Editar
                                                </button>
                                                <button
                                                  type="button"
                                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-destructive transition hover:bg-destructive/10"
                                                  onClick={() =>
                                                    handleDeleteComment(
                                                      post.id,
                                                      comment.id,
                                                    )
                                                  }
                                                  disabled={actionPending}
                                                >
                                                  {actionPending ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                  ) : (
                                                    <Trash2 className="h-3 w-3" />
                                                  )}
                                                  Eliminar
                                                </button>
                                              </>
                                            )
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  Aún no hay comentarios. Deja el primero.
                                </p>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sugerencias</CardTitle>
                <CardDescription>
                  Perfiles que compartieron recientemente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Publica para inspirar a otras integrantes.
                  </p>
                ) : (
                  suggestedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3 py-2"
                    >
                      <div className="relative h-9 w-9 overflow-hidden rounded-full bg-primary/10">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.full_name ?? "Integrante"}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                            {getInitials(user.full_name)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {user.full_name ?? "Integrante"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getMoodMeta(user.mood ?? null)?.label ?? "Compartió hace poco"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Próximos hitos</CardTitle>
                <CardDescription>
                  Mantén a la comunidad al tanto de tus avances.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Publica una actualización diaria para crear memoria de tu proceso.
                </p>
                <p>
                  • Invita a tu círculo a reaccionar con palabras de aliento.
                </p>
                <p>
                  • Guarda las entradas importantes para retomarlas en tus sesiones.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-left shadow-sm lg:text-right">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function getMoodMeta(value: string | null) {
  if (!value) return null;
  return moodOptions.find((option) => option.value === value) ?? null;
}

function getInitials(value: string | null | undefined) {
  if (!value) return "??";
  const parts = value
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (parts.length === 0) return "??";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  const initials = `${first}${last}`.trim().toUpperCase();
  return initials || "??";
}

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Hace un momento";

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.max(1, Math.round(diffMs / 1000));

  if (diffSeconds < 60) return `Hace ${diffSeconds} s`;

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} d`;

  return date.toLocaleDateString();
}

function QuickLink({
  icon,
  label,
  href,
  helper,
  active = false,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
  helper?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const content = (
    <span
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "bg-primary/10 font-semibold text-primary"
          : "text-foreground hover:bg-primary/5"
      } ${disabled ? "cursor-not-allowed text-muted-foreground opacity-75" : ""}`}
    >
      <span className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          {icon}
        </span>
        {label}
      </span>
      {helper ? <span className="text-xs text-muted-foreground">{helper}</span> : null}
    </span>
  );

  if (href && !disabled) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}
