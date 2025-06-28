"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type ProgresoItem = {
  dia: number;
  completado: boolean;
  desbloqueado: boolean;
  imagen_url?: string | null;
};

export default function DashboardPage() {
  const [progreso, setProgreso] = useState<ProgresoItem[]>([]);
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgreso = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUsuario(user.email || "Usuario");

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

      const { data: entregas } = await supabase
        .from("entregas")
        .select("dia, imagen_url")
        .order("dia");

      const { data: completados } = await supabase
        .from("progreso")
        .select("dia")
        .eq("user_id", user.id);

      const completadosSet = new Set(completados?.map((p) => p.dia));

      const progresoFormateado: ProgresoItem[] = (entregas || []).map((e) => ({
        dia: e.dia,
        completado: completadosSet.has(e.dia),
        desbloqueado: e.dia <= diasDesdeInicio + 1,
        imagen_url: e.imagen_url || null,
      }));

      setProgreso(progresoFormateado);
    };

    fetchProgreso();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary truncate max-w-full">
          ¡Bienvenida,
          <span className="ml-1 inline-block max-w-[300px] align-middle truncate text-foreground">
            {usuario}
          </span>
          !
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Este es tu portal vibracional. Avanza un día a la vez, con presencia y
          escucha interna ✨
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {progreso.map((p) => (
          <div
            key={p.dia}
            className={`relative border rounded-2xl shadow-md overflow-hidden group ${
              p.desbloqueado
                ? "bg-background text-foreground"
                : "bg-muted text-muted"
            }`}
          >
            <Image
              src={p.imagen_url || "/fallback.png"}
              alt={`Día ${p.dia}`}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-30 transition duration-300"
            />

            <div className="relative z-10 space-y-2 bg-black/50 dark:bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <h2 className="text-lg font-semibold text-white dark:text-white">
                Día {p.dia}
              </h2>
              <p className="text-sm text-white dark:text-white">
                Estado:{" "}
                {p.completado ? (
                  <span className="text-green-400 font-medium">
                    ✅ Completado
                  </span>
                ) : (
                  <span className="text-red-400 font-medium">
                    ❌ Incompleto
                  </span>
                )}
              </p>

              {p.desbloqueado ? (
                <Link
                  href={`/protected/dia/${p.dia}`}
                  className="inline-flex items-center gap-2 bg-white dark:bg-primary text-black dark:text-background px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  Acceder al Día
                  <SparklesIcon className="w-4 h-4" />
                </Link>
              ) : (
                <p className="text-sm italic text-white/80 dark:text-white/60">
                  Disponible próximamente
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
