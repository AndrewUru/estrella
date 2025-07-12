//C:\estrella\components\sign-up-form.tsx
"use client";

import { useState } from "react";
import { registerUser } from "@/lib/supabase/register-user";
import PlanSelector from "./PlanSelector";
import Script from "next/script";
import Image from "next/image";

type PlanType = "gratis" | "premium-mensual" | "premium-anual";

export default function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [planType, setPlanType] = useState<PlanType>("gratis");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    if (planType !== "gratis" && !subscriptionId) {
      setError("Primero completa el pago.");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        email,
        password,
        fullName,
        planType,
        subscriptionId,
      });
      window.location.href = "/auth/sign-up-success";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PlanSelector
          planType={planType}
          setPlanType={setPlanType}
          setSubscriptionId={setSubscriptionId}
        />

        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nombre completo"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          required
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          placeholder="Repite la contraseña"
          className="w-full p-2 border rounded"
        />

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
        >
          {isLoading ? "Registrando..." : "Crear cuenta"}
        </button>
        <div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300" />
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
      o continúa con
    </span>
  </div>
</div>

<button
  type="button"
  onClick={() =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/auth/callback"
            : "https://estrelladelalba.com/auth/callback",
      },
    })
  }
  className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2"
>
<Image
  src="/google-icon.svg"
  alt="Google"
  width={20}
  height={20}
  className="h-5 w-5"
/>
  <span>Registrarse con Google</span>
</button>

      </form>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&vault=true&intent=subscription"
        strategy="afterInteractive"
      />
    </div>
  );
}
