"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  SparklesIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";

type Entrega = {
  dia: number;
  titulo: string;
  descripcion: string;
  archivo_pdf?: string;
  audio_url?: string;
};

function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const handleEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-4">
      <button onClick={togglePlay} className="text-purple-600" type="button">
        {isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
      <audio ref={audioRef} src={src} preload="auto" />
      <span className="text-sm text-gray-700">Meditación del día</span>
    </div>
  );
}

export default function DiaPage() {
  const params = useParams();
  const router = useRouter();
  const dia = parseInt(params.dia as string);

  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [loading, setLoading] = useState(true);

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
        .select("start_date")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date) return;

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const acceso = dia <= diasDesdeInicio + 1;
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

  if (!accesoPermitido)
    return (
      <div className="flex flex-col items-center mt-20 px-4 text-center">
        <DocumentTextIcon className="w-12 h-12 text-yellow-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Este contenido no está disponible aún.
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
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
    <div className="max-w-3xl mx-auto mt-10 px-6 bg-white rounded-2xl shadow-xl py-10 transition-all duration-300">
      <h1 className="text-3xl font-extrabold mb-4 text-purple-700 flex items-center gap-2">
        Día {entrega.dia} <span className="text-lg font-normal">|</span>{" "}
        <span>{entrega.titulo}</span>
      </h1>
      <p className="mb-6 text-lg text-gray-700">{entrega.descripcion}</p>

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

        {entrega.audio_url && <AudioPlayer src={entrega.audio_url} />}
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
