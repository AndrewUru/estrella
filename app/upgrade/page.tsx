"use client";

import { useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase/client";
import {
  CheckCircle2,
  Clock,
  LifeBuoy,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePayPalButtons } from "@/hooks/usePayPalButtons";

const PLANS = [
  {
    containerId: "paypal-annual",
    planId: "P-4BW16214L45789006NDHMBHY",
    planType: "premium-anual" as const,
    label: "Plan anual",
    description: "Un solo pago al ano: 77 EUR. Ahorra mas del 70%.",
    delay: 0.3,
  },
];

const HIGHLIGHTS = [
  {
    icon: CheckCircle2,
    title: "Todo el contenido premium",
    description:
      "Clases grabadas, rituales guiados, descargas y actualizaciones nuevas sin limites.",
  },
  {
    icon: Sparkles,
    title: "Ruta clara para tu practica",
    description:
      "Recibe un calendario sugerido, recordatorios amorosos y seguimiento mensual.",
  },
  {
    icon: LifeBuoy,
    title: "Acompanamiento cercano",
    description:
      "Contacto directo si necesitas apoyo extra y acceso a la comunidad privada.",
  },
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Pago seguro",
    description:
      "Procesado por PayPal con proteccion al comprador y cifrado extremo a extremo.",
  },
  {
    icon: Clock,
    title: "Acceso inmediato",
    description:
      "Tu perfil premium se activa en cuanto confirmamos la suscripcion anual.",
  },
  {
    icon: Star,
    title: "Bonus especiales",
    description:
      "Incluye talleres en vivo, descansos conscientes y cintas nuevas cada temporada.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Que sucede despues del pago?",
    answer:
      "Veras la pagina de confirmacion de PayPal y redirigimos tu cuenta al area protegida sin esperas.",
  },
  {
    question: "Puedo cancelar cuando quiera?",
    answer:
      "Si, el plan se renueva cada ano. Cancela desde tu panel de PayPal antes del siguiente cobro y no se te volvera a cobrar.",
  },
  {
    question: "Y si necesito ayuda con el cobro?",
    answer:
      "Escribenos desde el formulario de contacto o por correo y respondemos en menos de 24 horas habiles.",
  },
];

export default function UpgradePage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const { paypalReady } = usePayPalButtons(
    scriptLoaded ? PLANS : [],
    async (planType, subscriptionID) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_id: subscriptionID,
          plan: "premium",
          plan_type: planType,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error al actualizar perfil:", error);
        alert("Ocurrio un problema al activar tu plan. Contactanos.");
      } else {
        alert("Suscripcion activada. Tu acceso premium ya esta disponible.");
        window.location.href = "/protected";
      }
    }
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 px-4 py-16 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_55%)]"
        animate={{ opacity: [0.35, 0.45, 0.35] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -left-12 top-0 h-64 w-64 rounded-full bg-purple-300/40 blur-3xl dark:bg-purple-700/30"
        animate={{ y: [0, 20, 0], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/30"
        animate={{ y: [0, -16, 0], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl rounded-[28px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_100px_-40px_rgba(79,70,229,0.55)] backdrop-blur-xl dark:border-white/5 dark:bg-gray-900/80 md:p-12"
      >
        <div className="grid gap-12 md:grid-cols-5 md:gap-10">
          <div className="md:col-span-3 space-y-8 text-left">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-200/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 shadow-sm dark:border-purple-800/60 dark:bg-purple-950/50 dark:text-purple-200"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
              Tu proximo nivel
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl font-bold leading-snug text-gray-900 dark:text-gray-100 sm:text-4xl"
            >
              Desbloquea tu estrella completa con un viaje anual intencional
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base text-gray-600 dark:text-gray-300"
            >
              Unete a la version premium de Estrella para profundizar en tu
              practica, sostener tu energia cada mes y acceder a experiencias
              que solo vivimos con la familia de suscripcion.
            </motion.p>

            <div className="space-y-4">
              {HIGHLIGHTS.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.08 }}
                  className="flex items-start gap-4 rounded-2xl border border-purple-100/80 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:border-purple-200 dark:border-purple-900/70 dark:bg-gray-900/60"
                >
                  <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-800/60 dark:text-purple-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-purple-100/50 bg-white/70 p-4 text-sm shadow-sm backdrop-blur dark:border-purple-900/60 dark:bg-gray-900/50"
                >
                  <div className="mb-2 flex items-center gap-2 text-purple-600 dark:text-purple-200">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold uppercase tracking-wide text-xs">
                      {title}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="rounded-[26px] border border-purple-100/70 bg-white p-8 text-left shadow-[0_18px_50px_-28px_rgba(79,70,229,0.8)] dark:border-purple-900/60 dark:bg-gray-950">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-500 dark:text-purple-200">
                    Suscripcion premium
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {PLANS[0].label}
                  </h2>
                </div>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900/60 dark:text-purple-200">
                  Mejor valor
                </span>
              </div>

              <div className="mb-4 flex items-baseline gap-3 text-purple-700 dark:text-purple-200">
                <span className="text-5xl font-black leading-none">77</span>
                <div className="flex flex-col text-sm font-semibold">
                  <span>EUR</span>
                  <span className="text-gray-500 dark:text-gray-300">
                    cada ano
                  </span>
                </div>
              </div>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                Un pago anual que desbloquea todo el contenido y las
                actualizaciones por 12 meses completos.
              </p>

              {paypalReady ? (
                <div
                  id={PLANS[0].containerId}
                  className="rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-white to-purple-100 p-3 dark:border-purple-900/40 dark:from-purple-950 dark:via-gray-950 dark:to-purple-900/40"
                />
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-purple-200 py-6 text-purple-500 dark:border-purple-800">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2 text-sm font-medium">
                    Preparando pasarela segura...
                  </span>
                </div>
              )}

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Gestionado por PayPal. Puedes cancelar en cualquier momento
                desde tu cuenta antes de la renovacion automatica.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Bonos de temporada incluidos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Sesiones nuevas cada mes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Material descargable sin limite
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-purple-200 bg-white/70 p-6 text-sm shadow-sm backdrop-blur dark:border-purple-900/60 dark:bg-gray-900/60">
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-200" />
                Promesa de cuidado Estrella
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Si algo no funciona como esperabas escribenos. Ajustamos tu
                acceso o devolvemos tu pago segun corresponda, sin preguntas.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-2xl border border-purple-100/70 bg-white/70 p-4 text-sm shadow-sm backdrop-blur transition-all hover:border-purple-200 dark:border-purple-900/60 dark:bg-gray-900/60"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-left font-semibold text-gray-800 marker:content-none dark:text-gray-100">
                  {question}
                  <span className="ml-4 text-xs font-medium uppercase tracking-wider text-purple-500 group-open:rotate-45 dark:text-purple-200">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {answer}
                </p>
              </details>
            ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            * Si ya realizaste el pago, tu acceso se activa de forma automatica.
            Si necesitas soporte adicional, contactanos y te ayudamos con todo
            el amor.
          </p>
        </div>
      </motion.section>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&components=buttons&vault=true&intent=subscription"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
    </div>
  );
}
