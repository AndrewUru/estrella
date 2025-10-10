"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
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
  Search,
  Users,
  ShieldCheck,
  Crown,
} from "lucide-react";

interface Usuario {
  id: string;
  email: string;
  full_name: string;
  role: string;
  plan?: string | null;
  subscription_active: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
}

type Draft = {
  role: string;
  plan: string | null;
  subscription_active: boolean;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function bootstrap() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/usuarios");
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

      await fetchUsuarios();
      setLoading(false);
    }

    bootstrap();
  }, [router]);

  async function fetchUsuarios() {
    const { data, error: queryError } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, role, plan, subscription_active, start_date, end_date",
      )
      .order("full_name", { ascending: true });

    if (queryError) {
      setError("No se pudieron cargar las usuarias.");
      return;
    }

    const list = (data ?? []) as Usuario[];
    setUsuarios(list);
    setDrafts(
      Object.fromEntries(list.map((user) => [user.id, createDraft(user)])),
    );
  }

  function createDraft(user: Usuario): Draft {
    return {
      role: user.role ?? "alumna",
      plan: user.plan ?? null,
      subscription_active: user.subscription_active === true,
    };
  }

  function getDraft(user: Usuario): Draft {
    return drafts[user.id] ?? createDraft(user);
  }

  function updateDraft(userId: string, patch: Partial<Draft>) {
    setDrafts((current) => {
      const base = current[userId] ?? createDraft(
        usuarios.find((u) => u.id === userId) as Usuario,
      );
      return {
        ...current,
        [userId]: { ...base, ...patch },
      };
    });
  }

  function resetDraft(userId: string) {
    const user = usuarios.find((u) => u.id === userId);
    if (!user) return;
    setDrafts((current) => ({ ...current, [userId]: createDraft(user) }));
    setFeedback((current) => ({ ...current, [userId]: null }));
  }

  function hasChanges(user: Usuario) {
    const draft = getDraft(user);
    return (
      draft.role !== user.role ||
      (draft.plan ?? "") !== (user.plan ?? "") ||
      draft.subscription_active !== (user.subscription_active === true)
    );
  }

  async function saveUser(user: Usuario) {
    const draft = getDraft(user);
    const updates: Partial<Usuario> = {};

    if (draft.role !== user.role) {
      updates.role = draft.role;
    }

    const normalizedPlan = draft.plan ?? null;
    if ((normalizedPlan ?? null) !== (user.plan ?? null)) {
      updates.plan = normalizedPlan;
    }

    if (draft.subscription_active !== (user.subscription_active === true)) {
      updates.subscription_active = draft.subscription_active;
    }

    if (Object.keys(updates).length === 0) {
      setFeedback((current) => ({
        ...current,
        [user.id]: {
          type: "success",
          message: "No hay cambios pendientes.",
        },
      }));
      return;
    }

    setSaving((current) => ({ ...current, [user.id]: true }));
    setFeedback((current) => ({ ...current, [user.id]: null }));

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (updateError) {
      setFeedback((current) => ({
        ...current,
        [user.id]: {
          type: "error",
          message: "No se pudo guardar. Intenta de nuevo.",
        },
      }));
    } else {
      setUsuarios((current) =>
        current.map((record) =>
          record.id === user.id ? { ...record, ...updates } : record,
        ),
      );
      const updatedUser = { ...user, ...updates };
      setDrafts((current) => ({
        ...current,
        [user.id]: createDraft(updatedUser),
      }));
      setFeedback((current) => ({
        ...current,
        [user.id]: {
          type: "success",
          message: "Cambios guardados correctamente.",
        },
      }));
    }

    setSaving((current) => ({ ...current, [user.id]: false }));
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return usuarios;

    return usuarios.filter((user) => {
      const haystack = [
        user.full_name,
        user.email,
        user.plan,
        user.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [usuarios, search]);

  const stats = useMemo(() => {
    const total = usuarios.length;
    const active = usuarios.filter(
      (user) => user.subscription_active === true,
    ).length;
    const premium = usuarios.filter((user) => user.plan === "premium").length;
    const admin = usuarios.filter((user) => user.role === "admin").length;
    return { total, active, premium, admin };
  }, [usuarios]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando usuarias...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="p-6 text-destructive">
            {error}
          </CardContent>
        </Card>
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
                Gestion de usuarias
              </Badge>
              <div className="space-y-2 text-foreground">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Panel de accesos
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Supervisa roles, planes activos y estados de suscripcion.
                  Usa los botones de guardar para confirmar cada cambio.
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-center sm:grid-cols-2 lg:text-right">
              <Stat label="Total" value={stats.total} icon={<Users className="h-4 w-4" />} />
              <Stat label="Activas" value={stats.active} icon={<ShieldCheck className="h-4 w-4" />} />
              <Stat label="Premium" value={stats.premium} icon={<Crown className="h-4 w-4" />} />
              <Stat label="Admins" value={stats.admin} icon={<ShieldCheck className="h-4 w-4" />} />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border-border/70 bg-card/90">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg text-foreground">
                Buscar usuarias
              </CardTitle>
              <CardDescription>
                Filtra por nombre, correo, plan o rol para encontrar a quien necesitas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nombre, correo o plan"
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border/70 bg-muted/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Buenas practicas
              </CardTitle>
              <CardDescription>
                Mantiene al equipo informando cada confirmacion en el historial.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Tip>
                Guarda cambios por usuaria para registrar el ajuste en supabase.
              </Tip>
              <Tip>
                Usa el estado de suscripcion para activar o pausar accesos sin modificar el plan.
              </Tip>
              <Tip>
                Revisa las fechas de inicio y fin antes de renovar el plan.
              </Tip>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Usuarias ({filtered.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Se muestran con los datos mas recientes disponibles.
              </p>
            </div>
          </header>

          <div className="grid gap-4">
            {filtered.map((user) => {
              const draft = getDraft(user);
              const changed = hasChanges(user);
              const isSaving = saving[user.id] === true;
              const entryFeedback = feedback[user.id];

              return (
                <Card
                  key={user.id}
                  className={cn(
                    "border-border/70 bg-card/90 transition-colors",
                    changed ? "border-primary/50 shadow-lg" : "hover:border-primary/30",
                  )}
                >
                  <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {user.full_name || "Sin nombre"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email || "Sin correo"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {draft.role}
                          </Badge>
                          {changed ? (
                            <Badge variant="outline" className="border-primary/60 text-primary">
                              Cambios sin guardar
                            </Badge>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Field
                          label="Rol"
                          description="Define permisos de acceso"
                          changed={draft.role !== user.role}
                        >
                          <select
                            value={draft.role}
                            onChange={(event) =>
                              updateDraft(user.id, { role: event.target.value })
                            }
                            className={cn(
                              "w-full rounded-lg border border-border bg-background p-2 text-sm",
                              draft.role !== user.role && "border-primary/60",
                            )}
                          >
                            <option value="alumna">alumna</option>
                            <option value="admin">admin</option>
                          </select>
                        </Field>

                        <Field
                          label="Plan"
                          description="Controla el contenido disponible"
                          changed={(draft.plan ?? "") !== (user.plan ?? "")}
                        >
                          <select
                            value={draft.plan ?? ""}
                            onChange={(event) =>
                              updateDraft(user.id, {
                                plan: event.target.value || null,
                              })
                            }
                            className={cn(
                              "w-full rounded-lg border border-border bg-background p-2 text-sm capitalize",
                              (draft.plan ?? "") !== (user.plan ?? "") &&
                                "border-primary/60",
                            )}
                          >
                            <option value="">Sin plan</option>
                            <option value="gratis">gratis</option>
                            <option value="premium">premium</option>
                          </select>
                        </Field>

                        <Field
                          label="Suscripcion"
                          description="Activa o pausa el acceso"
                          changed={
                            draft.subscription_active !==
                            (user.subscription_active === true)
                          }
                        >
                          <Button
                            type="button"
                            variant={
                              draft.subscription_active ? "default" : "outline"
                            }
                            className={cn(
                              "w-full justify-between",
                              !draft.subscription_active &&
                                "border-border text-muted-foreground",
                            )}
                            onClick={() =>
                              updateDraft(user.id, {
                                subscription_active: !draft.subscription_active,
                              })
                            }
                          >
                            {draft.subscription_active ? "Activa" : "Inactiva"}
                          </Button>
                        </Field>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <Meta label="Inicio">
                          {formatDate(user.start_date)}
                        </Meta>
                        <Meta label="Vencimiento">
                          {formatDate(user.end_date)}
                        </Meta>
                        <Meta label="Ultimo guardado">
                          {entryFeedback?.type === "success"
                            ? entryFeedback.message
                            : "Sin registros recientes"}
                        </Meta>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 md:w-52">
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => saveUser(user)}
                        disabled={!changed || isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => resetDraft(user.id)}
                        disabled={!changed || isSaving}
                      >
                        Revertir
                      </Button>
                      {entryFeedback ? (
                        <p
                          aria-live="polite"
                          className={cn(
                            "text-xs",
                            entryFeedback.type === "success"
                              ? "text-emerald-600"
                              : "text-destructive",
                          )}
                        >
                          {entryFeedback.message}
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filtered.length === 0 ? (
              <Card className="border-dashed border-border/70 bg-card/80">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No hay usuarias que coincidan con la busqueda actual.
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/90 p-4">
      <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
      <p>{children}</p>
    </div>
  );
}

function Field({
  label,
  description,
  changed,
  children,
}: {
  label: string;
  description?: string;
  changed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {description ? (
          <span className="text-xs text-muted-foreground/80">{description}</span>
        ) : null}
      </div>
      <div className={cn("space-y-1", changed && "text-primary")}>{children}</div>
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/80 p-3">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

function formatDate(input?: string | null) {
  if (!input) return "Sin registro";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Sin registro";
  return date.toLocaleDateString();
}
