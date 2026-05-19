"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radio, ShieldCheck, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
};

type PresenceUser = {
  user_id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  online_at: string;
};

type PresenceState = Record<string, PresenceUser[]>;

type OnlinePresenceProps = {
  currentUser: CurrentUser;
};

export function OnlinePresence({ currentUser }: OnlinePresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const displayName =
    currentUser.fullName || currentUser.email?.split("@")[0] || "Comunidad Estrella";

  useEffect(() => {
    let mounted = true;

    const channel = supabase.channel("social:online-presence", {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    const syncPresence = () => {
      const state = channel.presenceState() as PresenceState;
      const users = Object.values(state)
        .flat()
        .filter(Boolean)
        .sort((a, b) => a.full_name.localeCompare(b.full_name));

      if (mounted) {
        setOnlineUsers(users);
      }
    };

    channel
      .on("presence", { event: "sync" }, syncPresence)
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        setIsConnected(true);
        await channel.track({
          user_id: currentUser.id,
          full_name: displayName,
          email: currentUser.email,
          avatar_url: currentUser.avatarUrl,
          online_at: new Date().toISOString(),
        });
      });

    const handleBeforeUnload = () => {
      void channel.untrack();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      void channel.untrack();
      void supabase.removeChannel(channel);
    };
  }, [currentUser.avatarUrl, currentUser.email, currentUser.id, displayName]);

  const visibleUsers = useMemo(() => onlineUsers.slice(0, 5), [onlineUsers]);
  const hiddenCount = Math.max(onlineUsers.length - visibleUsers.length, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5"
    >
      <div className="relative border-b border-[#d8c6ff]/45 px-4 py-4 dark:border-purple-900/45">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(16,185,129,0.14),transparent_36%),radial-gradient(circle_at_90%_10%,rgba(200,154,60,0.12),transparent_35%)]" />
        <div className="relative flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8d73b7] dark:text-purple-300">
              <Radio className="h-4 w-4 text-emerald-500" />
              Ahora conectadas
            </div>
            <p className="mt-1 text-sm text-[#5f6680] dark:text-zinc-400">
              Presencia en tiempo real dentro de la comunidad.
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/40 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
            <UsersRound className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/75 bg-white/65 px-3 py-2 dark:border-purple-900/50 dark:bg-white/[0.03]">
          <span className="text-sm font-semibold text-[#27304f] dark:text-zinc-100">
            {onlineUsers.length} {onlineUsers.length === 1 ? "persona" : "personas"} en linea
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.85)]" : "bg-amber-400"
              }`}
            />
            {isConnected ? "Actualizado" : "Conectando"}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {visibleUsers.map((user) => (
            <div
              key={`${user.user_id}-${user.online_at}`}
              className="flex items-center gap-3 rounded-2xl border border-[#d8c6ff]/45 bg-[#fffaf2]/65 p-3 transition hover:border-[#8d73b7]/40 hover:bg-white/80 dark:border-purple-900/40 dark:bg-gray-950/35 dark:hover:border-purple-500/35 dark:hover:bg-white/[0.06]"
            >
              <UserAvatar user={user} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#27304f] dark:text-zinc-100">
                    {user.full_name}
                  </p>
                  {user.user_id === currentUser.id ? (
                    <span className="rounded-full bg-[#516fae]/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[#516fae] dark:bg-purple-400/10 dark:text-purple-200">
                      Tu
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs text-[#6b7280] dark:text-zinc-500">
                  Presente en la sala
                </p>
              </div>
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            </div>
          ))}
        </div>

        {hiddenCount > 0 ? (
          <p className="mt-3 text-center text-xs font-medium text-[#6f5aa8] dark:text-purple-300">
            +{hiddenCount} mas acompanando ahora
          </p>
        ) : null}

        {onlineUsers.length <= 1 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-[#d8c6ff]/70 bg-white/45 p-3 text-sm leading-6 text-[#5f6680] dark:border-purple-900/60 dark:bg-white/[0.03] dark:text-zinc-400">
            Cuando otra usuaria entre al espacio social, aparecera aqui al instante.
          </p>
        ) : null}
      </div>
    </motion.section>
  );
}

function UserAvatar({ user }: { user: PresenceUser }) {
  if (user.avatar_url) {
    return (
      <Image
        src={user.avatar_url}
        alt={`Foto de ${user.full_name}`}
        width={42}
        height={42}
        className="h-11 w-11 rounded-2xl object-cover ring-2 ring-emerald-300/35"
      />
    );
  }

  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#516fae] to-[#8d73b7] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(81,111,174,0.18)]">
      {getInitials(user.full_name)}
    </div>
  );
}

function getInitials(value: string) {
  const parts = value.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";

  return (first + last || "?").toUpperCase();
}
