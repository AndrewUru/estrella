import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

/**
 * Suscribe un canal realtime genérico a una tabla de Supabase
 * con tipado seguro de payload.
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
        (payload: RealtimePostgresChangesPayload<T>) => callback(payload)
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, callback]);
}
