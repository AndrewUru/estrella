import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

/**
 * Hook genérico para suscribirse a actualizaciones Realtime de una tabla de Supabase.
 * @param table Nombre de la tabla (por ejemplo, "progress_updates")
 * @param callback Función que recibe el payload tipado del evento
 */
export function useRealtime<T extends Record<string, unknown>>(
  table: string,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          // 👇 Cast explícito para preservar el tipo genérico T
          callback(payload as RealtimePostgresChangesPayload<T>);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, callback]);
}
