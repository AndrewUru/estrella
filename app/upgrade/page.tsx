"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase/client";

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<"22" | "222">("22");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const maybeWindow = window as { paypal?: typeof window.paypal };

      const planId =
        selectedPlan === "222"
          ? "P-9G192901S6962110GNBSUDZQ"
          : "P-7PF96689L4734453RNBSUC2I";

      if (maybeWindow.paypal) {
        const paypal = maybeWindow.paypal;

        paypal.Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
          },
          createSubscription: function (_data, actions) {
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: async function (data) {
            const { subscriptionID } = data as { subscriptionID: string };

            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
              .from("profiles")
              .update({
                subscription_id: subscriptionID,
                plan: "premium",
                plan_type:
                  selectedPlan === "222"
                    ? "premium-anual"
                    : "premium-mensual",
              })
              .eq("id", user.id);

            if (error) {
              console.error("Error al actualizar perfil:", error);
              alert("Ocurrió un problema al activar tu plan. Contáctanos.");
              return;
            }

            alert("✨ Suscripción activada. Tu acceso premium ya está disponible.");
            window.location.href = "/protected";
          },
        }).render("#paypal-button-container");
      }
    }
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-center">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-4">
          Desbloquea tu Estrella Completa ✨
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
          Elige cómo quieres acceder a todo el programa: suscripción mensual o anual.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Hemos creado esta suscripción con mucho amor y cuidado para que sea accesible y al mismo tiempo nos ayude a sostener el proyecto de esta app, desarrollada con esfuerzo, intuición y cariño para acompañarte en tu camino.
        </p>
  
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSelectedPlan("22")}
            className={`px-6 py-3 rounded-full font-semibold border transition-all duration-300 ${
              selectedPlan === "22"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-200 border-purple-300"
            }`}
          >
            Mensual – 22 €
          </button>
  
          <button
            onClick={() => setSelectedPlan("222")}
            className={`px-6 py-3 rounded-full font-semibold border transition-all duration-300 ${
              selectedPlan === "222"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-200 border-purple-300"
            }`}
          >
            Anual – 77 €
          </button>
        </div>
  
        <div className="text-2xl font-semibold text-purple-800 dark:text-purple-200 mb-6">
          {selectedPlan === "22"
            ? "Suscripción mensual de 22 €"
            : "Suscripción anual de 222 €"}
        </div>
  
        <div id="paypal-button-container" className="mb-6"></div>
  
        <p className="text-sm text-gray-500 dark:text-gray-400">
          * Si ya hiciste el pago, tu acceso se activará automáticamente. Si no, contáctanos para asistencia.
        </p>
      </div>
  
      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&vault=true&intent=subscription"
        strategy="afterInteractive"
      />
    </div>
  );
  
}
