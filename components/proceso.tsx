"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    id: "01",
    title: "Anclar la intencion",
    description:
      "Conecta con un objetivo claro para tu semana y abre el portal energetico que te guiara.",
    image: "/images/canalizaciones.webp",
  },
  {
    id: "02",
    title: "Practicas guiadas",
    description:
      "Recibe meditaciones canalizadas, breathwork y activaciones para sostener tu proceso diario.",
    image: "/images/anclar.webp",
  },
  {
    id: "03",
    title: "Integracion consciente",
    description:
      "Registra lo que sientes, comparte en comunidad y permite que la transformacion se asiente en ti.",
    image: "/images/integracion.webp",
  },
];

export default function ProcesoSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-400/15 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 translate-x-1/3 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-400/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-2xl space-y-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/80 dark:text-purple-200/70">
          Tu viaje interior
        </p>
        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
          Como se vive Estrella del Alba
        </h2>
        <p className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
          Acompana tu transformacion con rituales diarios, audio-guia y espacios
          protegidos. Tres pasos sencillos que puedes repetir cada ciclo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.article
            key={step.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="group relative overflow-hidden rounded-3xl border border-purple-200/40 bg-white/70 p-6 text-left shadow-lg backdrop-blur dark:border-purple-900/40 dark:bg-gray-950/70"
          >
            <span className="absolute right-6 top-6 text-sm font-semibold uppercase tracking-[0.4em] text-purple-400/70">
              {step.id}
            </span>
            <div className="relative mb-6 overflow-hidden rounded-2xl bg-purple-500/10">
              <Image
                src={step.image}
                alt={step.title}
                width={420}
                height={300}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {step.description}
            </p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
              <span>Explorar mas</span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                className="text-lg"
              >
                →
              </motion.span>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-purple-200/50 bg-gradient-to-br from-white/90 via-white/80 to-purple-100/60 p-1 shadow-2xl dark:border-purple-900/40 dark:from-gray-950/90 dark:via-gray-950/80 dark:to-purple-950/70"
      >
        <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-purple-500/15 via-white/70 to-transparent p-6 sm:p-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr),320px] md:items-center">
            <div className="space-y-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-500/70 dark:text-purple-200/70">
                Tu portal privado
              </p>
              <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-white">
                Practica, registra y celebra tu energia cada dia
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Explora tu panel con accesos rapidos a sesiones, rituales y
                comunidad. Visualiza tu avance y desbloquea material premium
                conforme sostienes el ritmo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/protected"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/40"
                >
                  Ver mi espacio
                </Link>
                <Link
                  href="/preguntas"
                  className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 px-5 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-500/10 dark:border-purple-700/40 dark:text-purple-200"
                >
                  Dudas frecuentes
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-purple-200/40 bg-white/90 shadow-xl dark:border-purple-800/40 dark:bg-gray-950/90">
                <Image
                  src="/Captura-vista-mi-espacio.webp"
                  alt="Vista de tu espacio interior"
                  width={640}
                  height={420}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
