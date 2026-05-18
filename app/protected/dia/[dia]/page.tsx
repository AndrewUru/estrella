"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  Headphones,
  Home,
  Loader2,
  Lock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Entrega = {
  dia: number;
  titulo: string;
  descripcion: string;
  archivo_pdf?: string | null;
  audio_url?: string | null;
  imagen_url?: string | null;
};

type Plan = "gratis" | "premium" | "membresia" | string;

export default function DiaPage() {
  const params = useParams();
  const router = useRouter();
  const dia = Number.parseInt(params.dia as string, 10);

  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipoPlan, setTipoPlan] = useState<Plan | null>(null);

  const avanzarDia = async () => {
    setSaving(true);

    const res = await fetch("/api/progreso/completar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dia }),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/protected");
      return;
    }

    const data = await res.json().catch(() => null);
    alert(data?.error || "Hubo un problema al guardar tu avance.");
  };

  useEffect(() => {
    const cargarEntrega = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: perfil } = await supabase
        .from("profiles")
        .select("start_date, plan")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date || !perfil.plan) {
        setLoading(false);
        return;
      }

      setTipoPlan(perfil.plan);

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const acceso =
        (perfil.plan === "gratis" && dia === 1) || dia <= diasDesdeInicio + 1;

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffaf2] dark:bg-gray-950">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex max-w-sm flex-col items-center gap-3 text-center text-[#5f6680] dark:text-zinc-400">
            <Loader2 className="h-6 w-6 animate-spin text-[#516fae]" aria-hidden="true" />
            <p className="text-sm sm:text-base">Preparando el contenido del dia...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!accesoPermitido) {
    const premiumLock = tipoPlan === "gratis" && dia > 1;

    return (
      <BlockedState
        title={
          premiumLock
            ? "Este contenido forma parte del plan premium"
            : "Este contenido no esta disponible todavia"
        }
        description={
          premiumLock
            ? "Gracias por unirte al dia 1 de forma gratuita. Puedes desbloquear el recorrido completo desde los planes."
            : "Cada practica tiene su momento. Vuelve mas adelante para recibir este material cuando se abra en tu proceso."
        }
        ctaHref={premiumLock ? "/upgrade" : "/protected"}
        ctaLabel={premiumLock ? "Ver planes" : "Volver al panel"}
        icon={premiumLock ? Sparkles : Lock}
      />
    );
  }

  if (!entrega) {
    return (
      <BlockedState
        title="Contenido no encontrado"
        description={`No se ha cargado material para el dia ${dia}. Puede que este en proceso de preparacion.`}
        ctaHref="/protected"
        ctaLabel="Volver al panel"
        icon={FileText}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#fffaf2] text-[#27304f] dark:bg-gray-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(216,198,255,0.38),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,250,242,0.7))] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(126,87,194,0.22),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(200,154,60,0.1),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-4 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)_300px] lg:px-6">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="flex h-full flex-col rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_24px_70px_rgba(81,111,174,0.12)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <Link href="/protected" className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm ring-1 ring-[#d8c6ff]/70 dark:bg-purple-950/70 dark:ring-purple-800/70">
                <span className="absolute inset-0 rounded-full bg-[#c89a3c]/20 blur-md" />
                <Image
                  src="/logo-estrella.png"
                  alt="Estrella del Alba"
                  width={36}
                  height={36}
                  priority
                  className="relative rounded-full"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f5aa8] dark:text-purple-300/80">
                  Estrella
                </span>
                <span className="-mt-0.5 bg-gradient-to-r from-[#516fae] via-[#8d73b7] to-[#c89a3c] bg-clip-text text-sm font-bold text-transparent">
                  Dia {entrega.dia}
                </span>
              </span>
            </Link>

            <nav className="mt-6 grid gap-2">
              <PanelLink href="/protected" icon={Home}>
                Mi espacio
              </PanelLink>
              <PanelLink href="#contenido" icon={BookOpen}>
                Contenido
              </PanelLink>
              {entrega.audio_url && (
                <PanelLink href="#audio" icon={Headphones}>
                  Audio
                </PanelLink>
              )}
              {entrega.archivo_pdf && (
                <PanelLink href="#guia" icon={FileText}>
                  Guia PDF
                </PanelLink>
              )}
              <PanelLink href="/protected/social" icon={MessageSquare}>
                Comunidad
              </PanelLink>
            </nav>

            <div className="mt-auto hidden rounded-2xl border border-[#d8c6ff]/65 bg-[#fffaf2]/70 p-4 text-sm leading-6 text-[#5f6680] dark:border-purple-900/55 dark:bg-white/5 dark:text-zinc-400 lg:block">
              Reserva unos minutos al final para integrar antes de marcar el dia
              como completado.
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-5 pb-8">
          <header
            id="contenido"
            className="overflow-hidden rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 shadow-[0_20px_60px_rgba(81,111,174,0.12)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5"
          >
            <div className="relative min-h-[320px] p-5 sm:p-7">
              <Image
                src={entrega.imagen_url ?? "/images/oleo-celeste.webp"}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf2]/96 via-[#fffaf2]/82 to-[#d8c6ff]/50 dark:from-gray-950/96 dark:via-gray-950/86 dark:to-purple-950/42" />
              <div className="relative flex min-h-[270px] flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5aa8] backdrop-blur dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200">
                    <Sparkles className="h-4 w-4 text-[#c89a3c]" />
                    Canalizacion de Samari Luz
                  </span>
                  <Link
                    href="/protected"
                    className="inline-flex items-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#516fae] transition hover:bg-white dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                  </Link>
                </div>

                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8d73b7] dark:text-purple-300">
                    Dia {entrega.dia}
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#27304f] dark:text-white sm:text-5xl">
                    {entrega.titulo}
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f6680] dark:text-zinc-300">
                    {entrega.descripcion}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-2">
            {entrega.audio_url && (
              <section
                id="audio"
                className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-5 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5"
              >
                <ResourceHeader
                  icon={Headphones}
                  label="Escucha"
                  title="Audio guiado"
                  description="Prepara un espacio tranquilo y escucha a tu ritmo."
                />
                <div className="mt-5 rounded-2xl border border-white/75 bg-[#fffaf2]/80 p-4 dark:border-purple-900/50 dark:bg-gray-950/50">
                  <audio
                    controls
                    src={entrega.audio_url}
                    className="w-full"
                    preload="metadata"
                  >
                    Tu navegador no soporta la reproduccion de audio.
                  </audio>
                </div>
              </section>
            )}

            {entrega.archivo_pdf && (
              <section
                id="guia"
                className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-5 shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5"
              >
                <ResourceHeader
                  icon={FileText}
                  label="Guia"
                  title="Material PDF"
                  description="Usa esta guia para acompanar la practica y volver a ella cuando lo necesites."
                />
                <a
                  href={entrega.archivo_pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#516fae] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.2)] transition hover:bg-[#405c98]"
                >
                  <Download className="h-4 w-4 text-[#f4d99a]" />
                  Abrir PDF
                </a>
              </section>
            )}
          </div>

          <section className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-5 text-center shadow-[0_18px_55px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-7">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200">
              <CheckCircle2 className="h-7 w-7 text-[#c89a3c]" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-[#27304f] dark:text-white">
              Cierra este momento con presencia
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#5f6680] dark:text-zinc-400">
              Cuando hayas escuchado, leido o integrado lo necesario, marca este
              dia como completado para continuar tu recorrido.
            </p>
            <button
              type="button"
              onClick={avanzarDia}
              disabled={saving}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#516fae] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Completar dia
                  <Sparkles className="h-4 w-4 text-[#f4d99a]" />
                </>
              )}
            </button>
          </section>
        </section>

        <aside className="space-y-5 pb-8 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
              Sesion actual
            </p>
            <div className="mt-4 space-y-3">
              <InfoRow label="Dia" value={String(entrega.dia)} />
              <InfoRow
                label="Audio"
                value={entrega.audio_url ? "Disponible" : "Sin audio"}
              />
              <InfoRow
                label="PDF"
                value={entrega.archivo_pdf ? "Disponible" : "Sin PDF"}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/60 p-4 shadow-[0_20px_60px_rgba(81,111,174,0.1)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] dark:text-purple-300">
              Integracion
            </p>
            <p className="mt-4 text-sm leading-7 text-[#5f6680] dark:text-zinc-400">
              Antes de seguir, anota una sensacion, una palabra o una imagen que
              te haya quedado despues de la practica.
            </p>
            <Link
              href="/protected/social"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d8c6ff]/70 bg-white/70 px-4 py-3 text-sm font-semibold text-[#516fae] transition hover:bg-white dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
            >
              Compartir en comunidad
              <MessageSquare className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PanelLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#535b78] transition hover:bg-white/70 hover:text-[#516fae] dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-purple-200"
    >
      <Icon className="h-4 w-4 text-[#8d73b7] transition group-hover:text-[#c89a3c]" />
      {children}
    </Link>
  );
}

function ResourceHeader({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: typeof Sparkles;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200">
        <Icon className="h-5 w-5 text-[#c89a3c]" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d73b7] dark:text-purple-300">
          {label}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[#27304f] dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5f6680] dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/75 bg-white/60 px-4 py-3 text-sm dark:border-purple-900/50 dark:bg-white/5">
      <span className="text-[#5f6680] dark:text-zinc-400">{label}</span>
      <span className="font-semibold text-[#27304f] dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}

function BlockedState({
  title,
  description,
  ctaHref,
  ctaLabel,
  icon: Icon,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  icon: typeof Sparkles;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf2] text-[#27304f] dark:bg-gray-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,198,255,0.42),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(200,154,60,0.18),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12">
        <section className="w-full rounded-[1.5rem] border border-[#d8c6ff]/55 bg-white/70 p-6 text-center shadow-[0_24px_70px_rgba(81,111,174,0.14)] backdrop-blur-xl dark:border-purple-900/55 dark:bg-white/5 sm:p-10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d8c6ff]/70 bg-white/70 dark:border-purple-900/60 dark:bg-white/5">
            <Icon className="h-8 w-8 text-[#c89a3c]" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-[#27304f] dark:text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#5f6680] dark:text-zinc-400">
            {description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98]"
            >
              {ctaLabel}
              <ArrowLeft className="h-4 w-4 text-[#f4d99a]" />
            </Link>
            <Link
              href="/protected"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/70 px-5 py-3 text-sm font-semibold text-[#516fae] transition hover:bg-white dark:border-purple-900/60 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
            >
              Mi espacio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
