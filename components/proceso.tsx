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
    <section className="relative w-full overflow-hidden px-6 py-20 transition-colors duration-1000">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/20 transition-colors duration-700 dark:bg-gray-950/20" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
            Tu viaje interior
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-4xl">
            Un recorrido simple, bonito y facil de seguir
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-[#68708b] transition-colors duration-700 dark:text-[#d9d4ec] lg:justify-self-end">
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
              className="group overflow-hidden rounded-lg border border-white/80 bg-white/74 shadow-[0_18px_50px_rgba(50,70,116,0.1)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/22 dark:bg-[#090d1c]/62 dark:shadow-[0_22px_70px_rgba(0,0,0,0.35)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-[opacity,transform,filter] duration-700 group-hover:scale-[1.03] dark:opacity-85 dark:saturate-[0.9] dark:brightness-[0.72] dark:contrast-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/45 via-transparent to-white/8 transition-colors duration-700 dark:from-[#02030a]/58 dark:via-[#060816]/8 dark:to-[#f5cf7d]/10" />
                <span className="absolute left-4 top-4 rounded-full border border-white/65 bg-white/72 px-3 py-1 text-xs font-semibold text-[#516fae] backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/35 dark:bg-[#070a18]/68 dark:text-[#f3d795]">
                  {step.id}
                </span>
              </div>
              <div className="p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f5cf7d]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
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
        className="relative overflow-hidden rounded-lg border border-white/80 bg-white/76 p-6 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/66 dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,198,255,0.24),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.14),transparent_28%)] transition-opacity duration-700 dark:opacity-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(141,115,183,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.1),transparent_28%)] opacity-0 transition-opacity duration-700 dark:opacity-100" />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
              Tu portal privado
            </p>
            <h3 className="text-2xl font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-3xl">
              Practica, registra y celebra tu energia cada dia
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
              Tu panel reune sesiones, progreso y comunidad en un espacio claro,
              para que vuelvas a tu practica sin ruido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/protected"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98] dark:bg-[#f0c86b] dark:text-[#15101f] dark:shadow-[0_0_38px_rgba(240,200,107,0.18)] dark:hover:bg-[#ffe09a]"
              >
                Ver mi espacio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/preguntas"
                className="inline-flex min-h-11 items-center rounded-full border border-[#b8c8ee] bg-white/65 px-5 py-3 text-sm font-semibold text-[#405c98] transition hover:bg-white dark:border-[#8d73b7]/55 dark:bg-[#090d1c]/58 dark:text-[#eee7ff] dark:hover:bg-[#16112b]"
              >
                Dudas frecuentes
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-white/80 bg-white shadow-lg transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-[#070a18]">
            <Image
              src="/Captura-vista-mi-espacio.webp"
              alt="Vista de tu espacio interior"
              width={640}
              height={420}
              className="h-full w-full object-cover transition-[opacity,filter] duration-700 dark:opacity-80 dark:saturate-[0.85]"
            />
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
