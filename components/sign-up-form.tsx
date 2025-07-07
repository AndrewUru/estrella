"use client";

import { useState } from "react";
import { registerUser } from "@/lib/supabase/register-user";
import Script from "next/script";

interface PayPalData {
  subscriptionID: string;
}

interface PayPalActions {
  subscription: {
    create: (input: { plan_id: string }) => Promise<string>;
  };
}

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
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Error al registrar el usuario.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 space-y-6">
      {/* Paso 1: Pago */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow">
        <p className="text-base font-medium text-slate-700 mb-2">
          Paso 1: Realiza el pago de la suscripción
        </p>
        <div id="paypal-button-container" className="mb-4" />
        {subscriptionId ? (
          <p className="text-green-600 text-sm font-medium mb-2">
            ✅ Pago confirmado correctamente
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Se habilitará el formulario cuando el pago esté confirmado.
          </p>
        )}
      </div>

      {/* Paso 2: Registro */}
      {subscriptionId && (
        <form
          onSubmit={handleSignUp}
          className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <p className="text-base font-medium text-slate-700 mb-2">
            Paso 2: Completa tu registro
          </p>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="Ej. Ana López"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="Crea una contraseña segura"
            />
          </div>

          <div>
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Repite la contraseña
            </label>
            <input
              id="repeatPassword"
              type="password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              placeholder="Vuelve a escribirla"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded transition-all"
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      )}

      {/* PayPal SDK Script */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&vault=true&intent=subscription"
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
                    plan_id: "P-7PF96689L4734453RNBSUC2I", // reemplaza si cambia
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
