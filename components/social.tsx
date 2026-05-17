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
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center"
      >
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
            Comunidad protegida
          </p>
          <h2 className="text-3xl font-semibold leading-tight text-[#27304f] sm:text-4xl">
            Un lugar para compartir sin ruido
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[#68708b]">
            Dentro de Estrella del Alba puedes escribir tu avance, leer a otras
            mujeres y sentir que tu proceso no ocurre en soledad.
          </p>
          <Link
            href="/protected/social"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#516fae] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(81,111,174,0.22)] transition hover:bg-[#405c98]"
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
          className="relative overflow-hidden rounded-lg border border-white/80 bg-white/76 p-5 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.1]"
            style={{ backgroundImage: "url('/images/oleo-celeste.webp')" }}
          />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8d73b7]">
                Feed privado
              </span>
              <span className="rounded-full border border-[#d8c6ff]/70 bg-white/70 px-3 py-1 text-xs font-semibold text-[#516fae]">
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
                className="rounded-lg border border-white/80 bg-white/82 p-4 shadow-sm backdrop-blur"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#27304f]">
                      {entry.user}
                    </p>
                    <p className="text-xs text-[#7b8299]">{entry.time}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c89a3c]">
                    {entry.mood}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#535b78]">
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
              className="rounded-lg border border-white/80 bg-white/72 p-6 shadow-[0_18px_50px_rgba(50,70,116,0.09)] backdrop-blur-xl"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8c6ff]/70 bg-white/70 text-[#516fae]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#27304f]">
                {highlight.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68708b]">
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
        className="grid overflow-hidden rounded-lg border border-white/80 bg-white/76 shadow-[0_22px_70px_rgba(50,70,116,0.12)] backdrop-blur-xl md:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8d73b7]">
            Co-creado contigo
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[#27304f] sm:text-3xl">
            Una comunidad que se escucha y evoluciona
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#68708b]">
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
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#27304f]/35 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
