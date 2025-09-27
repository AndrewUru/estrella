import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Beneficios } from "@/components/beneficios";
import ProcesoSection from "@/components/proceso";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-56 left-0 h-96 w-96 -translate-x-1/3 rounded-full bg-purple-400/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-pink-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center">
        <Hero />

        <ProcesoSection />

        <Stats />

        <Beneficios />

        <section className="w-full px-6 py-20 md:py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/80 shadow-[0_35px_120px_rgba(124,58,237,0.25)] backdrop-blur dark:border-white/10 dark:bg-black/60">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 right-16 h-40 w-40 rounded-full bg-primary/30 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-pink-300/30 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-200/20 dark:from-white/5 dark:to-purple-900/20" />
            </div>

            <div className="relative flex flex-col gap-10 px-8 py-14 md:px-14 lg:flex-row lg:items-center lg:gap-16">
              <div className="mx-auto flex shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-purple-200/30 to-pink-200/30 p-6 shadow-lg dark:from-primary/10 dark:via-purple-900/40 dark:to-pink-900/30">
                <div className="relative h-44 w-44">
                  <Image
                    src="/images/samari1.png"
                    alt="Samari Luz"
                    fill
                    className="rounded-[1.75rem] object-cover"
                    priority
                  />
                  <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-primary/25 to-transparent" />
                </div>
              </div>

              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 shadow-sm dark:border-primary/40 dark:bg-primary/10 dark:text-primary/70">
                  <Sparkles className="h-4 w-4" /> awakening
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl md:leading-tight dark:text-white">
                    Tu alma te esta llamando
                  </h2>
                  <p className="text-base text-muted-foreground sm:text-lg">
                    El camino de regreso a casa ya vive dentro de ti. Acompanate con practicas guiadas, comunidad y una guia amorosa paso a paso.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground/90 sm:grid-cols-[minmax(0,1fr)] md:grid-cols-2">
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-sm dark:bg-white/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Sesiones en audio y PDF para cada etapa del viaje.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-sm dark:bg-white/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Seguimiento diario y rituales para integrar con calma.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-sm dark:bg-white/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Acceso privado a espacios protegidos y acompanamiento.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 shadow-sm dark:bg-white/5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Guia de Samari Luz con mas de 10 anos de experiencia.
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/upgrade"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-2xl transition duration-500 hover:scale-105 hover:shadow-purple-500/30"
                  >
                    <span className="relative z-10">Comenzar hoy</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%]" />
                  </Link>

                  <Link
                    href="/preguntas"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 dark:border-primary/30 dark:text-primary/80"
                  >
                    Tengo preguntas
                    <Heart className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70 lg:justify-start">
                  <Sparkles className="h-3.5 w-3.5" />
                  Acceso inmediato sin permanencias. Cancela cuando quieras.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

