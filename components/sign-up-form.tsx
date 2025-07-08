"use client";

import { useState } from "react";
import { registerUser } from "@/lib/supabase/register-user";
import Script from "next/script";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    paypal?: any; // o la versión estricta mencionada arriba
  }
}

export default function SignUpWithPayment() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planType, setPlanType] = useState<"gratis" | "premium">("gratis");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (planType === "premium" && !subscriptionId) {
      setError("Primero realiza el pago con PayPal.");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        email,
        password,
        fullName,
        subscriptionId: subscriptionId || null,
        planType,
      });
      window.location.href = "/auth/sign-up-success";
    } catch {
      setError("Error al registrar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <label className="block text-sm font-medium text-gray-700">
          Selecciona tu plan
        </label>
        <select
          value={planType}
          onChange={(e) => setPlanType(e.target.value as "gratis" | "premium")}
          className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
        >
          <option value="gratis">Gratis</option>
          <option value="premium">Premium (22€ / mes)</option>
        </select>
      </div>

      {planType === "premium" && (
        <div className="bg-white border p-5 rounded-lg shadow">
          <div id="paypal-button-container" />
          {subscriptionId ? (
            <p className="text-green-600 text-sm">✅ Pago confirmado</p>
          ) : (
            <p className="text-sm text-gray-500">
              Realiza el pago para activar el formulario.
            </p>
          )}
        </div>
      )}

      {(planType === "gratis" || subscriptionId) && (
        <form
          onSubmit={handleSignUp}
          className="space-y-4 bg-white p-6 rounded shadow-md"
        >
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repite la contraseña"
            className="w-full border px-3 py-2 rounded"
          />
          {error && <div className="text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      )}

      <Script
        src="https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&vault=true&intent=subscription"
        onLoad={() => {
          if (window?.paypal && planType === "premium") {
            window.paypal
              .Buttons({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                createSubscription: (_, actions) =>
                  actions.subscription.create({ plan_id: "TU_PLAN_ID_PAYPAL" }),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onApprove: (data) => setSubscriptionId(data.subscriptionID),
              })
              .render("#paypal-button-container");
          }
        }}
      />
    </div>
  );
}
