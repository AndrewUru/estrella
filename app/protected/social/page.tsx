"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Loader2,
  MessageSquare,
  PenSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Badge } from "@/components/ui/badge";
import { Composer } from "@/components/social/Composer";
import { Feed } from "@/components/social/Feed";
import { MoodStats } from "@/components/social/MoodStats";
import { SidebarLeft } from "@/components/social/SidebarLeft";
import { SidebarRight } from "@/components/social/SidebarRight";

const quickHighlights = [
  {
    title: "Escribe algo breve",
    description: "Comparte un avance, una pregunta o una sensacion del dia.",
    icon: PenSquare,
  },
  {
    title: "Explora el feed",
    description: "Mira como va la comunidad y responde cuando algo resuene.",
    icon: Compass,
  },
  {
    title: "Sostengan el impulso",
    description: "Pequenas interacciones frecuentes crean mas constancia.",
    icon: Users,
  },
];

const communitySignals = [
  {
    label: "Ritmo recomendado",
    value: "1 nota al dia",
  },
  {
    label: "Mejor momento",
    value: "Despues de practicar",
  },
  {
    label: "Intencion",
    value: "Compartir y acompanarse",
  },
];

export default function SocialPage() {
  const router = useRouter();
  const { fullName, loading: loadingProfile } = useUserProfile();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login?returnTo=/protected/social");
        return;
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  const initials = useMemo(() => getInitials(fullName), [fullName]);
  const firstName = useMemo(() => getFirstName(fullName), [fullName]);

  if (!authChecked || loadingProfile) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex max-w-sm flex-col items-center gap-3 text-center text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <p className="text-sm sm:text-base">
              Preparando tu espacio comunitario...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-slate-50 pb-16 dark:bg-gray-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.2),_transparent_55%)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-28 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute left-[-10rem] top-80 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr),320px] lg:items-stretch">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 lg:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-orange-200/40 via-rose-200/30 to-transparent blur-2xl dark:from-orange-500/10 dark:via-rose-500/10" />

            <div className="relative space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="gap-2 border-0 bg-orange-500/10 px-3 py-1 text-orange-700 hover:bg-orange-500/10 dark:text-orange-200">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Comunidad activa
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Un lugar para compartir proceso, apoyo y momentum.
                </p>
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                  Comparte lo que estas integrando y encuentra eco en la comunidad.
                </h1>
                <p className="text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                  {firstName}, esta pagina funciona mejor cuando entrar, escribir y leer se siente
                  facil. Dejamos todo mas claro para que puedas publicar rapido, descubrir nuevas
                  historias y volver a tu proceso sin friccion.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#composer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-orange-600 hover:to-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  Escribir una nota
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#feed"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-orange-300 hover:text-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-orange-400 dark:hover:text-orange-200"
                >
                  Ver conversaciones
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  href="/protected"
                  className="inline-flex items-center gap-2 rounded-full px-2 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Volver al panel
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {quickHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-2xl bg-orange-500/10 p-2 text-orange-600 dark:text-orange-200">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="overflow-hidden rounded-[2rem] border border-orange-300/40 bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 p-6 text-white shadow-lg">
            <div className="flex h-full flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-content-center rounded-2xl border border-white/30 bg-white/10 text-xl font-semibold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                    Tu presencia
                  </p>
                  <p className="truncate text-xl font-semibold">
                    {fullName || "Comunidad Estrella"}
                  </p>
                  <p className="text-sm text-white/80">
                    Cuando compartes, ayudas a sostener el ritmo colectivo.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {communitySignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{signal.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/20 bg-black/10 p-4 text-sm text-white/85">
                Empieza con algo pequeno: una sensacion, un descubrimiento o una pregunta honesta
                ya es suficiente para abrir conversacion.
              </div>
            </div>
          </aside>
        </header>

        <section className="grid gap-4 rounded-[2rem] border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Como aprovechar este espacio
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Publica rapido, lee con calma y usa los laterales para orientarte.
            </p>
          </div>
          <QuickTip label="1. Publica" text="Una nota corta suele funcionar mejor que esperar el momento perfecto." />
          <QuickTip label="2. Revisa el tono" text="El selector emocional ayuda a que otras personas entiendan tu contexto." />
          <QuickTip label="3. Participa" text="Responder o volver mas tarde mantiene el espacio vivo." />
        </section>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px] lg:items-start">
          <aside className="order-2 space-y-6 lg:order-1 lg:sticky lg:top-24">
            <SidebarLeft />
            <MoodStats />
          </aside>

          <section className="order-1 space-y-6 lg:order-2">
            <div
              id="composer"
              className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Tu siguiente paso
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Comparte algo antes de seguir navegando
                  </h2>
                </div>
                <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
                  La experiencia mejora mucho cuando la accion principal esta clara: escribir primero,
                  explorar despues.
                </p>
              </div>
              <Composer />
            </div>

            <div
              id="feed"
              className="rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Historias recientes
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    Explora lo que esta pasando ahora
                  </h2>
                </div>
                <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
                  El feed queda mas visible y mejor separado para que leer, actualizar y volver al
                  compositor resulte natural.
                </p>
              </div>
              <Feed />
            </div>
          </section>

          <aside className="order-3 space-y-6 lg:sticky lg:top-24">
            <SidebarRight />
          </aside>
        </div>
      </div>
    </main>
  );
}

function QuickTip({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function getInitials(value: string | null | undefined) {
  if (!value) return "??";

  const parts = value.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";

  return (first + last).toUpperCase();
}

function getFirstName(value: string | null | undefined) {
  if (!value) return "Estrella";

  return value.split(/\s+/).filter(Boolean)[0] ?? "Estrella";
}
