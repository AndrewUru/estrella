"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase/client";

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<"22" | "77">("22");

  useEffect(() => {
    if (typeof window !== "undefined" && "paypal" in window) {
      const paypal = (window as typeof window & {
        paypal: {
          Buttons: (options: {
            createOrder: (
              data: Record<string, unknown>,
              actions: { order: { create: (options: { purchase_units: { amount: { value: string } }[] }) => string }
            }) => string;
            onApprove: (
              data: Record<string, unknown>,
              actions: { order: { capture: () => Promise<{ id: string; payer: { name: { given_name: string } } }> }
            }) => void;
          }) => { render: (selector: string) => void };
        };
      }).paypal;

      paypal.Buttons({
        createOrder: (_data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: selectedPlan,
                },
              },
            ],
          });
        },
        onApprove: async (_data, actions) => {
          const details = await actions.order.capture();
          const subscriptionID = details.id;

          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from("profiles")
            .update({
              subscription_id: subscriptionID,
              plan: "premium",
              plan_type: selectedPlan === "77" ? "premium-anual" : "premium-mensual",
            })
            .eq("id", user.id);

          if (error) {
            console.error("Error al actualizar perfil:", error);
            alert("Ocurrió un problema al activar tu plan. Contáctanos.");
            return;
          }

          alert("✨ Pago completado. Tu acceso premium está activado.");
          window.location.href = "/protected";
        },
      }).render("#paypal-button-container");
    }
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-center">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-4">
          Desbloquea tu Estrella Completa ✨
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
          Elige cómo quieres acceder a todo el programa: una vez o con acceso continuo y más beneficios.
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
            Curso completo – 22 €
          </button>

          <button
            onClick={() => setSelectedPlan("77")}
            className={`px-6 py-3 rounded-full font-semibold border transition-all duration-300 ${
              selectedPlan === "77"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-200 border-purple-300"
            }`}
          >
            Suscripción anual – 77 €
          </button>
        </div>

        <div className="text-2xl font-semibold text-purple-800 dark:text-purple-200 mb-6">
          {selectedPlan === "22" ? "Pago único de 22 €" : "Suscripción anual de 77 €"}
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