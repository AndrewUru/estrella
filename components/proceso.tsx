//C:\estrella\components\proceso.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image"; // Asegúrate de importar esto arriba

export default function ProcesoSection() {
  return (
    <section className="w-full max-w-6xl px-6 py-20 mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          ¿Cómo funciona ESTRELLA?
        </h2>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
          Una plataforma espiritual que te guía día a día a través de prácticas
          energéticas, meditaciones canalizadas y material sagrado. Tú solo
          conéctate, respira... y fluye
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="rounded-3xl overflow-hidden shadow-xl border border-purple-200 dark:border-purple-800"
      >
        <Image
          src="/Captura-vista-mi-espacio.webp"
          alt="Vista principal de tu espacio interior"
          width={1200}
          height={800}
          className="w-full object-cover"
        />
      </motion.div>
    </section>
  );
}
