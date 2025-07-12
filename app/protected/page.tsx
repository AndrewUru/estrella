"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

type ProgresoItem = {
  dia: number;
  completado: boolean;
  desbloqueado: boolean;
  imagen_url?: string | null;
};

export default function DashboardPage() {
  const [progreso, setProgreso] = useState<ProgresoItem[]>([]);
  const [esGratis, setEsGratis] = useState(false);
  const router = useRouter();
  const { fullName, loading } = useUserProfile();

  useEffect(() => {
    const fetchProgreso = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: perfil } = await supabase
        .from("profiles")
        .select("start_date, plan")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date) return;

      setEsGratis(perfil.plan === "gratis");

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const { data: entregas } = await supabase
        .from("entregas")
        .select("dia, imagen_url")
        .order("dia");

      const { data: completados } = await supabase
        .from("progresos")
        .select("dia")
        .eq("user_id", user.id);

      const completadosSet = new Set(completados?.map((p) => p.dia));

      const progresoFormateado: ProgresoItem[] = (entregas || []).map((e) => ({
        dia: e.dia,
        completado: completadosSet.has(e.dia),
        desbloqueado:
          perfil.plan === "gratis"
            ? e.dia === 1
            : e.dia <= diasDesdeInicio + 1,
        imagen_url: e.imagen_url || null,
      }));

      setProgreso(progresoFormateado);
    };

    fetchProgreso();
  }, [router]);

  return (
    <div className="min-h-screen h-full overflow-x-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 px-8 pt-10 md:pt-10 lg:pt-12">
      <div className="w-full px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            ¡Bienvenid@,
            <span className="ml-2 inline-block max-w-[300px] align-middle truncate">
              {loading ? "..." : fullName || "Estrella"}
            </span>
            !
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-light">
            Este es tu portal vibracional. Avanza un día a la vez, con presencia
            y escucha interna.
          </p>

          {esGratis && (
            <div className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-6 py-4 rounded-2xl max-w-xl mx-auto">
              Estás en el plan gratuito. Solo el Día 1 está desbloqueado. <Link href="/upgrade" className="underline font-semibold">Mejora tu plan</Link> para acceder al contenido completo ✨
            </div>
          )}

          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progreso del viaje</span>
              <span>
                {progreso.filter((p) => p.completado).length} / {progreso.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${
                    (progreso.filter((p) => p.completado).length / progreso.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Grid de días mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {progreso.map((p, index) => (
            <div
              key={p.dia}
              className={`group relative transform transition-all duration-300 hover:scale-105 ${
                !p.desbloqueado ? "opacity-60" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div
                className={`
                relative h-80 rounded-3xl overflow-hidden shadow-xl
                ${
                  p.desbloqueado
                    ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                }
                ${p.completado ? "ring-2 ring-green-400 ring-opacity-50" : ""}
                hover:shadow-2xl transition-all duration-300
              `}
              >
                {/* Imagen de fondo mejorada */}
                <div className="absolute inset-0">
                  <Image
                    src={p.imagen_url || "/fallback.png"}
                    alt={`Día ${p.dia}`}
                    layout="fill"
                    objectFit="cover"
                    className={`transition-all duration-500 ${
                      p.desbloqueado
                        ? "opacity-30 group-hover:opacity-50"
                        : "opacity-10 group-hover:opacity-20"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Contenido de la card */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between">
                    <div className="bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Día {p.dia}
                      </h2>
                    </div>

                    {/* Estado visual */}
                    <div
                      className={`
                      w-4 h-4 rounded-full border-2 transition-all duration-300
                      ${
                        p.completado
                          ? "bg-green-400 border-green-400 shadow-lg shadow-green-400/50"
                          : "bg-transparent border-white/50"
                      }
                    `}
                    />
                  </div>

                  {/* Footer de la card */}
                  <div className="space-y-4">
                    {/* Estado textual mejorado */}
                    <div className="bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.completado ? (
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

                    {/* Botón de acción mejorado */}
                    {p.desbloqueado ? (
                      <Link
                        href={`/protected/dia/${p.dia}`}
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
