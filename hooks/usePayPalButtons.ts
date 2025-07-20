import { useEffect, useState } from "react";

type PlanType = "premium-mensual" | "premium-anual";

interface PayPalPlan {
  containerId: string;
  planId: string;
  planType: PlanType;
}

interface UsePayPalButtonsResult {
  paypalReady: boolean;
}

export function usePayPalButtons(
  plans: PayPalPlan[],
  onSuccess: (planType: PlanType, subscriptionID: string) => void
): UsePayPalButtonsResult {
  const [paypalReady, setPaypalReady] = useState(false);

  useEffect(() => {
    const maxRetries = 10;
    let retries = 0;

    const renderButton = ({ containerId, planId, planType }: PayPalPlan) => {
      const paypal = window.paypal;
      const el = document.getElementById(containerId);

      if (!paypal?.Buttons || !el) {
        console.warn(`PayPal no disponible para ${containerId}`);
        return;
      }

      paypal.Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: (_data, actions) =>
          actions.subscription.create({ plan_id: planId }),
        onApprove: (data: { subscriptionID: string }) => {
          onSuccess(planType, data.subscriptionID);
        },
      }).render(`#${containerId}`);
    };

    const waitForPaypal = () => {
      if (window.paypal?.Buttons) {
        setPaypalReady(true);
        plans.forEach(renderButton);
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(waitForPaypal, 300);
      } else {
        console.error("⚠️ PayPal SDK no cargó a tiempo");
      }
    };

    waitForPaypal();
  }, [plans, onSuccess]);

  return { paypalReady };
}
