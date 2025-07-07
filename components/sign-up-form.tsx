"use client";

import { useState } from "react";
import { registerUser } from "@/lib/supabase/register-user";
import Script from "next/script";

// Tipado explícito para PayPal
interface PayPalData {
  subscriptionID: string;
}

interface PayPalActions {
  subscription: {
    create: (input: { plan_id: string }) => Promise<string>;
  };
}

// Declaración global para `window.paypal`
declare global {
  interface Window {
    paypal: {
      Buttons: (config: {
        style?: object;
        createSubscription: (
          data: PayPalData,
          actions: PayPalActions
        ) => Promise<string>;
        onApprove: (data: PayPalData) => void;
      }) => { render: (selector: string) => void };
    };
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

  const planType = "mensual";

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!subscriptionId) {
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
        subscriptionId,
        planType,
      });

      window.location.href = "/auth/sign-up-success";
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).message || "Error al registrar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Suscripción mensual – 22 €/mes
      </h1>

      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow">
        <p className="text-sm mb-2 text-gray-600">
          Realiza el pago para habilitar el registro:
        </p>
        <div id="paypal-button-container" className="mb-4" />
        {subscriptionId && (
          <p className="text-green-600 text-sm font-medium mb-2">
            ✅ Pago confirmado
          </p>
        )}
      </div>

      {subscriptionId && (
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Repite la contraseña"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      )}

      <Script
        src="https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&vault=true&intent=subscription"
        onLoad={() => {
          if (window?.paypal) {
            window.paypal
              .Buttons({
                style: {
                  layout: "vertical",
                  shape: "rect",
                  label: "subscribe",
                  color: "gold",
                },
                createSubscription: (data, actions) => {
                  return actions.subscription.create({
                    plan_id: "P-7PF96689L4734453RNBSUC2I",
                  });
                },
                onApprove: (data) => {
                  setSubscriptionId(data.subscriptionID);
                },
              })
              .render("#paypal-button-container");
          }
        }}
      />
    </div>
  );
}
