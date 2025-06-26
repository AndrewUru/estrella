"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type ProgresoItem = {
  dia: number;
  completado: boolean;
  desbloqueado: boolean;
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
        .select("dia")
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
      }));

      setProgreso(progresoFormateado);
    };

    fetchProgreso();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">¡Bienvenido, {usuario}!</h1>
        <p className="text-gray-500">Aquí está tu camino diario</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {progreso.map((p) => (
          <div
            key={p.dia}
            className={`border rounded-xl p-4 shadow-sm ${
              p.desbloqueado ? "bg-white" : "bg-gray-100 opacity-50"
            }`}
          >
            <h2 className="text-lg font-semibold">Día {p.dia}</h2>
            <p className="text-sm mb-2">
              Estado:{" "}
              {p.completado ? (
                <span className="text-green-600">✅ Completado</span>
              ) : (
                <span className="text-red-600">❌ Incompleto</span>
              )}
            </p>

            {p.desbloqueado ? (
              <Link
                href={`/protected/dia/${p.dia}`}
                className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Ir al contenido
              </Link>
            ) : (
              <p className="text-sm text-gray-500">Disponible próximamente</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
