"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NewPracticeForm from "@/components/admin/NewPracticeForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  plan: "free" | "premium" | null;
};

const kindOptions: Array<{
  label: string;
  value: "all" | "meditation" | "channeling";
}> = [
  { label: "Todo", value: "all" },
  { label: "Meditaciones", value: "meditation" },
  { label: "Canalizaciones", value: "channeling" },
];

const visibilityOptions: Array<{
  label: string;
  value: "all" | "public" | "private" | "unlisted";
}> = [
  { label: "Todas", value: "all" },
  { label: "Publicas", value: "public" },
  { label: "Privadas", value: "private" },
  { label: "Ocultas", value: "unlisted" },
];

const planOptions: Array<{ label: string; value: "all" | "free" | "premium" }> =
  [
    { label: "Todos los planes", value: "all" },
    { label: "Gratis", value: "free" },
    { label: "Premium", value: "premium" },
  ];

const visibilityLabel: Record<Practice["visibility"], string> = {
  public: "Publica",
  private: "Privada",
  unlisted: "Oculta",
};

export default function PracticasAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Practice[]>([]);
  const [q, setQ] = useState("");
  const [kind, setKind] =
    useState<"all" | "meditation" | "channeling">("all");
  const [visibility, setVisibility] = useState<
    "all" | "public" | "private" | "unlisted"
  >("all");
  const [planFilter, setPlanFilter] =
    useState<"all" | "free" | "premium">("all");

  useEffect(() => {
    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/practicas");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
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

    if (!error && data) {
      setItems(data as Practice[]);
    }
  }

  const filtered = useMemo(() => {
    const selectedKind = kind === "all" ? undefined : kind;
    const selectedVisibility = visibility === "all" ? undefined : visibility;
    const selectedPlan =
      planFilter === "all" ? undefined : (planFilter as Practice["plan"]);
    const query = q.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKind = selectedKind ? item.kind === selectedKind : true;
      const matchesVisibility = selectedVisibility
        ? item.visibility === selectedVisibility
        : true;
      const matchesPlan = selectedPlan
        ? (item.plan ?? "free") === selectedPlan
        : true;
      const combinedTags = item.tags?.join(",").toLowerCase() ?? "";
      const matchesQuery = query
        ? item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          combinedTags.includes(query)
        : true;

      return matchesKind && matchesVisibility && matchesPlan && matchesQuery;
    });
  }, [items, kind, visibility, planFilter, q]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((item) => item.visibility === "public").length;
    const privateCount = items.filter(
      (item) => item.visibility === "private"
    ).length;
    const premium = items.filter(
      (item) => (item.plan ?? "free") === "premium"
    ).length;

    return { total, published, privateCount, premium };
  }, [items]);

  async function toggleVisibility(id: string, current: Practice["visibility"]) {
    const next: Practice["visibility"] =
      current === "public" ? "private" : "public";

    const { error } = await supabase
      .from("practices")
      .update({ visibility: next })
      .eq("id", id);

    if (!error) {
      setItems((list) =>
        list.map((item) =>
          item.id === id ? { ...item, visibility: next } : item
        )
      );
    }
  }

  async function updatePlan(id: string, plan: "free" | "premium") {
    setItems((list) =>
      list.map((item) => (item.id === id ? { ...item, plan } : item))
    );

    const { error } = await supabase
      .from("practices")
      .update({ plan })
      .eq("id", id);

    if (error) {
      await load();
      alert("No se pudo actualizar el plan. Intentalo de nuevo.");
    }
  }

  async function remove(id: string) {
    if (
      !confirm(
        "Eliminar esta practica? Esta accion no se puede deshacer."
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("practices")
      .delete()
      .eq("id", id);

    if (!error) {
      setItems((list) => list.filter((item) => item.id !== id));
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando panel de practicas...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-border/80 bg-card/80 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Administracion de practicas
              </Badge>
              <div className="space-y-3 text-foreground">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Biblioteca de practicas
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Gestiona las meditaciones y canalizaciones disponibles para la
                  comunidad, ajusta su visibilidad y controla el acceso por plan.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-center sm:grid-cols-2 lg:text-right">
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publicadas</p>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.published}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Privadas</p>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.privateCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.premium}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border-border/70 bg-card/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg text-foreground">
                Filtros y busqueda
              </CardTitle>
              <CardDescription className="text-sm">
                Combina filtros para encontrar practicas especificas y ajusta el
                listado en tiempo real.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  placeholder="Buscar por titulo, descripcion o etiquetas"
                  className="pl-9"
                />
              </div>

              <div className="space-y-5">
                <FilterGroup
                  icon={<Music className="h-4 w-4" />}
                  label="Tipo"
                  options={kindOptions}
                  current={kind}
                  onSelect={(value) => setKind(value)}
                />
                <FilterGroup
                  icon={<Filter className="h-4 w-4" />}
                  label="Visibilidad"
                  options={visibilityOptions}
                  current={visibility}
                  onSelect={(value) => setVisibility(value)}
                />
                <FilterGroup
                  icon={<Crown className="h-4 w-4" />}
                  label="Plan de acceso"
                  options={planOptions}
                  current={planFilter}
                  onSelect={(value) => setPlanFilter(value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border/70 bg-muted/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Consejos rapidos
              </CardTitle>
              <CardDescription>
                Mantiene tu biblioteca ordenada y con el contexto que necesitara el equipo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <TipItem>
                Agrupa por plan para que las integrantes premium encuentren contenido exclusivo con rapidez.
              </TipItem>
              <TipItem>
                Completa la descripcion y etiquetas para mejorar las busquedas internas.
              </TipItem>
              <TipItem>
                Usa el estado privado para preparar practicas antes de publicarlas.
              </TipItem>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur">
          <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Crear nueva practica
              </h2>
              <p className="text-sm text-muted-foreground">
                Publica un nuevo recurso y actualiza automaticamente el listado.
              </p>
            </div>
          </header>
          <NewPracticeForm onCreated={load} />
        </section>

        <section className="space-y-4">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Listado ({filtered.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Las practicas se ordenan por las mas recientes primero.
              </p>
            </div>
          </header>

          <div className="grid gap-4">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="border-border/70 bg-card/90 transition hover:border-primary/40 hover:shadow-lg"
              >
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:gap-6">
                  <div className="w-full md:w-32">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-muted">
                      <img
                        src={item.cover_url ?? "/placeholder.svg"}
                        alt={item.title ?? "Portada de la practica"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {item.kind === "meditation" ? "Meditacion" : "Canalizacion"}
                      </Badge>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>{visibilityLabel[item.visibility]}</span>
                      {item.duration_minutes ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <span>{item.duration_minutes} min</span>
                        </>
                      ) : null}
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 border border-transparent",
                          (item.plan ?? "free") === "premium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        {(item.plan ?? "free") === "premium" ? (
                          <>
                            <Crown className="h-3 w-3" /> Premium
                          </>
                        ) : (
                          "Gratis"
                        )}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    {item.tags && item.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs uppercase tracking-wide"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex items-center gap-3 text-sm">
                      {item.audio_url ? (
                        <audio
                          controls
                          src={item.audio_url}
                          className="w-full max-w-md"
                        />
                      ) : (
                        <span className="text-muted-foreground">Sin audio</span>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 md:w-48">
                    <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-3">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Plan
                      </p>
                      <div className="flex gap-2">
                        {(["free", "premium"] as const).map((plan) => {
                          const isActive = (item.plan ?? "free") === plan;
                          return (
                            <Button
                              key={plan}
                              type="button"
                              size="sm"
                              variant={isActive ? "default" : "outline"}
                              className="flex-1 gap-1"
                              onClick={() => updatePlan(item.id, plan)}
                            >
                              {plan === "premium" ? (
                                <>
                                  <Crown className="h-3.5 w-3.5" /> Premium
                                </>
                              ) : (
                                "Gratis"
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-3">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        Estado
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => toggleVisibility(item.id, item.visibility)}
                      >
                        {item.visibility === "public" ? (
                          <>
                            <EyeOff className="h-4 w-4" /> Pasar a privado
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" /> Publicar
                          </>
                        )}
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar practica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 ? (
              <Card className="border-dashed border-border/70 bg-card/80">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No hay practicas que coincidan con los filtros actuales.
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterGroup<T extends string>({
  icon,
  label,
  options,
  current,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  options: Array<{ label: string; value: T }>;
  current: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === current;
          return (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => onSelect(option.value)}
              className="rounded-full"
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function TipItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/90 p-4">
      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
      <p>{children}</p>
    </div>
  );
}
