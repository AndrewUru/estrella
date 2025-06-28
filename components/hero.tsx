"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-40 h-40 md:w-80 md:h-80 md:-top-40 md:-left-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-48 h-48 md:w-96 md:h-96 md:-bottom-40 md:-right-40 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        className="absolute pointer-events-none z-10 hidden md:block"
        animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-20 flex flex-col gap-8 md:gap-12 items-center px-4 md:px-6 text-center max-w-6xl mx-auto">
        <h1 className="sr-only">
          Estrella del Alba - Plataforma energética diaria
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium"
        >
          <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
          7 días de reconexión energética
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-2 md:space-y-4"
        >
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent leading-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Reconecta con tu
          </motion.h2>
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Alma
          </motion.h2>
          <motion.div
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            en sólo{" "}
            <span className="inline-block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-bold">
              7 Días
            </span>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl lg:max-w-3xl leading-relaxed"
        >
          Una experiencia ceremonial, diaria y tangible para volver a sentir tu
          conexión interior.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-8"
        >
          <Link href="/protected">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg text-sm md:text-base"
            >
              Comenzar Mi Transformación
            </motion.button>
          </Link>

          <Link href="/informacion">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 md:px-8 md:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm md:text-base"
            >
              Más Información
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mt-6 md:mt-12 text-white/60 text-xs md:text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white/20"
                />
              ))}
            </div>
            <span>+1,000 almas acompañadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              ))}
            </div>
            <span>Valoración 4.9 / 5</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isVisible ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 w-48 md:w-96 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
      />
    </div>
  );
}
