"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const featureList = [
  "Practicas guiadas en audio y PDF",
  "Rituales diarios para integrar con calma",
  "Acompanamiento en una comunidad privada",
  "Un recorrido suave para volver a ti",
];

export function Hero() {
  return (
    <section
      className="relative flex min-h-[calc(100vh-4.5rem)] w-full items-center overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8"
      role="banner"
      aria-label="Seccion principal de Estrella del Alba"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/oleo-abstracto.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.96)_0%,rgba(255,253,248,0.9)_42%,rgba(255,253,248,0.58)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fffaf2] to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
        <motion.div
          className="max-w-2xl space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6f5aa8] shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#c89a3c]" />
            7 dias de reconexion energetica
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-normal text-[#27304f] sm:text-5xl md:text-6xl">
              Un espacio luminoso para volver a tu centro
            </h1>
            <p className="mx-auto max-w-xl text-base leading-8 text-[#5f6680] sm:text-lg lg:mx-0">
              Estrella del Alba acompana tu proceso con practicas guiadas,
              rituales sencillos y una comunidad cuidada para sostener tu
              energia cada dia.
            </p>
          </div>

          <div className="grid gap-3 text-left sm:grid-cols-2">
            {featureList.map((feature) => (
              <div
                key={feature}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium text-[#535b78] shadow-[0_14px_40px_rgba(83,94,130,0.08)] backdrop-blur-md"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c89a3c]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/upgrade"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#516fae] px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98]"
            >
              Comenzar ahora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#b8c8ee] bg-white/65 px-6 py-3 text-sm font-semibold text-[#405c98] shadow-sm backdrop-blur transition hover:bg-white"
            >
              <PlayCircle className="h-5 w-5" />
              Ver una sesion
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#777088] lg:justify-start">
            <Heart className="h-4 w-4 text-[#c89a3c]" />
            Una experiencia creada para mujeres sensibles, intuitivas y en
            expansion.
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[420px]"
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/62 p-3 shadow-[0_30px_90px_rgba(50,70,116,0.18)] backdrop-blur-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem]">
              <Image
                src="/images/oleo-celeste.webp"
                alt="Arte abstracto luminoso en tonos celestes, dorados y lila"
                fill
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/38 via-transparent to-white/12" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/55 bg-white/78 p-4 text-left shadow-lg backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8d73b7]">
                  Ritual del dia
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-snug text-[#27304f]">
                  Respira, integra y deja que tu claridad vuelva.
                </h2>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
