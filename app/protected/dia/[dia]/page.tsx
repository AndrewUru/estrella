"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function DiaPage() {
  const { dia } = useParams();
  const router = useRouter();

  const [accesoPermitido, setAccesoPermitido] = useState(false);
  interface Entrega {
    dia: number;
    titulo: string;
    descripcion: string;
    archivo_pdf: string;
    audio_url: string;
  }

  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [loading, setLoading] = useState(true);

  const avanzarDia = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const { error } = await supabase.rpc("avanzar_dia_usuario", {
      uid: session.user.id,
    });

    if (error) {
      console.error("Error al avanzar de día:", error.message);
    } else {
      router.push(`/protected/dia/${Number(dia) + 1}`);
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
        .select("start_date")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date) return;

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const diaActual = parseInt(dia as string);
      const acceso = diaActual <= diasDesdeInicio + 1;
      setAccesoPermitido(acceso);

      if (!acceso) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("entregas")
        .select("*")
        .eq("dia", diaActual)
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <p className="text-center text-lg text-gray-700">
          Cargando contenido energético...
        </p>
      </div>
    );

  if (!accesoPermitido) {
    return (
      <div className="flex flex-col items-center mt-20 px-4">
        <DocumentTextIcon className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Este contenido no está disponible aún.
        </h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Cada día tiene su tiempo sagrado. Vuelve más adelante cuando tu alma
          esté lista para recibir este material.
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
  }

  if (!entrega) {
    return (
      <div className="flex flex-col items-center mt-20 px-4">
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
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 bg-white rounded-lg shadow-lg py-8 transition-all duration-300">
      <h1 className="text-3xl font-extrabold mb-2 text-blue-700 flex items-center gap-2">
        Día {entrega.dia}
        <span className="text-gray-500 text-lg font-normal">|</span>
        <span className="text-gray-800">{entrega.titulo}</span>
      </h1>
      <p className="mb-6 text-gray-700 text-lg">{entrega.descripcion}</p>

      <div className="flex flex-col gap-4">
        {entrega.archivo_pdf && (
          <a
            href={entrega.archivo_pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 underline hover:text-blue-800 transition"
          >
            <DocumentTextIcon className="w-6 h-6" />
            Descargar guía energética en PDF
          </a>
        )}

        {entrega.audio_url && (
          <div className="flex items-center gap-2 mt-2">
            <SpeakerWaveIcon className="w-6 h-6 text-green-500" />
            <audio controls className="w-full">
              <source src={entrega.audio_url} type="audio/mpeg" />
              Tu navegador no soporta el audio.
            </audio>
          </div>
        )}
      </div>

      <div className="mt-10 border-t pt-6 text-center">
        <p className="text-gray-600 text-sm mb-4">
          Cuando sientas que has integrado el contenido de hoy, puedes avanzar
          al siguiente paso en tu camino interior.
        </p>
        <button
          onClick={avanzarDia}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition font-semibold"
        >
          Completar Día
          <SparklesIcon className="w-5 h-5" />
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
