//C:\estrella\app\protected\dia\[dia]\page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

type Entrega = {
  dia: number;
  titulo: string;
  descripcion: string;
  archivo_pdf?: string;
  audio_url?: string;
};

type Plan = "gratis" | "premium";

export default function DiaPage() {
  const params = useParams();
  const router = useRouter();
  const dia = parseInt(params.dia as string);

  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [loading, setLoading] = useState(true);
  const [tipoPlan, setTipoPlan] = useState<Plan | null>(null);

  const avanzarDia = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("No se pudo obtener el usuario.");
      return;
    }

    const { data: existente, error: fetchError } = await supabase
      .from("progresos")
      .select("id")
      .eq("user_id", user.id)
      .eq("dia", dia)
      .maybeSingle();

    if (fetchError) {
      console.error("Error verificando progreso:", fetchError);
      alert("Error verificando si ya completaste este día.");
      return;
    }

    if (existente) {
      alert("Ya has completado este día ✨");
      router.push("/protected");
      return;
    }

    const { error } = await supabase.from("progresos").insert({
      user_id: user.id,
      dia: dia,
    });

    if (error) {
      console.error("Error al insertar progreso:", error);
      alert("Hubo un problema al guardar tu avance.");
    } else {
      router.push("/protected");
    }
  };

  useEffect(() => {
    const cargarEntrega = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return router.push("/auth/login");

      const { data: perfil } = await supabase
        .from("profiles")
        .select("start_date, plan")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date || !perfil.plan) return;

      setTipoPlan(perfil.plan);

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const acceso =
        (perfil.plan === "gratis" && dia === 1) || dia <= diasDesdeInicio + 1;

      setAccesoPermitido(acceso);

      if (!acceso) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("entregas")
        .select("*")
        .eq("dia", dia)
        .single();

      setEntrega(data);
      setLoading(false);
    };

    cargarEntrega();
  }, [dia, router]);

  if (loading)
    return (
      <div className="flex flex-col items-center mt-20 animate-pulse">
        <svg
          className="w-12 h-12 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.85)] mb-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-center text-lg text-gray-700">
          Cargando contenido energético...
        </p>
      </div>
    );

  if (!accesoPermitido) {
    const mensaje =
      tipoPlan === "gratis" && dia > 1
        ? {
            icon: (
              <SparklesIcon className="w-12 h-12 text-[hsl(var(--accent))] mb-4" />
            ),
            titulo: "Este contenido es parte del plan premium",
            descripcion:
              "Gracias por unirte al Día 1 de forma gratuita. Para seguir avanzando en tu viaje interior, puedes desbloquear todos los días del programa por solo 22 €.",
          }
        : {
            icon: (
              <DocumentTextIcon className="w-12 h-12 text-[hsl(var(--accent))] mb-4" />
            ),
            titulo: "Este contenido no está disponible aún.",
            descripcion:
              "Cada día tiene su tiempo sagrado. Vuelve más adelante cuando tu alma esté lista para recibir este material.",
          };

    return (
      <div className="flex flex-col items-center mt-20 px-4 text-center">
        {mensaje.icon}
        <h2 className="text-2xl font-semibold mb-2 text-[hsl(var(--foreground))]">
          {mensaje.titulo}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{mensaje.descripcion}</p>
        <a
          href="/protected/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver al dashboard
        </a>
      </div>
    );
  }

  if (!entrega)
    return (
      <div className="flex flex-col items-center mt-20 px-4 text-center">
        <DocumentTextIcon className="w-12 h-12 text-[hsl(var(--destructive)) mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-[hsl(var(--foreground))]">
          Contenido no encontrado.
        </h2>
        <p className="text-gray-600 mb-6">
          No se ha cargado material para el día {dia}. Puede que esté en proceso
          de canalización ✨.
        </p>
        <a
          href="/protected/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver al dashboard
        </a>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 rounded-2xl shadow-xl py-10 transition-all duration-300 bg-gradient-to-br from-purple-50/80 via-purple-100/60 to-violet-100/40 dark:from-purple-950 dark:via-violet-950/60 dark:to-gray-900 border border-purple-200 dark:border-purple-800">
      {/* Header con mejor jerarquía visual */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Canalización de Samarí Luz
        </div>
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Día {entrega.dia}{" "}
          <span className="text-2xl font-normal text-muted-foreground">|</span>{" "}
          <span className="block md:inline text-3xl mt-2 md:mt-0">
            {entrega.titulo}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {entrega.descripcion}
        </p>
      </div>

      {/* Contenido principal con mejor organización */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Sección PDF */}
        {entrega.archivo_pdf && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Guía Energética
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Material complementario en PDF
                </p>
              </div>
            </div>
            <a
              href={entrega.archivo_pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 font-medium group-hover:scale-105"
            >
              Descargar PDF
            </a>
          </div>
        )}

        {/* Sección Audio */}
        {entrega.audio_url && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0 3 3 0 00-6 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Meditación Canalizada
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Audio guiado por Samarí Luz
                </p>
              </div>
            </div>
            <div className="bg-purple-100/30 dark:bg-purple-900/30 p-4 rounded-lg">
              <audio
                controls
                src={entrega.audio_url}
                className="w-full h-12 rounded-lg"
                preload="auto"
                style={{
                  filter:
                    "sepia(20%) saturate(70%) hue-rotate(290deg) brightness(1.1)",
                }}
              >
                Tu navegador no soporta la reproducción de audio.
              </audio>
            </div>
          </div>
        )}
      </div>

      {/* Sección de integración mejorada */}
      <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 dark:from-zinc-900 dark:via-purple-950 dark:to-pink-950 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-700">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white dark:text-purple-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">
          Momento de Integración
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300 mb-6 max-w-md mx-auto">
          Tómate el tiempo que necesites para sentir y asimilar la energía de
          esta canalización.
        </p>

        <button
          onClick={avanzarDia}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white dark:text-purple-100 rounded-full hover:opacity-90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span>Completar Día</span>
          <SparklesIcon className="w-6 h-6" />
        </button>

        {/* Navegación mejorada */}
        <div className="mt-8 pt-6 border-t border-purple-200 dark:border-purple-700">
          <a
            href="/protected"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-zinc-800 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-100 dark:hover:bg-zinc-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium border border-purple-200 dark:border-purple-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver a Mi espacio
          </a>
        </div>
      </div>

      {/* Elementos decorativos sutiles */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full opacity-20 blur-lg"></div>
    </div>
  );
}
