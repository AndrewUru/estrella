"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Badge } from "@/components/ui/badge";
import { Composer } from "@/components/social/Composer";
import { Feed } from "@/components/social/Feed";
import { MoodStats } from "@/components/social/MoodStats";
import { SidebarLeft } from "@/components/social/SidebarLeft";
import { SidebarRight } from "@/components/social/SidebarRight";
import { Loader2 } from "lucide-react";

export default function SocialPage() {
  const router = useRouter();
  const { fullName, loading: loadingProfile } = useUserProfile();
  const [authChecked, setAuthChecked] = useState(false);

  // 🔐 Autenticación protegida
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth/login?returnTo=/protected/social");
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [router]);

  if (!authChecked || loadingProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-secondary/30">
        <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Preparando tu espacio comunitario...</p>
        </div>
      </main>
    );
  }

  const initials = getInitials(fullName);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          {/* 🌿 Navegación lateral izquierda */}
          <aside className="space-y-6">
            <SidebarLeft />
            <MoodStats />
          </aside>

          {/* 🌞 Zona central del alma comunitaria */}
          <section className="space-y-6">
            <header className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    Espacio comunitario
                  </Badge>
                  <div className="space-y-2 text-foreground">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      Comparte tu proceso
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Celebra avances, pide apoyo y sostén la constancia junto a
                      la comunidad.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 text-center sm:grid-cols-2 lg:text-right">
                  <StatCard
                    label="Tu Presencia"
                    value={initials}
                    helper="Identidad energética"
                  />
                  <StatCard
                    label="Energía colectiva"
                    value="Viva ✨"
                    helper="En constante movimiento"
                  />
                </div>
              </div>
            </header>

            {/* 🌸 Compositor */}
            <Composer />

            {/* 💬 Feed en tiempo real */}
            <Feed />
          </section>

          {/* 🌕 Lateral derecho con guía y hitos */}
          <aside className="space-y-6">
            <SidebarRight />
          </aside>
        </div>
      </div>
    </main>
  );
}

/* 🔹 Pequeño componente auxiliar */
function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 text-left shadow-sm lg:text-right">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

/* 🪶 Utilidad para iniciales */
function getInitials(value: string | null | undefined) {
  if (!value) return "??";
  const parts = value.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}
