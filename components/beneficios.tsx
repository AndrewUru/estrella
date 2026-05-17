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
    <section className="relative mx-auto w-full max-w-6xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
          Del ruido a la resonancia
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#27304f] sm:text-4xl">
          Un cambio que se siente en lo cotidiano
        </h2>
        <p className="mt-4 text-base leading-7 text-[#68708b]">
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
              className="rounded-lg border border-white/80 bg-white/74 p-6 shadow-[0_18px_50px_rgba(50,70,116,0.09)] backdrop-blur-xl"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#27304f]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68708b]">
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
        className="mt-10 overflow-hidden rounded-lg border border-white/80 bg-white/76 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl"
      >
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
              Lo que recibes
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[#27304f] sm:text-3xl">
              Herramientas concretas para volver a ti
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {checklist.map((item) => (
              <div
                key={item}
                className="flex min-h-14 items-center gap-3 rounded-lg border border-[#d8c6ff]/55 bg-white/68 px-4 py-3 text-sm font-medium text-[#535b78]"
              >
                <Check className="h-4 w-4 shrink-0 text-[#c89a3c]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
