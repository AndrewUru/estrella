//C:\estrella\components\PlanSelector.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PlanType = "gratis" | "premium-mensual" | "premium-anual";

interface PlanSelectorProps {
  planType: PlanType;
  setPlanType: (value: PlanType) => void;
}

export default function PlanSelector({
  planType,
  setPlanType,
}: PlanSelectorProps) {
  const router = useRouter();

  useEffect(() => {
    if (planType !== "gratis") {
      router.push("/upgrade");
    }
  }, [planType, router]);

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

      {planType === "gratis" && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Puedes continuar con el acceso gratuito.
        </p>
      )}
    </div>
  );
}
