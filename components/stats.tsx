"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type StatItem = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  description: string;
  gradient: string;
  accent: string;
};

const stats: StatItem[] = [
  {
    id: "focus",
    value: 7,
    label: "Dias de enfoque",
    description: "Ciclo guiado para sostener tu practica diaria con claridad.",
    suffix: "",
    gradient: "from-purple-500/25 via-pink-400/15 to-indigo-400/25",
    accent: "text-purple-500",
  },
  {
    id: "energy",
    value: 100,
    label: "Energia alineada",
    description: "Sesiones y rituales creados para elevar tu frecuencia interior.",
    suffix: "%",
    gradient: "from-cyan-500/20 via-blue-400/10 to-purple-400/20",
    accent: "text-cyan-500",
  },
  {
    id: "community",
    value: 850,
    label: "Almas en comunidad",
    description: "Personas que caminan juntas y sostienen su proceso energetico.",
    suffix: "+",
    gradient: "from-amber-400/25 via-orange-400/15 to-rose-400/25",
    accent: "text-amber-500",
  },
];

export function Stats() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState<number[]>(() => stats.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 1600;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(stats.map((item) => Math.round(item.value * progress)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCounts(stats.map((item) => item.value));
      }
    };

    requestAnimationFrame(step);
  }, [visible]);

  return (
    <section ref={sectionRef} className="relative mx-auto mt-20 w-full max-w-6xl px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 translate-x-1/3 rounded-full bg-pink-400/20 blur-[140px]" />
        <div className="absolute left-0 bottom-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-400/15 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/80 dark:text-purple-200/70">
          Ritmo energetico
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
          Resultados que sostienen tu transformacion
        </h2>
        <p className="mt-4 text-base text-gray-600 sm:text-lg dark:text-gray-300">
          Cada indicador refleja la experiencia de quienes ya recorren Estrella del Alba. Inspira tu propio proceso y mantente en movimiento.
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-[1px] shadow-xl backdrop-blur-sm dark:border-purple-900/40 dark:bg-gray-950/80"
          >
            <div className={`rounded-3xl bg-gradient-to-br ${item.gradient} p-6 sm:p-8`}>
              <div className="flex items-baseline justify-center gap-2 text-5xl font-bold sm:text-6xl">
                <span className={`bg-gradient-to-r ${item.accent} bg-clip-text text-transparent`}>
                  {counts[index]}
                </span>
                {item.suffix ? (
                  <span className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                    {item.suffix}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {item.label}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {item.description}
              </p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-purple-200/20" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-purple-500/70 dark:text-purple-200/60">
                En armonia
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.4 }}
        className="mt-14 flex flex-col items-center gap-4 text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-purple-400/30 bg-white/70 px-6 py-3 text-sm font-medium text-gray-700 shadow-sm backdrop-blur dark:border-purple-800/40 dark:bg-gray-950/70 dark:text-gray-200">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-purple-500" />
          Mantente presente, la expansion sucede paso a paso.
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-pink-500" />
        </div>
      </motion.div>
    </section>
  );
}
