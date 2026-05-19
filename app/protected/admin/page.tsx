"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  LogOut,
  MessageCircle,
  Music3,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";

type Shortcut = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  helper: string;
};

const adminShortcuts: Shortcut[] = [
  {
    href: "/protected/admin/usuarios",
    icon: Users,
    title: "Ver y ayudar a usuarias",
    description: "Revisa perfiles, accesos y roles de las integrantes.",
    cta: "Abrir usuarias",
    helper: "Para resolver accesos o revisar permisos.",
  },
  {
    href: "/protected/admin/contenido",
    icon: BookOpenCheck,
    title: "Actualizar curso",
    description: "Ordena modulos, recursos y materiales del programa.",
    cta: "Editar curso",
    helper: "Para cambios en textos, recursos o estructura.",
  },
  {
    href: "/protected/admin/practicas",
    icon: Music3,
    title: "Revisar audios y ejercicios",
    description: "Comprueba practicas publicadas y su visibilidad.",
    cta: "Ver practicas",
    helper: "Para confirmar que todo esta disponible.",
  },
  {
    href: "/protected/admin/practicas#nueva",
    icon: PlusCircle,
    title: "Subir nueva practica",
    description: "Publica nuevos ejercicios guiados para la comunidad.",
    cta: "Subir practica",
    helper: "Para agregar un audio, PDF o ejercicio nuevo.",
  },
];

const tips = [
  "Empieza por comentarios recientes: es donde la comunidad suele necesitar respuesta mas rapido.",
  "Antes de anunciar una practica, confirma que este visible y con sus recursos correctos.",
  "Cuando hagas cambios importantes, anota que modificaste para recordarlo despues.",
];

type ModerationComment = {
  id: string;
  content: string;
  created_at: string;
  update_id: string;
  user_id: string;
  author_name: string | null;
  update_excerpt: string | null;
  update_owner: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function validarAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      setUserName(profile.full_name || "Admin");
      setAuthorized(true);
      await fetchLatestComments();
      setLoading(false);
    }

    validarAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const fetchLatestComments = async () => {
    setCommentsLoading(true);
    setCommentsError(null);

    const { data, error } = await supabase
      .from("progress_update_comments")
      .select(
        "id, content, created_at, user_id, update_id, profiles(full_name)"
      )
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) {
      setCommentsError("No pudimos cargar los comentarios recientes.");
      setComments([]);
      setCommentsLoading(false);
      return;
    }

    let normalized: ModerationComment[] =
      data?.map((row) => {
        const profileRelation = row.profiles as
          | { full_name: string | null }
          | { full_name: string | null }[]
          | null;
        const profile = Array.isArray(profileRelation)
          ? profileRelation[0]
          : profileRelation;

        return {
          id: row.id as string,
          content: row.content as string,
          created_at: row.created_at as string,
          update_id: row.update_id as string,
          user_id: row.user_id as string,
          author_name: profile?.full_name ?? null,
          update_excerpt: null,
          update_owner: null,
        };
      }) ?? [];

    const updateIds = Array.from(
      new Set(normalized.map((comment) => comment.update_id))
    ).filter(Boolean);

    if (updateIds.length > 0) {
      const { data: relatedUpdates } = await supabase
        .from("progress_updates")
        .select("id, content, user_id")
        .in("id", updateIds);

      if (relatedUpdates) {
        const map = new Map(
          relatedUpdates.map((u) => [
            u.id as string,
            {
              content: u.content as string | null,
              owner: u.user_id as string | null,
            },
          ])
        );

        normalized = normalized.map((comment) => {
          const info = map.get(comment.update_id);
          if (!info) return comment;
          return {
            ...comment,
            update_excerpt: info.content ?? null,
            update_owner: info.owner ?? null,
          };
        });
      }
    }

    setComments(normalized);
    setCommentsLoading(false);
  };

  const handleDeleteComment = async (id: string) => {
    setDeletingId(id);

    const { error } = await supabase.rpc("admin_delete_comment", {
      comment_id: id,
    });

    if (error) {
      console.error("DELETE error:", error);
      setCommentsError("No se pudo eliminar el comentario.");
    } else {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setConfirmDeleteId(null);
    }

    setDeletingId(null);
  };

  const commentsSummary = useMemo(() => {
    const total = comments.length;
    const last24h = comments.filter((comment) => {
      const created = new Date(comment.created_at);
      return Date.now() - created.getTime() <= 24 * 60 * 60 * 1000;
    }).length;
    return { total, last24h };
  }, [comments]);

  const todayTasks = useMemo(
    () => [
      {
        label: "Comentarios recientes",
        value:
          commentsSummary.last24h > 0
            ? `${commentsSummary.last24h} en 24h`
            : "Sin nuevos",
        status: commentsSummary.last24h > 0 ? "Revisar" : "Todo bien",
        icon: MessageCircle,
        tone:
          commentsSummary.last24h > 0
            ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200"
            : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950/30 dark:text-emerald-200",
      },
      {
        label: "Curso y practicas",
        value: "Contenido activo",
        status: "Revisar antes de publicar",
        icon: BookOpenCheck,
        tone:
          "border-[#d8c6ff]/70 bg-white/70 text-[#516fae] dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f3d795]",
      },
      {
        label: "Accesos de usuarias",
        value: "Gestion manual",
        status: "Ver si hay incidencias",
        icon: Users,
        tone:
          "border-[#d8c6ff]/70 bg-white/70 text-[#516fae] dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f3d795]",
      },
    ],
    [commentsSummary.last24h]
  );

  const formatRelativeTime = (input: string) => {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return "Sin registro";
    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `Hace ${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `Hace ${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `Hace ${hr}h`;
    const day = Math.floor(hr / 24);
    if (day < 7) return `Hace ${day}d`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf2] text-[#516fae] dark:bg-gray-950 dark:text-[#f3d795]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#d8c6ff]/60 bg-white/70 px-5 py-4 shadow-sm backdrop-blur dark:border-[#f3c76b]/20 dark:bg-white/5">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando panel de administracion...
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf2] text-[#27304f] transition-colors duration-700 dark:bg-gray-950 dark:text-[#fff6dd]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(216,198,255,0.34),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.15),transparent_28%)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(141,115,183,0.16),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.08),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="overflow-hidden rounded-[1.5rem] border border-[#d8c6ff]/60 bg-white/72 shadow-[0_24px_80px_rgba(50,70,116,0.12)] backdrop-blur-xl dark:border-[#f3c76b]/20 dark:bg-white/5 dark:shadow-[0_28px_90px_rgba(0,0,0,0.36)]">
          <div className="flex flex-col gap-7 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5">
              <Badge className="w-fit border border-[#d8c6ff]/70 bg-white/80 text-[#6f5aa8] dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f3d795]">
                Panel de cuidado
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Hola, {userName}. Esto necesita tu atencion.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[#5f6680] dark:text-[#c9c0df]">
                  Una vista simple para revisar comunidad, actualizar practicas
                  y resolver accesos sin perderte entre opciones tecnicas.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Link
                href="/protected/admin/practicas#nueva"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98] dark:bg-[#f0c86b] dark:text-[#15101f] dark:hover:bg-[#ffe09a]"
              >
                <PlusCircle className="h-4 w-4" />
                Subir practica
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 rounded-full border-[#d8c6ff]/70 bg-white/60 text-[#535b78] hover:bg-white dark:border-[#f3c76b]/20 dark:bg-white/5 dark:text-[#eee7ff] dark:hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {todayTasks.map(({ label, value, status, icon: Icon, tone }) => (
            <Card
              key={label}
              className="border-[#d8c6ff]/55 bg-white/72 shadow-[0_18px_50px_rgba(50,70,116,0.08)] backdrop-blur-xl dark:border-[#f3c76b]/18 dark:bg-white/5"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#27304f] dark:text-[#fff6dd]">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs font-medium text-[#777088] dark:text-[#b6accf]">
                    {status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Acciones principales</h2>
                <p className="mt-1 text-sm text-[#777088] dark:text-[#b6accf]">
                  Los lugares que mas vas a usar, con nombres claros.
                </p>
              </div>
              <Sparkles className="hidden h-5 w-5 text-[#c89a3c] sm:block" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {adminShortcuts.map(
                ({ href, icon: Icon, title, description, cta, helper }) => (
                  <Link key={href} href={href} className="group h-full">
                    <Card className="flex h-full flex-col justify-between border-[#d8c6ff]/55 bg-white/74 shadow-[0_18px_50px_rgba(50,70,116,0.08)] backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-1 group-hover:border-[#516fae]/45 group-hover:shadow-[0_24px_70px_rgba(81,111,174,0.14)] dark:border-[#f3c76b]/18 dark:bg-white/5 dark:group-hover:border-[#f3c76b]/35">
                      <CardHeader className="space-y-4 pb-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] transition-all group-hover:bg-[#516fae] group-hover:text-white dark:border-[#f3c76b]/20 dark:bg-white/5 dark:text-[#f3d795]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-[#27304f] dark:text-[#fff6dd]">
                            {title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-[#5f6680] dark:text-[#c9c0df]">
                            {description}
                          </CardDescription>
                          <p className="text-xs font-medium text-[#8d73b7] dark:text-[#f3d795]">
                            {helper}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#516fae] transition dark:text-[#f3d795]">
                          {cta}
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              )}
            </div>
          </div>

          <Card className="border-dashed border-[#d8c6ff]/70 bg-white/54 backdrop-blur-xl dark:border-[#f3c76b]/20 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-[#27304f] dark:text-[#fff6dd]">
                <CheckCircle2 className="h-5 w-5 text-[#c89a3c]" />
                Que hacer hoy
              </CardTitle>
              <CardDescription className="text-[#5f6680] dark:text-[#c9c0df]">
                Una rutina breve para revisar el panel sin agobio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-[#5f6680] dark:text-[#c9c0df]">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#516fae]/10 text-[#516fae] dark:bg-[#f0c86b]/10 dark:text-[#f3d795]">
                    <Clock3 className="h-3 w-3" />
                  </span>
                  <p>{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ShieldAlert className="h-5 w-5 text-[#c89a3c]" />
                Comentarios recientes
              </h2>
              <p className="mt-1 text-sm text-[#777088] dark:text-[#b6accf]">
                Revisa conversaciones de la comunidad. Eliminar pide
                confirmacion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#777088] dark:text-[#b6accf]">
              <span>
                Total:{" "}
                <strong className="text-[#27304f] dark:text-[#fff6dd]">
                  {commentsSummary.total}
                </strong>
              </span>
              <span>
                Ultimas 24h:{" "}
                <strong className="text-[#27304f] dark:text-[#fff6dd]">
                  {commentsSummary.last24h}
                </strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 rounded-full border-[#d8c6ff]/70 bg-white/60 dark:border-[#f3c76b]/20 dark:bg-white/5"
                onClick={fetchLatestComments}
                disabled={commentsLoading}
              >
                {commentsLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refrescar
                  </>
                )}
              </Button>
            </div>
          </div>

          {commentsError && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-200">
              {commentsError}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {commentsLoading && comments.length === 0 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="border-[#d8c6ff]/55 bg-white/70 dark:border-[#f3c76b]/18 dark:bg-white/5"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : comments.length === 0 ? (
              <Card className="border-dashed border-[#d8c6ff]/70 bg-white/70 md:col-span-2 dark:border-[#f3c76b]/20 dark:bg-white/5">
                <CardContent className="p-8 text-center text-sm text-[#777088] dark:text-[#b6accf]">
                  No hay comentarios recientes para moderar.
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border-[#d8c6ff]/55 bg-white/76 shadow-sm backdrop-blur-xl transition hover:border-[#516fae]/45 dark:border-[#f3c76b]/18 dark:bg-white/5 dark:hover:border-[#f3c76b]/35"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle className="text-base text-[#27304f] dark:text-[#fff6dd]">
                          {comment.author_name ?? "Integrante anonima"}
                        </CardTitle>
                        <CardDescription className="text-[#777088] dark:text-[#b6accf]">
                          {formatRelativeTime(comment.created_at)}
                        </CardDescription>
                      </div>

                      {confirmDeleteId === comment.id ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="gap-2 rounded-full"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deletingId === comment.id}
                          >
                            {deletingId === comment.id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Eliminando...
                              </>
                            ) : (
                              "Confirmar"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === comment.id}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-fit rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-950/30"
                          onClick={() => setConfirmDeleteId(comment.id)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-[#5f6680] dark:text-[#c9c0df]">
                    <p className="rounded-2xl border border-[#d8c6ff]/55 bg-[#fffaf2]/70 p-3 text-[#27304f] dark:border-[#f3c76b]/18 dark:bg-gray-950/50 dark:text-[#fff6dd]">
                      {comment.content}
                    </p>
                    <div className="rounded-2xl border border-[#d8c6ff]/45 bg-white/54 p-3 text-xs dark:border-[#f3c76b]/14 dark:bg-gray-950/35">
                      <p className="font-semibold text-[#777088] dark:text-[#b6accf]">
                        Comentario en:
                      </p>
                      <p className="mt-1 text-[#27304f]/90 dark:text-[#fff6dd]/90">
                        {comment.update_excerpt
                          ? `"${comment.update_excerpt.slice(0, 140)}${
                              comment.update_excerpt.length > 140 ? "..." : ""
                            }"`
                          : "Publicacion sin contenido disponible"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
