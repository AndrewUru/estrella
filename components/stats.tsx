"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, HeartHandshake, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatItem = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const stats: StatItem[] = [
  {
    id: "focus",
    value: 7,
    label: "Dias de enfoque",
    description: "Un ciclo breve, claro y facil de integrar en la rutina.",
    icon: CalendarDays,
  },
  {
    id: "energy",
    value: 100,
    label: "Ritmo guiado",
    description: "Practicas disenadas para sostener presencia y calma.",
    suffix: "%",
    icon: Sparkles,
  },
  {
    id: "community",
    value: 850,
    label: "Mujeres en comunidad",
    description: "Un espacio privado para compartir avances y apoyo real.",
    suffix: "+",
    icon: HeartHandshake,
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

    const duration = 1400;
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
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-6 py-20 transition-colors duration-1000"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#f7f5ff]/40 transition-colors duration-700 dark:bg-[#070a18]/35" />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
            Ritmo sostenible
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-4xl">
            Una experiencia pensada para acompanar, no saturar
          </h2>
          <p className="mt-4 text-base leading-7 text-[#68708b] transition-colors duration-700 dark:text-[#d9d4ec]">
            Todo el recorrido esta estructurado para que puedas avanzar con
            suavidad, claridad y continuidad.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative overflow-hidden rounded-lg border border-white/80 bg-white/72 p-6 shadow-[0_18px_50px_rgba(50,70,116,0.09)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/22 dark:bg-[#090d1c]/62 dark:shadow-[0_22px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(216,198,255,0.22),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.12),transparent_30%)] transition-opacity duration-700 dark:opacity-0" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(141,115,183,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.1),transparent_30%)] opacity-0 transition-opacity duration-700 dark:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f5cf7d]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex items-baseline gap-1 text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                      <span className="text-4xl font-semibold">
                        {counts[index]}
                      </span>
                      {item.suffix && (
                        <span className="text-xl font-semibold">
                          {item.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
