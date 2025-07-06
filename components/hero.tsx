"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // asegúrate de tenerlo importado

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Partículas flotantes
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div
      style={{ y, opacity }}
      className="relative w-screen h-screen flex flex-col justify-center items-center overflow-clip overscroll-none"
    >
      {/* Fondo gradiente mejorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>

      {/* Orbes de fondo animados */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 360],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [180, 540],
            x: [0, -120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
          className="absolute top-1/2 right-1/3 w-24 h-24 md:w-48 md:h-48 bg-gradient-to-r from-pink-500/25 to-rose-500/25 rounded-full blur-2xl"
        />
      </div>

      {/* Partículas flotantes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, -100, -20],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="bg-gradient-to-r from-white/40 to-cyan-400/40 rounded-full blur-sm"
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        </motion.div>
      ))}

      {/* Cursor interactivo mejorado */}
      <motion.div
        className="absolute pointer-events-none z-10 hidden md:block"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
          rotate: mousePosition.x * 10,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <div className="w-[400px] h-[400px] bg-gradient-to-r from-violet-400/10 via-purple-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      </motion.div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-20 flex flex-col gap-6 md:gap-10 items-center px-4 md:px-6 text-center max-w-7xl mx-auto"
        style={{ y: scrollY * 0.1 }}
      >
        {/* Badge mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group"
        >
          <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur-xl rounded-full border border-white/10 text-white text-sm font-medium shadow-2xl hover:shadow-purple-500/25 transition-all duration-500">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full shadow-lg shadow-cyan-400/50"
            />
            <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              ✨ 7 días de reconexión energética
            </span>
            <motion.div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>

        {/* Títulos mejorados */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="space-y-2 md:space-y-4"
        >
          <h1 className="sr-only">
            Estrella del Alba - Reconecta con tu alma en 7 días
          </h1>

          <div className="relative">
            <motion.h2
              className="text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-white via-cyan-100 to-violet-100 bg-clip-text text-transparent leading-none tracking-tight"
              whileHover={{
                scale: 1.02,
                textShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Reconecta con tu
            </motion.h2>

            <motion.h2
              className="text-4xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-none tracking-tight relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Alma
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100"
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  type: "tween",
                }}
              />
            </motion.h2>

            <motion.div
              className="text-xl md:text-3xl lg:text-4xl font-bold text-white/90 mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
              }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              en sólo{" "}
              <motion.span
                className="inline-block bg-gradient-to-r from-cyan-400 via-violet-400 to-purple-400 bg-clip-text text-transparent font-black relative"
                whileHover={{ scale: 1.1, rotate: 2 }}
              >
                7 Días
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full"
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    type: "tween",
                  }}
                />
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Descripción mejorada */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-4xl leading-relaxed font-light"
        >
          Una experiencia{" "}
          <span className="text-violet-300 font-semibold">ceremonial</span>,
          <span className="text-cyan-300 font-semibold"> diaria</span> y
          <span className="text-purple-300 font-semibold"> tangible</span> para
          volver a sentir tu conexión interior.
        </motion.p>

        {/* Botones mejorados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-8 md:mt-12"
        >
          <Link href="/auth/login">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white font-bold rounded-full overflow-hidden shadow-2xl text-base md:text-lg transition-all duration-300"
            >
              <span className="relative z-10">🌟 Iniciar Sesión</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </Link>

          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-xl text-white font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 text-base md:text-lg shadow-xl"
            >
              💫 Registrarse
            </motion.button>
          </Link>
        </motion.div>

        {/* Estadísticas mejoradas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col lg:flex-row items-center gap-6 md:gap-12 mt-12 md:mt-16 text-white/70 text-sm md:text-base"
        >
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex -space-x-3">
              {[
                "https://randomuser.me/api/portraits/women/68.jpg",
                "https://randomuser.me/api/portraits/men/34.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/12.jpg",
                "https://randomuser.me/api/portraits/women/25.jpg",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/30 shadow-lg overflow-hidden"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.4 + i * 0.1, type: "spring" }}
                >
                  <Image
                    src={src}
                    alt={`Usuario ${i + 1}`}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </motion.div>
              ))}
            </div>

            <span className="font-medium">+1,000 almas acompañadas</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                  initial={{ opacity: 0, scale: 0, rotate: 180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.6 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                />
              ))}
            </div>
            <span className="font-medium">Valoración 4.9 / 5</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              type: "tween",
            }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
