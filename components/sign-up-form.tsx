"use client";

import { useState } from "react";
import { registerUser } from "@/lib/supabase/register-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Script from "next/script";
import { motion } from "framer-motion";

declare global {
  interface Window {
    paypal: {
      Buttons: (config: {
        style: object;
        createSubscription: (
          data: PayPalSubscriptionData,
          actions: PayPalActions
        ) => Promise<string>;
        onApprove: (data: PayPalSubscriptionData) => void;
      }) => { render: (container: string) => void };
    };
  }
}

interface PayPalSubscriptionData {
  subscriptionID: string;
}

interface PayPalActions {
  subscription: {
    create: (details: { plan_id: string }) => Promise<string>;
  };
}

export default function SignUpWithPayment() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [planType, setPlanType] = useState<"mensual" | "anual" | null>(null);
  const [fullName, setFullName] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!subscriptionId || !planType) {
      setError("Primero debes realizar el pago");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({ email, password, subscriptionId, planType, fullName });
      window.location.href = "/auth/sign-up-success";
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Error al crear la cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Selección de Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50"></div>
          <CardHeader className="relative text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Elige tu plan
            </CardTitle>
            <CardDescription className="text-slate-600">
              Selecciona la opción que mejor se adapte a ti
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Plan Mensual */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-violet-200/50 hover:border-violet-300 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-full p-2">
                      <svg
                        className="w-5 h-5 text-violet-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Plan Mensual
                      </h3>
                      <p className="text-sm text-slate-600">
                        Sin compromisos a largo plazo
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-violet-600">
                      22€
                    </div>
                    <div className="text-sm text-slate-500">/mes</div>
                  </div>
                </div>
                <div
                  id="paypal-button-container-monthly"
                  className="min-h-[45px]"
                />
              </div>
            </div>

            {/* Plan Anual - Destacado */}
            <div className="group relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Recomendado
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-2xl opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:shadow-xl mt-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        Plan Anual
                      </h3>
                      <p className="text-sm text-slate-600">
                        El mejor valor para ti
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-sm">
                        264€
                      </span>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        -42€
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      222€
                    </div>
                    <div className="text-sm text-slate-500">/año</div>
                  </div>
                </div>
                <div
                  id="paypal-button-container-annual"
                  className="min-h-[45px]"
                />
              </div>
            </div>

            {/* Confirmación de pago */}
            {subscriptionId && planType && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-800">
                      ¡Pago confirmado!
                    </p>
                    <p className="text-sm text-green-700">
                      Plan <strong>{planType}</strong> activado. Completa tu
                      registro abajo.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Formulario de registro */}
      {subscriptionId && planType && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-gray-50/50"></div>
            <CardHeader className="relative text-center">
              <CardTitle className="text-2xl font-bold text-slate-800">
                Crear tu cuenta
              </CardTitle>
              <CardDescription className="text-slate-600">
                Último paso para acceder a todo el contenido
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          ></path>
                        </svg>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-white/80 border-slate-200 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <Label
                      htmlFor="full-name"
                      className="text-slate-700 font-medium"
                    >
                      Nombre
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.295.534 6.121 1.475M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="Tu nombre completo"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12 bg-white/80 border-slate-200 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 font-medium"
                    >
                      Contraseña
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          ></path>
                        </svg>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-white/80 border-slate-200 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <Label
                      htmlFor="repeat-password"
                      className="text-slate-700 font-medium"
                    >
                      Confirmar contraseña
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <Input
                        id="repeat-password"
                        type="password"
                        placeholder="Repite tu contraseña"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="pl-10 h-12 bg-white/80 border-slate-200 focus:border-violet-300 focus:ring-violet-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 rounded-full p-1">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creando cuenta...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      Crear mi cuenta
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Al crear tu cuenta, aceptas nuestros{" "}
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 underline"
                    >
                      términos y condiciones
                    </a>{" "}
                    y{" "}
                    <a
                      href="#"
                      className="text-violet-600 hover:text-violet-700 underline"
                    >
                      política de privacidad
                    </a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Script
        src="https://www.paypal.com/sdk/js?client-id=ASQix2Qu6atiH43_jrk18jeSMDjB_YdTjbfI8jrTJ7x5uagNzUhuNMXacO49ZxJWr_EMpBhrpVPbOvR_&vault=true&intent=subscription"
        onLoad={() => {
          window.paypal
            .Buttons({
              style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "subscribe",
                height: 45,
              },
              createSubscription: function (data, actions) {
                return actions.subscription.create({
                  plan_id: "P-7PF96689L4734453RNBSUC2I",
                });
              },
              onApprove: function (data) {
                setSubscriptionId(data.subscriptionID);
                setPlanType("mensual");
              },
            })
            .render("#paypal-button-container-monthly");

          window.paypal
            .Buttons({
              style: {
                shape: "rect",
                color: "blue",
                layout: "vertical",
                label: "subscribe",
                height: 45,
              },
              createSubscription: function (data, actions) {
                return actions.subscription.create({
                  plan_id: "P-9G192901S6962110GNBSUDZQ",
                });
              },
              onApprove: function (data) {
                setSubscriptionId(data.subscriptionID);
                setPlanType("anual");
              },
            })
            .render("#paypal-button-container-annual");
        }}
      />
    </div>
  );
}
