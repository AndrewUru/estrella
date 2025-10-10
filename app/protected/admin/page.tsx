"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookOpenCheck,
  LogOut,
  Music3,
  PlusCircle,
  Users,
} from "lucide-react";

type Shortcut = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
};

const adminShortcuts: Shortcut[] = [
  {
    href: "/protected/admin/usuarios",
    icon: Users,
    title: "Gestionar usuarias",
    description:
      "Administra perfiles, roles y el acceso seguro de la comunidad.",
    cta: "Abrir gestion",
  },
  {
    href: "/protected/admin/contenido",
    icon: BookOpenCheck,
    title: "Editar contenido del curso",
    description:
      "Actualiza modulos, recursos multimedia y organiza el temario.",
    cta: "Actualizar contenido",
  },
  {
    href: "/protected/admin/practicas",
    icon: Music3,
    title: "Ver practicas",
    description:
      "Consulta el estado de cada practica y controla su visibilidad.",
    cta: "Revisar practicas",
  },
  {
    href: "/protected/admin/practicas#nueva",
    icon: PlusCircle,
    title: "Crear nueva practica",
    description:
      "Publica ejercicios guiados para acompanar a las integrantes.",
    cta: "Crear practica",
  },
];

const tips = [
  "Revisa primero las usuarias con accesos pendientes y resuelve incidencias de inicio de sesion.",
  "Contrasta el contenido publicado con las sesiones en vivo y las actualizaciones del programa.",
  "Documenta cada cambio para mantener un historial claro de la evolucion de la plataforma.",
];

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function validarAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      setUserName(profile.full_name || "Admin");
      setAuthorized(true);
      setLoading(false);
    }

    validarAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-primary">
        Cargando panel de administracion...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-border/80 bg-card/80 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-5">
              <Badge variant="secondary" className="w-fit">
                Panel administrativo
              </Badge>
              <div className="space-y-3 text-foreground">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Bienvenida, {userName}
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Administra la experiencia de quienes forman parte de la
                  comunidad, manten el contenido actualizado y guia cada proceso
                  con claridad.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 self-start text-foreground sm:self-end"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Accesos rapidos
              </h2>
              <p className="text-sm text-muted-foreground">
                Elige una seccion para comenzar.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {adminShortcuts.map(
                ({ href, icon: Icon, title, description, cta }) => (
                  <Link key={href} href={href} className="group h-full">
                    <Card className="flex h-full flex-col justify-between border-border/70 bg-card/90 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg">
                      <CardHeader className="space-y-4 pb-4">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-foreground">
                            {title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-foreground">
                          {cta}
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </div>

          <Card className="border-dashed border-border/70 bg-muted/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">
                Recomendaciones rapidas
              </CardTitle>
              <CardDescription>
                Organiza tu jornada de administracion con claridad y ritmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted-foreground">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary/70" />
                  <p>{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
