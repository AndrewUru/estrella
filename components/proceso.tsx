"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Headphones, PenLine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: Array<{
  id: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}> = [
  {
    id: "01",
    title: "Define tu intencion",
    description:
      "Empiezas con una guia sencilla para reconocer como estas y que quieres sostener durante el ciclo.",
    image: "/images/canalizaciones.webp",
    icon: PenLine,
  },
  {
    id: "02",
    title: "Escucha la practica",
    description:
      "Cada dia tienes una sesion clara, en audio y recursos complementarios para ir a tu ritmo.",
    image: "/images/anclar.webp",
    icon: Headphones,
  },
  {
    id: "03",
    title: "Integra lo vivido",
    description:
      "Registras sensaciones, desbloqueas el siguiente paso y puedes compartir avances en comunidad.",
    image: "/images/integracion.webp",
    icon: BookOpenCheck,
  },
];

export default function ProcesoSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
            Tu viaje interior
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#27304f] sm:text-4xl">
            Un recorrido simple, bonito y facil de seguir
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-[#68708b] lg:justify-self-end">
          La experiencia esta organizada para que no tengas que decidir que hacer
          cada dia. Entras, escuchas, integras y sigues avanzando con calma.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.article
              key={step.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="group overflow-hidden rounded-lg border border-white/80 bg-white/74 shadow-[0_18px_50px_rgba(50,70,116,0.1)] backdrop-blur-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/45 via-transparent to-white/8" />
                <span className="absolute left-4 top-4 rounded-full border border-white/65 bg-white/72 px-3 py-1 text-xs font-semibold text-[#516fae] backdrop-blur">
                  {step.id}
                </span>
              </div>
              <div className="p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#27304f]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#68708b]">
                  {step.description}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative overflow-hidden rounded-lg border border-white/80 bg-white/76 p-6 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.1]"
          style={{ backgroundImage: "url('/images/oleo-abstracto.webp')" }}
        />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
              Tu portal privado
            </p>
            <h3 className="text-2xl font-semibold text-[#27304f] sm:text-3xl">
              Practica, registra y celebra tu energia cada dia
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[#68708b]">
              Tu panel reune sesiones, progreso y comunidad en un espacio claro,
              para que vuelvas a tu practica sin ruido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/protected"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98]"
              >
                Ver mi espacio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/preguntas"
                className="inline-flex min-h-11 items-center rounded-full border border-[#b8c8ee] bg-white/65 px-5 py-3 text-sm font-semibold text-[#405c98] transition hover:bg-white"
              >
                Dudas frecuentes
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white shadow-lg">
            <Image
              src="/Captura-vista-mi-espacio.webp"
              alt="Vista de tu espacio interior"
              width={640}
              height={420}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
