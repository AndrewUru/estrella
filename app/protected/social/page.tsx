"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Compass,
  Home,
  Loader2,
  MessageSquare,
  PenSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Composer } from "@/components/social/Composer";
import { Feed } from "@/components/social/Feed";
import { MoodStats } from "@/components/social/MoodStats";
import { OnlinePresence } from "@/components/social/OnlinePresence";
import { SidebarRight } from "@/components/social/SidebarRight";

const panelLinks = [
  { href: "/protected", label: "Panel", icon: Home },
  { href: "#composer", label: "Publicar", icon: PenSquare },
  { href: "#feed", label: "Feed", icon: MessageSquare },
  { href: "#community", label: "Comunidad", icon: Users },
];

const communitySignals = [
  {
    label: "Ritmo",
    value: "1 nota al dia",
    icon: Sparkles,
  },
  {
    label: "Momento",
    value: "Despues de practicar",
    icon: Compass,
  },
  {
    label: "Intencion",
    value: "Acompanarse",
    icon: Bell,
  },
];

export default function SocialPage() {
  const router = useRouter();
  const { fullName, loading: loadingProfile } = useUserProfile();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string | null;
    avatarUrl: string | null;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/auth/login?returnTo=/protected/social");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.user.id)
        .single();

      setCurrentUser({
        id: data.user.id,
        email: data.user.email ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      });
      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  const initials = useMemo(() => getInitials(fullName), [fullName]);
  const firstName = useMemo(() => getFirstName(fullName), [fullName]);

  if (!authChecked || loadingProfile) {
    return (
      <main className="min-h-screen bg-[#fffaf2] dark:bg-gray-950">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex max-w-sm flex-col items-center gap-3 text-center text-[#5f6680] dark:text-zinc-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#516fae]" aria-hidden="true" />
            <p className="text-sm sm:text-base">Preparando tu panel comunitario...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#fffaf2] text-[#27304f] dark:bg-gray-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(216,198,255,0.38),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,250,242,0.7))] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(126,87,194,0.22),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.1),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)_300px] lg:px-6">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="flex h-full flex-col rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_24px_70px_rgba(81,111,174,0.12)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <Link href="/" className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-[#d8c6ff]/70 dark:bg-purple-950/70 dark:ring-purple-800/70">
                <span className="absolute inset-0 rounded-full bg-[#c89a3c]/20 blur-md" />
                <Image
                  src="/logo-estrella.png"
                  alt="Estrella del Alba"
                  width={36}
                  height={36}
                  priority
                  className="relative rounded-full"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f5aa8] dark:text-purple-300/80">
                  Estrella
                </span>
                <span className="-mt-0.5 bg-gradient-to-r from-[#516fae] via-[#8d73b7] to-[#c89a3c] bg-clip-text text-sm font-bold text-transparent">
                  Comunidad
                </span>
              </span>
            </Link>

            <div className="mt-6 rounded-2xl border border-white/75 bg-white/60 p-4 dark:border-purple-900/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#516fae] to-[#8d73b7] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(81,111,174,0.24)]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d73b7] dark:text-purple-300">
                    Tu espacio
                  </p>
                  <p className="truncate text-sm font-semibold text-[#27304f] dark:text-zinc-100">
                    {fullName || "Comunidad Estrella"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-6 grid gap-2">
              {panelLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#535b78] transition hover:bg-white/70 hover:text-[#516fae] dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-purple-200"
                  >
                    <Icon className="h-4 w-4 text-[#8d73b7] transition group-hover:text-[#c89a3c]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden rounded-2xl border border-[#d8c6ff]/65 bg-[#fffaf2]/70 p-4 text-sm leading-6 text-[#5f6680] dark:border-purple-900/55 dark:bg-white/5 dark:text-zinc-400 lg:block">
              Comparte algo pequeno, responde con calma y vuelve a tu practica cuando lo sientas.
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-5 pb-6">
          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
                    Panel social
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/50 bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                    En vivo
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-[#27304f] dark:text-white sm:text-3xl">
                  Hola, {firstName}. Comparte y acompana desde aqui.
                </h1>
              </div>
              <Link
                href="/protected"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#516fae] transition hover:bg-white dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
            </div>
          </div>

          {currentUser ? (
            <div className="lg:hidden">
              <OnlinePresence
                currentUser={{
                  ...currentUser,
                  fullName,
                }}
              />
            </div>
          ) : null}

          <div
            id="composer"
            className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-4 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5"
          >
            <Composer />
          </div>

          <div
            id="feed"
            className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-4 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5"
          >
            <Feed />
          </div>
        </section>

        <aside id="community" className="space-y-5 pb-6 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
              Senales
            </p>
            <div className="mt-4 grid gap-3">
              {communitySignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-white/75 bg-white/60 p-4 dark:border-purple-900/50 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8d73b7] dark:text-purple-300">
                      <Icon className="h-4 w-4 text-[#c89a3c]" />
                      {signal.label}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#27304f] dark:text-zinc-100">
                      {signal.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <MoodStats />
          {currentUser ? (
            <OnlinePresence
              currentUser={{
                ...currentUser,
                fullName,
              }}
            />
          ) : null}
          <SidebarRight />
        </aside>
      </div>
    </main>
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
