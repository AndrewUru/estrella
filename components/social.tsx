"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, MessageCircle, ShieldCheck } from "lucide-react";

const highlights = [
  {
    title: "Historias vivas",
    description:
      "Comparte gratitud, avances y preguntas sin sentir que tienes que hacerlo perfecto.",
    icon: MessageCircle,
  },
  {
    title: "Cuidado real",
    description:
      "La comunidad esta pensada para sostener con respeto, privacidad y presencia.",
    icon: ShieldCheck,
  },
  {
    title: "Rituales compartidos",
    description:
      "Encuentra practicas recomendadas segun como te sientes y el momento del ciclo.",
    icon: HeartHandshake,
  },
];

const sampleFeed = [
  {
    user: "Maria",
    mood: "gratitud",
    content:
      "Termine la practica de respiracion y por primera vez en dias senti espacio dentro de mi.",
    time: "Hace 2h",
  },
  {
    user: "Isabel",
    mood: "claridad",
    content:
      "Hoy entendi que no necesito correr. Solo volver a mi centro una vez mas.",
    time: "Hace 5h",
  },
];

export default function SocialLandingSection() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-20 transition-colors duration-1000">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white/20 transition-colors duration-700 dark:bg-gray-950/20" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
      >
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
            Comunidad protegida
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-4xl">
            Un lugar para compartir sin ruido
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[#68708b] transition-colors duration-700 dark:text-[#d9d4ec]">
            Dentro de Estrella del Alba puedes escribir tu avance, leer a otras
            mujeres y sentir que tu proceso no ocurre en soledad.
          </p>
          <Link
            href="/protected/social"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98] dark:bg-[#f0c86b] dark:text-[#15101f] dark:shadow-[0_0_38px_rgba(240,200,107,0.18)] dark:hover:bg-[#ffe09a]"
          >
            Visitar la comunidad
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-lg border border-white/80 bg-white/76 p-5 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/66 dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,198,255,0.24),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.14),transparent_28%)] transition-opacity duration-700 dark:opacity-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(141,115,183,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,154,60,0.1),transparent_28%)] opacity-0 transition-opacity duration-700 dark:opacity-100" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
                Feed privado
              </span>
              <span className="rounded-full border border-[#d8c6ff]/70 bg-white/70 px-3 py-1 text-xs font-semibold text-[#516fae] transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-[#070a18]/58 dark:text-[#f3d795]">
                Moderado
              </span>
            </div>
            {sampleFeed.map((entry, index) => (
              <motion.article
                key={`${entry.user}-${index}`}
                initial={{ y: 16, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-lg border border-white/80 bg-white/82 p-4 shadow-sm backdrop-blur transition-colors duration-700 dark:border-[#f3c76b]/18 dark:bg-[#070a18]/62"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                      {entry.user}
                    </p>
                    <p className="text-xs text-[#7b8299] transition-colors duration-700 dark:text-[#b6accf]">{entry.time}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c89a3c] transition-colors duration-700 dark:text-[#f5cf7d]">
                    {entry.mood}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#535b78] transition-colors duration-700 dark:text-[#d9d4ec]">
                  {entry.content}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;

          return (
            <motion.article
              key={highlight.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true, amount: 0.4 }}
              className="rounded-lg border border-white/80 bg-white/72 p-6 shadow-[0_18px_50px_rgba(50,70,116,0.09)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/22 dark:bg-[#090d1c]/62 dark:shadow-[0_22px_70px_rgba(0,0,0,0.35)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae] transition-colors duration-700 dark:border-[#f3c76b]/25 dark:bg-white/5 dark:text-[#f5cf7d]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd]">
                {highlight.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
                {highlight.description}
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
        className="grid overflow-hidden rounded-lg border border-white/80 bg-white/76 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-700 dark:border-[#f3c76b]/24 dark:bg-[#090d1c]/66 dark:shadow-[0_28px_90px_rgba(0,0,0,0.42)] md:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7] transition-colors duration-700 dark:text-[#f3d795]">
            Co-creado contigo
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[#27304f] transition-colors duration-700 dark:text-[#fff6dd] sm:text-3xl">
            Una comunidad que se escucha y evoluciona
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#68708b] transition-colors duration-700 dark:text-[#c9c0df]">
            Los espacios se moderan con cuidado y las herramientas crecen a
            partir de lo que las integrantes necesitan en cada etapa.
          </p>
        </div>
        <div className="relative min-h-64 overflow-hidden">
          <Image
            src="/images/integracion.webp"
            alt="Espacio de integracion y comunidad"
            fill
            sizes="(min-width: 768px) 340px, 100vw"
            className="object-cover transition-[opacity,filter] duration-700 dark:opacity-85 dark:saturate-[0.9] dark:brightness-[0.72] dark:contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/35 to-transparent transition-colors duration-700 dark:from-[#02030a]/78 dark:to-[#f5cf7d]/8" />
        </div>
      </motion.div>
      </div>
    </section>
  );
}
