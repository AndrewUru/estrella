"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Historias vivas",
    description:
      "Publica notas de gratitud, pide apoyo y celebra micro-logros junto a tus compañeras.",
    icon: "✨",
  },
  {
    title: "Círculos activos",
    description:
      "Conecta con mujeres en procesos similares y coordina encuentros virtuales guiados.",
    icon: "🫶",
  },
  {
    title: "Rituales compartidos",
    description:
      "Descarga prácticas recomendadas por la comunidad según el estado emocional del día.",
    icon: "🕯️",
  },
];

const sampleFeed = [
  {
    user: "María",
    mood: "gratitud",
    content:
      "Terminé el ritual de respiración y sentí que por fin pude soltar la presión de la semana. Gracias por las palabras que me dejaron ayer.",
    time: "Hace 2h",
  },
  {
    user: "Isabel",
    mood: "inspiracion",
    content:
      "Compartí la meditación con mi círculo y todas terminamos llorando de emoción. ¡Las leo para seguir sosteniéndonos!",
    time: "Hace 5h",
  },
];

export default function SocialLandingSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute right-16 bottom-10 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-12 lg:grid-cols-[minmax(0,1fr),420px] lg:items-center"
      >
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-500/80">
            Comunidad protegida
          </p>
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            Un espacio social para conocerse, compartir y acompañarse
          </h2>
          <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
            Dentro de Estrella del Alba tienes una red privada que late al ritmo
            de tus procesos. Entra cuando quieras a saludar, escribir tu avance o
            sostener a otra integrante que lo necesite.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/protected/social"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/40"
            >
              Visitar la comunidad
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-[2rem] border border-pink-200/60 bg-white/80 shadow-2xl backdrop-blur dark:border-pink-900/40 dark:bg-gray-950/80"
        >
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -right-12 bottom-10 h-28 w-28 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="relative space-y-4 p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-500/70">
                Feed comunitario
              </span>
              <span className="text-xs font-semibold text-purple-500/80">
                Moderado 24/7
              </span>
            </div>
            <div className="space-y-4">
              {sampleFeed.map((entry, index) => (
                <motion.article
                  key={`${entry.user}-${index}`}
                  initial={{ y: 18, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, delay: index * 0.12 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-2xl border border-purple-200/50 bg-white/90 p-5 shadow-sm dark:border-purple-800/40 dark:bg-gray-900/80"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {entry.user}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.time}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-purple-500">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed dark:text-gray-200">
                    {entry.content}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.title}
            initial={{ y: 26, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            viewport={{ once: true, amount: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-pink-200/50 bg-white/75 p-6 shadow-lg backdrop-blur dark:border-pink-900/40 dark:bg-gray-950/70"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/15 text-xl">
              {highlight.icon}
            </span>
            <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
              {highlight.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {highlight.description}
            </p>
            <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-purple-400/20 blur-3xl" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-10 rounded-[2.75rem] border border-purple-200/60 bg-gradient-to-br from-white/95 via-white/85 to-purple-100/60 p-8 shadow-2xl backdrop-blur dark:border-purple-900/40 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-purple-950/60 md:grid-cols-[minmax(0,1fr),360px]"
      >
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/70">
            Co-creado contigo
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
            Te escuchamos cada semana para mantener la comunidad viva
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            El muro se modera con cariño, los círculos se abren según tu energía
            y cada mes sumamos herramientas sugeridas por las propias integrantes.
          </p>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• Notificaciones suaves, sin ruido innecesario.</li>
            <li>• Espacios privados por cohortes y temas específicos.</li>
            <li>• Biblioteca de rituales recomendados por la comunidad.</li>
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] border border-purple-200/40 bg-white/90 shadow-xl dark:border-purple-800/40 dark:bg-gray-950/80">
          <Image
            src="/images/integracion.webp"
            alt="Vista previa del espacio social"
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/25 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
