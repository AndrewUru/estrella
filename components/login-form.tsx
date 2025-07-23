"use client";

import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function LoginForm() {
  useAuthRedirect(); // Redirige si ya está logueado

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/protected";

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900">
      <Card className="p-8 max-w-md w-full shadow-2xl backdrop-blur-md border-white/30 dark:border-gray-700/30 bg-white/90 dark:bg-gray-900/80 rounded-2xl">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-2xl font-bold">Inicia sesión</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="dark:invert"
            />
            Iniciar sesión con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
