"use client";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center py-20">
      <h1 className="sr-only">
        Estrella del Alba - Plataforma energética diaria
      </h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl lg:text-5xl font-extrabold text-center max-w-3xl text-primary"
      >
        Reconecta con tu Alma en Solo 7 Días
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg text-muted-foreground text-center max-w-xl"
      >
        Un recorrido vibracional y ceremonial para regresar a la conexión con tu
        alma. No como un ideal abstracto, sino como una experiencia encarnada,
        diaria y accesible.
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8"
      />
    </div>
  );
}
