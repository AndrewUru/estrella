import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Beneficios } from "@/components/beneficios";
import ProcesoSection from "@/components/proceso";
import SocialLandingSection from "@/components/social";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#fffaf2] text-[#27304f] transition-colors duration-1000 dark:bg-gray-950 dark:text-[#fff6dd]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffaf2_0%,#f7f5ff_46%,#fffdf8_100%)] transition-opacity duration-1000 dark:opacity-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#030712_0%,#0a0d1c_46%,#111827_100%)] opacity-0 transition-opacity duration-1000 dark:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,154,60,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(81,111,174,0.12),transparent_32%)] transition-opacity duration-1000 dark:opacity-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,154,60,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(141,115,183,0.15),transparent_32%)] opacity-0 transition-opacity duration-1000 dark:opacity-100" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center">
        <Hero />

        <ProcesoSection />

        <Stats />

        <SocialLandingSection />

        <Beneficios />

        <section className="w-full px-6 py-20 md:py-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/76 shadow-[0_32px_100px_rgba(50,70,116,0.14)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/66 dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(216,198,255,0.24),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.14),transparent_30%)] transition-opacity duration-700 dark:opacity-0" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(141,115,183,0.18),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.1),transparent_30%)] opacity-0 transition-opacity duration-700 dark:opacity-100" />

            <div className="relative flex flex-col gap-10 px-8 py-14 md:px-14 lg:flex-row lg:items-center lg:gap-16">
              <div className="mx-auto flex shrink-0 items-center justify-center rounded-[1.5rem] border border-white/80 bg-white/64 p-4 shadow-lg backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/62">
                <div className="relative h-44 w-44">
                  <Image
                    src="/images/samari1.png"
                    alt="Samari Luz"
                    fill
                    className="rounded-[1.75rem] object-cover transition-[opacity,filter] duration-700 dark:opacity-90 dark:saturate-[0.9]"
                    priority
                  />
                  <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-primary/25 to-transparent transition-colors duration-700 dark:from-[#02030a]/45" />
                </div>
              </div>

              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c6ff]/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#6f5aa8] shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/35 dark:bg-[#070a18]/62 dark:text-[#f3d795]">
                  <Sparkles className="h-4 w-4" /> awakening
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold leading-tight text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-4xl md:text-5xl md:leading-tight">
                    Tu alma te esta llamando
                  </h2>
                  <p className="text-base leading-8 text-[#5f6680] transition-colors duration-700 dark:text-[#d9d4ec] sm:text-lg">
                    El camino de regreso a casa ya vive dentro de ti. Acompanate con practicas guiadas, comunidad y una guia amorosa paso a paso.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-[#535b78] sm:grid-cols-[minmax(0,1fr)] md:grid-cols-2">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/20 dark:bg-[#070a18]/58 dark:text-[#e6e2f5]">
                    <CheckCircle2 className="h-4 w-4 text-[#c89a3c] dark:text-[#f5cf7d]" />
                    Sesiones en audio y PDF para cada etapa del viaje.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/20 dark:bg-[#070a18]/58 dark:text-[#e6e2f5]">
                    <CheckCircle2 className="h-4 w-4 text-[#c89a3c] dark:text-[#f5cf7d]" />
                    Seguimiento diario y rituales para integrar con calma.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/20 dark:bg-[#070a18]/58 dark:text-[#e6e2f5]">
                    <CheckCircle2 className="h-4 w-4 text-[#c89a3c] dark:text-[#f5cf7d]" />
                    Acceso privado a espacios protegidos y acompanamiento.
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/20 dark:bg-[#070a18]/58 dark:text-[#e6e2f5]">
                    <CheckCircle2 className="h-4 w-4 text-[#c89a3c] dark:text-[#f5cf7d]" />
                    Guia de Samari Luz con mas de 10 anos de experiencia.
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/upgrade"
                    className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-[#516fae] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98] dark:bg-[#f0c86b] dark:text-[#15101f] dark:shadow-[0_0_38px_rgba(240,200,107,0.18)] dark:hover:bg-[#ffe09a]"
                  >
                    <span className="relative z-10">Comenzar hoy</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/preguntas"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#b8c8ee] bg-white/65 px-6 py-3 text-sm font-semibold text-[#405c98] shadow-sm backdrop-blur transition hover:bg-white dark:border-[#8d73b7]/55 dark:bg-[#090d1c]/58 dark:text-[#eee7ff] dark:hover:bg-[#16112b]"
                  >
                    Tengo preguntas
                    <Heart className="h-4 w-4" />
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-[#777088] transition-colors duration-700 dark:text-[#c9c0df] lg:justify-start">
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

