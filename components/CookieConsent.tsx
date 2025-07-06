"use client";
import { useEffect, useState } from "react";
import { X, Shield, Cookie, ExternalLink } from "lucide-react";

const COOKIE_KEY = "cookies_accepted";

export function CookieConsent() {
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored) {
      setAccepted(stored === "yes");
    } else {
      // Mostrar el banner después de un pequeño delay para mejor UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    setIsAnimating(true);
    localStorage.setItem(COOKIE_KEY, "yes");
    setTimeout(() => {
      setAccepted(true);
      setIsVisible(false);
    }, 300);
  };

  const handleReject = () => {
    setIsAnimating(true);
    localStorage.setItem(COOKIE_KEY, "no");
    setTimeout(() => {
      setAccepted(false);
      setIsVisible(false);
    }, 300);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (accepted !== null || !isVisible) return null;

  return (
    <>
      {/* Backdrop con blur sutil */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Banner principal */}
      <div
        className={`fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 transition-all duration-300 ease-out ${
          isAnimating
            ? "translate-y-full sm:translate-y-0 sm:translate-x-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border border-zinc-200/50 dark:border-zinc-700/50 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Cookie className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">
                  Configuración de Cookies
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia de navegación y
                  analizar el uso del sitio. Puedes gestionar tus preferencias a
                  continuación.
                </p>
              </div>
            </div>

            {/* Política de cookies link */}
            <div className="mb-6">
              <a
                href="/legal/cookies"
                className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <span>Ver política de cookies</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                Solo esenciales
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02]"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
