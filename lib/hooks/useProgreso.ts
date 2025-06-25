"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// Define el tipo del progreso
type Progreso = {
  id: string;
  user_id: string;
  dia: number;
  completado: boolean;
  completado_at: string | null;
  desbloqueado: boolean; // ✅ nueva propiedad
};

export function useProgreso() {
  const [progreso, setProgreso] = useState<Progreso[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cargarProgreso = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("❌ Error obteniendo usuario:", userError.message);
        return;
      }
      if (!user) {
        console.warn("⚠️ No hay usuario autenticado.");
        return;
      }

      setUserId(user.id);

      try {
        const res = await fetch("/api/progreso/init", {
          method: "POST",
          body: JSON.stringify({ user_id: user.id }),
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error("❌ Error inicializando progreso:", errData);
        }
      } catch (err) {
        console.error("❌ Error llamando a /api/progreso/init:", err);
      }

      const { data, error } = await supabase
        .from("progresos")
        .select("*")
        .eq("user_id", user.id)
        .order("dia");

      if (error) {
        console.error("❌ Error cargando progresos:", error.message);
        return;
      }

      console.log("✅ Progreso cargado:", data);
      setProgreso(data || []);
    };

    cargarProgreso();
  }, []);

  return { progreso, userId, setProgreso };
}
