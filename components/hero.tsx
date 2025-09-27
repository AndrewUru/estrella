"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Star,
  Users,
  Sparkles,
  Zap,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Pointer = { x: number; y: number };

const featureList = [
  "Practicas guiadas en audio y PDF",
  "Rituales diarios para integrar con calma",
  "Acompanamiento en vivo cada semana",
  "Espacios protegidos solo para miembros",
];

type SparkleConfig = {
  delay: number;
  scale: number;
  orbit: number;
  initialAngle: number;
};
export function Hero() {
  const [viewport, setViewport] = useState<Pointer>({ x: 0, y: 0 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { damping: 40, stiffness: 200 });
  const smoothY = useSpring(pointerY, { damping: 40, stiffness: 200 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setViewport(center);
    pointerX.set(center.x);
    pointerY.set(center.y);

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY]);

  const sparkles = useMemo<SparkleConfig[]>(
    () =>
      Array.from({ length: 6 }).map((_, index) => ({
        delay: index * 0.65,
        scale: 0.6 + Math.random() * 0.8,
        orbit: 120 + Math.random() * 80,
        initialAngle: Math.random() * Math.PI * 2,
      })),
    []
  );

  return (
    <section
      className="relative flex min-h-[720px] w-full items-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 px-4 py-20 sm:px-6 lg:px-10"
      role="banner"
      aria-label="Seccion principal de reconexion energetica"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.45) 0%, transparent 45%)",
        }}
        animate={{ opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(58, 12, 163, 0.65), rgba(37, 99, 235, 0.55))",
        }}
        animate={{ backgroundPosition: ["0% 0%", "80% 80%", "0% 0%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {sparkles.map((sparkle, index) => (
        <SparkleOrb
          key={`sparkle-${index}`}
          config={sparkle}
          smoothX={smoothX}
          smoothY={smoothY}
          viewport={viewport}
        />
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <motion.div
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80 shadow-lg backdrop-blur-sm lg:justify-start"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Zap className="h-4 w-4 text-yellow-300" />7 dias de reconexion
            energetica
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Reconecta con tu
              <span className="block bg-gradient-to-r from-violet-200 via-white to-cyan-200 bg-clip-text text-transparent">
                universo interior
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg lg:mx-0">
              Vive una experiencia ceremonial diaria para volver a sentir tu
              energia. Cada sesion combina meditacion guiada, respiracion y
              rituales sencillos para integrar en tu rutina.
            </p>
          </motion.div>

          <motion.ul
            className="grid gap-3 text-left text-sm text-white/70 sm:grid-cols-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {featureList.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm backdrop-blur"
              >
                <Star className="mt-0.5 h-4 w-4 text-violet-300" />
                <span>{feature}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link
              href="/upgrade"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-2xl transition duration-500 hover:scale-105 hover:shadow-purple-500/40"
            >
              Comenzar ahora
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <PlayCircle className="h-5 w-5" />
              Ver una sesion de muestra
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6 text-white/80 sm:flex-row sm:justify-center lg:justify-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/34.jpg",
                  "https://randomuser.me/api/portraits/women/44.jpg",
                ].map((src, index) => (
                  <div
                    key={src}
                    className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/20"
                  >
                    <Image
                      src={src}
                      alt={`Integrante ${index + 1}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">
                <Users className="mr-2 inline h-4 w-4 text-violet-300" />
                +500 almas conectadas
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="flex text-yellow-300">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star key={value} className="h-4 w-4 fill-current" />
                ))}
              </div>
              4.9 / 5
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto flex w-full max-w-md flex-1 justify-center lg:max-w-sm"
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <div className="relative h-[460px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-[0_20px_80px_rgba(124,58,237,0.35)] backdrop-blur">
            <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/30 blur-2xl" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="space-y-4 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                  Ritual del dia
                </span>
                <h3 className="text-2xl font-semibold leading-snug">
                  Respira, integra y anota tu energia del presente
                </h3>
                <p className="text-sm text-white/70">
                  Accede a practicas en audio, journaling guiado y activaciones
                  energeticas para sostener tu proceso.
                </p>
              </div>

              <div className="relative flex h-48 overflow-hidden rounded-[1.75rem]">
                <Image
                  src="/images/samari-2.webp"
                  alt="Sesiones guiadas por Samari"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white">
                  <PlayCircle className="h-5 w-5" /> 15 min de practica
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface SparkleOrbProps {
  config: SparkleConfig;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  viewport: Pointer;
}

function SparkleOrb({ config, smoothX, smoothY, viewport }: SparkleOrbProps) {
  const offsetX = useTransform(
    smoothX,
    (value) =>
      Math.cos(config.initialAngle) * config.orbit + (value - viewport.x)
  );
  const offsetY = useTransform(
    smoothY,
    (value) =>
      Math.sin(config.initialAngle) * config.orbit + (value - viewport.y)
  );

  return (
    <motion.div
      className="pointer-events-none absolute text-violet-200/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 6, delay: config.delay, repeat: Infinity }}
      style={{
        left: "50%",
        top: "50%",
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        style={{ x: offsetX, y: offsetY }}
        animate={{ rotate: 360, scale: [0, config.scale, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
    </motion.div>
  );
}
