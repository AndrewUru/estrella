import { useEffect } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export type ChannelAction = "INSERT" | "UPDATE" | "DELETE";

interface RealtimePayload<TRecord> {
  type: ChannelAction;
  new: TRecord | null;
  old: TRecord | null;
}

export function useRealtime<TRecord extends Record<string, unknown>>(
  table: string,
  onChange: (payload: RealtimePayload<TRecord>) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload: RealtimePostgresChangesPayload<TRecord>) => {
          onChange({
            type: payload.eventType as ChannelAction,
            new: (payload.new as TRecord | null) ?? null,
            old: (payload.old as TRecord | null) ?? null,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onChange]);
}
