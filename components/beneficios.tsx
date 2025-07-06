"use client";
import { useState } from "react";
import { AlertCircle, Sparkles, Check, X } from "lucide-react";

export function Beneficios() {
  const [hoveredCard, setHoveredCard] = useState<"before" | "after" | null>(
    null
  );

  const bloque1 = [
    "Desconexión del propósito interior",
    "Confusión tras años de camino espiritual",
    "Alta sensibilidad sin herramientas claras",
    "Deseo de claridad energética y dirección",
  ];

  const bloque2 = [
    "Claridad energética restaurada",
    "Canal intuitivo activo",
    "Dirección interior activada",
    "Pacto sagrado con tu alma",
  ];

  return (
    <section className="w-full max-w-7xl px-6 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Tu Transformación Espiritual
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Del caos interior a la claridad absoluta en solo 7 días
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Bloque 1 - Antes */}
        <div
          className="group relative overflow-hidden"
          onMouseEnter={() => setHoveredCard("before")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

          <div className="relative bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-3xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
            {/* Header con animación */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <X className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-400">
                  ¿Te reconoces en esto?
                </h3>
                <p className="text-red-600/80 dark:text-red-400/80 font-medium">
                  Síntomas del desequilibrio espiritual
                </p>
              </div>
            </div>

            {/* Lista de problemas */}
            <div className="space-y-4">
              {bloque1.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/60 dark:bg-red-900/20 rounded-2xl border border-red-200/30 dark:border-red-800/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation:
                      hoveredCard === "before"
                        ? "fadeInUp 0.5s ease-out forwards"
                        : "",
                  }}
                >
                  <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Indicador de problema */}
            <div className="mt-6 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                Estado actual: Desequilibrio energético
              </span>
            </div>
          </div>
        </div>

        {/* Flecha de transformación */}
        <div className="lg:hidden flex justify-center py-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Bloque 2 - Después */}
        <div
          className="group relative overflow-hidden"
          onMouseEnter={() => setHoveredCard("after")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

          <div className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-3xl border border-purple-200/50 dark:border-purple-800/50 backdrop-blur-sm transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
            {/* Header con animación */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white animate-spin" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Tu transformación en 7 días
                </h3>
                <p className="text-purple-600/80 dark:text-purple-400/80 font-medium">
                  Resultados garantizados
                </p>
              </div>
            </div>

            {/* Lista de beneficios */}
            <div className="space-y-4">
              {bloque2.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/60 dark:bg-purple-900/20 rounded-2xl border border-purple-200/30 dark:border-purple-800/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation:
                      hoveredCard === "after"
                        ? "fadeInUp 0.5s ease-out forwards"
                        : "",
                  }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Indicador de éxito */}
            <div className="mt-6 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">
                Estado objetivo: Armonía total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flecha de transformación para desktop */}
      <div className="hidden lg:flex justify-center items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          <Sparkles className="w-10 h-10 text-white animate-spin" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
