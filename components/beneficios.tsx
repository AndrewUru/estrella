"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Sparkles, Check, ArrowRight } from "lucide-react";

const beforeItems = [
  "Sensacion de desconexion con tu proposito interior",
  "Confusion tras anios de camino espiritual",
  "Alta sensibilidad sin herramientas de contencion",
  "Falta de direccion energetica para avanzar",
];

const afterItems = [
  "Claridad energetica restaurada",
  "Canal intuitivo disponible cada dia",
  "Ritmo interno alineado con tus decisiones",
  "Compromiso amoroso con tu alma",
];

export function Beneficios() {
  const [hovered, setHovered] = useState<"before" | "after" | null>(null);

  const columns = useMemo(
    () => [
      {
        id: "before" as const,
        icon: AlertCircle,
        title: "Antes de Estrella",
        subtitle: "Cuando la energia esta dispersa",
        items: beforeItems,
        gradient: "from-red-500/15 via-orange-500/10 to-amber-500/15",
        badgeClass: "border-red-400/40 text-red-500/80",
        badgeText: "Estado actual: desequilibrio",
      },
      {
        id: "after" as const,
        icon: Sparkles,
        title: "Despues de 7 dias",
        subtitle: "Claridad y direccion energetica",
        items: afterItems,
        gradient: "from-purple-500/15 via-pink-500/10 to-indigo-500/15",
        badgeClass: "border-purple-400/40 text-purple-500/80",
        badgeText: "Estado destino: armonia",
      },
    ],
    []
  );

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 translate-x-1/3 rounded-full bg-pink-400/25 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-60 w-60 -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/80 dark:text-purple-200/70">
          Del ruido a la resonancia
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
          Que cambia cuando caminas Estrella del Alba
        </h2>
        <p className="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300">
          Observa la diferencia energetica al vivir una semana en contencion consciente. De la inquietud a la claridad tangible.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        {columns.map((column, index) => {
          const Icon = column.icon;
          const isActive = hovered === column.id;
          const orderClasses = index === 0 ? "order-1 lg:order-1" : "order-3 lg:order-3";

          return (
            <motion.article
              key={column.id}
              onMouseEnter={() => setHovered(column.id)}
              onMouseLeave={() => setHovered(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-[1px] shadow-xl backdrop-blur dark:border-purple-900/40 dark:bg-gray-950/80 ${orderClasses}`}
            >
              <div className={`rounded-3xl bg-gradient-to-br ${column.gradient} p-6 sm:p-8`}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-purple-600 shadow-md dark:bg-purple-950/70">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {column.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {column.items.map((item, itemIndex) => (
                    <motion.div
                      key={item}
                      className="flex items-start gap-4 rounded-2xl bg-white/70 p-4 text-left shadow-sm transition duration-300 dark:bg-gray-950/70"
                      animate={isActive ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: itemIndex * 0.05,
                        repeat: isActive ? Infinity : 0,
                        repeatType: "loop",
                      }}
                    >
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-semibold text-white shadow">
                        {index === 0 ? itemIndex + 1 : <Check className="h-4 w-4" />}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${column.badgeClass}`}>
                  {column.badgeText}
                </div>
              </div>
            </motion.article>
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="order-2 hidden h-full flex-col items-center justify-center gap-6 lg:flex"
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
            <span className="absolute -bottom-5 text-xs font-semibold uppercase tracking-[0.35em] text-purple-200">
              7 dias
            </span>
          </div>
          <ArrowRight className="h-8 w-8 text-purple-400" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 shadow-2xl">
            <Check className="h-10 w-10 text-white" />
            <span className="absolute -bottom-5 text-xs font-semibold uppercase tracking-[0.35em] text-purple-200">
              Transformacion
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mt-16 flex flex-col gap-4 rounded-[2rem] border border-purple-400/30 bg-white/70 p-10 text-left shadow-xl backdrop-blur dark:border-purple-900/40 dark:bg-gray-950/80"
      >
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-purple-500/80 dark:text-purple-200/70">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-purple-500" />
          Recordatorio para el viaje
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          El proceso es personal, pero nunca estas sola. La practica diaria, la comunidad y la guia sostienen tu ritmo mientras integras cada leccion.
        </p>
      </motion.div>
    </section>
  );
}
