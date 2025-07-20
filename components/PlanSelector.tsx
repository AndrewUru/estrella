//C:\estrella\components\PlanSelector.tsx
"use client";

import { useEffect, useRef } from "react";

type PlanType = "gratis" | "premium-mensual" | "premium-anual";

interface PlanSelectorProps {
  planType: PlanType;
  setPlanType: (value: PlanType) => void;
  setSubscriptionId: (id: string) => void;
}

const PAYPAL_PLAN_IDS: Record<Exclude<PlanType, "gratis">, string> = {
  "premium-mensual": "P-7PF96689L4734453RNBSUC2I",
  "premium-anual": "P-9G192901S6962110GNBSUDZQ",
};

export default function PlanSelector({
  planType,
  setPlanType,
  setSubscriptionId,
}: PlanSelectorProps) {
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window?.paypal || planType === "gratis") return;

    if (paypalContainerRef.current) {
      paypalContainerRef.current.innerHTML = "";
    }

    const plan_id = PAYPAL_PLAN_IDS[planType as keyof typeof PAYPAL_PLAN_IDS];

    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: (_data, actions) =>
          actions.subscription.create({ plan_id }),
        onApprove: (data) => {
          setSubscriptionId(data.subscriptionID);
        },
      })
      .render("#paypal-button-container");
  }, [planType, setSubscriptionId]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-300 dark:border-gray-600">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        Selecciona tu plan
      </label>
      <select
        value={planType}
        onChange={(e) => setPlanType(e.target.value as PlanType)}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-3 py-2 mt-1"
      >
        <option value="gratis">Gratis</option>
        <option value="premium-mensual">Premium (22 €/mes)</option>
        <option value="premium-anual">Premium (220 €/año)</option>
      </select>

      {planType !== "gratis" && (
        <div className="mt-4">
          <div id="paypal-button-container" ref={paypalContainerRef} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Realiza el pago para activar el registro.
          </p>
        </div>
      )}
    </div>
  );
}
