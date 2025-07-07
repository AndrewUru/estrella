// app/auth/sign-up/page.tsx

import Image from "next/image";
import SignUpWithPayment from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col px-4 py-8 lg:py-12">
        {/* Hero */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-lg opacity-20 animate-pulse" />
            <Image
              src="/logo-estrella.png"
              alt="Logo Estrella"
              width={88}
              height={88}
              className="relative mx-auto rounded-full shadow-xl ring-4 ring-white/50"
            />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Únete a Estrella
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Estás a un paso de entrar en un espacio vibracional único, con
            contenido exclusivo y una comunidad que te apoya en tu camino de
            reconexión interior. Esto no es un curso, es una experiencia
            transformadora.
          </p>
        </div>

        {/* Por qué pagar */}
        <div className="max-w-2xl mx-auto mb-10 text-center text-slate-700 text-base leading-relaxed">
          <h2 className="text-xl font-semibold mb-4 text-violet-600">
            ¿Por qué una suscripción?
          </h2>
          <p className="mb-3">
            Este proyecto fue creado con muchísimo amor, horas de desarrollo y
            dedicación a cada detalle. No hay grandes empresas detrás, solo un
            equipo comprometido con tu transformación.
          </p>
          <p className="mb-3">
            La suscripción mensual de <strong>22 €</strong> permite sostener la
            plataforma, actualizar el contenido y garantizar que el espacio siga
            vivo, funcional y accesible para todas las personas que lo
            necesiten.
          </p>
          <p>
            Gracias por valorar este trabajo consciente. Tu apoyo mantiene la
            estrella encendida ✨
          </p>
        </div>

        {/* Plan de suscripción */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Suscripción mensual
              </h2>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-violet-600">
                    22€
                  </span>
                  <span className="text-slate-500">/mes</span>
                </div>
                <p className="text-slate-600 mt-2">
                  Cancela cuando quieras, sin compromisos.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Contenido nuevo cada semana",
                  "Acceso a comunidad privada",
                  "Soporte prioritario",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de registro */}
        <div className="flex justify-center mb-8" id="register-form">
          <div className="w-full max-w-md">
            <SignUpWithPayment />
          </div>
        </div>

        {/* Confianza y garantías */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-6 text-slate-500">
            {[
              {
                label: "Pago seguro",
                color: "text-green-500",
                icon: (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  />
                ),
              },
              {
                label: "Garantía 30 días",
                color: "text-blue-500",
                icon: (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  />
                ),
              },
              {
                label: "Sin compromisos",
                color: "text-purple-500",
                icon: (
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map(({ icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <svg
                  className={`w-5 h-5 ${color}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {icon}
                </svg>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            Únete a más de <strong>1,000 personas</strong> que ya han
            transformado su vida espiritual con Estrella.
          </p>
        </div>
      </div>
    </div>
  );
}
