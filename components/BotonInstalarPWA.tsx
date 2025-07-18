"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function BotonInstalarPWA() {
  const [mostrarBoton, setMostrarBoton] = useState(false);

  useEffect(() => {
    const verificar = () => {
      if (typeof window !== "undefined" && window.deferredPrompt) {
        setMostrarBoton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", verificar);
    verificar();

    return () => {
      window.removeEventListener("beforeinstallprompt", verificar);
    };
  }, []);

  const instalarApp = async () => {
    if (window.deferredPrompt) {
      const promptEvent = window.deferredPrompt;
      await promptEvent.prompt();

      const { outcome } = await promptEvent.userChoice;
      console.log(`Instalación: ${outcome}`);
      window.deferredPrompt = undefined;
      setMostrarBoton(false);
    }
  };

  return (
    <AnimatePresence>
      {mostrarBoton && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={instalarApp}
            className="flex items-center gap-2 bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 text-white font-semibold px-5 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Instalar la app Estrella del Alba
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
