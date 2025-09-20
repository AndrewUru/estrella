"use client";

import { useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { usePayPalButtons } from "@/hooks/usePayPalButtons";

const PLANS = [
  {
    containerId: "paypal-annual",
    planId: "P-4BW16214L45789006NDHMBHY",
    planType: "premium-anual" as const,
    label: "Plan Anual",
    description: "Una sola vez al año: 77 €. Ahorra más del 70 %.",
    delay: 0.3,
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
        alert("Ocurrió un problema al activar tu plan. Contáctanos.");
      } else {
        alert("✨ Suscripción activada. Tu acceso premium ya está disponible.");
        window.location.href = "/protected";
      }
    }
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Fondo animado tipo niebla luminosa */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-200 via-transparent to-indigo-200 dark:from-purple-900 dark:via-transparent dark:to-indigo-900 pointer-events-none blur-3xl opacity-20"
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-xl w-full p-8 md:p-10 space-y-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2"
        >
          <motion.div
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-7 h-7 text-yellow-400" />
          </motion.div>
          Desbloquea tu Estrella Completa
        </motion.h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Accede a todo el programa con una única suscripción anual.
        </p>

        <div className="flex justify-center">
          {PLANS.map(({ containerId, label, description, delay }) => (
            <motion.div
              key={containerId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay }}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow border max-w-sm w-full space-y-4 text-left"
            >
              <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-200 flex items-center gap-2">
                <Star className="text-yellow-500 w-5 h-5" />
                {label}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{description}</p>

              {paypalReady ? (
                <div id={containerId} />
              ) : (
                <div className="flex justify-center py-4 text-purple-500">
                  <Loader2 className="animate-spin w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4 italic">
          * Si ya hiciste el pago, tu acceso se activará automáticamente. Si no,
          contáctanos y te ayudamos con amor 💜
        </p>
      </motion.div>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&components=buttons&vault=true&intent=subscription"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
    </div>
  );
}
