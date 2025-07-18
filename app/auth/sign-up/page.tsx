// app/auth/sign-up/page.tsx

import Image from "next/image";
import SignUpWithPayment from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Fondo decorativo adaptativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/70 to-indigo-50/50 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-indigo-950/5" />

        {/* Elementos decorativos flotantes */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/40 to-purple-300/40 dark:from-violet-600/20 dark:to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-700/15 dark:to-pink-700/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Puntos flotantes */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-violet-400 dark:bg-violet-300 rounded-full animate-ping opacity-70" />
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 dark:bg-purple-300 rounded-full animate-ping opacity-70"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-ping opacity-70"
          style={{ animationDelay: "3s" }}
        />

        {/* Patrón geométrico sutil */}
        <div
          className="absolute top-20 left-20 w-32 h-32 border border-violet-200/30 dark:border-violet-700/30 rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-24 h-24 border border-purple-200/30 dark:border-purple-700/30 rounded-full animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        />
      </div>

      <div className="relative z-10 flex flex-col px-4 py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Formulario móvil - Solo visible en móvil */}
        <div className="lg:hidden mb-8">
          {/* Efecto de fondo del formulario */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-purple-200/50 dark:from-violet-700/20 dark:to-purple-700/20 rounded-2xl blur-xl transform rotate-1" />
          <div className="absolute inset-0 bg-gradient-to-l from-indigo-200/30 to-pink-200/30 dark:from-indigo-700/15 dark:to-pink-700/15 rounded-2xl blur-lg transform -rotate-1" />

          {/* Contenedor del formulario */}
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-gray-700/20 rounded-2xl pointer-events-none" />
            <div className="relative">
              <SignUpWithPayment />
            </div>
          </div>

          {/* Indicadores de confianza móvil */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-green-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Seguro SSL</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-blue-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Pago verificado</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-purple-500 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Acceso inmediato</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          {/* Contenido principal - Columna izquierda */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo con efectos */}
            <div className="inline-block relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 dark:from-violet-500 dark:via-purple-500 dark:to-indigo-500 rounded-full blur-xl opacity-30 animate-pulse scale-125" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 rounded-full blur-md opacity-20 animate-pulse scale-110"
                style={{ animationDelay: "1s" }}
              />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-4 shadow-2xl ring-1 ring-white/50 dark:ring-gray-700/50">
                <Image
                  src="/logo-estrella.png"
                  alt="Logo Estrella"
                  width={88}
                  height={88}
                  className="mx-auto rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* Título principal */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
                Bienvenida a Estrella del Alba 7D
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mx-auto lg:mx-0" />
            </div>

            {/* Descripción principal */}
            <p className="text-lg xl:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              ¿Sientes que has perdido la conexión contigo misma? ¿Buscas
              claridad sin gurús ni estructuras rígidas? Esta experiencia es un
              camino directo a tu alma.
            </p>

            {/* Precio y propuesta de valor */}
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-600/20 dark:to-purple-600/20 rounded-2xl p-6 border border-violet-200/30 dark:border-violet-700/30">
              <div className="text-center lg:text-left">
                {/* Nota final */}
                <div className="bg-white/80 dark:bg-gray-700/80 rounded-lg p-4 border border-white/50 dark:border-gray-600/50">
                  <p className="text-slate-700 dark:text-slate-300 text-sm xl:text-base">
                    ¿Quieres probar antes de comprometerte? También puedes
                    acceder de forma gratuita al{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      primer día del curso
                    </span>
                    . Descubre si esta experiencia vibra contigo desde el
                    inicio.
                  </p>
                </div>
              </div>
            </div>

            {/* Nota final */}
            <div className="text-center lg:text-left">
              <p className="text-slate-500 dark:text-slate-400 text-sm xl:text-base">
                Acceso inmediato a la plataforma y comunidad. Elige el plan que
                mejor se alinee con tu camino.
              </p>
            </div>
          </div>

          {/* Formulario de registro - Columna derecha - Solo visible en desktop */}
          <div className="hidden lg:block relative lg:sticky lg:top-8">
            {/* Efecto de fondo del formulario */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-purple-200/50 dark:from-violet-700/20 dark:to-purple-700/20 rounded-2xl blur-xl transform rotate-1" />
            <div className="absolute inset-0 bg-gradient-to-l from-indigo-200/30 to-pink-200/30 dark:from-indigo-700/15 dark:to-pink-700/15 rounded-2xl blur-lg transform -rotate-1" />

            {/* Contenedor del formulario */}
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent dark:from-gray-700/20 rounded-2xl pointer-events-none" />
              <div className="relative">
                <SignUpWithPayment />
              </div>
            </div>

            {/* Indicadores de confianza */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Seguro SSL</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-blue-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Pago verificado</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-purple-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Acceso inmediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
