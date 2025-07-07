"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 8,
    duration: Math.random() * 4 + 6,
  }));

  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    delay: Math.random() * 3,
  }));

  return (
    <motion.div
      className="relative w-screen pt-8 flex flex-col justify-center items-center overflow-clip overscroll-none"
      style={{
        height: "calc(100vh - 32px)",
        transform: `translateY(${scrollY * 0.5}px)`,
      }}
    >
      {/* Fondo mejorado con múltiples gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_20%,rgba(168,85,247,0.2),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(14,165,233,0.2),rgba(255,255,255,0))]" />
      </div>

      {/* Orbes animados mejorados */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          animate={{
            scale: [1, 1.4, 1.2, 1],
            rotate: [0, 180, 270, 360],
            x: [0, 150, -100, 0],
            y: [0, -80, 60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween",
          }}
          className="absolute top-1/4 left-1/4 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.3, 1.2],
            rotate: [360, 180, 0, 360],
            x: [0, -200, 100, 0],
            y: [0, 100, -60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
            type: "tween",
          }}
          className="absolute top-3/4 right-1/4 w-32 h-32 md:w-60 md:h-60 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-3xl"
        />
      </div>

      {/* Elementos flotantes decorativos */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute pointer-events-none opacity-20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15 + element.delay,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="bg-gradient-to-r from-white/30 to-violet-400/30 rounded-full blur-sm"
            style={{
              width: element.size,
              height: element.size,
            }}
          />
        </motion.div>
      ))}

      {/* Partículas mejoradas */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-30, -120, -30],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="bg-gradient-to-r from-white/60 to-cyan-400/60 rounded-full blur-sm shadow-lg"
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        </motion.div>
      ))}

      {/* Cursor animado mejorado */}
      <motion.div
        className="absolute pointer-events-none z-10 hidden md:block"
        animate={{
          x: mousePosition.x * 40,
          y: mousePosition.y * 40,
          rotate: mousePosition.x * 15,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
      >
        <div className="w-[500px] h-[500px] bg-gradient-to-r from-violet-400/8 via-purple-400/8 to-cyan-400/8 rounded-full blur-3xl animate-pulse" />
      </motion.div>

      {/* Contenido principal */}
      <motion.div className="relative z-20 flex flex-col gap-3 md:gap-6 items-center px-2 md:px-4 text-center max-w-7xl mx-auto">
        {/* Badge mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 30,
            scale: isVisible ? 1 : 0.9,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group"
        >
          <motion.div
            className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-900/40 to-purple-900/40 backdrop-blur-xl rounded-full border border-white/20 text-white text-sm font-medium shadow-2xl hover:shadow-purple-500/30 transition-all duration-500"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <motion.span
              className="text-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨
            </motion.span>
            <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent font-semibold">
              7 días de reconexión energética
            </span>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </motion.div>

        {/* Títulos mejorados */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="space-y-2 md:space-y-4"
        >
          <h1 className="sr-only">
            Estrella del Alba - Reconecta con tu alma en 7 días
          </h1>
          <div className="relative">
            <motion.h2
              className="text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-white via-cyan-100 to-violet-100 bg-clip-text text-transparent leading-none tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Reconecta con tu
            </motion.h2>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none tracking-tight relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Alma
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-2xl -z-10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.h2>
            <motion.div
              className="text-xl md:text-3xl lg:text-4xl font-bold text-white/90 mt-2 md:mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              en sólo{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-black relative"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                7 Días
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                />
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Descripción mejorada */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-xl lg:text-2xl text-white/85 max-w-4xl leading-relaxed font-light px-2"
        >
          Una experiencia{" "}
          <motion.span
            className="text-violet-300 font-semibold relative"
            whileHover={{ scale: 1.05 }}
          >
            ceremonial
          </motion.span>
          ,{" "}
          <motion.span
            className="text-cyan-300 font-semibold relative"
            whileHover={{ scale: 1.05 }}
          >
            diaria
          </motion.span>{" "}
          y{" "}
          <motion.span
            className="text-purple-300 font-semibold relative"
            whileHover={{ scale: 1.05 }}
          >
            tangible
          </motion.span>{" "}
          para volver a sentir tu conexión interior.
        </motion.p>

        {/* Estadísticas mejoradas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 mt-6 md:mt-8 text-white/80 text-sm md:text-base"
        >
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
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-white/30 shadow-lg overflow-hidden"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.6 + i * 0.1, type: "spring" }}
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
            <span className="font-semibold">+1,000 almas acompañadas</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
            whileHover={{ scale: 1.05, y: -2 }}
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                  initial={{ opacity: 0, scale: 0, rotate: 180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.8 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.2, y: -2 }}
                />
              ))}
            </div>
            <span className="font-semibold">Valoración 4.9 / 5</span>
          </motion.div>
        </motion.div>

        {/* Botones mejorados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-10"
        >
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white font-bold rounded-full overflow-hidden shadow-2xl shadow-purple-500/25 text-base md:text-lg transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
              <motion.span
                className="relative z-10 flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                <span className="text-xl">🌟</span>
                Iniciar Sesión
              </motion.span>
            </motion.button>
          </Link>

          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 text-base md:text-lg shadow-xl relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              />
              <motion.span
                className="relative z-10 flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                <span className="text-xl">💫</span>
                Registrarse
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-gradient-to-b from-white/60 to-transparent rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
