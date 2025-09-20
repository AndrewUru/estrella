"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Music, Search } from "lucide-react";

// Tipos
interface Practice {
  id: string;
  title: string;
  kind: "meditation" | "channeling";
  description: string | null;
  cover_url: string | null;
  audio_url: string | null;
  visibility: "public" | "private" | "unlisted";
  duration_minutes: number | null;
}

export default function PracticesGallery() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "meditation" | "channeling">("all");

  useEffect(() => {
    async function fetchPractices() {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth.user?.id ?? null;

      let query = supabase
        .from("practices")
        .select(
          "id, title, kind, description, cover_url, audio_url, visibility, duration_minutes"
        )
        .order("created_at", { ascending: false });

      if (userId) {
        // Usuario autenticado: públicas + del usuario (privadas/unlisted)
        query = query.or(`visibility.eq.public,created_by.eq.${userId}`);
      } else {
        // No autenticado: solo públicas
        query = query.eq("visibility", "public");
      }

      const { data, error } = await query;
      if (!error && data) setItems(data as Practice[]);
      setLoading(false);
    }

    fetchPractices();
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
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
            >
              <img
                src={p.cover_url ?? "/placeholder.svg"}
                alt={p.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-semibold truncate">{p.title}</h3>
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
                {p.audio_url ? (
                  <audio controls src={p.audio_url} className="w-full mt-2" />
                ) : (
                  <p className="text-xs text-muted-foreground">Sin audio</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
