
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface PayPalPlan {
  containerId: string;
  planId: string;
  planType: string;
}

export function usePayPalButtons(plans: PayPalPlan[]) {
  const [paypalReady, setPaypalReady] = useState(false);

  const renderButton = (containerId: string, planId: string, planType: string) => {
    const paypal = typeof window !== "undefined" ? window.paypal : undefined;
    const el = document.getElementById(containerId);

    if (!paypal?.Buttons || !el) {
      console.warn(`Botón PayPal no disponible para ${containerId}`);
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
        createSubscription: (_data, actions) =>
          actions.subscription.create({ plan_id: planId }),
        onApprove: async ({ subscriptionID }) => {
          const { data: { user } } = await supabase.auth.getUser();
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
        },
      })
      .render(`#${containerId}`);
  };

  const handlePaypalReady = () => {
    const maxRetries = 10;
    let retries = 0;

    const waitForPayPal = () => {
      if (window.paypal?.Buttons) {
        setPaypalReady(true);
        plans.forEach(({ containerId, planId, planType }) =>
          renderButton(containerId, planId, planType)
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

  return { paypalReady, handlePaypalReady };
}
