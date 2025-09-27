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
} from "lucide-react";

// Tipos
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
  created_by?: string | null; // para permitir acceso al creador
}

export default function PracticesGallery() {
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "meditation" | "channeling">("all");

  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"free" | "premium">("free");

  // Cargar usuario + perfil (plan)
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

  // Cargar prácticas
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
      if (!error && data && !ignore) setItems(data as Practice[]);
      if (!ignore) setLoadingItems(false);
    }
    fetchPractices();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((it) => {
      const matchKind = kind === "all" ? true : it.kind === kind;
      const matchQ = query
        ? it.title.toLowerCase().includes(query) ||
          (it.description ?? "").toLowerCase().includes(query)
        : true;
      return matchKind && matchQ;
    });
  }, [items, q, kind]);

  const loading = loadingItems || loadingProfile;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground p-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando prácticas…
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-600" />
          Meditaciones y Canalizaciones
        </h2>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              className="w-full rounded-2xl border border-border p-3 pr-10 bg-background"
              placeholder="Buscar prácticas…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Search className="w-4 h-4 absolute right-3 top-3.5 text-muted-foreground" />
          </div>

          <select
            className="rounded-2xl border border-border p-3 bg-background"
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as "all" | "meditation" | "channeling")
            }
          >
            <option value="all">Todos</option>
            <option value="meditation">Meditaciones</option>
            <option value="channeling">Canalizaciones</option>
          </select>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground p-6 text-center border border-dashed border-border rounded-2xl">
          No hay prácticas disponibles en este momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const plan = p.plan ?? "free";
            const isPremium = plan === "premium";
            const isFree = plan === "free";
            const canAccess =
              isFree ||
              userPlan === "premium" ||
              (p.created_by && p.created_by === userId);

            return (
              <article
                key={p.id}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden group"
              >
                <div className="relative">
                  <Image
                    src={p.cover_url ?? "/placeholder.svg"}
                    alt={p.title}
                    width={400}
                    height={160}
                    className={
                      "w-full h-40 object-cover " +
                      (!canAccess && isPremium ? "opacity-80 blur-[1px]" : "")
                    }
                    priority
                  />

                  {/* Insignias de plan */}
                  {isPremium && (
                    <div
                      className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50/95 text-amber-800 px-2 py-1 text-[11px] font-medium shadow-sm"
                      title="Recurso Premium"
                    >
                      <Crown className="w-3.5 h-3.5" /> Premium
                    </div>
                  )}
                  {isFree && (
                    <div
                      className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50/95 text-emerald-700 px-2 py-1 text-[11px] font-medium shadow-sm"
                      title="Recurso Gratis"
                    >
                      <Star className="w-3.5 h-3.5" /> Gratis
                    </div>
                  )}
                  {/* Candado si no hay acceso */}
                  {isPremium && !canAccess && (
                    <div className="absolute inset-0 grid place-items-center bg-black/10">
                      <div className="inline-flex items-center gap-1 rounded-full bg-white/90 text-amber-700 px-3 py-1 text-xs border border-amber-200">
                        <Lock className="w-3.5 h-3.5" /> Contenido Premium
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="uppercase tracking-wide">
                      {p.kind === "meditation" ? "Meditación" : "Canalización"}
                    </span>
                    {/* Chip de plan junto al tipo */}
                    {isPremium && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-700">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      </>
                    )}
                    {isFree && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700">
                          <Star className="w-3 h-3" /> Gratis
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="font-semibold truncate" title={p.title}>
                    {p.title}
                  </h3>

                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  )}

                  {p.duration_minutes && (
                    <p className="text-xs text-muted-foreground">
                      ⏱ {p.duration_minutes} min
                    </p>
                  )}

                  {/* AUDIO: gating */}
                  {p.audio_url ? (
                    !canAccess ? (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Audio disponible solo
                        para Premium
                      </p>
                    ) : (
                      <audio
                        controls
                        src={p.audio_url}
                        className="w-full mt-2"
                      />
                    )
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin audio</p>
                  )}

                  {/* PDF: gating */}
                  {p.pdf_url &&
                    (!canAccess ? (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> PDF disponible solo
                        para Premium
                      </p>
                    ) : (
                      <a
                        href={p.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-indigo-600 hover:underline mt-2"
                      >
                        <FileText className="w-4 h-4" /> Ver PDF
                      </a>
                    ))}

                  {/* CTA si no puede acceder */}
                  {isPremium && !canAccess && (
                    <a
                      href="/premium"
                      className="mt-2 inline-flex items-center justify-center rounded-xl bg-amber-600 text-white px-3 py-2 text-sm hover:bg-amber-700 transition-colors"
                    >
                      Desbloquear con Premium
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
