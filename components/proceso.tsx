"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface Phase {
  day: string;
  title: string;
  desc: string;
}

const processPhases: Phase[] = [
  {
    day: "1-2",
    title: "Limpieza Energética",
    desc: "Liberación de bloqueos",
  },
  {
    day: "3-5",
    title: "Activación",
    desc: "Despertar del canal intuitivo",
  },
  {
    day: "6-7",
    title: "Integración",
    desc: "Pacto sagrado con tu alma",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const numberVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

const cardVariants: Variants = {
  hover: {
    y: -8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const connectorVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      delay: 0.8,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ProcesoSection() {
  return (
    <section className="w-full max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          El Proceso de Reconexión
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Cada día es una puerta hacia tu esencia más profunda
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {processPhases.map((phase, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative group"
          >
            {index < processPhases.length - 1 && (
              <motion.div
                variants={connectorVariants}
                className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 origin-left"
              >
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                />
              </motion.div>
            )}

            <motion.div
              whileHover="hover"
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                whileHover="hover"
                variants={numberVariants}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mx-auto mb-4 relative z-10"
              >
                {phase.day}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.div className="relative z-10">
                <motion.h3
                  className="text-lg font-semibold text-foreground mb-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {phase.title}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {phase.desc}
                </motion.p>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-primary/20 rounded-full"
                initial={{ width: "20%" }}
                whileHover={{ width: "40%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-8"
      >
        <motion.div
          className="inline-flex items-center justify-center px-4 py-2 bg-secondary/50 rounded-full border border-border/30"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        ></motion.div>
      </motion.div>
    </section>
  );
}
