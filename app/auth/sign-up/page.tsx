// app/auth/sign-up/page.tsx

import Image from "next/image";
import SignUpWithPayment from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo con gradiente etéreo y elementos flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base etéreo */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/70 to-indigo-50/50" />

        {/* Elementos flotantes animados */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Partículas decorativas */}
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
        {/* Hero Section mejorada */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="relative inline-block mb-8">
            {/* Anillo mágico alrededor del logo */}
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
                className="relative mx-auto rounded-full shadow-lg"
              />
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
            Únete a Estrella
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
            Estás a un paso de entrar en un espacio vibracional único, con
            contenido exclusivo y una comunidad que te apoya en tu camino de
            reconexión interior. Esto no es un curso, es una{" "}
            <span className="font-semibold text-violet-600">
              experiencia transformadora
            </span>
            .
          </p>
        </div>

        {/* Por qué pagar - Rediseñado con mejor flujo visual */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-100/50 to-purple-100/50 rounded-3xl blur-xl" />
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-lg border border-white/30">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
                  ¿Por qué una suscripción?
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-violet-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    Proyecto Consciente
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Creado con amor, horas de desarrollo y dedicación a cada
                    detalle.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    Plataforma Viva
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Tu apoyo mantiene la estrella encendida y el contenido
                    actualizado.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    Comunidad Accesible
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Garantizamos que el espacio siga funcional para quienes lo
                    necesiten.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-700 font-medium">
                  Gracias por valorar este trabajo consciente ✨
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan de suscripción - Rediseño premium */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            {/* Efecto de brillo mágico */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-lg opacity-20 animate-pulse" />

            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/40 hover:shadow-3xl transition-all duration-700 hover:-translate-y-3">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-4 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Suscripción Mensual
                </h2>
                <p className="text-slate-600">
                  Tu puerta de entrada a la transformación
                </p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    22€
                  </span>
                  <span className="text-xl text-slate-500 font-medium">
                    /mes
                  </span>
                </div>
                <p className="text-slate-600 font-medium">
                  Cancela cuando quieras, sin compromisos
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
                    text: "Contenido nuevo cada semana",
                    color: "from-amber-400 to-orange-400",
                  },
                  {
                    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                    text: "Acceso a comunidad privada",
                    color: "from-purple-400 to-pink-400",
                  },
                  {
                    icon: "M13 10V3L4 14h7v7l9-11h-7z",
                    text: "Soporte prioritario",
                    color: "from-blue-400 to-cyan-400",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300"
                  >
                    <div
                      className={`bg-gradient-to-r ${item.color} rounded-full p-2 shadow-md`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de registro */}
        <div className="flex justify-center mb-16" id="register-form">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200/50 to-purple-200/50 rounded-2xl blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
                <SignUpWithPayment />
              </div>
            </div>
          </div>
        </div>

        {/* Confianza y garantías - Rediseñado */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              {
                label: "Pago Seguro",
                description: "Transacciones protegidas",
                color: "from-green-400 to-emerald-400",
                icon: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
              },
              {
                label: "Garantía 30 Días",
                description: "Satisfacción garantizada",
                color: "from-blue-400 to-cyan-400",
                icon: "M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
              },
              {
                label: "Sin Compromisos",
                description: "Libertad total",
                color: "from-purple-400 to-pink-400",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/60 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30 group-hover:shadow-xl transition-all duration-300">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${item.color} rounded-full mb-4 shadow-lg`}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {item.label}
                    </h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-100/50 to-purple-100/50 rounded-2xl blur-xl" />
            <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30">
              <p className="text-slate-700 font-medium">
                Únete a más de{" "}
                <span className="font-bold text-violet-600">
                  1,000 personas
                </span>{" "}
                que ya han transformado su vida espiritual con Estrella ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
