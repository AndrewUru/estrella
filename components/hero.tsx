"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Users, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 text-center"
      role="banner"
      aria-label="Sección principal de reconexión energética"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(139, 92, 246, 0.3) 0%, 
              transparent 50%),
            linear-gradient(135deg, 
              #0f0f23 0%, 
              #581c87 50%, 
              #3b82f6 100%)
          `,
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Sparkles */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-30"
          initial={{ 
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            scale: 0
          }}
          animate={{ 
            x: mousePosition.x + (Math.random() - 0.5) * 100,
            y: mousePosition.y + (Math.random() - 0.5) * 100,
            scale: [0, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8
          }}
        >
          <Sparkles className="text-violet-300 w-4 h-4" />
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col gap-8 max-w-4xl w-full">
        
        {/* Badge */}
        <motion.div
          className="flex justify-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-4 py-2 bg-violet-600/30 text-white text-sm rounded-full backdrop-blur-sm border border-white/20 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>7 días de reconexión energética</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-cyan-200 tracking-tight"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Reconecta con tu{" "}
          <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Alma
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Una experiencia{" "}
          <span className="text-violet-300 font-semibold">ceremonial</span>,{" "}
          <span className="text-cyan-300 font-semibold">diaria</span> y{" "}
          <span className="text-purple-300 font-semibold">tangible</span>
          <br />
          para volver a sentir tu conexión interior.
        </motion.p>

        {/* Social Proof */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white text-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "https://randomuser.me/api/portraits/women/68.jpg",
                "https://randomuser.me/api/portraits/men/34.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20"
                >
                  <Image
                    src={src}
                    alt={`Usuario ${i + 1}`}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-300" />
              <span className="font-medium">+500 almas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="font-medium">4.9 / 5</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/auth/login">
            <motion.button
              className="relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full text-lg font-semibold overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10 flex items-center gap-2">
                Iniciar Sesión
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.div>
              </span>
            </motion.button>
          </Link>

          <Link href="/auth/sign-up">
            <motion.button
              className="relative px-8 py-4 border-2 border-white/60 text-white rounded-full text-lg font-semibold backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                initial={false}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Regístrate GRATIS
              </span>
            </motion.button>
          </Link>
        </div>
       

      </div>
    </div>
  );
}