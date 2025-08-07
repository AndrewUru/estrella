"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ProcesoSection() {
  return (
    <section className="w-full max-w-6xl px-6 py-20 mx-auto text-center relative">
      {/* Elementos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/15 dark:bg-purple-500/8 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-100/25 dark:bg-purple-300/12 rounded-full blur-lg"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-16 relative z-10"
      >
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-purple-50/80 dark:bg-purple-900/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 px-4 py-2 rounded-full text-sm text-purple-700 dark:text-purple-300 mb-6 shadow-sm"
        >
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          Plataforma Espiritual
        </motion.div>

        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-800 via-purple-600 to-purple-700 dark:from-purple-200 dark:via-purple-300 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
          ¿Cómo funciona ESTRELLA?
        </h2>

        <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-purple-100/50 dark:border-purple-800/30 shadow-lg max-w-4xl mx-auto">
          <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-6">
            Una plataforma espiritual que te guía día a día a través de
            prácticas energéticas, meditaciones canalizadas y material sagrado.
            Tú solo conéctate, respira... y fluye.
          </p>

          {/* Sección Premium */}
          <div className="bg-gradient-to-br from-purple-50/80 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-800/15 rounded-xl p-6 mb-4 border border-purple-200/30 dark:border-purple-700/20">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl">💎</span>
              <div className="text-left">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  Suscripción Premium
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Con la suscripción premium, desbloqueas día a día una
                  experiencia guiada de 7 días: audio canalizado + guía práctica
                  PDF, todo desde un mismo lugar. Esta suscripción, de precio
                  accesible, nos permite sostener y cuidar esta plataforma
                  independiente creada con dedicación, esfuerzo y mucho amor
                  para acompañarte en tu proceso de reconexión.
                </p>
              </div>
            </div>
          </div>

          {/* Sección Gratuita */}
          <div className="bg-gradient-to-br from-green-50/60 to-emerald-50/40 dark:from-green-900/15 dark:to-emerald-900/10 rounded-xl p-6 mb-6 border border-green-200/30 dark:border-green-700/20">
            <div className="flex items-start gap-3">
              <span className="text-xl">🌱</span>
              <div className="text-left">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Suscripción Gratuita
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Con la suscripción gratuita, puedes acceder al Día 1 de forma
                  completa, para que puedas sentir la energía y decidir si
                  quieres continuar tu viaje interior.
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link
            href="/upgrade"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white text-sm font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="group-hover:animate-pulse">💎</span>
            Acceder como Premium
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="space-y-20 relative z-10"
      >
        {/* Primera imagen */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-gray-900/80 dark:to-purple-900/20 p-2 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            <div className="rounded-2xl overflow-hidden relative">
              <Image
                src="/Captura-vista-mi-espacio.webp"
                alt="Vista principal de tu espacio interior"
                width={1200}
                height={800}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                  Tu Espacio Sagrado
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed text-left">
                Desde &quot;Mi Espacio&quot; accedes a tu viaje sagrado,
                visualizas tu progreso y encuentras cada día canalizado con
                claridad.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Segunda imagen */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-200/50 dark:border-purple-800/50 bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-gray-900/80 dark:to-purple-900/20 p-2 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            <div className="rounded-2xl overflow-hidden relative">
              <Image
                src="/Captura-audio-y-pdf-diario.webp"
                alt="Audio y PDF diario"
                width={1200}
                height={800}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                  Contenido Diario
                </h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed text-left">
                Cada día recibes una meditación canalizada en audio y una guía
                PDF con prácticas para anclar la energía recibida.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
