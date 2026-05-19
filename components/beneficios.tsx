"use client";

import { motion } from "framer-motion";
import { Check, Compass, Moon, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const benefits: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: "Mas claridad",
    description:
      "Ordenas lo que sientes y encuentras un hilo para volver a escucharte.",
    icon: Compass,
  },
  {
    title: "Mas calma",
    description:
      "Las practicas te ayudan a regular energia, respiracion y presencia.",
    icon: Moon,
  },
  {
    title: "Mas constancia",
    description:
      "El avance diario y la comunidad hacen que sea mas facil sostener el camino.",
    icon: Sparkles,
  },
];

const checklist = [
  "Practicas breves para dias intensos",
  "Audio, PDF y registro personal",
  "Acceso privado al progreso diario",
  "Comunidad moderada y cuidada",
];

export function Beneficios() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-20 transition-colors duration-1000">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] transition-[opacity,transform,filter] duration-1000 ease-out dark:scale-[1.02] dark:opacity-0 dark:blur-[1px]"
          style={{ backgroundImage: "url('/images/oleo-abstracto.webp')" }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-0 blur-[1px] transition-[opacity,transform,filter] duration-1000 ease-out dark:scale-[1.03] dark:opacity-[0.18] dark:blur-0"
          style={{ backgroundImage: "url('/images/modo-oscuro.webp')" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
          Del ruido a la resonancia
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-4xl">
          Un cambio que se siente en lo cotidiano
        </h2>
        <p className="mt-4 text-base leading-7 text-[#68708b] transition-colors duration-700 dark:text-[#d9d4ec]">
          Estrella del Alba no busca exigirte mas. Busca darte un espacio
          limpio para sentir, practicar e integrar sin perderte en el proceso.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-lg border border-white/80 bg-white/74 p-6 shadow-[0_18px_50px_rgba(50,70,116,0.09)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/22 dark:bg-[#090d1c]/62 dark:shadow-[0_22px_70px_rgba(0,0,0,0.35)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f5cf7d]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
                {benefit.description}
              </p>
            </motion.article>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative mt-10 overflow-hidden rounded-lg border border-white/80 bg-white/76 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/66 dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.1] transition-[opacity,transform,filter] duration-1000 ease-out dark:scale-[1.02] dark:opacity-0 dark:blur-[1px]"
          style={{ backgroundImage: "url('/images/oleo-abstracto.webp')" }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-0 blur-[1px] transition-[opacity,transform,filter] duration-1000 ease-out dark:scale-[1.03] dark:opacity-[0.22] dark:blur-0"
          style={{ backgroundImage: "url('/images/modo-oscuro.webp')" }}
        />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="relative text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
              Lo que recibes
            </p>
            <h3 className="relative mt-3 text-2xl font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-3xl">
              Herramientas concretas para volver a ti
            </h3>
          </div>
          <div className="relative grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex min-h-14 items-center gap-3 rounded-lg border border-[#d8c6ff]/55 bg-white/68 px-4 py-3 text-sm font-medium text-[#535b78] backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/20 dark:bg-[#070a18]/58 dark:text-[#e6e2f5]"
              >
                <Check className="h-4 w-4 shrink-0 text-[#c89a3c] dark:text-[#f5cf7d]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
