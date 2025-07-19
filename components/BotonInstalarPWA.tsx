"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function BotonInstalarPWA() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const esModoDesarrollo = process.env.NODE_ENV === "development";

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setPromptEvent(event);
      setVisible(true);
      console.log("📲 Evento beforeinstallprompt capturado");

      // Ocultar el botón automáticamente después de 10 segundos
      setTimeout(() => setVisible(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const instalarApp = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      console.log(`✅ Instalación: ${outcome}`);
      setPromptEvent(null);
      setVisible(false);
    } else if (esModoDesarrollo) {
      alert("Este botón aparece solo en modo desarrollo.");
    }
  };

  const mostrarBoton = visible || esModoDesarrollo;

  return (
    <AnimatePresence>
      {mostrarBoton && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50"
        >
          <button
            onClick={instalarApp}
            className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-xl shadow-md hover:bg-gray-100 transition-all text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            Instalar App
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
