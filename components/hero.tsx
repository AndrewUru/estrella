"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <motion.div
      className="relative w-full max-w-screen pt-8 flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 md:px-8 text-center"
      style={{
        height: "calc(90vh - 16px)",
        minHeight: "600px",
      }}
    >
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

      {/* Contenido principal */}
      <motion.div className="relative z-20 flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm font-medium shadow-lg"
        >
          7 días de reconexión energética
        </motion.div>

        {/* Títulos */}
        <div className="space-y-3">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-violet-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Reconecta con tu Alma
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/85 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Una experiencia <span className="text-violet-300 font-semibold">ceremonial</span>, <span className="text-cyan-300 font-semibold">diaria</span> y <span className="text-purple-300 font-semibold">tangible</span> para volver a sentir tu conexión interior.
          </motion.p>
        </div>
        {/* Estadísticas mejoradas */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
  transition={{ duration: 1, delay: 1.4 }}
  className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 mt-6 md:mt-8 text-white/80 text-sm sm:text-base"
>
  {/* Avatar group */}
  <motion.div
    className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex -space-x-2">
      {[
        "https://randomuser.me/api/portraits/women/68.jpg",
        "https://randomuser.me/api/portraits/men/34.jpg",
        "https://randomuser.me/api/portraits/women/44.jpg",
        "https://randomuser.me/api/portraits/men/12.jpg",
        "https://randomuser.me/api/portraits/women/25.jpg",
      ].map((src, i) => (
        <motion.div
          key={i}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/30 shadow-lg overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 1.6 + i * 0.1,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ scale: 1.1, z: 10 }}
        >
          <Image
            src={src}
            alt={`Usuario ${i + 1}`}
            width={36}
            height={36}
            className="object-cover w-full h-full"
            unoptimized
          />
        </motion.div>
      ))}
    </div>
    <span className="font-semibold">+500 almas acompañadas</span>
  </motion.div>

  {/* Valoración */}
  <motion.div
    className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.8 + i * 0.1,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ scale: 1.2, y: -2 }}
        />
      ))}
    </div>
    <span className="font-semibold">Valoración 4.9 / 5</span>
  </motion.div>
</motion.div>


        {/* Botones */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Link href="/auth/login">
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🌟 Iniciar Sesión
            </motion.button>
          </Link>
          <Link href="/auth/sign-up">
            <motion.button
              className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/15 backdrop-blur-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💫 Regístrate GRATIS
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
