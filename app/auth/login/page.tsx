// app/auth/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-300/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-violet-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/60 dark:bg-gray-900/40 border border-purple-200/50 dark:border-purple-700/30 shadow-2xl hover:shadow-3xl transition-all duration-500">
          {/* Columna izquierda - Inspiracional */}
          <div className="hidden lg:flex flex-col justify-center items-start p-8 md:p-10 xl:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-indigo-100/30 to-transparent dark:from-purple-800/20 dark:via-indigo-700/15 dark:to-purple-700/10"></div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-br from-purple-800 to-violet-500 dark:from-purple-200 dark:to-violet-300 bg-clip-text text-transparent">
                  Reconecta con tu <span className="font-extrabold">alma</span>
                </h2>

                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-md font-medium">
                  En solo 7 días, despierta tu
                  <span className="text-purple-600 dark:text-purple-300 font-semibold"> claridad energética</span>,
                  <span className="text-pink-600 dark:text-pink-300 font-semibold"> propósito espiritual</span> y
                  <span className="text-purple-600 dark:text-purple-300 font-semibold"> dones intuitivos</span>.
                </p>
              </div>

              <div className="space-y-4">
                {[{
                  icon: "🌟",
                  text: "Acceso inmediato a prácticas vibracionales"
                }, {
                  icon: "🎧",
                  text: "Playlist ceremonial para tu viaje interior"
                }, {
                  icon: "📓",
                  text: "PDF para acompañar tu proceso"
                }].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-purple-100/30 dark:bg-purple-800/20 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 hover:bg-purple-100/50 dark:hover:bg-purple-800/30 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-purple-200/40 group-hover:bg-purple-300/40 dark:bg-purple-700/40 dark:group-hover:bg-purple-600/40 transition-colors duration-200">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-200">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Login */}
          <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-6 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/60 dark:to-gray-700/40"></div>

            <div className="relative z-10 space-y-8">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-purple-200/40 dark:border-purple-700/30 rounded-2xl p-6 shadow-lg">
                <Suspense
                  fallback={
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 mb-4 animate-pulse">
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-purple-600 dark:text-purple-300 font-medium animate-pulse">
                        Preparando tu experiencia...
                      </p>
                    </div>
                  }
                >
                  <LoginContent />
                </Suspense>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30">
                  <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">¿Primera vez aquí?</span>
                  <a
                    href="/auth/sign-up"
                    className="text-sm font-semibold text-purple-700 dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 rounded-lg px-2 py-1"
                    aria-label="Crear una nueva cuenta"
                  >
                    Crea tu cuenta →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Versión móvil del contenido inspiracional */}
      <div className="lg:hidden relative z-10 px-4 pb-8">
        <div className="max-w-md mx-auto text-center space-y-4 bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/30">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-purple-700 dark:text-purple-300">✨ Transformación en 7 días:</span> Despierta tu claridad energética y propósito espiritual
          </p>
        </div>
      </div>
    </div>
  );
}
