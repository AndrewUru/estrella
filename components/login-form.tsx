//C:\estrella\components\login-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm({ className }: { className?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/protected";

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?returnTo=${encodeURIComponent(
          returnTo
        )}`,
      },
    });

    if (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative overflow-hidden flex items-center justify-center">
      {/* Fondo adaptativo para light/dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base adaptativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50/70 to-indigo-50/50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-indigo-950/10" />

        {/* Elementos flotantes animados */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-purple-300/30 dark:from-violet-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-300/30 to-blue-300/30 dark:from-indigo-400/20 dark:to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-300/10 dark:to-pink-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Partículas decorativas */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-violet-400 dark:bg-violet-300 rounded-full animate-ping" />
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 dark:bg-purple-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-md">
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
          {/* Formulario mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative"
          >
            {/* Efecto de brillo en el fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200/20 to-purple-200/20 dark:from-violet-300/10 dark:to-purple-300/10 rounded-3xl blur-xl" />

            <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/30 dark:border-gray-800/30 shadow-2xl rounded-3xl overflow-hidden">
              {/* Borde superior brillante */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Inicia sesión con tu cuenta de Google
                </CardDescription>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="dark:invert"
                  />
                  {isLoading ? "Redirigiendo..." : "Iniciar sesión con Google"}
                </Button>
              </CardHeader>
              <CardContent>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl mb-4"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
                      {error}
                    </p>
                  </motion.div>
                )}
              </CardContent>

            </Card>
          </motion.div>

          {/* Elementos decorativos inferiores */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                <span>Conexión segura</span>
              </div>
              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-violet-400 dark:bg-violet-500 rounded-full animate-pulse"
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
