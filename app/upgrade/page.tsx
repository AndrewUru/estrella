//C:\estrella\app\upgrade\page.tsx
"use client";

import { useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function UpgradePage() {
  const [paypalReady, setPaypalReady] = useState(false);

  const renderButton = (
    containerId: string,
    planId: string,
    planType: string
  ) => {
    const paypal = window.paypal;
    if (!paypal || !paypal.Buttons) {
  console.warn("PayPal Buttons no disponibles");
  return;
}


    paypal
      .Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: (_data, actions) => {
          return actions.subscription.create({ plan_id: planId });
        },
        onApprove: async (data) => {
          const { subscriptionID } = data;

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
            return;
          }

          alert(
            "✨ Suscripción activada. Tu acceso premium ya está disponible."
          );
          window.location.href = "/protected";
        },
      })
      .render(`#${containerId}`);
  };

  const handlePaypalReady = () => {
  const maxRetries = 10;
  let retries = 0;

  const waitForPayPal = () => {
    if (window.paypal) {
      setPaypalReady(true);

      renderButton(
        "paypal-monthly",
        "P-7PF96689L4734453RNBSUC2I",
        "premium-mensual"
      );
      renderButton(
        "paypal-annual",
        "P-9G192901S6962110GNBSUDZQ",
        "premium-anual"
      );
    } else if (retries < maxRetries) {
      retries++;
      setTimeout(waitForPayPal, 300);
    } else {
      console.error("PayPal SDK no cargó a tiempo");
    }
  };

  waitForPayPal();
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full p-10 space-y-10 text-center"
      >
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
          Desbloquea tu Estrella Completa ✨
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Elige cómo quieres acceder a todo el programa: suscripción mensual o
          anual.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Plan Mensual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow border"
          >
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-2">
              🌙 Plan Mensual
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Accede por solo 22 € al mes. Cancela cuando quieras.
            </p>
            {paypalReady ? (
              <div id="paypal-monthly" />
            ) : (
              <div className="flex justify-center py-4 text-purple-500">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </motion.div>

          {/* Plan Anual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow border"
          >
            <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-200 mb-2">
              🌞 Plan Anual
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Una sola vez al año: 77 €. Ahorra más del 70%.
            </p>
            {paypalReady ? (
              <div id="paypal-annual" />
            ) : (
              <div className="flex justify-center py-4 text-purple-500">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </motion.div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
          * Si ya hiciste el pago, tu acceso se activará automáticamente. Si no,
          contáctanos para asistencia.
        </p>
      </motion.div>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&vault=true&intent=subscription"
        strategy="afterInteractive"
        onLoad={handlePaypalReady}
      />
    </div>
  );
}
