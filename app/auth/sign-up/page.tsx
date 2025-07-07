// app/auth/sign-up/page.tsx

import Image from "next/image";
import SignUpWithPayment from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/70 to-indigo-50/50" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col px-4 py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full blur-xl opacity-30 animate-pulse scale-125" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-md opacity-20 animate-pulse scale-110"
                style={{ animationDelay: "1s" }}
              />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-2xl ring-1 ring-white/50">
                <Image
                  src="/logo-estrella.png"
                  alt="Logo Estrella"
                  width={88}
                  height={88}
                  className="mx-auto rounded-full shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Bienvenida a Estrella del Alba 7D
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-light">
              ¿Sientes que has perdido la conexión contigo misma? ¿Buscas
              claridad sin gurús ni estructuras rígidas? Esta experiencia es un
              camino directo a tu alma.
            </p>
            <ul className="text-left list-disc list-inside text-sm text-slate-700">
              <li>Claridad energética restaurada</li>
              <li>Canal intuitivo activo</li>
              <li>Dirección interior activada</li>
              <li>Pacto sagrado con tu alma</li>
            </ul>
            <p className="text-lg text-slate-700 font-semibold">
              Todo esto por solo <span className="text-purple-600">22€</span>.
              Mientras otros cursos cuestan cientos o miles de euros, aquí tu
              alma se reconecta sin que tu bolsillo sufra.
            </p>
            <p className="text-slate-500 text-sm">
              Acceso inmediato a la plataforma y comunidad.
            </p>
          </div>

          {/* Formulario de registro */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-purple-200/50 rounded-2xl blur-xl" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
              <SignUpWithPayment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
