"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  Music,
  Search,
  FileText,
  Crown,
  Star,
  Lock,
  Timer,
  AlertCircle,
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

const kindFilters: Array<{
  value: "all" | "meditation" | "channeling";
  label: string;
}> = [
  { value: "all", label: "Todo" },
  { value: "meditation", label: "Meditaciones" },
  { value: "channeling", label: "Canalizaciones" },
];

export default function PracticesGallery() {
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "meditation" | "channeling">("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "premium">("free");

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
          setUserPlan((profile.plan as "free" | "premium") ?? "free");
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

  const planLabel = userPlan === "premium" ? "Premium" : "Free";
  const planMessage = userPlan === "premium"
    ? "Disfruta de acceso completo a las practicas premium."
    : "Algunas practicas son premium. Actualiza tu plan para desbloquearlas.";

  const skeletonCards = Array.from({ length: 6 });

  return (
    <section id="practices-gallery" className="space-y-8">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
              <Music className="h-5 w-5" />
              <span>Practicas guiadas</span>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
              Meditaciones y Canalizaciones
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Explora sesiones seleccionadas para acompanar tu proceso. Filtra por tipo o busca por titulo para encontrar lo que necesitas hoy.
            </p>
          </div>

          <div className="min-w-[220px] rounded-2xl border border-purple-200 bg-purple-50/70 p-4 text-sm text-purple-800 shadow-sm dark:border-purple-400/30 dark:bg-purple-950/40 dark:text-purple-200">
            <p className="font-semibold">Plan actual</p>
            <p className="mt-1 flex items-center gap-2">
              {loadingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900/30 dark:text-purple-100">
                  {planLabel}
                </span>
              )}
            </p>
            <p className="mt-2 text-xs leading-relaxed opacity-80">{planMessage}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
              Total: {totalCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              Free: {freeCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200">
              Premium: {premiumCount}
            </span>
            {filteredCount !== totalCount && (
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
                Resultado: {filteredCount}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Buscar practicas..."
                className="w-full rounded-full border border-gray-200 bg-white/80 py-2.5 pl-9 pr-4 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-white/10 dark:bg-black/40 dark:text-gray-100 dark:focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2">
              {kindFilters.map((option) => {
                const isActive = kind === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKind(option.value)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow"
                        : "border border-gray-200/80 bg-white/70 text-gray-600 hover:border-purple-200 hover:text-purple-600 dark:border-white/10 dark:bg-black/40 dark:text-gray-300 dark:hover:border-purple-400"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {skeletonCards.map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30"
                >
                  <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 w-1/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-3/5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-10 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-300 bg-white/70 p-16 text-center text-sm text-gray-600 shadow-sm dark:border-white/20 dark:bg-black/40 dark:text-gray-300">
              <AlertCircle className="h-8 w-8 text-purple-400" />
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-800 dark:text-white">
                  No encontramos practicas con ese criterio
                </p>
                <p className="text-sm opacity-80">
                  Ajusta los filtros o busca otro termino para continuar explorando.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((practice, index) => {
                const isPremium = practice.plan === "premium";
                const isFree = practice.plan === "free" || !practice.plan;
                const canAccess =
                  !isPremium || userPlan === "premium" || practice.created_by === userId;

                return (
                  <article
                    key={practice.id}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-black/40"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      {practice.cover_url ? (
                        <Image
                          src={practice.cover_url}
                          alt={practice.title}
                          fill
                          className={`object-cover transition duration-500 ${
                            canAccess ? "group-hover:scale-105" : "opacity-70"
                          } ${
                            !canAccess && isPremium ? "blur-[1.5px]" : ""
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 2}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-700" />
                      )}

                      {isPremium && (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50/95 px-2.5 py-1 text-[11px] font-medium text-amber-800 shadow-sm dark:border-amber-400/40 dark:bg-amber-900/70 dark:text-amber-100">
                          <Crown className="h-3.5 w-3.5" /> Premium
                        </div>
                      )}
                      {isFree && (
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50/95 px-2.5 py-1 text-[11px] font-medium text-emerald-700 shadow-sm dark:border-emerald-400/40 dark:bg-emerald-900/60 dark:text-emerald-100">
                          <Star className="h-3.5 w-3.5" /> Free
                        </div>
                      )}

                      {isPremium && !canAccess && (
                        <div className="absolute inset-0 grid place-items-center bg-black/15 backdrop-blur-sm">
                          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm dark:bg-black/70 dark:text-amber-200">
                            <Lock className="h-3.5 w-3.5" /> Contenido premium
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          <span>{practice.kind === "meditation" ? "Meditacion" : "Canalizacion"}</span>
                          {practice.duration_minutes ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500 dark:bg-gray-800/70 dark:text-gray-300">
                              <Timer className="h-3 w-3" /> {practice.duration_minutes} min
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 dark:text-white" title={practice.title}>
                          {practice.title}
                        </h3>

                        {practice.description && (
                          <p className="text-sm text-gray-600 line-clamp-3 dark:text-gray-300">
                            {practice.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto space-y-3 text-sm">
                        {practice.audio_url ? (
                          canAccess ? (
                            <audio controls src={practice.audio_url} className="w-full rounded-xl bg-gray-100/60 p-1 dark:bg-gray-800/60" />
                          ) : (
                            <p className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
                              <Lock className="h-3.5 w-3.5" /> Audio disponible con Premium
                            </p>
                          )
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sin audio disponible</p>
                        )}

                        {practice.pdf_url && (
                          canAccess ? (
                            <a
                              href={practice.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline dark:text-indigo-300 dark:hover:text-indigo-200"
                            >
                              <FileText className="h-4 w-4" /> Abrir PDF
                            </a>
                          ) : (
                            <p className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-300">
                              <Lock className="h-3.5 w-3.5" /> PDF disponible con Premium
                            </p>
                          )
                        )}

                        {isPremium && !canAccess && (
                          <a
                            href="/upgrade"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:from-purple-700 hover:to-pink-600"
                          >
                            Desbloquear con Premium
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
