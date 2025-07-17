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
          className="w-12 h-12 text-blue-500 mb-4 animate-spin"
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
            icon: <SparklesIcon className="w-12 h-12 text-purple-500 mb-4" />,
            titulo: "Este contenido es parte del plan premium",
            descripcion:
              "Gracias por unirte al Día 1 de forma gratuita. Para seguir avanzando en tu viaje interior, puedes desbloquear todos los días del programa por solo 22 €.",
          }
        : {
            icon: (
              <DocumentTextIcon className="w-12 h-12 text-yellow-400 mb-4" />
            ),
            titulo: "Este contenido no está disponible aún.",
            descripcion:
              "Cada día tiene su tiempo sagrado. Vuelve más adelante cuando tu alma esté lista para recibir este material.",
          };

    return (
      <div className="flex flex-col items-center mt-20 px-4 text-center">
        {mensaje.icon}
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
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
        <DocumentTextIcon className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
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
    <div className="max-w-3xl mx-auto mt-10 px-6 rounded-2xl shadow-xl py-10 transition-all duration-300">
      <h1 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
        Día {entrega.dia} <span className="text-lg font-normal">|</span>{" "}
        <span>{entrega.titulo}</span>
      </h1>
      <p className="mb-6 text-lg ">{entrega.descripcion}</p>

      <div className="flex flex-col gap-6">
        {entrega.archivo_pdf && (
          <div className="text-blue-600 underline hover:text-blue-800 transition flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6" />
            <a
              href={entrega.archivo_pdf}
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar guía energética en PDF
            </a>
          </div>
        )}

        {entrega.audio_url && (
          <div className="p-4 rounded-xl shadow-lg">
            <audio
              controls
              src={entrega.audio_url}
              className="w-full"
              preload="auto"
            >
              Tu navegador no soporta la reproducción de audio.
            </audio>
            <span className="text-sm block mt-2">Meditación del día</span>
          </div>
        )}
      </div>

      <div className="mt-10 border-t pt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">
          Cuando sientas que has integrado el contenido de hoy, puedes avanzar
          al siguiente paso en tu camino interior.
        </p>
        <button
          onClick={avanzarDia}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-semibold"
        >
          Completar Día <SparklesIcon className="w-5 h-5" />
        </button>

        <div className="mt-6">
          <a
            href="/protected"
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver al dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
