"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Gem,
  Home,
  Lock,
  MessageSquare,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import PracticesGallery from "@/components/PracticesGallery";

export type ProgresoItem = {
  dia: number;
  completado: boolean;
  desbloqueado: boolean;
  imagen_url?: string | null;
};

export type Perfil = {
  start_date: string | null;
  plan: "gratis" | "membresia" | "premium" | string;
  full_name: string | null;
  avatar_url?: string | null;
  username?: string | null;
};

const panelLinks = [
  { href: "/protected", label: "Inicio", icon: Home },
  { href: "#recorrido", label: "Recorrido", icon: CalendarDays },
  { href: "#practicas", label: "Practicas", icon: BookOpen },
  { href: "/protected/social", label: "Comunidad", icon: MessageSquare },
  { href: "/protected/profile", label: "Perfil", icon: UserRound },
];

export default function DashboardPage() {
  const [progreso, setProgreso] = useState<ProgresoItem[]>([]);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loadingProgreso, setLoadingProgreso] = useState<boolean>(true);

  const { fullName, loading: loadingHook } = useUserProfile();

  const esGratis = perfil?.plan === "gratis";

  const completadosCount = useMemo(
    () => progreso.filter((p) => p.completado).length,
    [progreso]
  );

  const progresoPercent = useMemo(() => {
    if (!progreso.length) return 0;
    return Math.round((completadosCount / progreso.length) * 100);
  }, [completadosCount, progreso.length]);

  const totalDias = progreso.length;

  const nextUnlockedDay = useMemo(
    () => progreso.find((p) => p.desbloqueado && !p.completado) ?? null,
    [progreso]
  );

  const lockedCount = useMemo(
    () => progreso.filter((p) => !p.desbloqueado).length,
    [progreso]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      setLoadingProgreso(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) console.error("auth error", userError.message);

        if (!user) {
          if (isMounted) {
            setPerfil(null);
            setProgreso([]);
          }
          return;
        }

        const { data: pData, error: pErr } = await supabase
          .from("profiles")
          .select("start_date, plan, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (pErr) console.error("profiles error", pErr.message);

        const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
        const profileUsername =
          pData &&
          typeof (pData as { username?: unknown }).username === "string"
            ? (pData as { username?: string }).username ?? null
            : typeof metadata.username === "string"
            ? (metadata.username as string)
            : typeof metadata.user_name === "string"
            ? (metadata.user_name as string)
            : typeof metadata.preferred_username === "string"
            ? (metadata.preferred_username as string)
            : typeof user.email === "string"
            ? user.email.split("@")[0] ?? null
            : null;

        const [
          { data: entregas, error: entErr },
          { data: completados, error: compErr },
        ] = await Promise.all([
          supabase.from("entregas").select("dia, imagen_url").order("dia"),
          supabase
            .from("progresos")
            .select("dia")
            .eq("user_id", user.id)
            .eq("completado", true),
        ]);

        if (entErr) console.error("entregas error", entErr.message);
        if (compErr) console.error("progresos error", compErr.message);

        const startDate = pData?.start_date ? new Date(pData.start_date) : null;
        const diasDesdeInicio = startDate
          ? Math.floor(
              (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            )
          : 0;

        const completadosSet = new Set((completados ?? []).map((p) => p.dia));

        const progresoFormateado: ProgresoItem[] = (entregas || []).map(
          (e) => ({
            dia: e.dia,
            completado: completadosSet.has(e.dia),
            desbloqueado:
              pData?.plan === "gratis"
                ? e.dia === 1
                : e.dia <= diasDesdeInicio + 1,
            imagen_url: e.imagen_url || null,
          })
        );

        if (isMounted) {
          setPerfil(
            pData
              ? ({
                  ...pData,
                  username: profileUsername,
                } as Perfil)
              : null
          );
          setProgreso(progresoFormateado);
        }
      } catch (error) {
        console.error("dashboard fetch error", error);
      } finally {
        if (isMounted) {
          setLoadingProgreso(false);
        }
      }
    };

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const profileName = fullName || perfil?.full_name || "Estrella";
  const firstName = getFirstName(profileName);
  const initials = getInitials(profileName);
  const planLabel = formatPlan(perfil?.plan || "Sin plan");
  const startDateLabel = useMemo(() => {
    if (!perfil?.start_date) return "Sin fecha";
    const parsed = new Date(perfil.start_date);
    return Number.isNaN(parsed.getTime())
      ? "Sin fecha"
      : parsed.toLocaleDateString();
  }, [perfil?.start_date]);

  const items: (ProgresoItem | null)[] = loadingProgreso
    ? Array.from({ length: 8 }).map(() => null)
    : progreso;

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
                  Mi espacio
                </span>
              </span>
            </Link>

            <div className="mt-6 rounded-2xl border border-white/75 bg-white/60 p-4 dark:border-purple-900/50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gradient-to-br from-[#516fae] to-[#8d73b7] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(81,111,174,0.24)]">
                  {perfil?.avatar_url ? (
                    <Image
                      src={perfil.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d73b7] dark:text-purple-300">
                    Tu proceso
                  </p>
                  <p className="truncate text-sm font-semibold text-[#27304f] dark:text-zinc-100">
                    {profileName}
                  </p>
                  {perfil?.username && (
                    <p className="truncate text-xs text-[#777088] dark:text-zinc-500">
                      @{perfil.username}
                    </p>
                  )}
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
              Vuelve a tu practica con suavidad. Un paso pequeno tambien cuenta.
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-5 pb-8">
          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
                  Panel personal
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-[#27304f] dark:text-white sm:text-3xl">
                  Hola, {loadingHook ? "..." : firstName}. Retoma tu recorrido.
                </h1>
              </div>
              {nextUnlockedDay ? (
                <Link
                  href={`/protected/dia/${nextUnlockedDay.dia}`}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#516fae] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98]"
                  aria-label={`Continuar con el dia ${nextUnlockedDay.dia}`}
                >
                  Dia {nextUnlockedDay.dia}
                  <ArrowRight className="h-4 w-4 text-[#f4d99a]" />
                </Link>
              ) : (
                <Link
                  href="#practicas"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#516fae] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98]"
                >
                  Explorar practicas
                  <ArrowRight className="h-4 w-4 text-[#f4d99a]" />
                </Link>
              )}
            </div>
          </div>

          {esGratis && (
            <div className="rounded-[1.5rem] border border-[#c89a3c]/40 bg-[#fff3cf]/80 p-4 text-sm text-[#6d5321] shadow-sm backdrop-blur dark:border-[#c89a3c]/30 dark:bg-[#3a2d12]/50 dark:text-[#f1d293] sm:flex sm:items-center sm:justify-between sm:gap-4">
              <p>
                Tu plan actual es gratuito. Solo el dia 1 esta disponible por
                ahora.
              </p>
              <Link
                href="/upgrade"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#c89a3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ad8431] sm:mt-0"
              >
                Mejorar plan
              </Link>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Progreso"
              value={loadingProgreso ? "--" : `${progresoPercent}%`}
              helper={`${completadosCount} de ${totalDias || 0} dias`}
              icon={CheckCircle2}
            />
            <MetricCard
              label="Plan"
              value={planLabel}
              helper={`Inicio: ${startDateLabel}`}
              icon={Gem}
            />
            <MetricCard
              label="Bloqueados"
              value={loadingProgreso ? "--" : String(lockedCount)}
              helper="Se abren con tu ritmo"
              icon={Lock}
            />
          </div>

          <section
            id="recorrido"
            className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-4 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
                  Tu recorrido
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-[#27304f] dark:text-white">
                  Practicas por dia
                </h2>
              </div>
              {completadosCount > 0 && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {completadosCount} completados
                </span>
              )}
            </div>

            {!loadingProgreso && progreso.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-[#d8c6ff]/70 bg-white/60 p-10 text-center text-sm text-[#5f6680] dark:border-purple-900/60 dark:bg-white/5 dark:text-zinc-400">
                Aun no hay practicas disponibles. Cuando se publiquen, las
                veras aqui.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p, index) => (
                  <DayCard
                    key={p?.dia ?? `skeleton-${index}`}
                    item={p}
                    index={index}
                    loading={loadingProgreso}
                  />
                ))}
              </div>
            )}
          </section>

          <section
            id="practicas"
            className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-4 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-5"
          >
            <PracticesGallery />
          </section>
        </section>

        <aside className="space-y-5 pb-8 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
              Estado actual
            </p>
            <div className="mt-4 space-y-3">
              <div className="h-2 overflow-hidden rounded-full bg-[#d8c6ff]/45 dark:bg-purple-950">
                <div
                  className="h-full rounded-full bg-[#516fae]"
                  style={{ width: `${progresoPercent}%` }}
                  aria-valuenow={progresoPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>
              <p className="text-sm leading-6 text-[#5f6680] dark:text-zinc-400">
                {nextUnlockedDay
                  ? `Tu siguiente practica disponible es el dia ${nextUnlockedDay.dia}.`
                  : "No tienes practicas pendientes desbloqueadas ahora mismo."}
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
              Accesos
            </p>
            <div className="mt-4 grid gap-2">
              <QuickAction href="/protected/social" icon={MessageSquare}>
                Ir a comunidad
              </QuickAction>
              <QuickAction href="/protected/profile" icon={Settings}>
                Ajustar perfil
              </QuickAction>
              <QuickAction href="/upgrade" icon={Gem}>
                Ver planes
              </QuickAction>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof Sparkles;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-4 shadow-[0_18px_45px_rgba(81,111,174,0.08)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d73b7] dark:text-purple-300">
        <Icon className="h-4 w-4 text-[#c89a3c]" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-semibold text-[#27304f] dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-sm text-[#5f6680] dark:text-zinc-400">{helper}</p>
    </div>
  );
}

function DayCard({
  item,
  index,
  loading,
}: {
  item: ProgresoItem | null;
  index: number;
  loading: boolean;
}) {
  const isLocked = !loading && item && !item.desbloqueado;
  const isCompleted = !loading && item?.completado;
  const canOpen = !loading && item?.desbloqueado;

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.25rem] border bg-white/80 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(81,111,174,0.16)] dark:bg-gray-950/50 ${
        loading
          ? "border-[#d8c6ff]/45"
          : isLocked
          ? "border-[#d8c6ff]/40 opacity-65"
          : isCompleted
          ? "border-emerald-300/70"
          : "border-[#d8c6ff]/60"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {loading ? (
          <div className="h-full w-full animate-pulse bg-[#e9e3f6]" />
        ) : (
          <Image
            src={item?.imagen_url ?? "/fallback.png"}
            alt={`Dia ${item?.dia ?? ""}`}
            fill
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              item?.desbloqueado ? "opacity-72" : "opacity-25 grayscale"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/72 via-[#27304f]/12 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-sm font-semibold text-[#27304f] backdrop-blur dark:bg-gray-950/80 dark:text-white">
          {loading ? "Dia --" : `Dia ${item?.dia ?? ""}`}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <StatusPill loading={loading} item={item} />
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        </div>

        {loading ? (
          <div className="h-11 animate-pulse rounded-2xl bg-[#e9e3f6]" />
        ) : canOpen ? (
          <Link
            href={`/protected/dia/${item?.dia ?? ""}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#516fae] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#405c98]"
            aria-label={`Abrir dia ${item?.dia ?? ""}`}
          >
            Acceder al dia
            <Sparkles className="h-4 w-4 text-[#f4d99a]" />
          </Link>
        ) : (
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e7e0f3] px-4 py-3 text-sm font-semibold text-[#777088] dark:bg-purple-950/50 dark:text-zinc-400">
            <Lock className="h-4 w-4" />
            Proximamente
          </div>
        )}
      </div>
    </article>
  );
}

function StatusPill({
  loading,
  item,
}: {
  loading: boolean;
  item: ProgresoItem | null;
}) {
  if (loading) {
    return (
      <span className="rounded-full bg-[#e9e3f6] px-3 py-1 text-xs font-semibold text-[#777088]">
        Cargando
      </span>
    );
  }

  if (item?.completado) {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
        Completado
      </span>
    );
  }

  if (item?.desbloqueado) {
    return (
      <span className="rounded-full bg-[#fff3cf] px-3 py-1 text-xs font-semibold text-[#8a6724] dark:bg-[#3a2d12]/50 dark:text-[#f1d293]">
        Pendiente
      </span>
    );
  }

  return (
    <span className="rounded-full bg-[#e7e0f3] px-3 py-1 text-xs font-semibold text-[#777088] dark:bg-purple-950/50 dark:text-zinc-400">
      Bloqueado
    </span>
  );
}

function QuickAction({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-white/75 bg-white/60 px-3 py-3 text-sm font-semibold text-[#535b78] transition hover:bg-white hover:text-[#516fae] dark:border-purple-900/50 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-purple-200"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#8d73b7] transition group-hover:text-[#c89a3c]" />
        {children}
      </span>
      <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}

function getInitials(value: string | null | undefined) {
  if (!value) return "E";

  const parts = value.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";

  return (first + last || "E").toUpperCase();
}

function getFirstName(value: string | null | undefined) {
  if (!value) return "Estrella";

  return value.split(/\s+/).filter(Boolean)[0] ?? "Estrella";
}

function formatPlan(value: string) {
  if (!value) return "Sin plan";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
