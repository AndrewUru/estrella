"use client";

import React, { useState, useEffect } from "react";

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumber, setAnimatedNumber] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate the number 7
          let current = 0;
          const increment = () => {
            if (current < 7) {
              current++;
              setAnimatedNumber(current);
              setTimeout(increment, 150);
            }
          };
          setTimeout(increment, 500);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("stats-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="w-full max-w-6xl px-6 mt-16 mb-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Tu Transformación Comienza Aquí
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubre el poder de la conexión interior y la transformación
          vibracional
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Días de Transformación */}
        <div
          className={`group relative overflow-hidden transform transition-all duration-700 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-purple-600/30 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl border border-purple-500/40 dark:border-purple-500/30 p-8 text-center hover:border-purple-400/60 dark:hover:border-purple-400/50 transition-all duration-500 shadow-lg dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl"></div>

            <div className="mb-4">
              <div className="relative inline-block">
                <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {animatedNumber}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-6xl font-bold animate-pulse opacity-50">
                  {animatedNumber}
                </div>
              </div>
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
              Días de Transformación
            </div>
            <div className="text-sm text-gray-600 dark:text-muted-foreground">
              Un viaje intensivo hacia tu despertar interior
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-500"></div>
          </div>
        </div>

        {/* Vibracional */}
        <div
          className={`group relative overflow-hidden transform transition-all duration-700 delay-200 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-blue-600/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl border border-blue-500/40 dark:border-blue-500/30 p-8 text-center hover:border-blue-400/60 dark:hover:border-blue-400/50 transition-all duration-500 shadow-lg dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-3xl"></div>

            <div className="mb-4">
              <div className="relative inline-block">
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-6xl font-bold animate-pulse opacity-50">
                  100%
                </div>
              </div>
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
              Vibracional
            </div>
            <div className="text-sm text-gray-600 dark:text-muted-foreground">
              Eleva tu frecuencia energética al máximo
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-700"></div>
          </div>
        </div>

        {/* Conexión Interior */}
        <div
          className={`group relative overflow-hidden transform transition-all duration-700 delay-400 hover:scale-105 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-orange-500/30 to-red-500/30 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl border border-amber-500/40 dark:border-amber-500/30 p-8 text-center hover:border-amber-400/60 dark:hover:border-amber-400/50 transition-all duration-500 shadow-lg dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-3xl"></div>

            <div className="mb-4">
              <div className="relative inline-block">
                <div className="text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
                  ∞
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent text-6xl font-bold animate-pulse opacity-50 delay-500">
                  ∞
                </div>
              </div>
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
              Conexión Interior
            </div>
            <div className="text-sm text-gray-600 dark:text-muted-foreground">
              Acceso ilimitado a tu sabiduría interna
            </div>

            {/* Floating particles */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-orange-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full border border-purple-500/30 dark:border-purple-500/20 backdrop-blur-sm">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-muted-foreground">
            Tu transformación está a solo un clic de distancia
          </span>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </section>
  );
}
