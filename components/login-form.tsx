//app/auth/login/page.tsx
"use client";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";

export function LoginForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useAuthRedirect(); // Redirige si ya está logueado

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Redirige a página protegida y refresca el estado
      router.push("/protected");
      router.refresh();
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al iniciar sesión."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Fondo espiritual y etéreo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/70 to-indigo-50/50" />

        {/* Elementos flotantes animados */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Partículas decorativas */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          key={error ? "error" : "no-error"}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            x: error ? [0, -8, 8, -6, 6, -4, 4, 0] : 0,
          }}
          transition={{ duration: 0.6 }}
          className={cn("flex flex-col gap-6", className)}
        >
          {/* Header espiritual */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative inline-block mb-6"
            >
              {/* Anillo mágico */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-full blur-xl opacity-30 animate-pulse scale-125" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-md opacity-20 animate-pulse scale-110"
                style={{ animationDelay: "1s" }}
              />

              <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-2xl ring-1 ring-white/50 w-20 h-20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-violet-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            >
              Bienvenido de vuelta
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-slate-600 font-light"
            >
              Reconecta con tu espacio espiritual
            </motion.p>
          </div>

          {/* Formulario mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative"
          >
            {/* Efecto de brillo en el fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-3xl blur-xl" />

            <Card className="relative bg-white/80 backdrop-blur-sm border-white/30 shadow-2xl rounded-3xl overflow-hidden">
              {/* Borde superior brillante */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Ingresa tus credenciales para acceder a tu cuenta
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Campo Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-medium"
                    >
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-white/70 border-white/20 focus:border-violet-300 focus:ring-violet-200 rounded-xl transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-slate-700 font-medium"
                      >
                        Contraseña
                      </Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline transition-colors duration-200"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-white/70 border-white/20 focus:border-violet-300 focus:ring-violet-200 rounded-xl transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Mensaje de error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        <p className="text-sm text-red-600 font-medium">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Botón de envío */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>Ingresando...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Entrar
                      </span>
                    )}
                  </Button>

                  {/* Enlace de registro */}
                  <div className="text-center pt-4 border-t border-white/20">
                    <p className="text-slate-600">
                      ¿No tienes cuenta?{" "}
                      <Link
                        href="/auth/sign-up"
                        className="font-medium text-violet-600 hover:text-violet-700 underline-offset-4 hover:underline transition-colors duration-200"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Elementos decorativos inferiores */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-center text-sm text-slate-500 mt-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Conexión segura</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span>Datos protegidos</span>
              </div>
            </div>
            <p>
              Tu información está protegida con encriptación de extremo a
              extremo
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
