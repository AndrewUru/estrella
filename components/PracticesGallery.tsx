"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  AlertCircle,
  Crown,
  FileText,
  Gem,
  Headphones,
  Library,
  Loader2,
  Lock,
  Music,
  Search,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";

interface Practice {
  id: string;
  title: string;
  kind: "meditation" | "channeling";
  description: string | null;
  cover_url: string | null;
  audio_url: string | null;
  pdf_url?: string | null;
  visibility: "public" | "private" | "unlisted";
  duration_minutes: number | null;
  plan: "free" | "premium" | null;
  created_by?: string | null;
}

type UserPlan = "free" | "gratis" | "premium" | "membresia";
type KindFilter = "all" | "meditation" | "channeling";

const kindFilters: Array<{
  value: KindFilter;
  label: string;
  icon: typeof Library;
}> = [
  { value: "all", label: "Todo", icon: Library },
  { value: "meditation", label: "Meditaciones", icon: Headphones },
  { value: "channeling", label: "Canalizaciones", icon: Sparkles },
];

export default function PracticesGallery() {
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlan>("free");

  useEffect(() => {
    let ignore = false;

    async function fetchUserAndPlan() {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const uid = auth.user?.id ?? null;
        if (!ignore) setUserId(uid);

        if (!uid) {
          if (!ignore) setUserPlan("free");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", uid)
          .single();

        if (!ignore && profile?.plan) {
          setUserPlan(normalizePlan(profile.plan));
        }
      } finally {
        if (!ignore) setLoadingProfile(false);
      }
    }

    fetchUserAndPlan();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchPractices() {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id ?? null;

      let query = supabase
        .from("practices")
        .select(
          "id, title, kind, description, cover_url, audio_url, pdf_url, visibility, duration_minutes, plan, created_by"
        )
        .order("created_at", { ascending: false });

      if (uid) {
        query = query.or(`visibility.eq.public,created_by.eq.${uid}`);
      } else {
        query = query.eq("visibility", "public");
      }

      const { data, error } = await query;
      if (!error && data && !ignore) {
        setItems(data as Practice[]);
      }
      if (!ignore) setLoadingItems(false);
    }

    fetchPractices();

    return () => {
      ignore = true;
    };
  }, []);

  const loading = loadingItems || loadingProfile;
  const hasPremiumAccess = userPlan === "premium" || userPlan === "membresia";

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((item) => {
      const matchKind = kind === "all" ? true : item.kind === kind;
      const matchQ = query
        ? item.title.toLowerCase().includes(query) ||
          (item.description ?? "").toLowerCase().includes(query)
        : true;
      return matchKind && matchQ;
    });
  }, [items, q, kind]);

  const totalCount = items.length;
  const filteredCount = filtered.length;
  const premiumCount = useMemo(
    () => items.filter((item) => item.plan === "premium").length,
    [items]
  );
  const freeCount = useMemo(
    () => items.filter((item) => item.plan !== "premium").length,
    [items]
  );
  const audioCount = useMemo(
    () => items.filter((item) => Boolean(item.audio_url)).length,
    [items]
  );

  const planLabel = hasPremiumAccess ? "Premium" : "Free";
  const planMessage = hasPremiumAccess
    ? "Tienes acceso completo a las practicas premium."
    : "Algunas practicas requieren Premium para abrir audio y PDF.";

  const skeletonCards = Array.from({ length: 6 });

  return (
    <section id="practices-gallery" className="space-y-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
        <div className="relative p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(216,198,255,0.34),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(200,154,60,0.14),transparent_30%)]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5aa8] backdrop-blur dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200">
                <Music className="h-4 w-4 text-[#c89a3c]" />
                Practicas guiadas
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal text-[#27304f] dark:text-white sm:text-3xl">
                Meditaciones y Canalizaciones
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f6680] dark:text-zinc-400">
                Explora sesiones para acompanar tu proceso. Filtra por tipo,
                busca por titulo y vuelve a lo que tu energia necesite hoy.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-[#d8c6ff]/60 bg-[#fffaf2]/75 p-4 text-sm text-[#5f6680] shadow-sm dark:border-purple-900/55 dark:bg-white/5 dark:text-zinc-400 xl:max-w-[260px]">
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#27304f] dark:text-white">
                  Plan actual
                </span>
                {loadingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#516fae]" />
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#516fae] dark:bg-white/10 dark:text-purple-200">
                    <Gem className="h-3.5 w-3.5 text-[#c89a3c]" />
                    {planLabel}
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs leading-6">{planMessage}</p>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatPill label="Total" value={totalCount} tone="blue" />
            <StatPill label="Free" value={freeCount} tone="green" />
            <StatPill label="Premium" value={premiumCount} tone="gold" />
            <StatPill label="Con audio" value={audioCount} tone="lilac" />
          </div>

          <div className="relative mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d73b7]" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Buscar practicas..."
                className="min-h-11 w-full rounded-full border border-[#d8c6ff]/65 bg-white/78 py-2.5 pl-11 pr-4 text-sm text-[#27304f] shadow-sm transition placeholder:text-[#777088] focus:border-[#516fae] focus:outline-none focus:ring-2 focus:ring-[#d8c6ff]/60 dark:border-purple-900/60 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {kindFilters.map((option) => {
                const isActive = kind === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKind(option.value)}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#516fae] ${
                      isActive
                        ? "bg-[#516fae] text-white shadow-[0_12px_26px_rgba(81,111,174,0.2)]"
                        : "border border-[#d8c6ff]/65 bg-white/70 text-[#535b78] hover:bg-white hover:text-[#516fae] dark:border-purple-900/60 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-purple-200"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-[#f4d99a]" : "text-[#8d73b7]"
                      }`}
                    />
                    {option.label}
                  </button>
                );
              })}
              {filteredCount !== totalCount && (
                <span className="rounded-full border border-[#d8c6ff]/65 bg-white/70 px-4 py-2 text-xs font-semibold text-[#516fae] dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200">
                  {filteredCount} resultados
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {skeletonCards.map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-[1.5rem] border border-[#d8c6ff]/45 bg-white/70 p-4 shadow-sm dark:border-purple-900/55 dark:bg-white/5"
            >
              <div className="aspect-[4/3] rounded-[1.15rem] bg-[#e9e3f6] dark:bg-purple-950/50" />
              <div className="mt-5 space-y-3">
                <div className="h-3 w-1/4 rounded-full bg-[#e9e3f6] dark:bg-purple-950/50" />
                <div className="h-4 w-2/3 rounded-full bg-[#e9e3f6] dark:bg-purple-950/50" />
                <div className="h-3 w-full rounded-full bg-[#e9e3f6] dark:bg-purple-950/50" />
                <div className="h-3 w-3/5 rounded-full bg-[#e9e3f6] dark:bg-purple-950/50" />
                <div className="h-10 w-full rounded-2xl bg-[#e9e3f6] dark:bg-purple-950/50" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-[#d8c6ff]/70 bg-white/70 p-10 text-center text-sm text-[#5f6680] shadow-sm backdrop-blur dark:border-purple-900/60 dark:bg-white/5 dark:text-zinc-400 sm:p-14">
          <AlertCircle className="h-9 w-9 text-[#c89a3c]" />
          <div className="space-y-1">
            <p className="text-base font-semibold text-[#27304f] dark:text-white">
              No encontramos practicas con ese criterio
            </p>
            <p className="text-sm">
              Ajusta los filtros o prueba otro termino para seguir explorando.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((practice, index) => {
            const isPremium = practice.plan === "premium";
            const isFree = practice.plan === "free" || !practice.plan;
            const canAccess =
              !isPremium || hasPremiumAccess || practice.created_by === userId;

            return (
              <article
                key={practice.id}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/78 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_52px_rgba(81,111,174,0.16)] dark:border-purple-900/55 dark:bg-white/5"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  {practice.cover_url ? (
                    <Image
                      src={practice.cover_url}
                      alt={practice.title}
                      fill
                      className={`object-cover transition duration-500 ${
                        canAccess ? "group-hover:scale-105" : "opacity-70"
                      } ${!canAccess && isPremium ? "blur-[1.5px]" : ""}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      priority={index < 2}
                    />
                  ) : (
                    <div className="h-full w-full bg-[radial-gradient(circle_at_22%_20%,rgba(216,198,255,0.8),transparent_38%),linear-gradient(135deg,#fffaf2,#d8c6ff)]" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/72 via-[#27304f]/12 to-transparent" />

                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {isPremium && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#f1d293]/80 bg-[#fff3cf]/95 px-2.5 py-1 text-[11px] font-semibold text-[#8a6724] shadow-sm">
                        <Crown className="h-3.5 w-3.5" />
                        Premium
                      </span>
                    )}
                    {isFree && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
                        <Star className="h-3.5 w-3.5" />
                        Free
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/55 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#516fae] backdrop-blur">
                      {practice.kind === "meditation" ? (
                        <Headphones className="h-3.5 w-3.5 text-[#8d73b7]" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 text-[#c89a3c]" />
                      )}
                      {practice.kind === "meditation"
                        ? "Meditacion"
                        : "Canalizacion"}
                    </span>

                    {practice.duration_minutes ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/55 bg-white/80 px-3 py-1 text-xs font-semibold text-[#535b78] backdrop-blur">
                        <Timer className="h-3.5 w-3.5 text-[#c89a3c]" />
                        {practice.duration_minutes} min
                      </span>
                    ) : null}
                  </div>

                  {isPremium && !canAccess && (
                    <div className="absolute inset-0 grid place-items-center bg-[#27304f]/20 backdrop-blur-sm">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#8a6724] shadow-sm">
                        <Lock className="h-4 w-4" />
                        Contenido premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-2">
                    <h3
                      className="line-clamp-2 text-lg font-semibold leading-snug text-[#27304f] dark:text-white"
                      title={practice.title}
                    >
                      {practice.title}
                    </h3>

                    {practice.description && (
                      <p className="line-clamp-3 text-sm leading-6 text-[#5f6680] dark:text-zinc-400">
                        {practice.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto space-y-3 text-sm">
                    {practice.audio_url ? (
                      canAccess ? (
                        <div className="rounded-2xl border border-[#d8c6ff]/55 bg-[#fffaf2]/70 p-3 dark:border-purple-900/55 dark:bg-gray-950/40">
                          <audio
                            controls
                            src={practice.audio_url}
                            className="w-full"
                            preload="metadata"
                          />
                        </div>
                      ) : (
                        <LockedLine>Audio disponible con Premium</LockedLine>
                      )
                    ) : (
                      <p className="text-xs font-medium text-[#777088] dark:text-zinc-500">
                        Sin audio disponible
                      </p>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row">
                      {practice.pdf_url ? (
                        canAccess ? (
                          <a
                            href={practice.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d8c6ff]/65 bg-white/70 px-4 py-2.5 text-xs font-semibold text-[#516fae] transition hover:bg-white dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
                          >
                            <FileText className="h-4 w-4 text-[#c89a3c]" />
                            Abrir PDF
                          </a>
                        ) : (
                          <LockedLine>PDF disponible con Premium</LockedLine>
                        )
                      ) : null}

                      {isPremium && !canAccess && (
                        <a
                          href="/upgrade"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#516fae] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_12px_28px_rgba(81,111,174,0.2)] transition hover:bg-[#405c98]"
                        >
                          <Crown className="h-4 w-4 text-[#f4d99a]" />
                          Desbloquear
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "gold" | "lilac";
}) {
  const toneClass = {
    blue: "text-[#516fae]",
    green: "text-emerald-700 dark:text-emerald-300",
    gold: "text-[#8a6724] dark:text-[#f1d293]",
    lilac: "text-[#8d73b7] dark:text-purple-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/75 bg-white/60 px-4 py-3 shadow-sm dark:border-purple-900/50 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777088] dark:text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function LockedLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 rounded-2xl border border-[#f1d293]/60 bg-[#fff3cf]/70 px-3 py-2 text-xs font-semibold text-[#8a6724] dark:border-[#c89a3c]/30 dark:bg-[#3a2d12]/40 dark:text-[#f1d293]">
      <Lock className="h-3.5 w-3.5" />
      {children}
    </p>
  );
}

function normalizePlan(value: unknown): UserPlan {
  if (
    value === "premium" ||
    value === "membresia" ||
    value === "gratis" ||
    value === "free"
  ) {
    return value;
  }

  return "free";
}
