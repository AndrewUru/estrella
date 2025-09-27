"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/outline";
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
  plan: "gratis" | "membresia" | "vip" | string;
  full_name: string | null;
  avatar_url?: string | null;
  username?: string | null;
};

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
    const done = progreso.filter((p) => p.completado).length;
    return Math.round((done / progreso.length) * 100);
  }, [progreso]);

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
          .select("start_date, plan, full_name, avatar_url, username")
          .eq("id", user.id)
          .single();

        if (pErr) console.error("profiles error", pErr.message);

        const [
          { data: entregas, error: entErr },
          { data: completados, error: compErr },
        ] = await Promise.all([
          supabase.from("entregas").select("dia, imagen_url").order("dia"),
          supabase.from("progresos").select("dia").eq("user_id", user.id),
        ]);

        if (entErr) console.error("entregas error", entErr.message);
        if (compErr) console.error("progresos error", compErr.message);

        const startDate = pData?.start_date ? new Date(pData.start_date) : null;
        const diasDesdeInicio = startDate
          ? Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        const completadosSet = new Set((completados ?? []).map((p) => p.dia));

        const progresoFormateado: ProgresoItem[] = (entregas || []).map((e) => ({
          dia: e.dia,
          completado: completadosSet.has(e.dia),
          desbloqueado:
            pData?.plan === "gratis" ? e.dia === 1 : e.dia <= diasDesdeInicio + 1,
          imagen_url: e.imagen_url || null,
        }));

        if (isMounted) {
          setPerfil((pData as Perfil) ?? null);
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
  const greetingName = loadingHook ? "..." : profileName;
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "E";
  const planLabel = perfil?.plan || "Sin plan";
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
    <div className="relative min-h-screen bg-slate-50 pb-16 dark:bg-gray-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-72 bg-gradient-to-b from-purple-200/40 via-transparent to-transparent blur-3xl sm:block dark:from-purple-900/40" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8 md:pt-12">
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr),340px] lg:items-start">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40">
            <div className="flex items-center gap-3 text-sm font-medium text-purple-600 dark:text-purple-300">
              <SparklesIcon className="h-6 w-6" />
              <span>Espacio protegido</span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
              Hola, {greetingName}
            </h1>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              Acompana tu proceso con calma. Retoma el programa donde lo dejaste y usa las practicas como guia diaria.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {loadingProgreso ? (
                <div className="h-12 w-40 animate-pulse rounded-full bg-gray-200/80 dark:bg-gray-700/60" />
              ) : nextUnlockedDay ? (
                <Link
                  href={`/protected/dia/${nextUnlockedDay.dia}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-purple-700 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  aria-label={`Continuar con el dia ${nextUnlockedDay.dia}`}
                >
                  <span>Continuar con el dia {nextUnlockedDay.dia}</span>
                  <SparklesIcon className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="#practicas"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow transition hover:from-purple-700 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                >
                  <span>Explorar practicas</span>
                  <SparklesIcon className="h-4 w-4" />
                </Link>
              )}

              <Link
                href="/protected/profile"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300/80 bg-white/70 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-purple-300 hover:text-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 dark:border-white/20 dark:bg-black/30 dark:text-gray-100 dark:hover:border-purple-400"
              >
                <span>Ver perfil</span>
              </Link>
            </div>
          </div>

          <aside className="flex h-full flex-col gap-6 rounded-3xl border border-purple-200/60 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-6 text-white shadow-lg backdrop-blur dark:border-purple-400/30 dark:from-purple-700 dark:via-purple-600 dark:to-pink-500">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/40 bg-white/10">
                {perfil?.avatar_url ? (
                  <Image
                    src={perfil.avatar_url}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-content-center text-xl font-semibold">
                    {profileInitial}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-white/70">
                  Tu perfil
                </p>
                <p className="truncate text-lg font-semibold">{profileName}</p>
                {perfil?.username && (
                  <p className="truncate text-xs text-white/80">@{perfil.username}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-white/70">Progreso total</p>
              <p className="text-4xl font-semibold">
                {loadingProgreso ? "--" : `${progresoPercent}%`}
              </p>
              <p className="text-sm text-white/80">
                {completadosCount} de {totalDias || 0} dias completados
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${progresoPercent}%` }}
                  aria-valuenow={progresoPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>
            </div>

            <ul className="grid gap-3 text-sm text-white/90">
              <li className="flex items-center justify-between">
                <span>Plan</span>
                <span className="font-semibold">{planLabel}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Inicio</span>
                <span className="font-semibold">{startDateLabel}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Bloqueados</span>
                <span className="font-semibold">{lockedCount}</span>
              </li>
            </ul>
          </aside>
        </header>

        {esGratis && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-950/40 dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Tu plan actual es gratuito. Solo el dia 1 esta disponible. Actualiza para desbloquear el resto del recorrido.
            </p>
            <Link
              href="/upgrade"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Mejorar plan
            </Link>
          </div>
        )}

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Tu recorrido
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Revisa cada dia y avanza a tu ritmo. Las sesiones se desbloquean conforme avanzas.
              </p>
            </div>
            {completadosCount > 0 && (
              <span className="rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700 dark:border-green-400/30 dark:bg-green-950/40 dark:text-green-300">
                {completadosCount} dias completados
              </span>
            )}
          </div>

          {!loadingProgreso && progreso.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white/70 p-12 text-center text-sm text-gray-600 dark:border-white/20 dark:bg-black/40 dark:text-gray-300">
              Aun no hay practicas disponibles. Cuando se publiquen, las veras aqui.
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p, index) => (
                <div
                  key={p?.dia ?? `skeleton-${index}`}
                  className={`group relative transform transition-all duration-300 ${
                    !loadingProgreso && p && !p.desbloqueado ? "opacity-60" : ""
                  } hover:-translate-y-2`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div
                    className={`relative h-80 rounded-3xl border shadow-xl transition-all duration-300 ${
                      loadingProgreso
                        ? "border-gray-200/70 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                        : p?.desbloqueado
                        ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                        : "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                    } ${
                      !loadingProgreso && (p?.completado ?? false)
                        ? "ring-2 ring-green-400/60"
                        : ""
                    }`}
                  >
                    <div className="absolute inset-0">
                      {!loadingProgreso ? (
                        <Image
                          src={p?.imagen_url ?? "/fallback.png"}
                          alt={`Dia ${p?.dia ?? ""}`}
                          fill
                          className={`object-cover transition-all duration-500 ${
                            p?.desbloqueado
                              ? "opacity-30 group-hover:opacity-50"
                              : "opacity-10 group-hover:opacity-20"
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="h-full w-full animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-6">
                      <div className="flex items-start justify-between">
                        <div className="rounded-2xl bg-white/90 px-4 py-2 text-gray-800 shadow-sm backdrop-blur dark:bg-black/70 dark:text-white">
                          <h3 className="text-xl font-semibold">
                            {loadingProgreso ? "Dia --" : `Dia ${p?.dia ?? ""}`}
                          </h3>
                        </div>
                        <div
                          className={`h-4 w-4 rounded-full border-2 transition-all duration-300 ${
                            loadingProgreso
                              ? "border-white/40"
                              : p?.completado
                              ? "border-green-400 bg-green-400 shadow-lg shadow-green-400/40"
                              : "border-white/60"
                          }`}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur dark:bg-black/70 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            {loadingProgreso ? (
                              <>
                                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
                                <span>Cargando...</span>
                              </>
                            ) : p?.completado ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                                <span>Completado</span>
                              </>
                            ) : p?.desbloqueado ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-orange-400" />
                                <span>Pendiente</span>
                              </>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-gray-400" />
                                <span>Bloqueado</span>
                              </>
                            )}
                          </div>
                        </div>

                        {loadingProgreso ? (
                          <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700" />
                        ) : p?.desbloqueado ? (
                          <Link
                            href={`/protected/dia/${p?.dia ?? ""}`}
                            className="group/btn flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:from-purple-600 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                            aria-label={`Abrir dia ${p?.dia ?? ""}`}
                          >
                            <span>Acceder al dia</span>
                            <SparklesIcon className="h-5 w-5 transition-transform duration-300 group-hover/btn:rotate-12" />
                          </Link>
                        ) : (
                          <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-300 px-6 py-4 text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Proximamente</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section id="practicas" className="mt-16">
        <PracticesGallery />
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
