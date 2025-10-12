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
  LogOut,
  Music3,
  PlusCircle,
  Users,
  Loader2,
} from "lucide-react";

type Shortcut = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
};

const adminShortcuts: Shortcut[] = [
  {
    href: "/protected/admin/usuarios",
    icon: Users,
    title: "Gestionar usuarias",
    description:
      "Administra perfiles, roles y el acceso seguro de la comunidad.",
    cta: "Abrir gestion",
  },
  {
    href: "/protected/admin/contenido",
    icon: BookOpenCheck,
    title: "Editar contenido del curso",
    description:
      "Actualiza modulos, recursos multimedia y organiza el temario.",
    cta: "Actualizar contenido",
  },
  {
    href: "/protected/admin/practicas",
    icon: Music3,
    title: "Ver practicas",
    description:
      "Consulta el estado de cada practica y controla su visibilidad.",
    cta: "Revisar practicas",
  },
  {
    href: "/protected/admin/practicas#nueva",
    icon: PlusCircle,
    title: "Crear nueva practica",
    description: "Publica ejercicios guiados para acompanar a las integrantes.",
    cta: "Crear practica",
  },
];

const tips = [
  "Revisa primero las usuarias con accesos pendientes y resuelve incidencias de inicio de sesion.",
  "Contrasta el contenido publicado con las sesiones en vivo y las actualizaciones del programa.",
  "Documenta cada cambio para mantener un historial claro de la evolucion de la plataforma.",
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

  // 🔐 Validar admin al cargar
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

  // 🗂 Cargar últimos comentarios
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

    // 📎 Buscar publicaciones relacionadas
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

  // 🧹 Borrar comentario con RPC (seguro para RLS)
  const handleDeleteComment = async (id: string) => {
    setDeletingId(id);

    const { error } = await supabase.rpc("admin_delete_comment", {
      comment_id: id,
    });

    if (error) {
      console.error("DELETE error:", error);
      setCommentsError("No se pudo eliminar el comentario (RLS/permiso).");
    } else {
      setComments((prev) => prev.filter((c) => c.id !== id));
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
      <div className="flex min-h-screen items-center justify-center bg-background text-primary">
        Cargando panel de administracion...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* 🔹 Header */}
        <header className="rounded-3xl border border-border/80 bg-card/80 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5">
              <Badge variant="secondary" className="w-fit">
                Panel administrativo
              </Badge>
              <div className="space-y-3 text-foreground">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Bienvenida, {userName}
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Administra la experiencia de la comunidad y guia cada proceso
                  con claridad y orden.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 self-start text-foreground sm:self-end"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>
          </div>
        </header>

        {/* 🔹 Atajos */}
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">
              Accesos rapidos
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {adminShortcuts.map(
                ({ href, icon: Icon, title, description, cta }) => (
                  <Link key={href} href={href} className="group h-full">
                    <Card className="flex h-full flex-col justify-between border-border/70 bg-card/90 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg">
                      <CardHeader className="space-y-4 pb-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-foreground">
                            {title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-foreground">
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

          <Card className="border-dashed border-border/70 bg-muted/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Recomendaciones rapidas
              </CardTitle>
              <CardDescription>
                Organiza tu jornada con claridad y ritmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted-foreground">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary/70" />
                  <p>{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* 🔹 Moderación */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Moderacion de comentarios
              </h2>
              <p className="text-sm text-muted-foreground">
                Revisa y elimina mensajes reportados por la comunidad.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Total:{" "}
                <strong className="text-foreground">
                  {commentsSummary.total}
                </strong>
              </span>
              <span>
                Ultimas 24h:{" "}
                <strong className="text-foreground">
                  {commentsSummary.last24h}
                </strong>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={fetchLatestComments}
                disabled={commentsLoading}
              >
                {commentsLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Refrescar"
                )}
              </Button>
            </div>
          </div>

          {commentsError && (
            <p className="text-sm text-destructive">{commentsError}</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {commentsLoading && comments.length === 0 ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="border-border/60 bg-card/80"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : comments.length === 0 ? (
              <Card className="border-dashed border-border/70 bg-card/80 md:col-span-2">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No hay comentarios recientes para moderar.
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border-border/70 bg-card/90 transition hover:border-primary/40"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base text-foreground">
                          {comment.author_name ?? "Integrante anonima"}
                        </CardTitle>
                        <CardDescription>
                          {formatRelativeTime(comment.created_at)}
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingId === comment.id}
                      >
                        {deletingId === comment.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          "Eliminar"
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p className="rounded-2xl border border-border/60 bg-background/60 p-3 text-foreground">
                      {comment.content}
                    </p>
                    <div className="rounded-2xl border border-border/50 bg-background/40 p-3 text-xs">
                      <p className="font-semibold text-muted-foreground">
                        Comentario en:
                      </p>
                      <p className="mt-1 text-foreground/90">
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
