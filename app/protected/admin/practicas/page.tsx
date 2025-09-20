"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NewPracticeForm from "@/components/admin/NewPracticeForm";
import {
  Loader2,
  Music,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  Search,
  Crown,
} from "lucide-react";

// Tipos
export type Practice = {
  id: string;
  title: string;
  kind: "meditation" | "channeling";
  description: string | null;
  language: string | null;
  facilitator: string | null;
  duration_minutes: number | null;
  tags: string[] | null;
  audio_url: string | null;
  cover_url: string | null;
  recorded_at: string | null;
  published_at: string | null;
  visibility: "public" | "private" | "unlisted";
  created_by: string | null;
  created_at: string | null;
  // NUEVO: plan de acceso
  plan: "free" | "premium" | null;
};

export default function PracticasAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState<string>("");
  const [kind, setKind] = useState<"all" | "meditation" | "channeling">("all");
  const [visibility, setVisibility] = useState<
    "all" | "public" | "private" | "unlisted"
  >("all");
  // NUEVO: filtro por plan
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "premium">(
    "all"
  );

  useEffect(() => {
    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/practicas");
        return;
      }
      const { data: perfil } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (perfil?.role !== "admin") {
        router.push("/no-access");
        return;
      }
      await load();
      setLoading(false);
    }
    bootstrap();
  }, [router]);

  async function load() {
    const { data, error } = await supabase
      .from("practices")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Practice[]);
  }

  const filtered: Practice[] = useMemo(() => {
    const k: Practice["kind"] | undefined = kind === "all" ? undefined : kind;
    const v: Practice["visibility"] | undefined =
      visibility === "all" ? undefined : visibility;
    const p: Practice["plan"] | undefined =
      planFilter === "all" ? undefined : (planFilter as Practice["plan"]);

    return items.filter((it) => {
      const matchK = k ? it.kind === k : true;
      const matchV = v ? it.visibility === v : true;
      const matchP = p ? (it.plan ?? "free") === p : true;
      const query = q.trim().toLowerCase();
      const matchQ = query
        ? it.title?.toLowerCase().includes(query) ||
          it.description?.toLowerCase().includes(query) ||
          it.tags?.join(",").toLowerCase().includes(query)
        : true;
      return matchK && matchV && matchP && matchQ;
    });
  }, [items, kind, visibility, planFilter, q]);

  async function toggleVisibility(id: string, current: Practice["visibility"]) {
    const next: Practice["visibility"] =
      current === "public" ? "private" : "public";
    const { error } = await supabase
      .from("practices")
      .update({ visibility: next })
      .eq("id", id);
    if (!error) {
      setItems((xs) =>
        xs.map((x) => (x.id === id ? { ...x, visibility: next } : x))
      );
    }
  }

  // NUEVO: actualizar plan (gratis/premium)
  async function updatePlan(id: string, plan: "free" | "premium") {
    // Optimista
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, plan } : x)));
    const { error } = await supabase
      .from("practices")
      .update({ plan })
      .eq("id", id);
    if (error) {
      // revertir si falla
      await load();
      alert("No se pudo actualizar el plan. Inténtalo de nuevo.");
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta práctica? Esta acción no se puede deshacer."))
      return;
    const { error } = await supabase.from("practices").delete().eq("id", id);
    if (!error) setItems((xs) => xs.filter((x) => x.id !== id));
  }

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Cargando…
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-600">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              Meditaciones y Canalizaciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Crea, filtra y publica tus prácticas sonoras.
            </p>
          </div>
        </div>
      </header>

      {/* Controles */}
      <section className="bg-card border border-border rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <input
            className="w-full rounded-2xl border border-border p-3 pr-10 bg-background"
            placeholder="Buscar por título, descripción o tags"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Search className="w-4 h-4 absolute right-3 top-3.5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            className="w-full rounded-2xl border border-border p-3 bg-background"
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as "all" | "meditation" | "channeling")
            }
          >
            <option value="all">Todos los tipos</option>
            <option value="meditation">Meditaciones</option>
            <option value="channeling">Canalizaciones</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            className="w-full rounded-2xl border border-border p-3 bg-background"
            value={visibility}
            onChange={(e) =>
              setVisibility(
                e.target.value as "all" | "public" | "private" | "unlisted"
              )
            }
          >
            <option value="all">Todas las visibilidades</option>
            <option value="public">Públicas</option>
            <option value="private">Privadas</option>
            <option value="unlisted">No listadas</option>
          </select>
          {/* NUEVO: filtro por plan */}
          <select
            className="w-full rounded-2xl border border-border p-3 bg-background"
            value={planFilter}
            onChange={(e) =>
              setPlanFilter(e.target.value as "all" | "free" | "premium")
            }
          >
            <option value="all">Todos los planes</option>
            <option value="free">Gratis</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </section>

      {/* Formulario de creación */}
      <section className="bg-card border border-border rounded-2xl p-5">
        {/* NOTA: Si tu NewPracticeForm ya maneja el campo `plan`, lo respetará al crear. */}
        <NewPracticeForm onCreated={load} />
      </section>

      {/* Listado */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Lista ({filtered.length})</h2>
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((it) => (
            <article
              key={it.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4"
            >
              <img
                src={it.cover_url ?? "/placeholder.svg"}
                alt="cover"
                className="w-16 h-16 rounded-xl object-cover border border-border"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="uppercase tracking-wide">
                    {it.kind === "meditation" ? "Meditación" : "Canalización"}
                  </span>
                  <span>•</span>
                  <span>{it.visibility}</span>
                  {it.duration_minutes ? (
                    <>
                      <span>•</span>
                      <span>{it.duration_minutes} min</span>
                    </>
                  ) : null}
                  {/* NUEVO: insignia de plan */}
                  <span>•</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                      (it.plan ?? "free") === "premium"
                        ? "border-amber-300 text-amber-700 bg-amber-50"
                        : "border-emerald-300 text-emerald-700 bg-emerald-50"
                    }`}
                    title="Plan de acceso"
                  >
                    {(it.plan ?? "free") === "premium" ? (
                      <>
                        <Crown className="w-3 h-3" /> Premium
                      </>
                    ) : (
                      <>Gratis</>
                    )}
                  </span>
                </div>
                <h3 className="font-medium truncate">{it.title}</h3>
                {it.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {it.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-sm">
                  {it.audio_url ? (
                    <audio
                      controls
                      src={it.audio_url}
                      className="w-full max-w-md"
                    />
                  ) : (
                    <span className="text-muted-foreground">Sin audio</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-40">
                {/* NUEVO: selector de plan */}
                <label className="text-xs text-muted-foreground">Plan</label>
                <select
                  className="rounded-xl border border-border p-2 bg-background text-sm"
                  value={(it.plan ?? "free") as "free" | "premium"}
                  onChange={(e) =>
                    updatePlan(
                      it.id,
                      e.target.value as unknown as "free" | "premium"
                    )
                  }
                >
                  <option value="free">Gratis</option>
                  <option value="premium">Premium</option>
                </select>

                <button
                  className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm"
                  onClick={() => toggleVisibility(it.id, it.visibility)}
                  title={
                    it.visibility === "public"
                      ? "Hacer privada"
                      : "Hacer pública"
                  }
                >
                  {it.visibility === "public" ? (
                    <>
                      <EyeOff className="w-4 h-4" /> Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Publicar
                    </>
                  )}
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 text-rose-600 px-3 py-2 text-sm hover:bg-rose-50"
                  onClick={() => remove(it.id)}
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground p-6 text-center border border-dashed border-border rounded-2xl">
              No hay prácticas con los filtros actuales.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
