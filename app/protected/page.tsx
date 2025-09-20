"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import PracticesGallery from "@/components/PracticesGallery";

// Tipos estrictos
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
  const router = useRouter();

  // Hook existente (para saludo rápido)
  const { fullName, loading: loadingHook } = useUserProfile();

  const esGratis = perfil?.plan === "gratis";

  const progresoPercent = useMemo(() => {
    if (!progreso.length) return 0;
    const done = progreso.filter((p) => p.completado).length;
    return Math.round((done / progreso.length) * 100);
  }, [progreso]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingProgreso(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) console.error("auth error", userError.message);
      if (!user) {
        // Si no hay usuario, cerramos el loading para mostrar skeletons o redirigir si quieres
        setLoadingProgreso(false);
        // Opcional: descomenta para enviar a login
        // router.replace("/login");
        return;
      }

      // 1) Perfil
      const { data: pData, error: pErr } = await supabase
        .from("profiles")
        .select("start_date, plan, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (pErr) console.error("profiles error", pErr.message);
      setPerfil((pData as Perfil) ?? null);

      // 2) Entregas + completados en paralelo
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

      setProgreso(progresoFormateado);
      setLoadingProgreso(false);
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Fuente de items para el grid (sin `any`)
  const items: (ProgresoItem | null)[] = loadingProgreso
    ? Array.from({ length: 8 }).map(() => null)
    : (progreso as (ProgresoItem | null)[]);

  return (
    <div className="min-h-screen h-full overflow-x-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 px-8 pt-10 md:pt-10 lg:pt-12">
      <div className="w-full px-4 py-12">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6">
          {/* Fila superior: saludo + CTA perfil */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                ¡Bienvenid@,
                <span className="ml-2 inline-block max-w-[300px] align-middle truncate">
                  {loadingHook
                    ? "..."
                    : fullName || perfil?.full_name || "Estrella"}
                </span>
                !
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl font-light">
                Este es tu portal vibracional. Avanza un día a la vez, con
                presencia y escucha interna.
              </p>
            </div>

            <Link
              href="/protected/profile"
              className="group flex items-center gap-2 bg-white/80 dark:bg-black/40 px-5 py-3 rounded-2xl shadow hover:shadow-md border border-gray-200/70 dark:border-white/10 backdrop-blur-sm transition-colors hover:bg-white dark:hover:bg-black/60"
            >
              <div className="relative w-9 h-9 overflow-hidden rounded-full ring-2 ring-purple-400/60">
                {perfil?.avatar_url ? (
                  <Image
                    src={perfil.avatar_url}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-content-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold">
                    {(perfil?.full_name || fullName || "E").charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                Ir a mi perfil
              </span>
            </Link>
          </div>

          {/* Aviso plan gratuito */}
          {esGratis && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-6 py-4 rounded-2xl max-w-xl">
              Estás en el plan gratuito. Solo el Día 1 está desbloqueado.{" "}
              <Link href="/upgrade" className="underline font-semibold">
                Mejora tu plan
              </Link>{" "}
              para acceder al contenido completo ✨
            </div>
          )}

          {/* Tarjeta de Perfil Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-white/60 dark:bg-black/30 border border-gray-200/70 dark:border-white/10 rounded-3xl p-6 shadow backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 overflow-hidden rounded-3xl ring-2 ring-purple-400/50">
                  {perfil?.avatar_url ? (
                    <Image
                      src={perfil.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-content-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                      {(perfil?.full_name || fullName || "E").charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white truncate">
                      {perfil?.full_name || fullName || "Tu nombre"}
                    </h2>
                    {perfil?.username && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
                        @{perfil.username}
                      </span>
                    )}
                    {perfil?.plan && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                        Plan: {perfil.plan}
                      </span>
                    )}
                  </div>

                  {/* Progreso */}
                  <div className="mt-4 max-w-md">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progreso del viaje</span>
                      <span>
                        {progreso.filter((p) => p.completado).length} /{" "}
                        {progreso.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progresoPercent}%` }}
                        aria-valuenow={progresoPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rápidas */}
            <div className="bg-white/60 dark:bg-black/30 border border-gray-200/70 dark:border-white/10 rounded-3xl p-6 shadow backdrop-blur-sm grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Inicio del viaje
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {perfil?.start_date
                    ? new Date(perfil.start_date).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Días completados
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {progreso.filter((p) => p.completado).length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total de días
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {progreso.length || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Plan</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {perfil?.plan || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID de días */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((p, index) => (
            <div
              key={p?.dia ?? `skeleton-${index}`}
              className={`group relative transform transition-all duration-300 hover:scale-105 ${
                !loadingProgreso && p && !p.desbloqueado ? "opacity-60" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div
                className={`relative h-80 rounded-3xl overflow-hidden shadow-xl ${
                  loadingProgreso
                    ? "bg-gray-100 dark:bg-gray-800 border border-gray-200/70 dark:border-gray-700"
                    : p?.desbloqueado
                    ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                } ${
                  !loadingProgreso && (p?.completado ?? false)
                    ? "ring-2 ring-green-400 ring-opacity-50"
                    : ""
                } hover:shadow-2xl transition-all duration-300`}
              >
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                  {!loadingProgreso ? (
                    <Image
                      src={p?.imagen_url ?? "/fallback.png"}
                      alt={`Día ${p?.dia ?? "—"}`}
                      fill
                      className={`object-cover transition-all duration-500 ${
                        p?.desbloqueado
                          ? "opacity-30 group-hover:opacity-50"
                          : "opacity-10 group-hover:opacity-20"
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Contenido de la card */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* Header card */}
                  <div className="flex items-start justify-between">
                    <div className="bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {loadingProgreso ? "Día —" : `Día ${p?.dia ?? "—"}`}
                      </h2>
                    </div>

                    {/* Estado visual */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                        loadingProgreso
                          ? "bg-transparent border-white/40"
                          : p?.completado ?? false
                          ? "bg-green-400 border-green-400 shadow-lg shadow-green-400/50"
                          : "bg-transparent border-white/50"
                      }`}
                    />
                  </div>

                  {/* Footer card */}
                  <div className="space-y-4">
                    {/* Estado textual */}
                    <div className="bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        {loadingProgreso ? (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                            <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
                              Cargando…
                            </span>
                          </>
                        ) : p?.completado ?? false ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                              Completado
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-orange-400 rounded-full" />
                            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                              Pendiente
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Botón acción */}
                    {loadingProgreso ? (
                      <div className="w-full h-12 rounded-2xl bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    ) : p?.desbloqueado ? (
                      <Link
                        href={`/protected/dia/${p?.dia ?? ""}`}
                        className="group/btn flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <span>Acceder al Día</span>
                        <SparklesIcon className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 w-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-6 py-4 rounded-2xl font-medium text-sm cursor-not-allowed">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Próximamente</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PracticesGallery />

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
