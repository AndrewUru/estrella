"use client";

import { useEffect, useState } from "react";

export default function BotonInstalarPWA() {
  const [mostrarBoton, setMostrarBoton] = useState(false);

  useEffect(() => {
    const comprobarDisponibilidad = () => {
      if (typeof window !== "undefined" && window.deferredPrompt) {
        setMostrarBoton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", comprobarDisponibilidad);
    comprobarDisponibilidad();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        comprobarDisponibilidad
      );
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

  if (!mostrarBoton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={instalarApp}
        className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-2xl shadow-lg hover:bg-purple-700 transition-all"
      >
        Instalar App
      </button>
    </div>
  );
}
